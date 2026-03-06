import { useState } from 'react';
import { Search, Filter, Edit, Wrench, CheckCircle, LogIn, LogOut } from 'lucide-react';
import { useCRM } from '../../context/CRMDataContext';
import type { Room } from '../../context/CRMDataContext';
import { toast } from 'sonner';

export default function Rooms() {
  const { rooms, updateRoom, reservations, checkInGuest, checkOutGuest } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find the active reservation for a room for today
  const getActiveReservation = (roomId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    return reservations.find(r => {
      // Must match room name or ID (fallback since some old data might not have room_id)
      const matchesRoom = r.room_id === roomId || rooms.find(room => room.id === roomId)?.type === r.room;
      if (!matchesRoom) return false;

      if (r.status !== 'Confirmed' && r.status !== 'Checked In' && r.status !== 'Pending') return false;

      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(23, 59, 59, 999);

      return today >= checkIn && today <= checkOut;
    });
  };

  const handleCheckIn = async (reservationId: string) => {
    if (!window.confirm("Check in this guest?")) return;
    try {
      const res = reservations.find(r => r.id === reservationId);
      const room = rooms.find(r => r.id === res?.room_id || r.type === res?.room);
      await checkInGuest(reservationId, room?.id);
      toast.success("Guest checked in successfully");
    } catch (error) {
      toast.error("Failed to check in guest");
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    if (!window.confirm("Check out this guest?")) return;
    try {
      const res = reservations.find(r => r.id === reservationId);
      const room = rooms.find(r => r.id === res?.room_id || r.type === res?.room);
      await checkOutGuest(reservationId, room?.id);
      toast.success("Guest checked out successfully");
    } catch (error) {
      toast.error("Failed to check out guest");
    }
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
                const activeRes = getActiveReservation(room.id);
                const guestName = activeRes ? activeRes.guest : null;

                // Derive actual status
                let displayStatus = room.status; // 'Available' or 'Maintenance'
                if (activeRes && room.status !== 'Maintenance') {
                  displayStatus = activeRes.status === 'Checked In' ? 'Occupied' : 'Reserved';
                }

                return (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 font-bold text-gray-900 text-lg">{room.room_number || 'N/A'}</td>
                    <td className="p-4 text-gray-600 font-medium">{room.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${displayStatus === 'Available' ? 'bg-green-100 text-green-800' :
                        displayStatus === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                          displayStatus === 'Reserved' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {displayStatus}
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
                        <span className="font-medium text-[var(--color-ocean-900)]">{guestName} <span className="text-xs text-gray-400 ml-1">({activeRes?.id})</span></span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeRes && activeRes.status !== 'Checked In' && (
                          <button
                            onClick={() => handleCheckIn(activeRes.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Check In">
                            <LogIn size={18} />
                          </button>
                        )}
                        {activeRes && activeRes.status === 'Checked In' && (
                          <button
                            onClick={() => handleCheckOut(activeRes.id)}
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
