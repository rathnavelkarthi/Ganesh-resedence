import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { supabase } from '../lib/supabaseClient';
import { generateSubdomain, hasPermission as checkPermission, DEMO_EMAIL } from '../lib/booking';
import { Session } from '@supabase/supabase-js';

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
  type: 'CLERK' | 'SUPABASE';
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
  loginAsDemo: () => void;
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
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('is_demo_mode') === 'true');

  const buildUser = (id: string, email: string, name: string, role: Role, type: 'CLERK' | 'SUPABASE', avatarUrl?: string): User => ({
    id,
    name,
    email,
    role,
    type,
    avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E2A38&color=fff`,
  });

  const loadProperties = async (userId: string, email: string, name: string, type: 'CLERK' | 'SUPABASE', avatarUrl?: string) => {
    console.log(`[AuthContext] Loading properties for ${type} user: ${userId}`);
    
    try {
      // 1. Try to find the tenant link in user_properties
      const { data: links, error: linkError } = await supabase
        .from('user_properties')
        .select('tenant_id, role, is_owner')
        .eq('user_id', userId);

      if (linkError) console.error('[AuthContext] Error fetching user_properties:', linkError);

      if (links && links.length > 0) {
        const tenantIds = links.map(l => l.tenant_id);
        const { data: tenantData, error: tError } = await supabase
          .from('tenants')
          .select('*')
          .in('id', tenantIds);

        if (tError) {
          console.error('[AuthContext] Error fetching tenants sequentially:', tError);
          // If sequence fails too, we might have a broader schema issue
        }

        if (tenantData && tenantData.length > 0) {
          setProperties(tenantData as Tenant[]);
          const savedId = localStorage.getItem(ACTIVE_PROPERTY_KEY);
          const active = (savedId && tenantData.find(t => t.id === savedId)) || tenantData[0];

          if (active) {
            setTenant(active as Tenant);
            localStorage.setItem(ACTIVE_PROPERTY_KEY, active.id);
            const link = links.find(l => l.tenant_id === active.id);
            const role = (link?.role as Role) || 'RECEPTION';
            setUser(buildUser(userId, email, name, role, type, avatarUrl));
            setLoading(false);
            return;
          }
        }
      }

      // 2. Fallback for Owners (mostly Clerk users)
      if (type === 'CLERK') {
        const { data: fallback, error: fbError } = await supabase
          .from('tenants').select('*').eq('owner_id', userId).limit(1).single();

        if (fbError && fbError.code !== 'PGRST116') {
          console.error('[AuthContext] Clerk fallback error:', fbError);
        }

        if (fallback) {
          setProperties([fallback as Tenant]);
          setTenant(fallback as Tenant);
          setUser(buildUser(userId, email, name, 'SUPER_ADMIN', 'CLERK', avatarUrl));
          setLoading(false);
          return;
        }
      }

      // 3. Fallback for Staff (Supabase users)
      if (type === 'SUPABASE') {
        const { data: staffData, error: sError } = await supabase
          .from('staff')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (sError) {
          console.error('[AuthContext] Staff lookup error:', sError);
          throw sError;
        }

        if (staffData) {
          const { data: tenantData, error: stError } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', staffData.tenant_id)
            .single();

          if (stError) {
             console.error('[AuthContext] Staff tenant lookup error:', stError);
             throw stError;
          }

          if (tenantData) {
            const staffTenant = tenantData as Tenant;
            setProperties([staffTenant]);
            setTenant(staffTenant);
            setUser(buildUser(userId, email, name, (staffData.role as Role) || 'RECEPTION', 'SUPABASE', avatarUrl));
            setLoading(false);
            return;
          }
        }
      }
    } catch (err: any) {
      console.error('[AuthContext] Critical failure in loadProperties:', err);
      if (err.message && err.message.includes('schema')) {
        console.error('[AuthContext] Possible schema mismatch or PostgREST cache issue detected.');
      }
    }

    // 4. Handle Pending Signups (only for owners)
    if (type === 'CLERK') {
      const pendingName = localStorage.getItem('pending_business_name');
      const pendingType = localStorage.getItem('pending_business_type') as Tenant['business_type'] | null;

      if (pendingName && pendingType) {
        localStorage.removeItem('pending_business_name');
        localStorage.removeItem('pending_business_type');
        const subdomain = generateSubdomain(pendingName);
        const { error } = await supabase.rpc('create_tenant', {
          p_owner_id: userId,
          p_business_name: pendingName,
          p_business_type: pendingType,
          p_subdomain: subdomain,
        });
        if (!error) {
          await loadProperties(userId, email, name, 'CLERK', avatarUrl);
          return;
        }
      }
      
      setUser(buildUser(userId, email, name, 'SUPER_ADMIN', 'CLERK', avatarUrl));
    } else {
      setUser(null);
      setTenant(null);
      setProperties([]);
    }
    
    setLoading(false);
  };

  const refreshTenant = async () => {
    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const name = clerkUser.fullName || email.split('@')[0];
      await loadProperties(clerkUser.id, email, name, 'CLERK', clerkUser.imageUrl);
    } else if (supabaseSession?.user) {
      const sUser = supabaseSession.user;
      const name = sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'Staff';
      await loadProperties(sUser.id, sUser.email || '', name, 'SUPABASE');
    }
  };

  useEffect(() => {
    // 1. Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 2. Main Auth Resolution Logic
    if (isDemoMode) {
      const demoTenant: Tenant = {
        id: '00000000-0000-0000-0000-000000000777',
        business_name: 'Ocean View Demo Resort',
        business_type: 'combined',
        subdomain: 'demo-ocean-view',
        template: 'luxury',
        plan: 'enterprise',
        custom_email: DEMO_EMAIL,
        logo_url: null,
        is_active: true,
      };
      setTenant(demoTenant);
      setUser(buildUser('demo-user-123', DEMO_EMAIL, 'Demo Manager', 'SUPER_ADMIN', 'SUPABASE'));
      setProperties([demoTenant]);
      setLoading(false);
      return;
    }

    if (!userLoaded) return;

    // Handle Clerk User
    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const name = clerkUser.fullName || email.split('@')[0];
      loadProperties(clerkUser.id, email, name, 'CLERK', clerkUser.imageUrl);
      return;
    }

    // Handle Supabase User
    if (supabaseSession?.user) {
      const sUser = supabaseSession.user;
      const name = sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'Staff';
      loadProperties(sUser.id, sUser.email || '', name, 'SUPABASE');
      return;
    }

    // No user found
    setUser(null);
    setTenant(null);
    setProperties([]);
    setLoading(false);
  }, [clerkUser?.id, userLoaded, supabaseSession?.user?.id, isDemoMode]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      setLoading(true);
      // Try Clerk first (for owners/managers)
      const clerkInstance = clerk as any;
      const client = clerkInstance?.client;
      
      if (client) {
        try {
          console.log('[AuthContext] Attempting Clerk login for:', email);
          const signIn = await client.signIn.create({ identifier: email, password });
          if (signIn.status === 'complete') {
            console.log('[AuthContext] Clerk login successful');
            await clerkInstance.setActive({ session: signIn.createdSessionId });
            return { error: null };
          }
          console.log('[AuthContext] Clerk login status:', signIn.status);
        } catch (clerkErr: any) {
          console.error('[AuthContext] Clerk login error detail:', {
            status: clerkErr.status,
            errors: clerkErr.errors,
            message: clerkErr.message,
            clerkError: clerkErr
          });
          console.log('[AuthContext] Clerk login failed, trying Supabase fallback...');
        }
      }

      // Fallback to Supabase (for staff)
      const { data, error: sError } = await supabase.auth.signInWithPassword({ email, password });
      if (sError) return { error: sError.message };
      
      if (data.session) {
        setSupabaseSession(data.session);
        return { error: null };
      }

      return { error: 'Unknown authentication error.' };
    } catch (err: any) {
      return { error: err.message || 'Login failed.' };
    } finally {
      setLoading(false);
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
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('redeemed')) {
        return { error: null };
      }
      return { error: msg || 'Verification failed.' };
    }
  };

  const logout = async () => {
    try {
      if (user?.type === 'CLERK') {
        await clerk.signOut();
      } else {
        await supabase.auth.signOut();
        setSupabaseSession(null);
      }
    } catch (e) {
      console.error('Error during sign out', e);
    }
    setIsDemoMode(false);
    localStorage.removeItem('is_demo_mode');
    setUser(null); setTenant(null); setProperties([]);
    localStorage.removeItem(ACTIVE_PROPERTY_KEY);
    localStorage.removeItem('crm_user');
  };

  const switchProperty = (tenantId: string) => {
    const target = properties.find(p => p.id === tenantId);
    if (!target) return;
    
    setTenant(target);
    localStorage.setItem(ACTIVE_PROPERTY_KEY, tenantId);
    
    const currentUserId = user?.id;
    if (currentUserId) {
      supabase.from('user_properties').select('role')
        .eq('user_id', currentUserId).eq('tenant_id', tenantId).single()
        .then(({ data }) => {
          if (data) setUser(prev => prev ? { ...prev, role: (data.role as Role) || 'RECEPTION' } : prev);
        });
    }
  };

  const addProperty = async (name: string, type: 'hotel' | 'restaurant' | 'combined'): Promise<{ error: string | null }> => {
    if (!user || user.type !== 'CLERK') return { error: 'Only property owners can add new properties.' };
    
    const subdomain = generateSubdomain(name);
    const { data: newTenantId, error } = await supabase.rpc('create_tenant', {
      p_owner_id: user.id, p_business_name: name, p_business_type: type, p_subdomain: subdomain,
    });
    
    if (error) {
      if (error.message?.includes('tenants_subdomain_key')) {
        return { error: 'This property name is already taken. Please try a different name.' };
      }
      return { error: error.message };
    }
    
    await refreshTenant();
    if (newTenantId) switchProperty(newTenantId);
    return { error: null };
  };

  const hasPermission = (allowedRoles: Role[]) => checkPermission(user?.role ?? null, allowedRoles);
  const session = user ? { access_token: isDemoMode ? 'demo-token' : 'active-session' } : null;

  const loginAsDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('is_demo_mode', 'true');
  };

  return (
    <AuthContext.Provider value={{
      user, tenant, properties, session, loading,
      login, signup, verifyEmail, logout, switchProperty, addProperty, hasPermission, refreshTenant,
      loginAsDemo,
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
