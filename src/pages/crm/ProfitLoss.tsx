import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMDataContext';
import { supabase } from '../../lib/supabaseClient';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

type Preset = 'this_month' | 'last_month' | 'last_3_months' | 'custom';

function getDateRange(preset: Preset): [string, string] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (preset) {
    case 'this_month':
      return [`${y}-${String(m + 1).padStart(2, '0')}-01`, now.toISOString().slice(0, 10)];
    case 'last_month': {
      const lm = m === 0 ? 11 : m - 1;
      const ly = m === 0 ? y - 1 : y;
      const lastDay = new Date(ly, lm + 1, 0).getDate();
      return [`${ly}-${String(lm + 1).padStart(2, '0')}-01`, `${ly}-${String(lm + 1).padStart(2, '0')}-${lastDay}`];
    }
    case 'last_3_months': {
      const start = new Date(y, m - 2, 1);
      return [start.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
    }
    default:
      return [`${y}-${String(m + 1).padStart(2, '0')}-01`, now.toISOString().slice(0, 10)];
  }
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function ProfitLoss() {
  const { tenant } = useAuth();
  const { reservations, foodOrders } = useCRM();
  const [preset, setPreset] = useState<Preset>('this_month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExp, setLoadingExp] = useState(true);

  const [from, to] = useMemo(() => {
    if (preset === 'custom' && customFrom && customTo) return [customFrom, customTo];
    return getDateRange(preset);
  }, [preset, customFrom, customTo]);

  useEffect(() => {
    if (!tenant?.id) return;
    setLoadingExp(true);
    supabase
      .from('expenses')
      .select('id, category, amount, date')
      .eq('tenant_id', tenant.id)
      .gte('date', from)
      .lte('date', to)
      .then(({ data }) => {
        setExpenses(data || []);
        setLoadingExp(false);
      });
  }, [tenant?.id, from, to]);

  // Revenue
  const roomRevenue = useMemo(() => {
    return (reservations || [])
      .filter((r: any) => {
        const d = (r.check_in || r.created_at || '').slice(0, 10);
        return d >= from && d <= to;
      })
      .reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);
  }, [reservations, from, to]);

  const restaurantRevenue = useMemo(() => {
    return (foodOrders || [])
      .filter((o: any) => {
        const d = (o.created_at || '').slice(0, 10);
        return d >= from && d <= to;
      })
      .reduce((s: number, o: any) => s + (Number(o.total_amount) || 0), 0);
  }, [foodOrders, from, to]);

  const totalRevenue = roomRevenue + restaurantRevenue;

  // Expenses by category
  const expByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Month-over-month (show if range spans multiple months)
  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; expenses: number }> = {};

    (reservations || []).forEach((r: any) => {
      const d = (r.check_in || r.created_at || '').slice(0, 10);
      if (d >= from && d <= to) {
        const key = d.slice(0, 7);
        if (!months[key]) months[key] = { revenue: 0, expenses: 0 };
        months[key].revenue += Number(r.amount) || 0;
      }
    });
    (foodOrders || []).forEach((o: any) => {
      const d = (o.created_at || '').slice(0, 10);
      if (d >= from && d <= to) {
        const key = d.slice(0, 7);
        if (!months[key]) months[key] = { revenue: 0, expenses: 0 };
        months[key].revenue += Number(o.total_amount) || 0;
      }
    });
    expenses.forEach(e => {
      const key = e.date.slice(0, 7);
      if (!months[key]) months[key] = { revenue: 0, expenses: 0 };
      months[key].expenses += Number(e.amount);
    });

    return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reservations, foodOrders, expenses, from, to]);

  const maxMonthly = Math.max(...monthlyData.map(([, d]) => Math.max(d.revenue, d.expenses)), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0E2A38]">Profit & Loss</h1>
          <p className="text-sm text-gray-500 mt-1">Revenue vs expenses overview</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['this_month', 'last_month', 'last_3_months', 'custom'] as Preset[]).map(p => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                preset === p ? 'bg-[#0E2A38] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === 'this_month' ? 'This Month' : p === 'last_month' ? 'Last Month' : p === 'last_3_months' ? 'Last 3 Months' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <Calendar size={16} className="text-gray-400" />
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/10" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/10" />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-1">Gross Revenue</p>
          <p className="text-xl font-bold text-[#0E2A38]">{fmt(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-1">Total Expenses</p>
          <p className="text-xl font-bold text-red-600">{fmt(totalExpenses)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-1">Net Profit/Loss</p>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netProfit >= 0 ? '+' : ''}{fmt(netProfit)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium mb-1">Profit Margin</p>
          <p className={`text-xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0E2A38] uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" /> Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Room Revenue</span>
                <span className="font-semibold">{fmt(roomRevenue)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${totalRevenue > 0 ? (roomRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Restaurant Revenue</span>
                <span className="font-semibold">{fmt(restaurantRevenue)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${totalRevenue > 0 ? (restaurantRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold">
              <span>Total Revenue</span>
              <span className="text-green-600">{fmt(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0E2A38] uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" /> Expense Breakdown
          </h3>
          {loadingExp ? (
            <p className="text-gray-400 text-sm py-8 text-center">Loading expenses...</p>
          ) : expByCategory.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No expenses in this period</p>
          ) : (
            <div className="space-y-3">
              {expByCategory.map(([cat, amt]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat}</span>
                    <span className="font-semibold">{fmt(amt)}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold">
                <span>Total Expenses</span>
                <span className="text-red-600">{fmt(totalExpenses)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Month-over-Month */}
      {monthlyData.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0E2A38] uppercase tracking-wider mb-4">Month-over-Month Comparison</h3>
          <div className="space-y-4">
            {monthlyData.map(([month, data]) => {
              const label = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
              const net = data.revenue - data.expenses;
              return (
                <div key={month}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 w-24">{label}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600">Rev: {fmt(data.revenue)}</span>
                      <span className="text-red-500">Exp: {fmt(data.expenses)}</span>
                      <span className={`font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Net: {net >= 0 ? '+' : ''}{fmt(net)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-5">
                    <div className="bg-green-400 rounded-sm transition-all" style={{ width: `${(data.revenue / maxMonthly) * 100}%` }} title={`Revenue: ${fmt(data.revenue)}`} />
                    <div className="bg-red-400 rounded-sm transition-all" style={{ width: `${(data.expenses / maxMonthly) * 100}%` }} title={`Expenses: ${fmt(data.expenses)}`} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Expenses</span>
          </div>
        </div>
      )}
    </div>
  );
}
