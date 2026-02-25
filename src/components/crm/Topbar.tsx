import { Search, Bell, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user, hasPermission } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search bookings, guests, or rooms..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {hasPermission(['SUPER_ADMIN', 'MANAGER', 'RECEPTION']) && (
          <button className="flex items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus size={16} />
            Quick Add Booking
          </button>
        )}

        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-500 hover:text-gray-900 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-gray-200" />
        </div>
      </div>

    </header>
  );
}
