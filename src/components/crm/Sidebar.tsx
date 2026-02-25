import { NavLink } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
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
  ListTodo
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
  { name: 'Staff Management', path: '/admin/staff', icon: UserCog, roles: ['SUPER_ADMIN'] },
  { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN', 'MANAGER'] },
];

export default function Sidebar() {
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles));

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="font-serif text-xl font-bold text-[var(--color-ocean-900)]">Ganesh Residency</h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">CRM Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
