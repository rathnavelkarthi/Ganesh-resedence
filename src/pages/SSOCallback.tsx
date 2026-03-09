import { AuthenticateWithRedirectCallback } from '@clerk/react';

/**
 * Handles the OAuth redirect callback from Clerk (e.g. Google).
 * We use the official AuthenticateWithRedirectCallback to reliably 
 * handle transfers between signIn and signUp flows.
 */
export default function SSOCallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E2A38] to-[#071A24]">
            <AuthenticateWithRedirectCallback
                signInFallbackRedirectUrl="/admin/dashboard"
                signUpFallbackRedirectUrl="/admin/dashboard"
            />
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#C9A646] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#AAB8C5] text-sm">Completing sign in…</p>
            </div>
        </div>
    );
}
