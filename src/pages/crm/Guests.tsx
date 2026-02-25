import { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';

const mockGuests = [
  { id: 'G-001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', stays: 3, spent: '₹45,000', lastVisit: '2023-10-25', location: 'Delhi, India' },
  { id: 'G-002', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 87654 32109', stays: 1, spent: '₹12,500', lastVisit: '2023-10-26', location: 'Mumbai, India' },
  { id: 'G-003', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 76543 21098', stays: 5, spent: '₹85,000', lastVisit: '2023-10-27', location: 'Bangalore, India' },
  { id: 'G-004', name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '+91 65432 10987', stays: 2, spent: '₹28,000', lastVisit: '2023-10-28', location: 'Chennai, India' },
  { id: 'G-005', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 54321 09876', stays: 1, spent: '₹15,000', lastVisit: '2023-10-29', location: 'Pune, India' },
];

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Guest Directory</h1>
          <p className="text-gray-500 mt-1">Manage guest profiles and stay history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Phone..." 
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
                <th className="p-4 font-semibold">Guest Info</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Total Stays</th>
                <th className="p-4 font-semibold">Total Spent</th>
                <th className="p-4 font-semibold">Last Visit</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {mockGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] flex items-center justify-center font-bold text-lg">
                        {guest.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{guest.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {guest.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate max-w-[150px]">{guest.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{guest.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                      {guest.stays} Stays
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-[var(--color-ocean-900)]">{guest.spent}</td>
                  <td className="p-4 text-gray-600">{guest.lastVisit}</td>
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
          <span>Showing 1 to 5 of 120 entries</span>
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
