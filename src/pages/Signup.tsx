import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Building, UtensilsCrossed, Layers, ArrowRight, Check } from 'lucide-react';

type BusinessType = 'hotel' | 'restaurant' | 'combined';

const businessTypes: { type: BusinessType; icon: React.ElementType; label: string; desc: string }[] = [
    { type: 'hotel', icon: Building, label: 'Hotel / Resort', desc: 'Rooms, bookings, guest management' },
    { type: 'restaurant', icon: UtensilsCrossed, label: 'Restaurant', desc: 'Menu, POS, table reservations' },
    { type: 'combined', icon: Layers, label: 'Hotel + Restaurant', desc: 'Full property with stays and dining' },
];

export default function Signup() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState<BusinessType>('hotel');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [signupComplete, setSignupComplete] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName.trim()) {
            setError('Business name is required.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        const result = await signup(email, password, businessName, businessType);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setSignupComplete(true);
            setIsLoading(false);
        }
    };

    const subdomain = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);

    // Success screen
    if (signupComplete) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0E2A38] to-[#071A24] p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-[#2E7D5B]/20 border border-[#2E7D5B]/30 flex items-center justify-center mx-auto mb-6">
                        <Check size={28} className="text-[#2E7D5B]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#F7F4EF] mb-3">You're in.</h1>
                    <p className="text-[#AAB8C5] text-sm mb-2">
                        Check your email ({email}) for a confirmation link.
                    </p>
                    <p className="text-[#AAB8C5]/60 text-xs mb-8">
                        Your subdomain: <span className="text-[#C9A646] font-medium">{subdomain}.hospitalityos.com</span>
                    </p>
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="px-6 py-3 bg-[#C9A646] hover:bg-[#B89535] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                        Go to login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0C2230] relative overflow-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A38] to-[#071A24] z-0" />
            <div className="absolute left-0 md:left-[5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0E2A38] rounded-full blur-[100px] opacity-40 pointer-events-none z-0" />

            {/* LEFT: progress & preview */}
            <div className="relative z-10 w-full md:w-[45%] p-8 md:p-16 lg:px-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#AAB8C5]/5 order-2 md:order-1 min-h-[40vh] md:min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 flex flex-col justify-center"
                >
                    <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#F7F4EF] leading-tight mb-2 tracking-tight">
                        Hospitality<span className="text-[#C9A646]">OS</span>
                    </h1>
                    <p className="text-[#AAB8C5] text-[15px] max-w-[400px] leading-relaxed mb-12 font-light">
                        Create your account and get your property online in 15 minutes. Website, bookings, billing, and more.
                    </p>

                    {/* Live preview of what they'll get */}
                    <div className="bg-[#0E2A38]/40 border border-[#AAB8C5]/10 rounded-xl p-5 max-w-[360px]">
                        <p className="text-[10px] text-[#AAB8C5]/50 uppercase tracking-widest font-semibold mb-3">What you'll get</p>
                        <ul className="space-y-3">
                            {[
                                'Your own website on a custom subdomain',
                                'Booking engine with zero commission',
                                'Custom email for invoicing',
                                'Dashboard with analytics',
                                'Staff and inventory management',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#AAB8C5]/80">
                                    <div className="w-1 h-1 rounded-full bg-[#C9A646] mt-2 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {businessName && (
                            <div className="mt-5 pt-4 border-t border-[#AAB8C5]/10">
                                <p className="text-[10px] text-[#AAB8C5]/50 uppercase tracking-widest font-semibold mb-1">Your subdomain</p>
                                <p className="text-sm text-[#C9A646] font-medium">{subdomain || '...'}.hospitalityos.com</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="mt-12 md:mt-auto pt-6 border-t border-[#AAB8C5]/10">
                    <Link to="/" className="text-[12px] font-medium text-[#C9A646] hover:text-[#F7F4EF] transition-colors">
                        ← Back to HospitalityOS.com
                    </Link>
                </div>
            </div>

            {/* RIGHT: form */}
            <div className="relative z-10 w-full md:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-24 min-h-[60vh] md:min-h-screen order-1 md:order-2">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[440px] p-8 sm:p-12 rounded-2xl bg-[#0E2A38]/20 backdrop-blur-xl border border-[#AAB8C5]/10 shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
                >
                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#C9A646] text-white' : 'bg-[#AAB8C5]/10 text-[#AAB8C5]/40'}`}>1</div>
                        <div className="flex-1 h-px bg-[#AAB8C5]/10" />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#C9A646] text-white' : 'bg-[#AAB8C5]/10 text-[#AAB8C5]/40'}`}>2</div>
                    </div>

                    {step === 1 ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-[24px] font-bold text-[#F7F4EF] tracking-tight">Tell us about your business</h2>
                                <p className="text-[#AAB8C5] mt-2 text-[13px] font-light">We'll set up your dashboard based on this.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleStep1}>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-[13px] text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                {/* Business name */}
                                <div>
                                    <label className="block text-[12px] text-[#AAB8C5] font-medium uppercase tracking-widest mb-2">Business name</label>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="e.g. Sunrise Beach Resort"
                                        className="w-full bg-[#0E2A38]/30 border border-[#AAB8C5]/20 rounded-lg px-4 py-3 text-[#F7F4EF] placeholder-[#AAB8C5]/30 outline-none focus:border-[#C9A646]/50 focus:ring-1 focus:ring-[#C9A646]/20 transition-all text-sm"
                                    />
                                </div>

                                {/* Business type */}
                                <div>
                                    <label className="block text-[12px] text-[#AAB8C5] font-medium uppercase tracking-widest mb-3">What do you run?</label>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {businessTypes.map(({ type, icon: Icon, label, desc }) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setBusinessType(type)}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${businessType === type
                                                    ? 'bg-[#C9A646]/10 border-[#C9A646]/40 ring-1 ring-[#C9A646]/20'
                                                    : 'bg-[#0E2A38]/20 border-[#AAB8C5]/10 hover:border-[#AAB8C5]/25'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${businessType === type ? 'bg-[#C9A646]/20' : 'bg-[#AAB8C5]/5'
                                                    }`}>
                                                    <Icon size={18} className={businessType === type ? 'text-[#C9A646]' : 'text-[#AAB8C5]/50'} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-semibold ${businessType === type ? 'text-[#F7F4EF]' : 'text-[#AAB8C5]/80'}`}>{label}</p>
                                                    <p className="text-[11px] text-[#AAB8C5]/40">{desc}</p>
                                                </div>
                                                {businessType === type && (
                                                    <div className="ml-auto w-5 h-5 rounded-full bg-[#C9A646] flex items-center justify-center">
                                                        <Check size={12} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-b from-[#0E2A38] to-[#071A24] text-[#F7F4EF] font-semibold py-3.5 rounded-lg transition-all border border-transparent hover:border-[#C9A646]/30 shadow-[0_4px_14px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 text-sm"
                                >
                                    Continue <ArrowRight size={16} />
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-8">
                                <button onClick={() => setStep(1)} className="text-[12px] text-[#AAB8C5]/60 hover:text-[#AAB8C5] transition-colors mb-3 block">&larr; Back</button>
                                <h2 className="text-[24px] font-bold text-[#F7F4EF] tracking-tight">Create your account</h2>
                                <p className="text-[#AAB8C5] mt-2 text-[13px] font-light">
                                    Setting up <span className="text-[#C9A646] font-medium">{businessName}</span> as a {businessType === 'combined' ? 'hotel + restaurant' : businessType}.
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSignup}>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-[13px] text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[12px] text-[#AAB8C5] font-medium uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-[#0E2A38]/30 border border-[#AAB8C5]/20 rounded-lg px-4 py-3 text-[#F7F4EF] placeholder-[#AAB8C5]/30 outline-none focus:border-[#C9A646]/50 focus:ring-1 focus:ring-[#C9A646]/20 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[12px] text-[#AAB8C5] font-medium uppercase tracking-widest mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full bg-[#0E2A38]/30 border border-[#AAB8C5]/20 rounded-lg px-4 py-3 text-[#F7F4EF] placeholder-[#AAB8C5]/30 outline-none focus:border-[#C9A646]/50 focus:ring-1 focus:ring-[#C9A646]/20 transition-all text-sm"
                                    />
                                </div>

                                {/* Subdomain preview */}
                                <div className="bg-[#0E2A38]/30 border border-[#AAB8C5]/10 rounded-lg px-4 py-3">
                                    <p className="text-[10px] text-[#AAB8C5]/50 uppercase tracking-widest font-semibold mb-1">Your subdomain</p>
                                    <p className="text-sm text-[#C9A646] font-mono">{subdomain}.hospitalityos.com</p>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-[#C9A646] hover:bg-[#B89535] text-white font-semibold py-3.5 rounded-lg transition-all shadow-[0_4px_14px_rgba(201,166,70,0.3)] text-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating your account...' : 'Create account'}
                                </motion.button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-[13px] text-[#AAB8C5]/70">
                            Already have an account?{' '}
                            <Link to="/admin/login" className="text-[#C9A646] hover:text-[#F7F4EF] font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
