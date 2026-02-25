import { useState } from 'react';
import { Search, Filter, Edit, Wrench, CheckCircle } from 'lucide-react';

const mockRooms = [
  { id: '101', type: 'Executive Double AC', status: 'Occupied', cleaning: 'Clean', guest: 'Rahul Sharma' },
  { id: '102', type: 'Executive Double AC', status: 'Available', cleaning: 'Dirty', guest: null },
  { id: '103', type: 'Triple Room AC', status: 'Occupied', cleaning: 'Clean', guest: 'Priya Patel' },
  { id: '104', type: 'Four Occupancy Room', status: 'Maintenance', cleaning: 'Clean', guest: null },
  { id: '105', type: 'Six Bed AC Room', status: 'Available', cleaning: 'Clean', guest: null },
  { id: '201', type: 'Executive Double AC', status: 'Available', cleaning: 'Clean', guest: null },
  { id: '202', type: 'Triple Room AC', status: 'Occupied', cleaning: 'Dirty', guest: 'Amit Kumar' },
];

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState('');

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
              {mockRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-bold text-gray-900 text-lg">{room.id}</td>
                  <td className="p-4 text-gray-600 font-medium">{room.type}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      room.status === 'Available' ? 'bg-green-100 text-green-800' : 
                      room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                      room.cleaning === 'Clean' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.cleaning === 'Clean' ? <CheckCircle size={12} /> : <Wrench size={12} />}
                      {room.cleaning}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {room.guest ? (
                      <span className="font-medium text-[var(--color-ocean-900)]">{room.guest}</span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {room.cleaning === 'Dirty' && (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Clean">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Mark Maintenance">
                        <Wrench size={18} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors" title="Edit Room">
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
