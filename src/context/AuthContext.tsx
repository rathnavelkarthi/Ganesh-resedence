import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'RECEPTION' | 'HOUSEKEEPING' | 'ACCOUNTANT';

export type Tenant = {
  id: string;
  business_name: string;
  business_type: 'hotel' | 'restaurant' | 'combined';
  subdomain: string | null;
  template: string;
  plan: string;
  custom_email: string | null;
  logo_url: string | null;
  is_active: boolean;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  hasPermission: (allowedRoles: Role[]) => boolean;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Map Supabase user to our User shape
  const mapUser = (supaUser: SupabaseUser): User => ({
    id: supaUser.id,
    name: supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
    email: supaUser.email || '',
    role: (supaUser.user_metadata?.role as Role) || 'SUPER_ADMIN',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'U')}&background=0E2A38&color=fff`,
  });

  // Fetch tenant for the current user
  const fetchTenant = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .limit(1)
      .single();

    if (!error && data) {
      setTenant(data as Tenant);
    } else {
      setTenant(null);
    }
  };

  const refreshTenant = async () => {
    await fetchTenant();
  };

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(mapUser(currentSession.user));
        fetchTenant();
      }
      setLoading(false);
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(mapUser(newSession.user));
        fetchTenant();
      } else {
        setUser(null);
        setTenant(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signup = async (
    email: string,
    password: string,
    businessName: string,
    businessType: 'hotel' | 'restaurant' | 'combined'
  ): Promise<{ error: string | null }> => {
    // 1. Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: businessName,
          role: 'SUPER_ADMIN',
        },
      },
    });

    if (authError) return { error: authError.message };
    if (!authData.user) return { error: 'Signup failed. Please try again.' };

    // 2. Create the tenant row via RPC (bypasses RLS)
    const subdomain = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);

    const { error: tenantError } = await supabase.rpc('create_tenant', {
      p_owner_id: authData.user.id,
      p_business_name: businessName,
      p_business_type: businessType,
      p_subdomain: subdomain,
    });

    if (tenantError) return { error: tenantError.message };

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTenant(null);
    setSession(null);
    localStorage.removeItem('crm_user');
  };

  const hasPermission = (allowedRoles: Role[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, session, loading, login, signup, logout, hasPermission, refreshTenant }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
