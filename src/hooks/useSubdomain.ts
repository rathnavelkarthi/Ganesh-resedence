export function getSubdomain() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    // Ignore common non-tenant subdomains
    const ignoredSubdomains = ['www', 'app', 'crm', 'admin'];

    if (isLocalhost) {
        const parts = hostname.split('.');
        if (parts.length > 1) {
            const sub = parts[0];
            if (!ignoredSubdomains.includes(sub)) {
                return sub;
            }
        }
        return null;
    }

    // Production (e.g., tenant.superstay.com)
    const parts = hostname.split('.');

    // Check if it has a subdomain (e.g., parts.length >= 3 for example.com)
    // Note: This relies on the root domain consisting of 2 parts (e.g. superstay.com).
    // If using a .co.uk domain, this logic would need extending, but works for .com/.org/etc.
    if (parts.length >= 3) {
        const sub = parts[0];
        if (!ignoredSubdomains.includes(sub)) {
            return sub;
        }
    }

    return null;
}
