import { Calendar, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  room: any;
  nights: number;
  onContinue: () => void;
  buttonText: string;
  isMobileDrawer?: boolean;
}

export default function BookingSummary({ 
  checkIn, 
  checkOut, 
  guests, 
  room, 
  nights, 
  onContinue, 
  buttonText,
  isMobileDrawer = false
}: BookingSummaryProps) {
  
  const roomPrice = room ? room.price * nights : 0;
  const taxes = Math.round(roomPrice * 0.12); // 12% GST
  const total = roomPrice + taxes;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const content = (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="bg-[var(--color-ocean-900)] p-6 text-white">
        <h3 className="font-serif text-2xl font-bold mb-1">Booking Summary</h3>
        <p className="text-white/80 text-sm">Ganesh Residency, Pondicherry</p>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {/* Dates & Guests */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Check-in</p>
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar size={14} className="text-[var(--color-ocean-500)]" />
              {formatDate(checkIn)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Check-out</p>
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar size={14} className="text-[var(--color-ocean-500)]" />
              {formatDate(checkOut)}
            </p>
          </div>
          <div className="col-span-2 mt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Guests</p>
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <Users size={14} className="text-[var(--color-ocean-500)]" />
              {guests} Guest{guests > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Room Details */}
        {room ? (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">{room.name}</h4>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>₹{room.price} x {nights} night{nights > 1 ? 's' : ''}</span>
              <span>₹{roomPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes & Fees (12% GST)</span>
              <span>₹{taxes.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-gray-100 text-center py-4">
            <p className="text-gray-500 italic">Please select a room to see pricing</p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-end mb-8 mt-auto">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <span className="font-bold text-[var(--color-ocean-900)] text-3xl">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action */}
        <button 
          onClick={onContinue}
          disabled={!room || !checkIn || !checkOut}
          className="w-full py-4 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors shadow-md hover:shadow-lg mb-4"
        >
          {buttonText}
        </button>

        {/* Trust Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
            <ShieldCheck size={14} className="text-green-600" />
            <span>Secure Direct Booking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
            <CheckCircle2 size={14} className="text-green-600" />
            <span>Best Rate Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 z-50 lg:hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
            <p className="font-bold text-xl text-[var(--color-ocean-900)]">₹{total.toLocaleString('en-IN')}</p>
          </div>
          <button 
            onClick={onContinue}
            disabled={!room || !checkIn || !checkOut}
            className="px-8 py-3 bg-[var(--color-ocean-600)] disabled:bg-gray-300 text-white rounded-xl font-bold transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  return <div className="sticky top-32">{content}</div>;
}
