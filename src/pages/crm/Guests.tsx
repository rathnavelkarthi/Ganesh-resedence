import { useState, useRef } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, FileText, X, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Define the Guest type
type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  stays: number;
  spent: string;
  lastVisit: string;
  location: string;
};

const mockGuests: Guest[] = [
  { id: 'G-001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', stays: 3, spent: '₹45,000', lastVisit: '2023-10-25', location: 'Delhi, India' },
  { id: 'G-002', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 87654 32109', stays: 1, spent: '₹12,500', lastVisit: '2023-10-26', location: 'Mumbai, India' },
  { id: 'G-003', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 76543 21098', stays: 5, spent: '₹85,000', lastVisit: '2023-10-27', location: 'Bangalore, India' },
  { id: 'G-004', name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '+91 65432 10987', stays: 2, spent: '₹28,000', lastVisit: '2023-10-28', location: 'Chennai, India' },
  { id: 'G-005', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 54321 09876', stays: 1, spent: '₹15,000', lastVisit: '2023-10-29', location: 'Pune, India' },
];

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleGenerateInvoice = (guest: Guest) => {
    setSelectedGuest(guest);
    setActiveDropdown(null);
  };

  const handleDownloadAndShare = async () => {
    if (!invoiceRef.current || !selectedGuest) return;

    // 1. Create WhatsApp Share Link and open tab SYNCHRONOUSLY to bypass popup blockers
    const formattedPhone = selectedGuest.phone.replace(/[^0-9+]/g, '');
    const waMessage = encodeURIComponent(
      `Hello ${selectedGuest.name},\n\nThank you for choosing Ganesh Residency! We hope you enjoyed your stay.\n\nPlease find your latest billing invoice attached to this chat (you can drag and drop the downloaded file here).\n\nBest Regards,\nGanesh Residency Team`
    );
    const waUrl = `https://wa.me/${formattedPhone}?text=${waMessage}`;

    // Open a blank window immediately before any await
    const waWindow = window.open('about:blank', '_blank');

    setIsGenerating(true);
    try {
      // 2. Generate Canvas
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher resolution for PDF
        useCORS: true,
        logging: false,
      });

      // 3. Setup PDF (A4 size)
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // 4. Download the PDF
      const filename = `Invoice_${selectedGuest.id}_${selectedGuest.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);

      // 5. Navigate the opened window to WhatsApp
      if (waWindow) {
        waWindow.location.href = waUrl;
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF invoice. Please try again.');
      // Close the empty window if we failed
      if (waWindow) waWindow.close();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Guest Directory</h1>
          <p className="text-gray-500 mt-1">Manage guest profiles and stay history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible relative z-10">

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 rounded-t-2xl">
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
        <div className="overflow-x-auto min-h-[400px]">
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
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors group">
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
                  <td className="p-4 text-right relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === guest.id ? null : guest.id)}
                      className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors focus:outline-none"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Simplified Action Dropdown */}
                    {activeDropdown === guest.id && (
                      <div className="absolute right-8 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                        <button
                          onClick={() => handleGenerateInvoice(guest)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-700)] transition-colors text-left"
                        >
                          <FileText size={16} />
                          Generate Bill
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50 text-sm text-gray-500 rounded-b-2xl gap-4">
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

      {/* Invoice Modal Overlay */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-gray-50 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
              <h2 className="font-serif text-xl font-bold text-gray-900">Invoice Preview</h2>
              <button
                onClick={() => setSelectedGuest(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Contains the actual invoice to be printed */}
            <div className="p-6 overflow-y-auto flex-1 flex justify-center">

              {/* THE INVOICE TEMPLATE (This div is captured by html2canvas) */}
              <div
                ref={invoiceRef}
                className="bg-[#ffffff] p-8 sm:p-12 w-full max-w-2xl shadow-sm border border-[#e5e7eb]"
                style={{
                  // Enforce white background for the PDF, avoiding transparent backgrounds
                  backgroundColor: '#ffffff',
                  color: '#1f2937' // gray-800
                }}
              >
                {/* Header Section */}
                <div className="flex justify-between items-start border-b border-[#f3f4f6] pb-8 mb-8">
                  <div>
                    <h1 className="font-serif text-3xl font-bold text-[#0c4a6e] leading-tight mb-2">Ganesh Residency</h1>
                    <p className="text-[#6b7280] text-sm">East Coast Road, Chennai</p>
                    <p className="text-[#6b7280] text-sm">Tamil Nadu, 600119</p>
                    <p className="text-[#6b7280] text-sm">billing@ganeshresidency.com</p>
                    <p className="text-[#6b7280] text-sm">+91 44 2345 6789</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-[#1f2937] tracking-wider mb-2">INVOICE</h2>
                    <p className="text-[#4b5563] text-sm font-medium">Inv. No: <span className="font-normal">#INV-{Math.floor(Math.random() * 90000) + 10000}</span></p>
                    <p className="text-[#4b5563] text-sm font-medium">Date: <span className="font-normal">{new Date().toLocaleDateString('en-GB')}</span></p>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-10">
                  <p className="text-xs text-[#9ca3af] font-bold uppercase tracking-wider mb-2">Bill To</p>
                  <h3 className="text-lg font-bold text-[#1f2937]">{selectedGuest.name}</h3>
                  <p className="text-[#4b5563] text-sm mt-1">{selectedGuest.location}</p>
                  <p className="text-[#4b5563] text-sm">{selectedGuest.phone}</p>
                  <p className="text-[#4b5563] text-sm">{selectedGuest.email}</p>
                </div>

                {/* Main Items Table */}
                <table className="w-full mb-10 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1f2937] text-[#1f2937] text-sm">
                      <th className="py-3 text-left font-bold w-1/2">Description</th>
                      <th className="py-3 text-center font-bold">Qty / Days</th>
                      <th className="py-3 text-right font-bold">Unit Price</th>
                      <th className="py-3 text-right font-bold w-1/4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-[#f3f4f6]">
                      <td className="py-4 text-[#1f2937]">
                        <p className="font-semibold">Premium Ocean View Suite</p>
                        <p className="text-xs text-[#6b7280] mt-1">Accommodation charges for latest visit.</p>
                      </td>
                      <td className="py-4 text-center text-[#4b5563]">{selectedGuest.stays}</td>
                      <td className="py-4 text-right text-[#4b5563]">
                        ₹{(parseInt(selectedGuest.spent.replace(/[^0-9]/g, '')) / selectedGuest.stays).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 text-right font-medium text-[#1f2937]">{selectedGuest.spent}</td>
                    </tr>
                    <tr className="border-b border-[#f3f4f6]">
                      <td className="py-4 text-[#1f2937]">
                        <p className="font-semibold">Room Service & Dining</p>
                        <p className="text-xs text-[#6b7280] mt-1">In-room dining and minibar consumption.</p>
                      </td>
                      <td className="py-4 text-center text-[#4b5563]">1</td>
                      <td className="py-4 text-right text-[#4b5563]">₹4,500</td>
                      <td className="py-4 text-right font-medium text-[#1f2937]">₹4,500</td>
                    </tr>
                    <tr className="border-b border-[#f3f4f6]">
                      <td className="py-4 text-[#1f2937]">
                        <p className="font-semibold">Spa & Wellness Center</p>
                        <p className="text-xs text-[#6b7280] mt-1">Aromatherapy massage session.</p>
                      </td>
                      <td className="py-4 text-center text-[#4b5563]">1</td>
                      <td className="py-4 text-right text-[#4b5563]">₹3,200</td>
                      <td className="py-4 text-right font-medium text-[#1f2937]">₹3,200</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals Section */}
                <div className="flex justify-end mb-16">
                  <div className="w-1/2 max-w-[250px]">
                    <div className="flex justify-between py-2 text-sm text-[#4b5563]">
                      <span>Subtotal</span>
                      <span>
                        ₹{(parseInt(selectedGuest.spent.replace(/[^0-9]/g, '')) + 4500 + 3200).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-sm text-[#4b5563] border-b border-[#e5e7eb]">
                      <span>GST (18%)</span>
                      <span>
                        ₹{((parseInt(selectedGuest.spent.replace(/[^0-9]/g, '')) + 4500 + 3200) * 0.18).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold text-[#111827] border-b-2 border-[#1f2937]">
                      <span>Total</span>
                      <span>
                        ₹{((parseInt(selectedGuest.spent.replace(/[^0-9]/g, '')) + 4500 + 3200) * 1.18).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="text-center pt-8 border-t border-[#e5e7eb]">
                  <h4 className="font-serif text-[#0c4a6e] font-bold text-lg mb-1">Thank You For Your Stay!</h4>
                  <p className="text-[#6b7280] text-xs">If you have any questions concerning this invoice, please contact reception.</p>
                  <p className="text-[#9ca3af] text-xs mt-4">This is a highly secure, computer-generated invoice.</p>
                </div>

              </div>
              {/* END INVOICE TEMPLATE */}

            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadAndShare}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating PDF...
                  </span>
                ) : (
                  <>
                    <Download size={18} />
                    <Share2 size={18} className="ml-1" />
                    Download & WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
