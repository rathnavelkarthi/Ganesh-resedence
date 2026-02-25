import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical } from 'lucide-react';

const mockReservations = [
  { id: 'RES-001', guest: 'Rahul Sharma', room: 'Executive Double AC', checkIn: '2023-10-25', checkOut: '2023-10-28', source: 'Direct', status: 'Confirmed', payment: 'Paid' },
  { id: 'RES-002', guest: 'Priya Patel', room: 'Triple Room AC', checkIn: '2023-10-26', checkOut: '2023-10-29', source: 'Booking.com', status: 'Pending', payment: 'Unpaid' },
  { id: 'RES-003', guest: 'Amit Kumar', room: 'Four Occupancy Room', checkIn: '2023-10-27', checkOut: '2023-10-30', source: 'Agoda', status: 'Confirmed', payment: 'Partial' },
  { id: 'RES-004', guest: 'Sneha Gupta', room: 'Six Bed AC Room', checkIn: '2023-10-28', checkOut: '2023-11-02', source: 'Direct', status: 'Cancelled', payment: 'Refunded' },
  { id: 'RES-005', guest: 'Vikram Singh', room: 'Executive Double AC', checkIn: '2023-10-29', checkOut: '2023-10-31', source: 'Direct', status: 'Confirmed', payment: 'Paid' },
];

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500 mt-1">Manage all bookings and guest stays.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus size={16} />
          Add Booking
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Guest Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
              <Filter size={16} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
              Export
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">Guest Name</th>
                <th className="p-4 font-semibold">Room Type</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {mockReservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-900">{res.id}</td>
                  <td className="p-4 font-semibold text-[var(--color-ocean-900)]">{res.guest}</td>
                  <td className="p-4 text-gray-600">{res.room}</td>
                  <td className="p-4 text-gray-600">
                    <div className="flex flex-col">
                      <span>{res.checkIn}</span>
                      <span className="text-xs text-gray-400">to {res.checkOut}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      res.source === 'Direct' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {res.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      res.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                      res.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      res.payment === 'Paid' ? 'bg-green-100 text-green-800' : 
                      res.payment === 'Partial' ? 'bg-orange-100 text-orange-800' : 
                      res.payment === 'Refunded' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {res.payment}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 text-sm text-gray-500">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-[var(--color-ocean-500)] bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] rounded-lg font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
