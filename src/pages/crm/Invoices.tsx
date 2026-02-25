import { useState } from 'react';
import { Search, Filter, Download, FileText, Eye } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2023-001', bookingId: 'RES-001', guest: 'Rahul Sharma', amount: 8400, gst: 900, date: '2023-10-28', status: 'Generated' },
  { id: 'INV-2023-002', bookingId: 'RES-003', guest: 'Amit Kumar', amount: 15120, gst: 1620, date: '2023-10-30', status: 'Generated' },
  { id: 'INV-2023-003', bookingId: 'RES-005', guest: 'Vikram Singh', amount: 5600, gst: 600, date: '2023-10-31', status: 'Generated' },
  { id: 'INV-2023-004', bookingId: 'RES-002', guest: 'Priya Patel', amount: 11760, gst: 1260, date: '2023-10-29', status: 'Pending' },
];

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage and generate GST-compliant invoices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID, Guest, or Booking ID..." 
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
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">Guest Name</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">GST Included</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-[var(--color-ocean-600)]" />
                    {invoice.id}
                  </td>
                  <td className="p-4 text-[var(--color-ocean-600)] font-medium hover:underline cursor-pointer">{invoice.bookingId}</td>
                  <td className="p-4 font-semibold text-gray-900">{invoice.guest}</td>
                  <td className="p-4 font-bold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">₹{invoice.gst.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{invoice.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors" title="View Invoice">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors" title="Download PDF">
                        <Download size={18} />
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
