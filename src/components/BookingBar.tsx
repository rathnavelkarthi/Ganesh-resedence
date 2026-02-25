import { useState } from 'react';
import { Calendar, Users, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults, 0 Children');
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    // Parse simple guest count for the booking page
    const guestCount = parseInt(guests.split(' ')[0], 10) || 2;
    params.append('guests', guestCount.toString());
    
    navigate(`/book?${params.toString()}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
      <form className="flex flex-col md:flex-row gap-4 md:gap-6 items-end">
        
        {/* Check-in */}
        <div className="w-full md:w-1/4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Check-in</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="w-full md:w-1/4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Check-out</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="w-full md:w-1/4 flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Guests</label>
          <div 
            className="relative cursor-pointer"
            onClick={() => setIsGuestOpen(!isGuestOpen)}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Users size={18} />
            </div>
            <div className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 flex items-center justify-between">
              <span className="truncate">{guests}</span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>
          
          {/* Simple Dropdown Mockup */}
          {isGuestOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Adults</span>
                <div className="flex items-center gap-3">
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                  <span>2</span>
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Children</span>
                <div className="flex items-center gap-3">
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                  <span>0</span>
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="w-full md:w-1/4 flex flex-col gap-2">
          <button 
            type="button"
            onClick={handleCheckAvailability}
            className="w-full py-3.5 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Check Availability
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-xs font-medium text-[var(--color-ocean-600)] tracking-wide uppercase">
          Best Price Guarantee for Direct Booking
        </p>
      </div>
    </div>
  );
}
