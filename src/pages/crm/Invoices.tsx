import { useState } from 'react';
import { Search, Filter, Download, FileText, Eye, X, CheckCircle } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2023-001', bookingId: 'RES-001', guest: 'Rahul Sharma', amount: 8400, gst: 900, date: '2023-10-28', status: 'Generated' },
  { id: 'INV-2023-002', bookingId: 'RES-003', guest: 'Amit Kumar', amount: 15120, gst: 1620, date: '2023-10-30', status: 'Generated' },
  { id: 'INV-2023-003', bookingId: 'RES-005', guest: 'Vikram Singh', amount: 5600, gst: 600, date: '2023-10-31', status: 'Generated' },
  { id: 'INV-2023-004', bookingId: 'RES-002', guest: 'Priya Patel', amount: 11760, gst: 1260, date: '2023-10-29', status: 'Pending' },
];

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = (invoice: any) => {
    setIsDownloading(invoice.id);
    // Simulate generation delay
    setTimeout(() => {
      // alert removed to prevent blocking UI 'page error' perception
      setIsDownloading(null);
    }, 1200);
  };

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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${invoice.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors" title="View Invoice"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice)}
                        disabled={isDownloading === invoice.id}
                        className={`p-1.5 rounded-lg transition-colors ${isDownloading === invoice.id
                          ? 'text-[#C9A646] bg-[#C9A646]/10 animate-pulse'
                          : 'text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)]'
                          }`}
                        title="Download PDF"
                      >
                        {isDownloading === invoice.id ? <CheckCircle size={18} /> : <Download size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="text-[var(--color-ocean-600)]" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">Invoice Details</h3>
                  <p className="text-xs text-gray-500">{selectedInvoice.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Guest Name</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInvoice.guest}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInvoice.bookingId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInvoice.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedInvoice.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">₹{(selectedInvoice.amount - selectedInvoice.gst).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">GST (12%)</span>
                  <span className="text-sm font-medium text-gray-900">₹{selectedInvoice.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-[#0E2A38]">₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(selectedInvoice)}
                  className="flex-1 flex justify-center items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white font-semibold py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(14,42,56,0.15)]"
                >
                  {isDownloading === selectedInvoice.id ? <CheckCircle size={18} /> : <Download size={18} />}
                  {isDownloading === selectedInvoice.id ? 'Downloaded' : 'Download Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
