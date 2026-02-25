import { useState } from 'react';
import { Search, Plus, MoreVertical, Shield, Mail, Phone } from 'lucide-react';

const mockStaff = [
  { id: 'S-001', name: 'Admin User', email: 'admin@ganeshresidency.com', phone: '+91 98765 43210', role: 'SUPER_ADMIN', status: 'Active' },
  { id: 'S-002', name: 'Manager User', email: 'manager@ganeshresidency.com', phone: '+91 87654 32109', role: 'MANAGER', status: 'Active' },
  { id: 'S-003', name: 'Reception User', email: 'reception@ganeshresidency.com', phone: '+91 76543 21098', role: 'RECEPTION', status: 'Active' },
  { id: 'S-004', name: 'Housekeeping User', email: 'house@ganeshresidency.com', phone: '+91 65432 10987', role: 'HOUSEKEEPING', status: 'Active' },
  { id: 'S-005', name: 'Accountant User', email: 'account@ganeshresidency.com', phone: '+91 54321 09876', role: 'ACCOUNTANT', status: 'Inactive' },
];

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage employee access, roles, and profiles.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus size={16} />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Staff Info</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {mockStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] flex items-center justify-center font-bold text-lg">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate max-w-[150px]">{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{staff.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold uppercase tracking-wider">
                      <Shield size={12} className="text-gray-500" />
                      {staff.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
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

      </div>
    </div>
  );
}
