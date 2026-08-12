import type { Course, Lesson, Module } from './types';
import { fondamentaux } from './course-fondamentaux';
import { depenses } from './course-depenses';
import { estimation } from './course-estimation';
import { risques } from './course-risques';
import { agile } from './course-agile';

/** Ordre du catalogue : les thèmes enseignés par FGF Consultant d'abord. */
export const courses: Course[] = [fondamentaux, depenses, estimation, risques, agile];

export function getCourse(courseId: string | undefined): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export interface LessonRef {
  course: Course;
  module: Module;
  lesson: Lesson;
  moduleIndex: number;
  lessonIndex: number;
}

export function getLessonRef(
  courseId: string | undefined,
  moduleId: string | undefined,
  lessonId: string | undefined,
): LessonRef | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return undefined;
  const module = course.modules[moduleIndex];
  const lessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) return undefined;
  return { course, module, lesson: module.lessons[lessonIndex], moduleIndex, lessonIndex };
}

/** Étapes ordonnées d'un parcours : leçons puis QCM de chaque module. */
export type Step =
  | { kind: 'lesson'; moduleId: string; lessonId: string; label: string }
  | { kind: 'quiz'; moduleId: string; label: string };

export function courseSteps(course: Course): Step[] {
  const steps: Step[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      steps.push({ kind: 'lesson', moduleId: mod.id, lessonId: lesson.id, label: lesson.title });
    }
    steps.push({ kind: 'quiz', moduleId: mod.id, label: mod.quiz.title });
  }
  return steps;
}

export function courseLessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function courseQuestionCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.quiz.questions.length, 0);
}

/** Temps de travail en ligne : somme des durées de leçons + 1 min par question de QCM. */
export function courseMinutes(course: Course): number {
  return course.modules.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.duration, 0) + m.quiz.questions.length,
    0,
  );
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}
