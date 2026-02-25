import { Search, Bell, Plus, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, hasPermission } = useAuth();

  return (
    <header className="h-20 bg-white/60 backdrop-blur-2xl border-b border-gray-200/50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">

      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 focus:outline-none transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search operations, guests, or IDs..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-full text-sm font-medium focus:bg-white focus:border-[#C9A646] focus:ring-4 focus:ring-[#C9A646]/10 outline-none transition-all shadow-inner placeholder-gray-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 lg:gap-8">
        {hasPermission(['SUPER_ADMIN', 'MANAGER', 'RECEPTION']) && (
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              onClick={() => alert('Quick Check Out flow coming soon. Will integrate with POS and folio management.')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0E2A38] px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow-sm border border-gray-200"
            >
              <LogOut size={14} className="text-[#C9A646]" />
              Quick Check Out
            </motion.button>
            <motion.button
              onClick={() => alert('Quick Booking flow coming soon. Will open new reservation wizard.')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-[#0E2A38] hover:bg-[#091b24] text-[#C9A646] px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg border border-[#0E2A38]"
            >
              <Plus size={14} />
              Quick Booking
            </motion.button>
          </div>
        )}

        {hasPermission(['SUPER_ADMIN', 'MANAGER', 'RECEPTION']) && (
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => alert('Quick Check Out flow coming soon.')}
              className="flex items-center justify-center bg-white text-[#0E2A38] p-2.5 rounded-full font-semibold transition-all shadow-sm border border-gray-200"
            >
              <LogOut size={18} className="text-[#C9A646]" />
            </button>
            <button
              onClick={() => alert('Quick Booking flow coming soon.')}
              className="flex items-center justify-center bg-[#0E2A38] text-[#C9A646] p-2.5 rounded-full font-semibold transition-all shadow-md"
            >
              <Plus size={18} />
            </button>
          </div>
        )}

        <div className="relative cursor-pointer p-2 group">
          <Bell size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
        </div>

        <div className="flex items-center gap-4 pl-4 lg:pl-8 border-l border-gray-200/60">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Active Workspace</p>
          </div>
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 cursor-pointer object-cover"
          />
        </div>
      </div>

    </header>
  );
}
