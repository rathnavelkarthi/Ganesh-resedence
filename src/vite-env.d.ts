/// <reference types="vite/client" />

// Fix react-helmet-async types for React 19
declare module 'react-helmet-async' {
    import { ReactNode } from 'react';
    export interface HelmetProps {
        children?: ReactNode;
    }
    export const Helmet: React.FC<HelmetProps>;
    export const HelmetProvider: React.FC<{ children?: ReactNode }>;
}

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
