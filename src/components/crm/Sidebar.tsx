import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BedDouble,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  UserCog,
  LogOut,
  ListTodo,
  X,
  Image,
  Layers
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING', 'ACCOUNTANT'] },
  { name: 'Reservations', path: '/admin/reservations', icon: ListTodo, roles: ['SUPER_ADMIN', 'MANAGER', 'RECEPTION'] },
  { name: 'Calendar View', path: '/admin/calendar', icon: CalendarDays, roles: ['SUPER_ADMIN', 'MANAGER', 'RECEPTION'] },
  { name: 'Guests', path: '/admin/guests', icon: Users, roles: ['SUPER_ADMIN', 'MANAGER', 'RECEPTION'] },
  { name: 'Rooms', path: '/admin/rooms', icon: BedDouble, roles: ['SUPER_ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'] },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard, roles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
  { name: 'Invoices', path: '/admin/invoices', icon: FileText, roles: ['SUPER_ADMIN', 'RECEPTION', 'ACCOUNTANT'] },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
  { name: 'Rooms CMS', path: '/admin/rooms-cms', icon: Layers, roles: ['SUPER_ADMIN', 'MANAGER'] },
  { name: 'Landing CMS', path: '/admin/landing-cms', icon: Image, roles: ['SUPER_ADMIN', 'MANAGER'] },
  { name: 'Staff Management', path: '/admin/staff', icon: UserCog, roles: ['SUPER_ADMIN'] },
  { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN', 'MANAGER'] },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles));

  return (
    <aside className="w-64 bg-[#0E2A38] border-r border-[#0E2A38]/50 flex flex-col h-full lg:h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_40px_rgba(14,42,56,0.15)] z-40 relative backdrop-blur-xl">
      <div className="p-8 pb-6 flex justify-between items-center relative z-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white leading-tight tracking-wide">Ganesh <br /> Residency</h1>
          <p className="text-[10px] text-[#C9A646] uppercase tracking-[0.25em] mt-2 font-semibold">Workspace</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-white/50 hover:text-white rounded-lg transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar relative z-10">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-300 relative group overflow-hidden ${isActive
                ? 'text-white bg-white/5 shadow-inner'
                : 'text-white/50 hover:bg-white/5 hover:text-white/90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-indicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#C9A646] rounded-r-lg shadow-[0_0_12px_rgba(201,166,70,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={18} className={`transition-colors duration-300 ${isActive ? 'text-[#C9A646]' : 'text-white/40 group-hover:text-white/80'}`} />
                <span className="text-sm tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/20 shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#C9A646] uppercase tracking-widest truncate">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-md font-medium text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-colors text-xs uppercase tracking-widest"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#05141C]/80 pointer-events-none z-0" />
    </aside>
  );
}
