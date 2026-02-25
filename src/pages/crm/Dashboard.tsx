import { useAuth } from '../../context/AuthContext';
import { 
  IndianRupee, 
  Users, 
  BedDouble, 
  CalendarCheck, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const revenueData = [
  { name: 'Jan', total: 400000 },
  { name: 'Feb', total: 300000 },
  { name: 'Mar', total: 500000 },
  { name: 'Apr', total: 450000 },
  { name: 'May', total: 600000 },
  { name: 'Jun', total: 550000 },
];

const occupancyData = [
  { name: 'Mon', rate: 65 },
  { name: 'Tue', rate: 70 },
  { name: 'Wed', rate: 68 },
  { name: 'Thu', rate: 85 },
  { name: 'Fri', rate: 95 },
  { name: 'Sat', rate: 100 },
  { name: 'Sun', rate: 90 },
];

export default function Dashboard() {
  const { user } = useAuth();

  const renderSuperAdmin = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹24,50,000" icon={IndianRupee} trend="+12.5%" />
        <StatCard title="Occupancy Rate" value="85%" icon={BedDouble} trend="+5.2%" />
        <StatCard title="Total Bookings" value="342" icon={CalendarCheck} trend="+18.1%" />
        <StatCard title="Pending Payments" value="₹1,25,000" icon={AlertCircle} trend="-2.4%" trendDown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="var(--color-ocean-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Weekly Occupancy</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `${value}%`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManager = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Check-ins" value="12" icon={CalendarCheck} />
        <StatCard title="Today's Check-outs" value="8" icon={CalendarCheck} />
        <StatCard title="Available Rooms" value="5" icon={BedDouble} />
        <StatCard title="Pending Confirmations" value="3" icon={AlertCircle} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Staff Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ocean-100)] flex items-center justify-center text-[var(--color-ocean-600)] font-bold">
                  S{i}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Staff Member {i}</p>
                  <p className="text-sm text-gray-500">Checked in Room 10{i}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-medium">10 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReception = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Expected Arrivals" value="12" icon={Users} />
        <StatCard title="Expected Departures" value="8" icon={Users} />
        <StatCard title="Available Rooms" value="5" icon={BedDouble} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Today's Arrivals</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="pb-4 font-semibold">Guest Name</th>
                <th className="pb-4 font-semibold">Room Type</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">John Doe {i}</td>
                  <td className="py-4 text-gray-600">Executive Double AC</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-[var(--color-ocean-600)] font-medium hover:underline">Check In</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHousekeeping = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Rooms to Clean" value="8" icon={BedDouble} />
        <StatCard title="Cleaned Today" value="12" icon={BedDouble} />
        <StatCard title="Maintenance Alerts" value="2" icon={AlertCircle} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Cleaning Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[101, 102, 103, 104, 105].map((room) => (
            <div key={room} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50">
              <div>
                <p className="font-bold text-gray-900 text-lg">Room {room}</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Check-out</p>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[var(--color-ocean-50)] hover:text-[var(--color-ocean-700)] hover:border-[var(--color-ocean-200)] transition-colors shadow-sm">
                Mark Clean
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountant = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Today's Revenue" value="₹45,000" icon={IndianRupee} />
        <StatCard title="Pending Invoices" value="12" icon={FileText} />
        <StatCard title="GST Collected" value="₹5,400" icon={IndianRupee} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="pb-4 font-semibold">Txn ID</th>
                <th className="pb-4 font-semibold">Guest</th>
                <th className="pb-4 font-semibold">Amount</th>
                <th className="pb-4 font-semibold">Method</th>
                <th className="pb-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">TXN-00{i}</td>
                  <td className="py-4 text-gray-600">Jane Smith {i}</td>
                  <td className="py-4 font-semibold text-gray-900">₹12,500</td>
                  <td className="py-4 text-gray-600">UPI</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening at Ganesh Residency today.</p>
      </div>

      {user?.role === 'SUPER_ADMIN' && renderSuperAdmin()}
      {user?.role === 'MANAGER' && renderManager()}
      {user?.role === 'RECEPTION' && renderReception()}
      {user?.role === 'HOUSEKEEPING' && renderHousekeeping()}
      {user?.role === 'ACCOUNTANT' && renderAccountant()}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendDown }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-ocean-50)] flex items-center justify-center">
          <Icon size={24} className="text-[var(--color-ocean-600)]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendDown ? 'text-red-600' : 'text-green-600'}`}>
            {trendDown ? <TrendingUp size={16} className="rotate-180" /> : <TrendingUp size={16} />}
            {trend}
          </div>
        )}
      </div>
      <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
