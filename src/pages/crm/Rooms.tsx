import { useState } from 'react';
import { Search, Filter, Edit, Wrench, CheckCircle, LogIn, LogOut } from 'lucide-react';
import { useCRM } from '../../context/CRMDataContext';
import type { Room } from '../../context/CRMDataContext';
import { toast } from 'sonner';

export default function Rooms() {
  const { rooms, updateRoom, reservations } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find the current guest for a room by checking active reservations
  // whose dates overlap today and have a relevant status
  const getRoomGuest = (roomId: number) => {
    const today = new Date();
    const activeRes = reservations.find(r => {
      if (r.room_id !== roomId) return false;
      if (r.status !== 'Confirmed' && r.status !== 'Pending') return false;
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return today >= checkIn && today <= checkOut;
    });
    return activeRes ? activeRes.guest : null;
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateRoom(id, { status: status as Room['status'] });
      toast.success(`Room status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateCleaning = async (id: number, status: 'Clean' | 'Dirty') => {
    try {
      await updateRoom(id, { cleaning_status: status });
      toast.success(`Room marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update cleaning status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500 mt-1">Monitor room status, cleaning, and maintenance.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Room Number or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Room Number</th>
                <th className="p-4 font-semibold">Room Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Cleaning Status</th>
                <th className="p-4 font-semibold">Current Guest</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredRooms.map((room) => {
                const guestName = getRoomGuest(room.id);
                return (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 font-bold text-gray-900 text-lg">{room.room_number || 'N/A'}</td>
                    <td className="p-4 text-gray-600 font-medium">{room.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${room.status === 'Available' ? 'bg-green-100 text-green-800' :
                          room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${room.cleaning_status === 'Clean' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {room.cleaning_status === 'Clean' ? <CheckCircle size={12} /> : <Wrench size={12} />}
                        {room.cleaning_status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {guestName ? (
                        <span className="font-medium text-[var(--color-ocean-900)]">{guestName}</span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {room.status === 'Available' && (
                          <button
                            onClick={() => handleUpdateStatus(room.id, 'Occupied')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Check In">
                            <LogIn size={18} />
                          </button>
                        )}
                        {room.status === 'Occupied' && (
                          <button
                            onClick={() => handleUpdateStatus(room.id, 'Available')}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Check Out">
                            <LogOut size={18} />
                          </button>
                        )}
                        {room.cleaning_status === 'Dirty' ? (
                          <button
                            onClick={() => handleUpdateCleaning(room.id, 'Clean')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Clean">
                            <CheckCircle size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateCleaning(room.id, 'Dirty')}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Mark Dirty">
                            <Wrench size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
