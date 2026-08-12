import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Le campus doit rester consultable sans backend : tant que les variables
 * d'environnement ne sont pas renseignées, `supabase` vaut null et
 * l'application se comporte comme une application statique — contenu
 * accessible, progression conservée dans le navigateur, comptes désactivés.
 * Chaque appel doit donc tester `isBackendConfigured` avant d'utiliser le client.
 */
export const isBackendConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isBackendConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export type UserRole = 'apprenant' | 'formateur' | 'admin' | 'referent_entreprise';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  organization_id: string | null;
  credential_name: string | null;
}

export const roleLabels: Record<UserRole, string> = {
  apprenant: 'Apprenant',
  formateur: 'Formateur',
  admin: 'Super administrateur',
  referent_entreprise: 'Référent entreprise',
};

/**
 * Traduit les erreurs Supabase en messages lisibles. Les libellés d'origine
 * sont en anglais et parfois trompeurs pour un utilisateur final.
 */
export function humanError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Adresse ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Confirmez d’abord votre adresse via le courriel reçu.';
  if (m.includes('user already registered')) return 'Un compte existe déjà avec cette adresse.';
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (m.includes('réservé aux administrateurs')) return 'Cette action est réservée aux administrateurs.';
  return message;
}
