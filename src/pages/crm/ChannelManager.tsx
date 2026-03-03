import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Waypoints,
    Globe,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Plus,
    Power,
    Activity,
    CalendarDays,
    Tag,
    Search,
    Settings2,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Channel {
    id: string;
    name: string;
    logo: string;
    description: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastSync?: string;
    syncInventory: boolean;
    syncRates: boolean;
    commission: string;
}

const INITIAL_CHANNELS: Channel[] = [
    {
        id: 'booking_com',
        name: 'Booking.com',
        logo: '🏨',
        description: 'The world\'s leading digital travel company.',
        status: 'connected',
        lastSync: 'just now',
        syncInventory: true,
        syncRates: true,
        commission: '15%'
    },
    {
        id: 'agoda',
        name: 'Agoda',
        logo: '🏖️',
        description: 'Fast-growing online travel booking platform.',
        status: 'disconnected',
        syncInventory: false,
        syncRates: false,
        commission: '15-20%'
    },
    {
        id: 'makemytrip',
        name: 'MakeMyTrip',
        logo: '🇮🇳',
        description: 'India\'s leading online travel company.',
        status: 'disconnected',
        syncInventory: false,
        syncRates: false,
        commission: '15-25%'
    },
    {
        id: 'goibibo',
        name: 'Goibibo',
        logo: '✈️',
        description: 'Popular Indian travel aggregator.',
        status: 'disconnected',
        syncInventory: false,
        syncRates: false,
        commission: '15%'
    },
    {
        id: 'expedia',
        name: 'Expedia',
        logo: '🌍',
        description: 'Global travel technology company.',
        status: 'disconnected',
        syncInventory: false,
        syncRates: false,
        commission: '18-22%'
    }
];

interface SyncLog {
    id: string;
    channelId: string;
    channelName: string;
    action: string;
    details: string;
    status: 'success' | 'error' | 'warning';
    timestamp: string;
}

export default function ChannelManager() {
    const { tenant } = useAuth();
    const [channels, setChannels] = useState<Channel[]>(() => {
        const saved = localStorage.getItem(`channels_${tenant?.id}`);
        return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'connected'>('all');

    // Connection Modal State
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [hotelId, setHotelId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [connectionStep, setConnectionStep] = useState(1); // 1: Form, 2: Connecting, 3: Success

    // Simulated Logs
    const [logs, setLogs] = useState<SyncLog[]>([
        {
            id: '1',
            channelId: 'booking_com',
            channelName: 'Booking.com',
            action: 'Inventory Push',
            details: 'Pushed availability for next 30 days (Deluxe Suite: 2, Standard: 5)',
            status: 'success',
            timestamp: '2 mins ago'
        },
        {
            id: '2',
            channelId: 'booking_com',
            channelName: 'Booking.com',
            action: 'Reservation Pull',
            details: 'Fetched 3 new reservations',
            status: 'success',
            timestamp: '15 mins ago'
        }
    ]);

    // Save changes to local storage
    useEffect(() => {
        if (tenant?.id) {
            localStorage.setItem(`channels_${tenant.id}`, JSON.stringify(channels));
        }
    }, [channels, tenant?.id]);

    const handleGlobalSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setChannels(prev => prev.map(c =>
                c.status === 'connected' ? { ...c, lastSync: 'just now' } : c
            ));

            const newLog: SyncLog = {
                id: Date.now().toString(),
                channelId: 'all',
                channelName: 'Multiple Channels',
                action: 'Manual Full Sync',
                details: 'Synchronized inventory and rates across all active channels',
                status: 'success',
                timestamp: 'just now'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10
            setIsSyncing(false);
        }, 1500);
    };

    const toggleChannelSetting = (channelId: string, setting: 'syncInventory' | 'syncRates') => {
        setChannels(prev => prev.map(c =>
            c.id === channelId
                ? { ...c, [setting]: !c[setting] }
                : c
        ));

        // Add a log for setting change
        const channel = channels.find(c => c.id === channelId);
        if (channel) {
            const isEnabled = !channel[setting];
            const newLog: SyncLog = {
                id: Date.now().toString(),
                channelId: channel.id,
                channelName: channel.name,
                action: 'Setting Update',
                details: `${setting === 'syncInventory' ? 'Inventory' : 'Rate'} sync turned ${isEnabled ? 'ON' : 'OFF'}`,
                status: 'warning',
                timestamp: 'just now'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10));
        }
    };

    const handleConnectClick = (channel: Channel) => {
        setSelectedChannel(channel);
        setHotelId('');
        setApiKey('');
        setConnectionStep(1);
        setShowConnectModal(true);
    };

    const handleDisconnect = (channelId: string) => {
        if (window.confirm('Are you sure you want to disconnect this channel? This will stop all inventory and rate sync immediately.')) {
            setChannels(prev => prev.map(c =>
                c.id === channelId
                    ? { ...c, status: 'disconnected', syncInventory: false, syncRates: false, lastSync: undefined }
                    : c
            ));

            const channel = channels.find(c => c.id === channelId);
            if (channel) {
                const newLog: SyncLog = {
                    id: Date.now().toString(),
                    channelId: channel.id,
                    channelName: channel.name,
                    action: 'Channel Disconnected',
                    details: 'Connection revoked and mappings disabled',
                    status: 'warning',
                    timestamp: 'just now'
                };
                setLogs(prev => [newLog, ...prev].slice(0, 10));
            }
        }
    };

    const submitConnection = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hotelId || !apiKey) return;

        setConnectionStep(2); // Connecting state

        // Simulate API connection delay
        setTimeout(() => {
            setConnectionStep(3); // Success state

            setTimeout(() => {
                // Apply success
                if (selectedChannel) {
                    setChannels(prev => prev.map(c =>
                        c.id === selectedChannel.id
                            ? { ...c, status: 'connected', syncInventory: true, syncRates: true, lastSync: 'just now' }
                            : c
                    ));

                    const newLog: SyncLog = {
                        id: Date.now().toString(),
                        channelId: selectedChannel.id,
                        channelName: selectedChannel.name,
                        action: 'Channel Connected',
                        details: `Successfully authenticated with Hotel ID: ${hotelId}`,
                        status: 'success',
                        timestamp: 'just now'
                    };
                    setLogs(prev => [newLog, ...prev].slice(0, 10));
                }
                setShowConnectModal(false);
            }, 1500); // Wait in success state before closing
        }, 2000); // Simulate connection
    };

    const filteredChannels = channels.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'connected') return matchesSearch && c.status === 'connected';
        return matchesSearch;
    });

    const connectedCount = channels.filter(c => c.status === 'connected').length;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Waypoints className="text-[#C9A646]" size={28} />
                        Channel Manager
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Connect OTAs and automate your inventory and rate distribution.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-[#0E2A38]/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <Activity size={14} className="text-[#0E2A38]" />
                        <span className="text-xs font-semibold text-[#0E2A38]">{connectedCount} Channels Active</span>
                    </div>
                    <button
                        onClick={handleGlobalSync}
                        disabled={isSyncing || connectedCount === 0}
                        className={`flex items-center gap-2 px-4 py-2 bg-[#0E2A38] text-white rounded-lg text-sm font-medium transition-all ${isSyncing || connectedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0E2A38]/90 shadow-md'}`}
                    >
                        <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync All Now'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Interface (Channels) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                All Channels
                            </button>
                            <button
                                onClick={() => setActiveTab('connected')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'connected' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Connected ({connectedCount})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search channels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A646]/50 focus:border-[#C9A646] transition-all"
                            />
                        </div>
                    </div>

                    {/* Channel Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredChannels.length > 0 ? (
                                filteredChannels.map((channel) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={channel.id}
                                        className={`bg-white rounded-xl border p-5 relative overflow-hidden transition-shadow hover:shadow-md ${channel.status === 'connected' ? 'border-[#C9A646]/30' : 'border-gray-200'}`}
                                    >
                                        {channel.status === 'connected' && (
                                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                                                <div className="absolute top-0 right-0 w-2 h-full bg-[#C9A646]/20 skew-x-12 translate-x-4" />
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 shadow-sm">
                                                    {channel.logo}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{channel.name}</h3>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        {channel.status === 'connected' ? (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                <CheckCircle2 size={10} /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                Custom integration
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {channel.status !== 'connected' && (
                                                <button
                                                    onClick={() => handleConnectClick(channel)}
                                                    className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#C9A646]/10 hover:text-[#C9A646] transition-colors"
                                                    title="Connect Channel"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">
                                            {channel.description}
                                        </p>

                                        {channel.status === 'connected' ? (
                                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <CalendarDays size={16} className="text-gray-400" />
                                                        <span>Inventory sync</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleChannelSetting(channel.id, 'syncInventory')}
                                                        className={`w-9 h-5 rounded-full relative transition-colors ${channel.syncInventory ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${channel.syncInventory ? 'translate-x-4.5 left-0' : 'translate-x-0.5 left-0'}`} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <Tag size={16} className="text-gray-400" />
                                                        <span>Rate sync</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleChannelSetting(channel.id, 'syncRates')}
                                                        className={`w-9 h-5 rounded-full relative transition-colors ${channel.syncRates ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${channel.syncRates ? 'translate-x-4.5 left-0' : 'translate-x-0.5 left-0'}`} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <RefreshCw size={10} />
                                                        Last sync: {channel.lastSync}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDisconnect(channel.id)}
                                                        className="text-[10px] font-semibold text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1"
                                                    >
                                                        <Power size={10} /> Disconnect
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                                <span>Commission: {channel.commission}</span>
                                                <button
                                                    onClick={() => handleConnectClick(channel)}
                                                    className="font-medium text-[#0E2A38] hover:text-[#C9A646] transition-colors"
                                                >
                                                    Connect XML →
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                                    <Globe className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                    <h3 className="text-sm font-medium text-gray-900">No channels found</h3>
                                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar (Sync Logs & Stats) */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-[#0E2A38] rounded-xl p-5 text-white shadow-lg overflow-hidden relative">
                        {/* Background pattern */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#C9A646]/20 rounded-full blur-2xl" />

                        <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2 relative z-10">
                            <Activity size={16} /> Connection Health
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/5">
                                <p className="text-xs text-white/50 mb-1">Total Bookings (Last 30d)</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold">142</p>
                                    <p className="text-xs text-[#C9A646] mb-1 font-medium">+12% vs last month</p>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/5">
                                <p className="text-xs text-white/50 mb-1">OTA Booking Mix</p>
                                <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden flex form-row mt-2">
                                    <div className="h-full bg-[#C9A646]" style={{ width: '45%' }} title="MakeMyTrip: 45%" />
                                    <div className="h-full bg-sky-500" style={{ width: '35%' }} title="Booking.com: 35%" />
                                    <div className="h-full bg-emerald-500" style={{ width: '20%' }} title="Agoda: 20%" />
                                </div>
                                <div className="flex justify-between mt-2 text-[9px] text-white/40 font-medium">
                                    <span>MMT (45%)</span>
                                    <span>B.com (35%)</span>
                                    <span>Agoda (20%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sync Logs */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                <Settings2 size={16} className="text-gray-400" />
                                Live Sync Log
                            </h3>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {logs.map((log) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={log.id}
                                        className="relative pl-4 border-l-2 py-1"
                                        style={{ borderColor: log.status === 'success' ? '#10b981' : log.status === 'warning' ? '#f59e0b' : '#ef4444' }}
                                    >
                                        <div className="flex justify-between items-start mb-0.5">
                                            <span className="text-[11px] font-bold text-gray-700">{log.action}</span>
                                            <span className="text-[9px] text-gray-400">{log.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-1">{log.details}</p>
                                        <span className="text-[10px] font-medium text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                                            {log.channelName}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center text-gray-400 text-xs text-center">
                                    Waiting for sync events...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Connect Modal */}
            <AnimatePresence>
                {showConnectModal && selectedChannel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => connectionStep === 1 && setShowConnectModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm border border-gray-100">
                                        {selectedChannel.logo}
                                    </div>
                                    <h3 className="font-bold text-gray-900">Connect to {selectedChannel.name}</h3>
                                </div>
                                {connectionStep === 1 && (
                                    <button onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {connectionStep === 1 ? (
                                    <form onSubmit={submitConnection} className="space-y-4">
                                        <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2 mb-2">
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <p>To connect, you must authorize HospitalityOS within your {selectedChannel.name} Extranet account first.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Hotel ID / Property ID</label>
                                            <input
                                                type="text"
                                                required
                                                value={hotelId}
                                                onChange={(e) => setHotelId(e.target.value)}
                                                placeholder={`e.g. ${selectedChannel.id}_12345`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">API Connection Key</label>
                                            <input
                                                type="password"
                                                required
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                placeholder="Provided by channel provider"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!hotelId || !apiKey}
                                            className="w-full mt-2 py-2.5 bg-[#0E2A38] text-white rounded-lg text-sm font-semibold hover:bg-[#0E2A38]/90 transition-colors disabled:opacity-50"
                                        >
                                            Authenticate & Connect
                                        </button>
                                    </form>
                                ) : connectionStep === 2 ? (
                                    <div className="py-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C9A646] rounded-full animate-spin mb-4" />
                                        <h4 className="font-semibold text-gray-900 mb-1">Authenticating...</h4>
                                        <p className="text-sm text-gray-500">Contacting {selectedChannel.name} API endpoint</p>
                                    </div>
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Connection Successful!</h4>
                                        <p className="text-sm text-gray-500">Initial sync will begin shortly.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
