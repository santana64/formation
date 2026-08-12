import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isBackendConfigured, supabase, type Profile, type UserRole } from './supabase';

interface AuthState {
  /** Faux tant que la session initiale n'a pas été résolue. */
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  /** Vrai quand les comptes sont activés (backend configuré). */
  enabled: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (patch: Partial<Pick<Profile, 'full_name' | 'credential_name'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(!isBackendConfigured);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, organization_id, credential_name')
      .eq('id', userId)
      .single();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) void loadProfile(next.user.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      session,
      profile,
      enabled: isBackendConfigured,

      async signIn(email, password) {
        if (!supabase) throw new Error('Les comptes ne sont pas activés sur cette installation.');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      async signUp(email, password, fullName) {
        if (!supabase) throw new Error('Les comptes ne sont pas activés sur cette installation.');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        // Sans session en retour, la confirmation par courriel est exigée.
        return { needsConfirmation: !data.session };
      },

      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },

      async resetPassword(email) {
        if (!supabase) throw new Error('Les comptes ne sont pas activés sur cette installation.');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/compte`,
        });
        if (error) throw error;
      },

      async updateProfile(patch) {
        if (!supabase || !session) throw new Error('Vous devez être connecté.');
        const { error } = await supabase.from('profiles').update(patch).eq('id', session.user.id);
        if (error) throw error;
        await loadProfile(session.user.id);
      },

      async refreshProfile() {
        if (session) await loadProfile(session.user.id);
      },
    }),
    [ready, session, profile, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  return ctx;
}

/** Hiérarchie des droits : un administrateur peut tout ce que peut un formateur. */
export function hasRole(profile: Profile | null, ...roles: UserRole[]): boolean {
  if (!profile) return false;
  if (profile.role === 'admin') return true;
  return roles.includes(profile.role);
}
