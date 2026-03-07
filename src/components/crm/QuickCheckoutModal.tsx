import { useState, useMemo } from 'react';
import { X, Search, LogOut, Printer, User, Calendar, CreditCard, MapPin } from 'lucide-react';
import { useCRM, Reservation } from '../../context/CRMDataContext';
import { InvoiceData } from './InvoicePrintTemplate';
import { printInvoice } from './invoiceUtils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickCheckoutModal({ isOpen, onClose }: Props) {
    const { reservations, updateReservation, rooms } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutDone, setCheckoutDone] = useState(false);

    // Filter to active stays: Confirmed OR already Checked In (not yet checked out)
    const activeStays = useMemo(() => {
        return reservations.filter(r =>
            (r.status === 'Confirmed' || r.status === 'Checked In') &&
            (r.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.room.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [reservations, searchTerm]);

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

    const handleCheckout = async (andPrint: boolean) => {
        if (!selectedRes) return;
        setIsProcessing(true);

        try {
            if (andPrint) {
                const data = buildInvoiceData(selectedRes);
                printInvoice(data);
            }

            await updateReservation(selectedRes.id, {
                status: 'Checked Out',
                payment: 'Paid',
            });

            setCheckoutDone(true);

            setTimeout(() => {
                setSelectedRes(null);
                setCheckoutDone(false);
                setIsProcessing(false);
            }, 1500);
        } catch {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#0E2A38] to-[#1a3d50]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C9A646]/20 flex items-center justify-center">
                            <LogOut size={20} className="text-[#C9A646]" />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-bold text-white">Quick Check Out</h2>
                            <p className="text-white/50 text-xs">Select a guest to check out</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setSelectedRes(null); setCheckoutDone(false); onClose(); }}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {!selectedRes ? (
                        <div className="p-5">
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by guest name, booking ID, or room..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[#C9A646] focus:ring-2 focus:ring-[#C9A646]/20 outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Active stays list */}
                            <div className="space-y-2">
                                {activeStays.length > 0 ? (
                                    activeStays.map(res => (
                                        <button
                                            key={res.id}
                                            onClick={() => setSelectedRes(res)}
                                            className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-[#C9A646]/40 hover:bg-[#C9A646]/5 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] flex items-center justify-center font-bold text-lg">
                                                        {res.guest.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{res.guest}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <MapPin size={10} /> Room: {rooms.find(r => r.id === res.room_id)?.room_number || rooms.find(r => r.name === res.room || r.type === res.room)?.room_number || res.room}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-mono text-gray-500">{res.id}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{res.checkIn} - {res.checkOut}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-3 text-xs">
                                                <span className={`px-2 py-0.5 rounded-full font-semibold ${res.payment === 'Paid' ? 'bg-green-100 text-green-800' :
                                                    res.payment === 'Partial' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {res.payment}
                                                </span>
                                                {res.amount && (
                                                    <span className="text-gray-600 font-semibold">
                                                        ₹{res.amount.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span className="text-gray-400">{res.source}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <LogOut size={32} className="mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No active stays found</p>
                                        <p className="text-xs mt-1">All confirmed reservations have been checked out.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-5">
                            {/* Selected guest details */}
                            {checkoutDone ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <LogOut size={28} className="text-green-600" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">Checked Out</h3>
                                    <p className="text-gray-500 text-sm">{selectedRes.guest} has been checked out from {rooms.find(r => r.id === selectedRes.room_id)?.room_number || rooms.find(r => r.name === selectedRes.room || r.type === selectedRes.room)?.room_number || selectedRes.room}.</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedRes(null)}
                                        className="text-sm text-[var(--color-ocean-600)] hover:underline mb-4 inline-block"
                                    >
                                        ← Back to list
                                    </button>

                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-5">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-14 h-14 rounded-full bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] flex items-center justify-center font-bold text-2xl">
                                                {selectedRes.guest.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-xl font-bold text-gray-900">{selectedRes.guest}</h3>
                                                <p className="text-sm text-gray-500 font-mono">{selectedRes.id}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-start gap-2">
                                                <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Room</p>
                                                    <p className="text-gray-900 font-medium">{rooms.find(r => r.id === selectedRes.room_id)?.room_number || rooms.find(r => r.name === selectedRes.room || r.type === selectedRes.room)?.room_number || selectedRes.room}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Calendar size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Stay</p>
                                                    <p className="text-gray-900 font-medium">{selectedRes.checkIn}</p>
                                                    <p className="text-gray-500 text-xs">to {selectedRes.checkOut}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CreditCard size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Amount</p>
                                                    <p className="text-gray-900 font-bold">₹{(selectedRes.amount || 0).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Payment</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${selectedRes.payment === 'Paid' ? 'bg-green-100 text-green-800' :
                                                        selectedRes.payment === 'Partial' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {selectedRes.payment}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {selectedRes && !checkoutDone && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => handleCheckout(false)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E2A38] text-white font-semibold hover:bg-[#091b24] transition-all text-sm disabled:opacity-60"
                        >
                            <LogOut size={16} />
                            {isProcessing ? 'Processing...' : 'Mark Checked Out'}
                        </button>
                        <button
                            onClick={() => handleCheckout(true)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A646] text-[#0E2A38] font-semibold hover:bg-[#b8953e] transition-all text-sm disabled:opacity-60"
                        >
                            <Printer size={16} />
                            {isProcessing ? 'Generating...' : 'Check Out & Print Invoice'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
