import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const rooms = [
  { id: '101', type: 'Executive Double AC', status: 'Clean' },
  { id: '102', type: 'Executive Double AC', status: 'Dirty' },
  { id: '103', type: 'Triple Room AC', status: 'Clean' },
  { id: '104', type: 'Four Occupancy Room', status: 'Maintenance' },
  { id: '105', type: 'Six Bed AC Room', status: 'Clean' },
];

const bookings = [
  { id: 'B1', roomId: '101', guest: 'Rahul Sharma', start: new Date(), end: addDays(new Date(), 2), status: 'Confirmed' },
  { id: 'B2', roomId: '103', guest: 'Priya Patel', start: addDays(new Date(), -1), end: addDays(new Date(), 1), status: 'Checked In' },
  { id: 'B3', roomId: '105', guest: 'Amit Kumar', start: addDays(new Date(), 1), end: addDays(new Date(), 4), status: 'Confirmed' },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(addDays(currentDate, 7), { weekStartsOn: 1 }); // Show 2 weeks
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const handleToday = () => setCurrentDate(new Date());

  const getBookingForRoomAndDate = (roomId: string, date: Date) => {
    return bookings.find(b => 
      b.roomId === roomId && 
      date >= new Date(b.start.setHours(0,0,0,0)) && 
      date <= new Date(b.end.setHours(23,59,59,999))
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-500 mt-1">Visual overview of room availability.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm p-1">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border-x border-gray-100">
              Today
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm hover:bg-gray-50">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
        
        {/* Legend */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-6 bg-gray-50 text-sm font-medium text-gray-600 overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" /> Confirmed
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" /> Checked In
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" /> Maintenance
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300" /> Available
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="w-48 shrink-0 p-4 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50 flex items-center gap-2">
                <CalendarIcon size={18} className="text-[var(--color-ocean-600)]" />
                Rooms
              </div>
              <div className="flex-1 flex">
                {days.map((day, i) => (
                  <div key={i} className={`flex-1 min-w-[60px] p-2 text-center border-r border-gray-100 flex flex-col items-center justify-center ${isSameDay(day, new Date()) ? 'bg-[var(--color-ocean-50)]' : ''}`}>
                    <span className={`text-xs font-semibold uppercase ${isSameDay(day, new Date()) ? 'text-[var(--color-ocean-600)]' : 'text-gray-500'}`}>
                      {format(day, 'EEE')}
                    </span>
                    <span className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-[var(--color-ocean-900)]' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Rows */}
            <div className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <div key={room.id} className="flex hover:bg-gray-50/50 transition-colors group">
                  <div className="w-48 shrink-0 p-4 border-r border-gray-200 bg-white group-hover:bg-gray-50 transition-colors">
                    <p className="font-bold text-gray-900">Room {room.id}</p>
                    <p className="text-xs text-gray-500 truncate" title={room.type}>{room.type}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${room.status === 'Clean' ? 'bg-green-500' : room.status === 'Dirty' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">{room.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex relative">
                    {days.map((day, i) => {
                      const booking = getBookingForRoomAndDate(room.id, day);
                      const isStart = booking && isSameDay(day, booking.start);
                      const isEnd = booking && isSameDay(day, booking.end);
                      const isMiddle = booking && !isStart && !isEnd;

                      return (
                        <div key={i} className={`flex-1 min-w-[60px] border-r border-gray-100 relative p-1 ${isSameDay(day, new Date()) ? 'bg-[var(--color-ocean-50)]/30' : ''}`}>
                          {booking && (
                            <div 
                              className={`absolute top-2 bottom-2 flex items-center px-2 text-xs font-semibold text-white truncate cursor-pointer shadow-sm hover:opacity-90 transition-opacity z-10
                                ${booking.status === 'Confirmed' ? 'bg-green-500' : booking.status === 'Checked In' ? 'bg-yellow-500' : 'bg-red-500'}
                                ${isStart ? 'left-2 rounded-l-md' : 'left-0'}
                                ${isEnd ? 'right-2 rounded-r-md' : 'right-0'}
                                ${isMiddle ? 'left-0 right-0' : ''}
                              `}
                              title={`${booking.guest} (${booking.status})`}
                            >
                              {isStart && <span className="truncate">{booking.guest}</span>}
                            </div>
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
    </div>
  );
}
