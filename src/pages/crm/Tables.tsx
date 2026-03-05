import { useState } from 'react';
import { useCRM, RestaurantTable } from '../../context/CRMDataContext';
import { Plus, Pencil, Trash2, X, Users, Armchair } from 'lucide-react';

const SECTIONS = ['main', 'outdoor', 'private', 'bar', 'rooftop'];
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
    occupied: { bg: 'bg-red-100', text: 'text-red-600', label: 'Occupied' },
    reserved: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Reserved' },
};

export default function Tables() {
    const { restaurantTables, addRestaurantTable, updateRestaurantTable, deleteRestaurantTable } = useCRM();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<RestaurantTable | null>(null);
    const [filterSection, setFilterSection] = useState('all');

    // Form state
    const [tableNumber, setTableNumber] = useState('');
    const [capacity, setCapacity] = useState('4');
    const [section, setSection] = useState('main');

    const resetForm = () => {
        setTableNumber(''); setCapacity('4'); setSection('main');
        setShowForm(false); setEditing(null);
    };

    const startEdit = (t: RestaurantTable) => {
        setEditing(t); setTableNumber(t.table_number);
        setCapacity(String(t.capacity)); setSection(t.section);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!tableNumber.trim()) return;
        const data = { table_number: tableNumber, capacity: parseInt(capacity) || 4, section, status: 'available' as const };
        if (editing) {
            await updateRestaurantTable(editing.id, data);
        } else {
            await addRestaurantTable(data);
        }
        resetForm();
    };

    const cycleStatus = async (t: RestaurantTable) => {
        const cycle: RestaurantTable['status'][] = ['available', 'occupied', 'reserved'];
        const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
        await updateRestaurantTable(t.id, { status: next });
    };

    const filtered = filterSection === 'all' ? restaurantTables : restaurantTables.filter(t => t.section === filterSection);
    const usedSections = Array.from(new Set<string>(restaurantTables.map(t => t.section)));

    const totalTables = restaurantTables.length;
    const availableCount = restaurantTables.filter(t => t.status === 'available').length;
    const occupiedCount = restaurantTables.filter(t => t.status === 'occupied').length;
    const totalSeats = restaurantTables.reduce((s, t) => s + t.capacity, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{totalTables} tables, {totalSeats} total seats</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0E2A38] text-white rounded-lg hover:bg-[#1a3d4f] transition-colors text-sm font-medium">
                    <Plus size={16} /> Add Table
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tables', value: totalTables, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Available', value: availableCount, color: 'bg-green-50 text-green-700' },
                    { label: 'Occupied', value: occupiedCount, color: 'bg-red-50 text-red-600' },
                    { label: 'Total Seats', value: totalSeats, color: 'bg-purple-50 text-purple-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-xl p-4`}>
                        <p className="text-xs font-medium opacity-70">{s.label}</p>
                        <p className="text-2xl font-bold mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Section filter */}
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterSection('all')}
                    className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${filterSection === 'all' ? 'bg-[#0E2A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    All Sections
                </button>
                {usedSections.map(s => (
                    <button key={s} onClick={() => setFilterSection(s)}
                        className={`px-3 py-1.5 text-xs rounded-full font-medium capitalize transition-colors ${filterSection === s ? 'bg-[#0E2A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{editing ? 'Edit Table' : 'New Table'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Table number (e.g. T1)"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20" />
                        <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Capacity"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20" />
                        <select value={section} onChange={e => setSection(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0E2A38]/20 capitalize">
                            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#0E2A38] text-white rounded-lg hover:bg-[#1a3d4f]">
                            {editing ? 'Update' : 'Add Table'}
                        </button>
                    </div>
                </div>
            )}

            {/* Table Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Armchair size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 text-sm mb-4">No tables yet. Add your first table to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filtered.map(t => {
                        const sc = STATUS_COLORS[t.status];
                        return (
                            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow group relative">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 text-lg">T{t.table_number}</h3>
                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(t)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => deleteRestaurantTable(t.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Users size={12} />
                                    <span>{t.capacity} seats</span>
                                    <span className="mx-1">·</span>
                                    <span className="capitalize">{t.section}</span>
                                </div>
                                <button onClick={() => cycleStatus(t)}
                                    className={`w-full py-1.5 rounded-lg text-xs font-medium ${sc.bg} ${sc.text} hover:opacity-80 transition-opacity`}>
                                    {sc.label}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
