import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

// --- Reusable Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative w-full group">
        <input
          ref={ref}
          type={currentType}
          id={props.id || label}
          className={`peer w-full bg-[#0E2A38]/30 border border-[#AAB8C5]/20 rounded-lg px-4 pt-6 pb-2 text-[#F7F4EF] placeholder-transparent outline-none transition-all duration-300 focus:border-[#0E2A38] focus:bg-[#0E2A38]/50 focus:ring-1 focus:ring-[#2E7D5B]/40 hover:border-[#AAB8C5]/40 shadow-inner hover:-translate-y-[1px] ${className}`}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={props.id || label}
          className="absolute text-[14px] text-[#AAB8C5] duration-300 transform -translate-y-3 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 peer-focus:text-[#F7F4EF] pointer-events-none"
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAB8C5] hover:text-[#F7F4EF] transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// --- Main Login Page Component ---
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#0C2230] relative overflow-hidden font-sans selection:bg-[#2E7D5B]/30"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A38] to-[#071A24] z-0" />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0E2A38] rounded-full blur-[100px] opacity-40 pointer-events-none z-0" />

      {/* LEFT SIDE (BRAND PANEL) */}
      <div className="relative z-10 w-full md:w-[45%] p-8 md:p-16 lg:px-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#AAB8C5]/5 h-auto md:h-full order-2 md:order-1 min-h-[50vh] md:min-h-screen">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-[#F7F4EF] leading-tight mb-2 tracking-tight">
              Hospitality<span className="text-[#C9A646]">OS</span>
            </h1>
            <h2 className="text-[#AAB8C5] font-light text-[18px] md:text-[22px] tracking-wide mb-8">
              Hotel & Restaurant Management Platform
            </h2>

            <p className="text-[#AAB8C5] text-[15px] max-w-[400px] leading-relaxed mb-12 font-light">
              Manage your property, bookings, inventory, billing, and team from one system.
            </p>

            <ul className="space-y-6 text-[#F7F4EF]">
              {[
                "Real-time reservation sync",
                "Multi-role access control",
                "Direct billing and invoicing",
                "Your own website and subdomain"
              ].map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.6, ease: "easeOut" }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0E2A38] border border-[#AAB8C5]/30 group-hover:bg-[#C9A646] group-hover:border-[#C9A646] transition-colors duration-300" />
                  <span className="text-[14px] md:text-[15px] font-normal tracking-wide text-[#AAB8C5] group-hover:text-[#F7F4EF] transition-colors duration-300">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 md:mt-auto flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link
            to="/"
            className="text-[12px] md:text-[13px] font-medium text-[#C9A646] hover:text-[#F7F4EF] tracking-wide text-left transition-colors self-start"
          >
            ← Back to HospitalityOS.com
          </Link>

          <div className="pt-6 border-t border-[#AAB8C5]/10">
            <p className="text-[10px] md:text-[11px] font-semibold text-[#AAB8C5] tracking-[0.2em] uppercase leading-relaxed text-left opacity-60 m-0">
              &copy; 2026 HospitalityOS<br />
              Secure hotel and restaurant infrastructure
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (LOGIN PANEL) */}
      <div className="relative z-10 w-full md:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-24 min-h-[60vh] md:min-h-screen order-1 md:order-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] p-8 sm:p-12 rounded-2xl bg-[#0E2A38]/20 backdrop-blur-xl border border-[#AAB8C5]/10 shadow-[0_40px_120px_rgba(0,0,0,0.25)] relative overflow-hidden"
        >
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />

          <div className="mb-10">
            <h2 className="text-[28px] font-bold text-[#F7F4EF] tracking-tight m-0">
              Welcome back
            </h2>
            <p className="text-[#AAB8C5] mt-2 text-[14px] font-light tracking-wide m-0">
              Sign in to your dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-[13px] text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Email address"
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-4">
              <Input
                label="Password"
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-start px-1">
                <a href="#" className="text-[12px] font-medium text-[#AAB8C5] hover:text-[#F7F4EF] transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden bg-gradient-to-b from-[#0E2A38] to-[#071A24] text-[#F7F4EF] font-semibold tracking-wide py-3.5 px-6 rounded-lg transition-all duration-200 border border-transparent shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:border-[#C9A646]/30 hover:shadow-[0_8px_30px_rgba(201,166,70,0.15)] disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#AAB8C5]/70">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#C9A646] hover:text-[#F7F4EF] font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
