import { supabase, type Profile, type UserRole } from './supabase';

/**
 * Accès aux données d'administration. Chaque fonction suppose que l'appelant
 * est authentifié : les droits réels sont appliqués par les policies RLS de la
 * base, pas ici. Le filtrage côté client ne sert qu'à l'ergonomie.
 */

function client() {
  if (!supabase) throw new Error('Les comptes ne sont pas activés sur cette installation.');
  return supabase;
}

export interface CourseRow {
  id: string;
  slug: string;
  title: string;
  level: string;
  pitch: string;
  status: 'brouillon' | 'en_relecture' | 'publie' | 'archive';
  author_id: string;
  updated_at: string;
}

export interface ModuleRow {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  summary: string;
  position: number;
}

export interface LessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  intro: string;
  duration: number;
  kind: string;
  position: number;
}

export interface QuestionRow {
  id: string;
  module_id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  position: number;
}

export interface ExamRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  course_ids: string[];
  question_count: number;
  duration_minutes: number;
  pass_threshold: number;
  status: string;
  author_id: string;
}

export const statusLabels: Record<string, string> = {
  brouillon: 'Brouillon',
  en_relecture: 'En relecture',
  publie: 'Publié',
  archive: 'Archivé',
};

/** Transforme un titre en identifiant d'URL stable. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// ————— Cours —————

export async function listCourses(authorId?: string): Promise<CourseRow[]> {
  let query = client().from('courses').select('*').order('updated_at', { ascending: false });
  if (authorId) query = query.eq('author_id', authorId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CourseRow[];
}

export async function createCourse(authorId: string, title: string): Promise<CourseRow> {
  const { data, error } = await client()
    .from('courses')
    .insert({ title, slug: slugify(title) || `cours-${Date.now()}`, author_id: authorId })
    .select()
    .single();
  if (error) throw error;
  return data as CourseRow;
}

export async function updateCourse(id: string, patch: Partial<CourseRow>) {
  const { error } = await client()
    .from('courses')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCourse(id: string) {
  const { error } = await client().from('courses').delete().eq('id', id);
  if (error) throw error;
}

// ————— Modules, leçons, questions —————

export async function listModules(courseId: string): Promise<ModuleRow[]> {
  const { data, error } = await client().from('modules').select('*').eq('course_id', courseId).order('position');
  if (error) throw error;
  return (data ?? []) as ModuleRow[];
}

export async function createModule(courseId: string, title: string, position: number) {
  const { error } = await client()
    .from('modules')
    .insert({ course_id: courseId, title, slug: slugify(title) || `module-${position + 1}`, position });
  if (error) throw error;
}

export async function updateModule(id: string, patch: Partial<ModuleRow>) {
  const { error } = await client().from('modules').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteModule(id: string) {
  const { error } = await client().from('modules').delete().eq('id', id);
  if (error) throw error;
}

export async function listLessons(moduleId: string): Promise<LessonRow[]> {
  const { data, error } = await client().from('lessons').select('*').eq('module_id', moduleId).order('position');
  if (error) throw error;
  return (data ?? []) as LessonRow[];
}

export async function createLesson(moduleId: string, title: string, position: number) {
  const { error } = await client()
    .from('lessons')
    .insert({ module_id: moduleId, title, slug: slugify(title) || `lecon-${position + 1}`, position });
  if (error) throw error;
}

export async function updateLesson(id: string, patch: Partial<LessonRow> & { blocks?: unknown }) {
  const { error } = await client().from('lessons').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteLesson(id: string) {
  const { error } = await client().from('lessons').delete().eq('id', id);
  if (error) throw error;
}

export async function listQuestions(moduleId: string): Promise<QuestionRow[]> {
  const { data, error } = await client().from('questions').select('*').eq('module_id', moduleId).order('position');
  if (error) throw error;
  return (data ?? []) as QuestionRow[];
}

export async function saveQuestion(question: Partial<QuestionRow> & { module_id: string }) {
  const payload = {
    module_id: question.module_id,
    prompt: question.prompt ?? '',
    choices: question.choices ?? [],
    answer: question.answer ?? 0,
    explanation: question.explanation ?? '',
    position: question.position ?? 0,
  };
  const { error } = question.id
    ? await client().from('questions').update(payload).eq('id', question.id)
    : await client().from('questions').insert(payload);
  if (error) throw error;
}

export async function deleteQuestion(id: string) {
  const { error } = await client().from('questions').delete().eq('id', id);
  if (error) throw error;
}

// ————— Examens —————

export async function listExams(authorId?: string): Promise<ExamRow[]> {
  let query = client().from('exams').select('*').order('created_at', { ascending: false });
  if (authorId) query = query.eq('author_id', authorId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ExamRow[];
}

export async function createExam(authorId: string, title: string) {
  const { error } = await client()
    .from('exams')
    .insert({ title, slug: slugify(title) || `examen-${Date.now()}`, author_id: authorId });
  if (error) throw error;
}

export async function updateExam(id: string, patch: Partial<ExamRow>) {
  const { error } = await client().from('exams').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteExam(id: string) {
  const { error } = await client().from('exams').delete().eq('id', id);
  if (error) throw error;
}

// ————— Comptes —————

export interface UserRow extends Profile {
  organizations?: { name: string }[] | null;
}

export async function listUsers(): Promise<UserRow[]> {
  const { data, error } = await client()
    .from('profiles')
    .select('id, full_name, role, organization_id, credential_name, organizations(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as UserRow[];
}

export async function setUserRole(userId: string, role: UserRole) {
  const { error } = await client().rpc('set_user_role', { p_user_id: userId, p_role: role });
  if (error) throw error;
}

export async function setUserOrganization(userId: string, organizationId: string | null) {
  const { error } = await client().rpc('set_user_organization', {
    p_user_id: userId,
    p_organization_id: organizationId,
  });
  if (error) throw error;
}

export interface OrganizationRow {
  id: string;
  name: string;
  siren: string | null;
}

export async function listOrganizations(): Promise<OrganizationRow[]> {
  const { data, error } = await client().from('organizations').select('id, name, siren').order('name');
  if (error) throw error;
  return (data ?? []) as OrganizationRow[];
}

export async function createOrganization(name: string, siren: string | null) {
  const { error } = await client().from('organizations').insert({ name, siren });
  if (error) throw error;
}
