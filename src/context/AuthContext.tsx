import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { supabase } from '../lib/supabaseClient';
import { generateSubdomain, hasPermission as checkPermission } from '../lib/booking';

export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'RECEPTION' | 'HOUSEKEEPING' | 'ACCOUNTANT' | 'SERVER';

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
  session: { access_token: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null; needsVerification?: boolean }>;
  verifyEmail: (code: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  switchProperty: (tenantId: string) => void;
  addProperty: (name: string, type: 'hotel' | 'restaurant' | 'combined') => Promise<{ error: string | null }>;
  hasPermission: (allowedRoles: Role[]) => boolean;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_PROPERTY_KEY = 'active_property_id';

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const clerk = useClerk();

  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [properties, setProperties] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const buildUser = (clerkId: string, email: string, name: string, role: Role, avatarUrl?: string): User => ({
    id: clerkId,
    name,
    email,
    role,
    avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E2A38&color=fff`,
  });

  const loadProperties = async (clerkId: string, email: string, name: string, avatarUrl?: string) => {
    const { data: links } = await supabase
      .from('user_properties')
      .select('tenant_id, role, is_owner, tenants(*)')
      .eq('user_id', clerkId);

    if (links && links.length > 0) {
      const tenantList: Tenant[] = links
        .filter(l => l.tenants)
        .map(l => l.tenants as unknown as Tenant);

      setProperties(tenantList);
      const savedId = localStorage.getItem(ACTIVE_PROPERTY_KEY);
      const active = (savedId && tenantList.find(t => t.id === savedId)) || tenantList[0];

      if (active) {
        console.log('[AuthContext] Found active tenant', active.id);
        setTenant(active);
        localStorage.setItem(ACTIVE_PROPERTY_KEY, active.id);
        const link = links.find(l => l.tenant_id === active.id);
        const role = (link?.role as Role) || 'SUPER_ADMIN';
        setUser(buildUser(clerkId, email, name, role, avatarUrl));
      }
      return;
    }

    console.log('[AuthContext] No properties found via user_properties, checking fallback...');
    const { data: fallback } = await supabase
      .from('tenants').select('*').eq('owner_id', clerkId).limit(1).single();

    if (fallback) {
      console.log('[AuthContext] Found fallback tenant directly connected to owner', fallback.id);
      setProperties([fallback as Tenant]);
      setTenant(fallback as Tenant);
      setUser(buildUser(clerkId, email, name, 'SUPER_ADMIN', avatarUrl));
    } else {
      console.log('[AuthContext] No tenant found at all for user', clerkId);
      // New Google signup — check if business info was saved before the OAuth redirect
      const pendingName = localStorage.getItem('pending_business_name');
      const pendingType = localStorage.getItem('pending_business_type') as Tenant['business_type'] | null;

      if (pendingName && pendingType) {
        localStorage.removeItem('pending_business_name');
        localStorage.removeItem('pending_business_type');
        const subdomain = generateSubdomain(pendingName);
        const { error } = await supabase.rpc('create_tenant', {
          p_owner_id: clerkId,
          p_business_name: pendingName,
          p_business_type: pendingType,
          p_subdomain: subdomain,
        });
        if (!error) {
          console.log('[AuthContext] Successfully created pending tenant from Google signup', subdomain);
          // Reload now that the tenant exists
          await loadProperties(clerkId, email, name, avatarUrl);
          return;
        } else {
          console.error('[AuthContext] Error creating tenant from pending info', error);
        }
      }

      console.log('[AuthContext] Providing isolated user session to avoid redirect loop');
      setProperties([]);
      setTenant(null);
      // We must set the user even if there is no tenant, otherwise Login.tsx 
      // redirects to /admin/dashboard -> CRMApp -> redirects to /admin/login -> loop
      setUser(buildUser(clerkId, email, name, 'SUPER_ADMIN', avatarUrl));
    }
  };

  const refreshTenant = async () => {
    if (!clerkUser) return;
    const email = clerkUser.primaryEmailAddress?.emailAddress || '';
    const name = clerkUser.fullName || email.split('@')[0];
    await loadProperties(clerkUser.id, email, name, clerkUser.imageUrl);
  };

  useEffect(() => {
    if (!userLoaded) return;
    if (!clerkUser) {
      console.log('[AuthContext] No clerkUser, setting state to null');
      setUser(null); setTenant(null); setProperties([]); setLoading(false); return;
    }
    console.log('[AuthContext] clerkUser loaded, email:', clerkUser.primaryEmailAddress?.emailAddress);
    const email = clerkUser.primaryEmailAddress?.emailAddress || '';
    const name = clerkUser.fullName || email.split('@')[0];
    loadProperties(clerkUser.id, email, name, clerkUser.imageUrl).finally(() => setLoading(false));
  }, [clerkUser?.id, userLoaded]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const clerkInstance = clerk as any;
      const client = clerkInstance?.client;
      if (!client) return { error: 'Auth not ready. Try again.' };

      const signIn = await client.signIn.create({ identifier: email, password });
      if (signIn.status === 'complete') {
        await clerkInstance.setActive({ session: signIn.createdSessionId });
        return { error: null };
      }
      return { error: 'Sign in did not complete. Please try again.' };
    } catch (err: any) {
      return { error: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Sign in failed.' };
    }
  };

  const signup = async (
    email: string, password: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined'
  ): Promise<{ error: string | null; needsVerification?: boolean }> => {
    try {
      const clerkInstance = clerk as any;
      const client = clerkInstance?.client;
      if (!client) return { error: 'Auth not ready. Try again.' };

      const result = await client.signUp.create({ emailAddress: email, password, firstName: businessName });

      if (result?.status === 'complete') {
        const clerkId = result?.createdUserId;
        await clerkInstance.setActive({ session: result.createdSessionId });
        if (clerkId) {
          const subdomain = generateSubdomain(businessName);
          const { error: tenantError } = await supabase.rpc('create_tenant', {
            p_owner_id: clerkId, p_business_name: businessName, p_business_type: businessType, p_subdomain: subdomain,
          });
          if (tenantError) {
            if (tenantError.message?.includes('tenants_subdomain_key')) {
              return { error: 'This business name is already taken. Please choose a different one.' };
            }
            return { error: tenantError.message };
          }
        }
        return { error: null };
      }

      // Email verification required (missing_requirements)
      if (result?.status === 'missing_requirements') {
        await result.prepareEmailAddressVerification({ strategy: 'email_code' });
        return { error: null, needsVerification: true };
      }

      return { error: 'Unexpected signup status.' };
    } catch (err: any) {
      return { error: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Signup failed.' };
    }
  };

  const verifyEmail = async (
    code: string, businessName: string, businessType: 'hotel' | 'restaurant' | 'combined'
  ): Promise<{ error: string | null }> => {
    try {
      const clerkInstance = clerk as any;
      const client = clerkInstance?.client;
      if (!client) return { error: 'Auth not ready. Try again.' };

      const result = await client.signUp.attemptEmailAddressVerification({ code });

      if (result?.status === 'complete') {
        const clerkId = result?.createdUserId;
        await clerkInstance.setActive({ session: result.createdSessionId });

        if (clerkId) {
          const subdomain = generateSubdomain(businessName);
          await supabase.rpc('create_tenant', {
            p_owner_id: clerkId, p_business_name: businessName, p_business_type: businessType, p_subdomain: subdomain,
          });
        }
        return { error: null };
      }

      return { error: 'Verification did not complete. Please check the code and try again.' };
    } catch (err: any) {
      const msg: string = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || '';
      // If already verified, the first attempt worked — treat as success
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('redeemed')) {
        try {
          const clerkInstance = clerk as any;
          const sessions = clerkInstance?.client?.sessions;
          if (sessions && sessions.length > 0) {
            await clerkInstance.setActive({ session: sessions[0].id });
            return { error: null };
          }
        } catch (_) { /* fall through */ }
        return { error: null }; // verified, just navigate
      }
      return { error: msg || 'Verification failed.' };
    }
  };

  const logout = async () => {
    await clerk.signOut();
    setUser(null); setTenant(null); setProperties([]);
    localStorage.removeItem(ACTIVE_PROPERTY_KEY);
    localStorage.removeItem('crm_user');
  };

  const switchProperty = (tenantId: string) => {
    const target = properties.find(p => p.id === tenantId);
    if (!target || !clerkUser) return;
    setTenant(target);
    localStorage.setItem(ACTIVE_PROPERTY_KEY, tenantId);
    supabase.from('user_properties').select('role')
      .eq('user_id', clerkUser.id).eq('tenant_id', tenantId).single()
      .then(({ data }) => {
        if (data) setUser(prev => prev ? { ...prev, role: (data.role as Role) || 'SUPER_ADMIN' } : prev);
      });
  };

  const addProperty = async (name: string, type: 'hotel' | 'restaurant' | 'combined'): Promise<{ error: string | null }> => {
    if (!user || !clerkUser) return { error: 'Not authenticated' };
    const subdomain = generateSubdomain(name);
    const { data: newTenantId, error } = await supabase.rpc('create_tenant', {
      p_owner_id: clerkUser.id, p_business_name: name, p_business_type: type, p_subdomain: subdomain,
    });
    if (error) {
      if (error.message?.includes('tenants_subdomain_key')) {
        return { error: 'This property name is already taken. Please try a different name.' };
      }
      return { error: error.message };
    }
    const email = clerkUser.primaryEmailAddress?.emailAddress || '';
    const clerkName = clerkUser.fullName || email.split('@')[0];
    await loadProperties(clerkUser.id, email, clerkName, clerkUser.imageUrl);
    if (newTenantId) switchProperty(newTenantId);
    return { error: null };
  };

  const hasPermission = (allowedRoles: Role[]) => checkPermission(user?.role ?? null, allowedRoles);
  const session = clerkUser ? { access_token: 'clerk-managed' } : null;

  return (
    <AuthContext.Provider value={{
      user, tenant, properties, session, loading,
      login, signup, verifyEmail, logout, switchProperty, addProperty, hasPermission, refreshTenant,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
