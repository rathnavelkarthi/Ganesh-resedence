import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { generateSubdomain, hasPermission as checkPermission } from '../lib/booking';

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
  properties: Tenant[];
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  switchProperty: (tenantId: string) => void;
  addProperty: (name: string, type: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null }>;
  hasPermission: (allowedRoles: Role[]) => boolean;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_PROPERTY_KEY = 'active_property_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [properties, setProperties] = useState<Tenant[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Map Supabase user to our User shape
  const mapUser = (supaUser: SupabaseUser, role?: Role): User => ({
    id: supaUser.id,
    name: supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
    email: supaUser.email || '',
    role: role || (supaUser.user_metadata?.role as Role) || 'SUPER_ADMIN',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'U')}&background=0E2A38&color=fff`,
  });

  // Fetch all properties this user can access via user_properties
  const fetchProperties = async (userId: string, supaUser: SupabaseUser) => {
    const { data: links, error } = await supabase
      .from('user_properties')
      .select('tenant_id, role, is_owner, tenants(*)')
      .eq('user_id', userId);

    if (error || !links || links.length === 0) {
      // Fallback: try the old owner_id approach for backward compat
      const { data: fallback } = await supabase
        .from('tenants')
        .select('*')
        .eq('owner_id', userId)
        .limit(1)
        .single();

      if (fallback) {
        const t = fallback as Tenant;
        setProperties([t]);
        setTenant(t);
        setUser(mapUser(supaUser, 'SUPER_ADMIN'));
      } else {
        setProperties([]);
        setTenant(null);
      }
      return;
    }

    // Build tenant list from joined data
    const tenantList: Tenant[] = links
      .filter(link => link.tenants)
      .map(link => link.tenants as unknown as Tenant);

    setProperties(tenantList);

    // Determine active property
    const savedId = localStorage.getItem(ACTIVE_PROPERTY_KEY);
    const saved = savedId ? tenantList.find(t => t.id === savedId) : null;
    const active = saved || tenantList[0];

    if (active) {
      setTenant(active);
      // Set role from the matching user_properties row
      const activeLink = links.find(l => l.tenant_id === active.id);
      const activeRole = (activeLink?.role as Role) || 'SUPER_ADMIN';
      setUser(mapUser(supaUser, activeRole));
      localStorage.setItem(ACTIVE_PROPERTY_KEY, active.id);
    }
  };

  const refreshTenant = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      await fetchProperties(currentSession.user.id, currentSession.user);
    }
  };

  // Switch active property
  const switchProperty = (tenantId: string) => {
    const target = properties.find(p => p.id === tenantId);
    if (!target) return;

    setTenant(target);
    localStorage.setItem(ACTIVE_PROPERTY_KEY, tenantId);

    // Update user role for the new property
    // Re-fetch properties to get the role (async, but we set tenant immediately for responsiveness)
    if (user?.id) {
      supabase
        .from('user_properties')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .single()
        .then(({ data }) => {
          if (data) {
            setUser(prev => prev ? { ...prev, role: (data.role as Role) || 'SUPER_ADMIN' } : prev);
          }
        });
    }
  };

  // Add a new property
  const addProperty = async (name: string, type: 'hotel' | 'restaurant' | 'combined'): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const subdomain = generateSubdomain(name);
    const { data: newTenantId, error } = await supabase.rpc('create_tenant', {
      p_owner_id: user.id,
      p_business_name: name,
      p_business_type: type,
      p_subdomain: subdomain,
    });

    if (error) return { error: error.message };

    // Refresh the properties list and switch to the new one
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      await fetchProperties(currentSession.user.id, currentSession.user);
      if (newTenantId) {
        switchProperty(newTenantId);
      }
    }

    return { error: null };
  };

  // Listen to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProperties(currentSession.user.id, currentSession.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchProperties(newSession.user.id, newSession.user);
      } else {
        setUser(null);
        setTenant(null);
        setProperties([]);
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

    const subdomain = generateSubdomain(businessName);
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
    setProperties([]);
    setSession(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem(ACTIVE_PROPERTY_KEY);
  };

  const hasPermission = (allowedRoles: Role[]) => {
    return checkPermission(user?.role ?? null, allowedRoles);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, properties, session, loading, login, signup, logout, switchProperty, addProperty, hasPermission, refreshTenant }}>
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
