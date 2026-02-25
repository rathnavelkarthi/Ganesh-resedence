import { Users, Maximize, Wind, Wifi, Bath } from 'lucide-react';
import { motion } from 'framer-motion';

const rooms = [
  {
    id: 'executive-double-ac',
    name: 'Executive Double AC',
    capacity: '2 Guests',
    size: '250 sq.ft',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'triple-room-ac',
    name: 'Triple Room AC',
    capacity: '3 Guests',
    size: '320 sq.ft',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'four-occupancy-room',
    name: 'Four Occupancy Room',
    capacity: '4 Guests',
    size: '400 sq.ft',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'six-bed-ac-room',
    name: 'Six Bed AC Room',
    capacity: '6 Guests',
    size: '600 sq.ft',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
  },
];

interface RoomSelectorProps {
  selectedRoomId: string | null;
  onSelectRoom: (room: any) => void;
  nights: number;
}

export default function RoomSelector({ selectedRoomId, onSelectRoom, nights }: RoomSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[var(--color-ocean-900)] font-bold mb-6">Select Your Room</h2>

      <div className="grid grid-cols-1 gap-6">
        {rooms.map((room, index) => {
          const isSelected = selectedRoomId === room.id;

          return (
            <motion.div
              key={room.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer
                ${isSelected ? 'border-[var(--color-ocean-500)] ring-4 ring-[var(--color-ocean-50)]' : 'border-transparent hover:border-gray-200 hover:shadow-md'}`}
              onClick={() => onSelectRoom(room)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              {/* Image */}
              <div className="w-full sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">{room.name}</h3>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-[var(--color-ocean-500)]" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize size={16} className="text-[var(--color-ocean-500)]" />
                      <span>{room.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-gray-500">
                    <Wind size={18} title="AC" />
                    <Wifi size={18} title="Free WiFi" />
                    <Bath size={18} title="Attached Bath" />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{room.price}</span>
                    <span className="text-sm text-gray-500"> / night</span>
                    {nights > 0 && (
                      <div className="text-sm font-medium text-[var(--color-ocean-600)] mt-1">
                        Total: ₹{room.price * nights} for {nights} night{nights > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <button
                    className={`px-6 py-2.5 rounded-xl font-medium transition-colors
                      ${isSelected
                        ? 'bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] border border-[var(--color-ocean-200)]'
                        : 'bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white shadow-sm'}`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
