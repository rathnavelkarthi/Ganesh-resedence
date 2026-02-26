import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Plus, Users, LogIn, LogOut, CheckCircle, Wrench, X, Phone, Mail, Home, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCRM } from '../../context/CRMDataContext';

const rooms = [
  { id: '101', type: 'Executive Double AC', status: 'Clean' },
  { id: '102', type: 'Executive Double AC', status: 'Dirty' },
  { id: '103', type: 'Triple Room AC', status: 'Clean' },
  { id: '104', type: 'Four Occupancy Room', status: 'Maintenance' },
  { id: '105', type: 'Six Bed AC Room', status: 'Clean' },
  { id: '201', type: 'Executive Double AC', status: 'Clean' },
  { id: '202', type: 'Triple Room AC', status: 'Dirty' },
];

export default function Calendar() {
  const { reservations: rawReservations } = useCRM();
  const navigate = useNavigate();

  // Transform context reservations to Calendar format
  const bookings = rawReservations.map(res => ({
    id: res.id,
    roomId: '101', // TODO: Add real room assignment to Reservations
    guest: res.guest,
    phone: '', // TODO: Add to Reservations
    email: '', // TODO: Add to Reservations
    amount: 0, // TODO: Add to Reservations
    source: res.source,
    start: new Date(res.checkIn),
    end: new Date(res.checkOut),
    status: res.status,
    payment: res.payment,
    notes: ''
  }));

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(addDays(currentDate, 13), { weekStartsOn: 1 }); // Show 2 weeks
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const handleToday = () => setCurrentDate(new Date());

  const getBookingForRoomAndDate = (roomId: string, date: Date) => {
    return bookings.find(b =>
      b.roomId === roomId &&
      date >= new Date(b.start.setHours(0, 0, 0, 0)) &&
      date <= new Date(b.end.setHours(23, 59, 59, 999))
    );
  };

  const smartStats = [
    { label: "Today's Check-ins", value: "8", icon: LogIn, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Check-outs", value: "5", icon: LogOut, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Occupied", value: "24", icon: Home, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Available", value: "12", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Maintenance", value: "2", icon: Wrench, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-8rem)] relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0E2A38] tracking-tight">Command Center</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Operational View
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-sm p-1">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-900">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleToday} className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#0E2A38] hover:bg-gray-50 rounded-lg transition-colors border-x border-gray-100">
              Today
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 hover:text-gray-900">
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={() => toast.info('Filter options coming soon!')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200/60 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <Filter size={16} /> Filters
          </button>
          <motion.button
            onClick={() => navigate('/admin/reservations?action=new')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#0E2A38] hover:bg-[#091b24] text-[#C9A646] px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg border border-[#0E2A38]"
          >
            <Plus size={16} /> Add Booking
          </motion.button>
        </div>
      </div>

      {/* Smart Stats Row - Floating KPI Chips */}
      <div className="flex flex-nowrap overflow-x-auto gap-4 mb-6 pb-2 no-scrollbar">
        {smartStats.map((stat, idx) => (
          <div key={idx} className="flex-1 min-w-[160px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-center gap-4 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className="font-serif text-2xl font-bold text-[#0E2A38] leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white/50 overflow-hidden flex-1 flex flex-col">

        {/* Header Legend */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm" /> Confirmed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm" /> Checked In
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500 shadow-sm" /> Maintenance
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-400">
            {format(startDate, 'MMMM yyyy')}
          </div>
        </div>

        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-auto relative container-snap">
          <div className="min-w-[1200px] h-full flex flex-col">

            {/* Date Header Row */}
            <div className="flex border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-20 shadow-sm">
              <div className="w-64 shrink-0 p-4 font-bold uppercase tracking-widest text-xs text-[#0E2A38] border-r border-gray-100 bg-gray-50/80 flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#C9A646]" /> Room Inventory
              </div>
              <div className="flex-1 flex">
                {days.map((day, i) => {
                  const isToday = isSameDay(day, new Date());
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  return (
                    <div key={i} className={`flex-1 min-w-[70px] p-3 text-center border-r border-gray-100/50 flex flex-col items-center justify-center transition-colors
                      ${isToday ? 'bg-[#0E2A38] relative overflow-hidden' : isWeekend ? 'bg-gray-50/50' : 'bg-transparent'}
                    `}>
                      {isToday && <div className="absolute inset-0 bg-gradient-to-t from-[#C9A646]/20 to-transparent opacity-50" />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest relative z-10 ${isToday ? 'text-[#C9A646]' : 'text-gray-400'}`}>
                        {format(day, 'EEE')}
                      </span>
                      <span className={`text-lg font-bold relative z-10 mt-0.5 ${isToday ? 'text-white' : isWeekend ? 'text-gray-600' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Rows */}
            <div className="divide-y divide-gray-100/50 flex-1 relative z-10">
              {rooms.map((room) => (
                <div key={room.id} className="flex group relative h-[72px]">
                  {/* Sticky Room Info Sidebar */}
                  <div className="w-64 shrink-0 p-3 px-4 border-r border-gray-100 bg-white group-hover:bg-gray-50/80 transition-colors flex items-center gap-4 sticky left-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-col shrink-0">
                      <span className="font-serif font-bold text-lg text-[#0E2A38] leading-none">{room.id}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wide truncate" title={room.type}>{room.type}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1
                          ${room.status === 'Clean' ? 'bg-emerald-50 text-emerald-700' : room.status === 'Dirty' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'Clean' ? 'bg-emerald-500' : room.status === 'Dirty' ? 'bg-amber-500' : 'bg-red-500'}`} />
                          {room.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid Cells */}
                  <div className="flex-1 flex relative">
                    {/* Background Grid Lines & Highlighting */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map((day, i) => {
                        const isToday = isSameDay(day, new Date());
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        return (
                          <div key={`bg-${i}`} className={`flex-1 min-w-[70px] border-r border-gray-100/30 ${isToday ? 'bg-[#0E2A38]/[0.02]' : isWeekend ? 'bg-gray-50/30' : ''}`} />
                        );
                      })}
                    </div>

                    {/* Booking Blocks */}
                    {days.map((day, i) => {
                      const booking = getBookingForRoomAndDate(room.id, day);
                      const isStart = booking && isSameDay(day, booking.start);
                      const isEnd = booking && isSameDay(day, booking.end);
                      const isMiddle = booking && !isStart && !isEnd;

                      // Block Styling based on status
                      let bgGradient = 'from-gray-400 to-gray-500';
                      if (booking) {
                        if (booking.status === 'Confirmed') bgGradient = 'from-emerald-400 to-emerald-600';
                        if (booking.status === 'Checked In') bgGradient = 'from-amber-400 to-amber-500';
                        if (booking.status === 'Maintenance') bgGradient = 'from-red-400 to-red-600';
                      }

                      return (
                        <div key={i} className="flex-1 min-w-[70px] relative p-[3px] py-2 z-10 flex">
                          {booking && (
                            <motion.div
                              onClick={() => setSelectedBooking(booking)}
                              whileHover={{ scale: 1.02, zIndex: 30 }}
                              initial={isStart ? { x: -10, opacity: 0 } : false}
                              animate={{ x: 0, opacity: 1 }}
                              className={`absolute top-2 bottom-2 bg-gradient-to-r flex flex-col justify-center px-3 cursor-pointer shadow-md hover:shadow-xl transition-shadow overflow-hidden group
                                ${bgGradient}
                                ${isStart ? 'left-[3px] rounded-l-xl z-20' : 'left-0 border-l border-white/20'}
                                ${isEnd ? 'right-[3px] rounded-r-xl z-20' : 'right-0'}
                                ${isMiddle ? 'left-0 right-0' : ''}
                                ${selectedBooking?.id === booking.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0E2A38]' : ''}
                              `}
                            >
                              {/* Inner Glass Highlight */}
                              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                              {/* Content visible only on start day or if it's long */}
                              {(isStart || day.getDay() === 1) && (
                                <div className="relative z-10">
                                  <p className="text-xs font-bold text-white tracking-wide truncate drop-shadow-md flex items-center gap-1.5">
                                    {booking.status === 'Checked In' && <CheckCircle2 size={12} className="text-white/80" />}
                                    {booking.guest}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Slide-in Booking Details Panel */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-[#0E2A38]/40 backdrop-blur-sm z-40 transition-opacity"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#0E2A38]">Reservation</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#C9A646] mt-1">{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-colors shadow-sm bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Guest Profile */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Guest Profile</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#0E2A38] text-[#C9A646] flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
                      {selectedBooking.guest.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{selectedBooking.guest}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {selectedBooking.source}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Phone size={16} className="text-gray-400" /> {selectedBooking.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Mail size={16} className="text-gray-400" /> {selectedBooking.email}
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Stay Details</h4>

                  <div className="bg-[#0E2A38] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Check In</p>
                        <p className="font-bold text-lg">{format(selectedBooking.start, 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="w-8 border-b-2 border-white/20 border-dashed" />
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Check Out</p>
                        <p className="font-bold text-lg">{format(selectedBooking.end, 'MMM dd, yyyy')}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm relative z-10 border border-white/10">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Room</p>
                        <p className="font-bold text-[#C9A646]">{selectedBooking.roomId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Status</p>
                        <p className="font-bold text-emerald-400">{selectedBooking.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing & Notes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <CreditCard size={14} />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Payment</h4>
                    </div>
                    <p className="text-xl font-bold text-gray-900 leading-tight">₹{selectedBooking.amount.toLocaleString('en-IN')}</p>
                    <p className={`text-xs font-bold mt-1 ${selectedBooking.payment === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedBooking.payment}
                    </p>
                  </div>

                  {selectedBooking.notes && (
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 col-span-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Special Notes</h4>
                      <p className="text-sm font-medium text-amber-900">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() => toast.info(`Editing booking ${selectedBooking.id} for ${selectedBooking.guest}...`)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Edit Booking
                </button>
                <button
                  onClick={() => toast.success(`Initiating Check Out for ${selectedBooking.guest}. Amount due: ₹${selectedBooking.amount.toLocaleString('en-IN')}`)}
                  className="flex-1 px-4 py-3 bg-[#0E2A38] text-[#C9A646] border border-[#0E2A38] font-bold uppercase tracking-widest text-xs rounded-xl shadow-md hover:shadow-lg hover:bg-[#091b24] transition-all"
                >
                  Check Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
