import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, X, LogOut, FileText, Printer } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCRM, Reservation } from '../../context/CRMDataContext';
import InvoicePrintTemplate, { InvoiceData } from '../../components/crm/InvoicePrintTemplate';
import { printInvoice } from '../../components/crm/invoiceUtils';
import { usePlanLimits } from '../../lib/planLimits';
import UpgradeModal from '../../components/crm/UpgradeModal';

type StatusFilter = 'All' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Pending' | 'Cancelled';

export default function Reservations() {
  const { reservations, rooms, addReservation, updateReservation, deleteReservation, checkInGuest, checkOutGuest } = useCRM();
  const { canAdd, limitFor, currentCount, plan } = usePlanLimits();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [billRes, setBillRes] = useState<Reservation | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [formData, setFormData] = useState({
    guest: '',
    room: 'Executive Double AC',
    checkIn: '',
    checkOut: '',
    source: 'Direct',
    status: 'Pending' as 'Confirmed' | 'Checked In' | 'Pending' | 'Cancelled' | 'Checked Out',
    payment: 'Unpaid' as 'Paid' | 'Unpaid' | 'Partial' | 'Refunded',
  });

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(res => {
        const matchesSearch =
          res.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.room.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [reservations, searchTerm, statusFilter]);

  // Count reservations by status for the filter tabs
  const statusCounts = useMemo(() => {
    const counts = { All: reservations.length, Confirmed: 0, 'Checked In': 0, 'Checked Out': 0, Pending: 0, Cancelled: 0 };
    reservations.forEach(r => {
      if (r.status in counts) counts[r.status as keyof typeof counts]++;
    });
    return counts;
  }, [reservations]);

  const buildInvoiceData = (res: Reservation): InvoiceData => {
    const checkIn = new Date(res.checkIn);
    const checkOut = new Date(res.checkOut);
    const nights = Math.max(1, Math.floor((checkOut.getTime() - checkIn.getTime()) / 86400000));
    const subtotal = res.amount || 0;
    const gst = res.gst_amount || Math.round(subtotal * 0.12);
    const total = subtotal + gst;
    const ratePerNight = nights > 0 ? Math.round(subtotal / nights) : subtotal;

    return {
      invoiceNumber: `INV-${res.id.replace('RES-', '')}`,
      date: new Date().toLocaleDateString('en-GB'),
      guestName: res.guest,
      guestPhone: res.guest_phone,
      guestEmail: res.guest_email,
      guestLocation: res.guest_location,
      bookingId: res.id,
      room: res.room,
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      nights,
      ratePerNight,
      subtotal,
      gstAmount: gst,
      totalAmount: total,
      paymentMethod: res.payment_method || 'UPI',
      paymentStatus: res.payment,
    };
  };

  const handleCheckout = async (res: Reservation) => {
    if (!window.confirm(`Check out ${res.guest} from ${res.room}?`)) return;
    await checkOutGuest(res.id, res.room_id);
    setActiveMenuId(null);
  };

  const handleCheckIn = async (res: Reservation) => {
    if (!window.confirm(`Check in ${res.guest} to ${res.room}?`)) return;
    await checkInGuest(res.id, res.room_id);
    setActiveMenuId(null);
  };

  const handleCheckoutAndBill = async (res: Reservation) => {
    setActiveMenuId(null);
    setBillRes(res);
    // The bill modal handles the rest
  };

  const handleGenerateBill = (res: Reservation) => {
    setActiveMenuId(null);
    setBillRes(res);
  };

  const handlePrintBill = () => {
    if (!billRes) return;
    const data = buildInvoiceData(billRes);
    printInvoice(data);
  };

  const handleCheckoutAndPrint = async () => {
    if (!billRes) return;
    const data = buildInvoiceData(billRes);
    printInvoice(data);
    await checkOutGuest(billRes.id, billRes.room_id);
    setBillRes(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest || !formData.checkIn || !formData.checkOut) {
      alert("Please fill in all required fields (Guest Name, Check-in, Check-out).");
      return;
    }

    if (editingReservationId) {
      updateReservation(editingReservationId, formData);
    } else {
      addReservation(formData);
    }

    setIsModalOpen(false);
    setEditingReservationId(null);
    setFormData({
      guest: '', room: 'Executive Double AC', checkIn: '', checkOut: '',
      source: 'Direct', status: 'Pending', payment: 'Unpaid',
    });
  };

  const openEditModal = (res: Reservation) => {
    setEditingReservationId(res.id);
    setFormData({
      guest: res.guest, room: res.room, checkIn: res.checkIn, checkOut: res.checkOut,
      source: res.source, status: res.status, payment: res.payment,
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const statusTabs: StatusFilter[] = ['All', 'Confirmed', 'Checked In', 'Pending', 'Checked Out', 'Cancelled'];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'Checked In': return 'bg-amber-100 text-amber-800';
      case 'Checked Out': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const invoiceData = billRes ? buildInvoiceData(billRes) : null;

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500 mt-1">Manage bookings, check-ins, and check-outs.</p>
        </div>
        <button
          onClick={() => canAdd('reservations') ? setIsModalOpen(true) : setShowUpgrade(true)}
          className="flex items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Booking
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Status Filter Tabs */}
        <div className="px-4 pt-4 pb-0 border-b border-gray-100 bg-gray-50 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {statusTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${statusFilter === tab
                  ? 'bg-white text-[var(--color-ocean-900)] border-[#C9A646] shadow-sm'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {tab}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === tab ? 'bg-[#C9A646]/10 text-[#C9A646]' : 'bg-gray-200 text-gray-500'
                  }`}>
                  {statusCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Guest Name or Room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
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
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <tr key={res.id} className={`hover:bg-gray-50 transition-colors group ${res.status === 'Checked Out' ? 'opacity-70' : ''
                    }`}>
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
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${res.source === 'Direct' ? 'bg-slate-100 text-slate-700' :
                        res.source === 'Website' ? 'bg-[var(--color-ocean-100)] text-[var(--color-ocean-800)]' :
                          res.source === 'Booking.com' ? 'bg-[#003580]/10 text-[#003580]' :
                            res.source === 'Agoda' ? 'bg-[#5392f9]/10 text-[#5392f9]' :
                              res.source === 'MakeMyTrip' ? 'bg-[#ffedb3] text-[#d63200]' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {res.source}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${res.payment === 'Paid' ? 'bg-green-100 text-green-800' :
                        res.payment === 'Partial' ? 'bg-orange-100 text-orange-800' :
                          res.payment === 'Refunded' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {res.payment}
                      </span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === res.id ? null : res.id)}
                        className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === res.id && (
                        <div className="absolute right-8 top-10 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 text-left">
                          <button
                            onClick={() => openEditModal(res)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <MoreVertical size={14} className="text-gray-400" />
                            Edit Booking
                          </button>

                          {res.status === 'Confirmed' && (
                            <>
                              <div className="border-t border-gray-100" />
                              <button
                                onClick={() => handleCheckIn(res)}
                                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ocean-800)] hover:bg-[var(--color-ocean-50)] transition-colors flex items-center gap-2 font-medium"
                              >
                                <LogOut size={14} className="text-[#C9A646] rotate-180" />
                                Check In
                              </button>
                            </>
                          )}

                          {(res.status === 'Confirmed' || res.status === 'Checked In') && (
                            <>
                              <div className="border-t border-gray-100" />
                              <button
                                onClick={() => handleCheckout(res)}
                                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ocean-800)] hover:bg-[var(--color-ocean-50)] transition-colors flex items-center gap-2 font-medium"
                              >
                                <LogOut size={14} className="text-[#C9A646]" />
                                Check Out
                              </button>
                              <button
                                onClick={() => handleCheckoutAndBill(res)}
                                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-ocean-800)] hover:bg-[var(--color-ocean-50)] transition-colors flex items-center gap-2 font-medium"
                              >
                                <Printer size={14} className="text-[#C9A646]" />
                                Check Out & Print Bill
                              </button>
                            </>
                          )}

                          <div className="border-t border-gray-100" />
                          <button
                            onClick={() => handleGenerateBill(res)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <FileText size={14} className="text-gray-400" />
                            Generate Bill
                          </button>

                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => {
                              if (window.confirm('Remove this booking permanently?')) {
                                deleteReservation(res.id);
                              }
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                          >
                            <X size={14} />
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'All'
                      ? `No reservations match your filters.`
                      : 'No reservations yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 text-sm text-gray-500">
          <span>Showing {filteredReservations.length} of {reservations.length} entries</span>
        </div>
      </div>

      {/* Bill/Invoice Preview Modal */}
      {billRes && invoiceData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-50 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">Invoice Preview</h2>
                <p className="text-xs text-gray-500 mt-0.5">{billRes.id} -- {billRes.guest}</p>
              </div>
              <button
                onClick={() => setBillRes(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex justify-center">
              <InvoicePrintTemplate data={invoiceData} />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setBillRes(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {billRes.status === 'Confirmed' && (
                <button
                  onClick={handleCheckoutAndPrint}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E2A38] text-white font-semibold hover:bg-[#091b24] transition-colors shadow-sm"
                >
                  <LogOut size={16} />
                  Check Out & Print
                </button>
              )}
              <button
                onClick={handlePrintBill}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A646] text-[#0E2A38] font-semibold hover:bg-[#b8953e] transition-colors shadow-sm"
              >
                <Printer size={16} />
                Download & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {editingReservationId ? 'Edit Booking' : 'Add New Booking'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReservationId(null);
                  setFormData({
                    guest: '', room: 'Executive Double AC', checkIn: '', checkOut: '',
                    source: 'Direct', status: 'Pending', payment: 'Unpaid',
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={formData.guest}
                    onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.room_number ? `Room ${r.room_number} - ${r.name}` : r.name}>
                        {r.room_number ? `Room ${r.room_number} - ${r.name}` : r.name}
                      </option>
                    ))}
                    {rooms.length === 0 && <option value="">No rooms added yet</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  >
                    <option value="Direct">Direct (Walk-in/Phone)</option>
                    <option value="Website">Website</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Agoda">Agoda</option>
                    <option value="MakeMyTrip">MakeMyTrip</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment</label>
                  <select
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReservationId(null);
                    setFormData({
                      guest: '', room: 'Executive Double AC', checkIn: '', checkOut: '',
                      source: 'Direct', status: 'Pending', payment: 'Unpaid',
                    });
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] rounded-xl transition-colors shadow-sm"
                >
                  {editingReservationId ? 'Update Booking' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} resource="reservations this month" plan={plan} currentCount={currentCount('reservations')} limit={limitFor('reservations')} />
    </div>
  );
}
