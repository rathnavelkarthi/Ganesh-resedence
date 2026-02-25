import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Wind, Wifi, Bath, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import { useState } from 'react';

const roomsData = {
  'executive-double-ac': {
    name: 'Executive Double AC',
    description: 'Perfect for couples or solo travelers seeking comfort with modern amenities and a cozy atmosphere. Enjoy a restful night in our premium bedding and wake up refreshed. The room features elegant decor, a dedicated workspace, and a well-appointed en-suite bathroom.',
    capacity: '2 Guests',
    price: '₹2,500',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1582719478250-c894e4dc240e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Attached Bathroom', 'Flat-screen TV', 'Room Service', 'Daily Housekeeping', 'Complimentary Toiletries', 'Wardrobe'],
  },
  'triple-room-ac': {
    name: 'Triple Room AC',
    description: 'Spacious accommodation ideal for small families or groups of three, featuring premium bedding. This room offers ample space to relax and unwind after a day of exploring Pondicherry. Thoughtfully designed to ensure a comfortable stay for everyone.',
    capacity: '3 Guests',
    price: '₹3,500',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Attached Bathroom', 'Flat-screen TV', 'Room Service', 'Daily Housekeeping', 'Complimentary Toiletries', 'Wardrobe', 'Seating Area'],
  },
  'four-occupancy-room': {
    name: 'Four Occupancy Room',
    description: 'Generously sized room designed for families of four, offering ample space to relax after a beach day. Features multiple comfortable beds and a spacious layout to ensure everyone has their own space. Perfect for family vacations.',
    capacity: '4 Guests',
    price: '₹4,500',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c894e4dc240e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55dd58024cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Attached Bathroom', 'Flat-screen TV', 'Room Service', 'Daily Housekeeping', 'Complimentary Toiletries', 'Wardrobe', 'Large Seating Area'],
  },
  'six-bed-ac-room': {
    name: 'Six Bed AC Room',
    description: 'The ultimate group getaway room. Comfortably sleeps six with multiple beds and expansive living area. Ideal for large families or groups of friends traveling together. Enjoy the convenience of staying together without compromising on comfort.',
    capacity: '6 Guests',
    price: '₹6,000',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55dd58024cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Attached Bathroom', 'Flat-screen TV', 'Room Service', 'Daily Housekeeping', 'Complimentary Toiletries', 'Wardrobe', 'Expansive Living Area', 'Multiple Beds'],
  },
};

export default function RoomDetail() {
  const { slug } = useParams<{ slug: string }>();
  const room = slug ? roomsData[slug as keyof typeof roomsData] : null;
  const [activeImage, setActiveImage] = useState(0);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-sand-50)] pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[var(--color-ocean-900)] mb-4">Room not found</h2>
          <Link to="/#rooms" className="text-[var(--color-ocean-600)] hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-[var(--color-sand-50)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/#rooms" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-ocean-600)] transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to All Rooms
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div 
                className="aspect-[16/9] rounded-3xl overflow-hidden shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={room.images[activeImage]} 
                  alt={room.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-3 gap-4">
                {room.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[var(--color-ocean-500)] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${room.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold">
                  {room.name}
                </h1>
                <div className="bg-[var(--color-ocean-50)] text-[var(--color-ocean-800)] px-4 py-2 rounded-full flex items-center gap-2 font-medium">
                  <Users size={18} />
                  <span>Max Occupancy: {room.capacity}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {room.description}
              </p>

              {/* Quick Features */}
              <div className="flex flex-wrap gap-6 mb-12 py-6 border-y border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Wind size={24} className="text-[var(--color-ocean-500)]" />
                  <span className="font-medium">Air Conditioning</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Wifi size={24} className="text-[var(--color-ocean-500)]" />
                  <span className="font-medium">Free WiFi</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Bath size={24} className="text-[var(--color-ocean-500)]" />
                  <span className="font-medium">Attached Bath</span>
                </div>
              </div>

              {/* Amenities List */}
              <div className="mb-12">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Room Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Policies</h3>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 text-gray-600">
                  <p><strong>Check-in:</strong> 12:00 PM</p>
                  <p><strong>Check-out:</strong> 11:00 AM</p>
                  <p><strong>Cancellation:</strong> Free cancellation up to 48 hours before check-in. After that, the first night will be charged.</p>
                  <p><strong>Children & Extra Beds:</strong> Children of all ages are welcome. Extra beds are available upon request (additional charges may apply).</p>
                  <p><strong>Pets:</strong> Pets are not allowed.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar / Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-bold text-gray-900">{room.price}</span>
                <span className="text-gray-500 font-medium"> / night</span>
                <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                  <CheckCircle2 size={16} /> Best Price Guarantee
                </p>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Check-in</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Check-out</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <Link 
                  to="/book"
                  className="w-full py-4 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white rounded-xl font-bold text-lg transition-colors shadow-md hover:shadow-lg mt-4 flex items-center justify-center"
                >
                  Reserve Now
                </Link>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  You won't be charged yet
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
