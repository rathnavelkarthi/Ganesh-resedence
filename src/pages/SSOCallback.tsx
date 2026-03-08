import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';

/**
 * Handles the OAuth redirect callback from Clerk (e.g. Google).
 * Clerk processes the OAuth params from the URL, sets the session,
 * then we redirect to the dashboard.
 */
export default function SSOCallback() {
    const { handleRedirectCallback } = useClerk();
    const navigate = useNavigate();

    useEffect(() => {
        handleRedirectCallback({
            afterSignInUrl: '/admin/dashboard',
            afterSignUpUrl: '/admin/dashboard',
        } as any)
            .then(() => {
                window.location.href = '/admin/dashboard';
            })
            .catch(() => {
                // If callback handling fails, still try to go to dashboard
                // (session may already be set)
                window.location.href = '/admin/dashboard';
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E2A38] to-[#071A24]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#C9A646] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#AAB8C5] text-sm">Completing sign in…</p>
            </div>
        </div>
    );
}
