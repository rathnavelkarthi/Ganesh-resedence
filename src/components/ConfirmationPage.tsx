import { motion } from 'motion/react';
import { CheckCircle, Calendar, Users, MapPin, Download, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConfirmationPageProps {
  bookingData: any;
}

export default function ConfirmationPage({ bookingData }: ConfirmationPageProps) {
  const { room, checkIn, checkOut, guests, guestDetails } = bookingData;
  const bookingId = `GR-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const roomPrice = room ? room.price * nights : 0;
  const taxes = Math.round(roomPrice * 0.12);
  const total = roomPrice + taxes;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Header */}
        <div className="bg-[var(--color-ocean-900)] text-white p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>
          
          <h1 className="font-serif text-4xl font-bold mb-2 relative z-10">Your Stay is Confirmed! 🎉</h1>
          <p className="text-white/80 text-lg relative z-10">Thank you for choosing Ganesh Residency, {guestDetails?.fullName?.split(' ')[0] || 'Guest'}.</p>
        </div>

        {/* Booking Details */}
        <div className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-gray-100 gap-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Booking ID</p>
              <p className="text-2xl font-bold text-[var(--color-ocean-900)]">{bookingId}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Room Details</h3>
                <p className="font-bold text-lg text-gray-900">{room?.name}</p>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Users size={16} />
                  <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Guest Information</h3>
                <p className="font-medium text-gray-900">{guestDetails?.fullName}</p>
                <p className="text-gray-600">{guestDetails?.email}</p>
                <p className="text-gray-600">{guestDetails?.phone}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Check-in</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar size={16} className="text-[var(--color-ocean-600)]" />
                  {formatDate(checkIn)}
                </p>
                <p className="text-sm text-gray-500 mt-1">After 12:00 PM</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Check-out</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar size={16} className="text-[var(--color-ocean-600)]" />
                  {formatDate(checkOut)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Before 11:00 AM</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[var(--color-sand-100)] rounded-xl mb-10">
            <MapPin size={20} className="text-[var(--color-ocean-600)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Ganesh Residency</p>
              <p className="text-sm text-gray-600">No. 2, Sai Baba Koil Street, Chinna Kalapet, Puducherry 605014</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-semibold text-gray-700 transition-colors">
              <Download size={18} />
              Download Invoice
            </button>
            <a 
              href="https://wa.me/918248981269" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors shadow-sm"
            >
              <MessageCircle size={18} />
              WhatsApp Confirmation
            </a>
            <a 
              href="tel:04132656555"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-semibold text-gray-700 transition-colors sm:col-span-2"
            >
              <Phone size={18} />
              Contact Front Desk
            </a>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-[var(--color-ocean-600)] font-medium hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
