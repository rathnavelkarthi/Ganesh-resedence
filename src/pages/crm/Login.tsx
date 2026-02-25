import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
import { Lock, Mail, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock role assignment based on email prefix
    let role: Role = 'RECEPTION';
    if (email.startsWith('admin')) role = 'SUPER_ADMIN';
    else if (email.startsWith('manager')) role = 'MANAGER';
    else if (email.startsWith('house')) role = 'HOUSEKEEPING';
    else if (email.startsWith('account')) role = 'ACCOUNTANT';

    if (password === 'password') {
      login(email, role);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use password: password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[var(--color-ocean-50)] rounded-2xl flex items-center justify-center mb-6">
            <Building2 size={32} className="text-[var(--color-ocean-600)]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Ganesh Residency</h2>
          <p className="mt-2 text-sm text-gray-500 uppercase tracking-wider font-semibold">CRM Admin Portal</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
                  placeholder="admin@ganeshresidency.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white rounded-xl font-bold text-lg transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Demo accounts (password: password):</p>
            <p className="mt-1">admin@, manager@, reception@, house@, account@</p>
          </div>
        </form>
      </div>
    </div>
  );
}
