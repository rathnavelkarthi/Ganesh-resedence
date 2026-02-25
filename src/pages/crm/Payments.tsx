import { useState } from 'react';
import { Search, Filter, Download, CheckCircle, RotateCcw } from 'lucide-react';

const mockPayments = [
  { id: 'PAY-1001', bookingId: 'RES-001', guest: 'Rahul Sharma', amount: 7500, method: 'UPI', status: 'Paid', date: '2023-10-25 10:30 AM' },
  { id: 'PAY-1002', bookingId: 'RES-002', guest: 'Priya Patel', amount: 10500, method: 'Credit Card', status: 'Pending', date: '2023-10-26 02:15 PM' },
  { id: 'PAY-1003', bookingId: 'RES-003', guest: 'Amit Kumar', amount: 13500, method: 'Debit Card', status: 'Paid', date: '2023-10-27 09:45 AM' },
  { id: 'PAY-1004', bookingId: 'RES-004', guest: 'Sneha Gupta', amount: 18000, method: 'UPI', status: 'Refunded', date: '2023-10-28 11:20 AM' },
  { id: 'PAY-1005', bookingId: 'RES-005', guest: 'Vikram Singh', amount: 5000, method: 'Cash', status: 'Paid', date: '2023-10-29 04:00 PM' },
];

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Track transactions, refunds, and payment statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Payment ID, Guest, or Booking ID..." 
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
                <th className="p-4 font-semibold">Payment ID</th>
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">Guest Name</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Method</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-900">{payment.id}</td>
                  <td className="p-4 text-[var(--color-ocean-600)] font-medium hover:underline cursor-pointer">{payment.bookingId}</td>
                  <td className="p-4 font-semibold text-gray-900">{payment.guest}</td>
                  <td className="p-4 font-bold text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{payment.method}</td>
                  <td className="p-4 text-gray-600">{payment.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {payment.status === 'Pending' && (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark as Paid">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {payment.status === 'Paid' && (
                        <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Refund">
                          <RotateCcw size={18} />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors" title="Download Invoice">
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
