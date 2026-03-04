import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface WhatsAppConfig {
    whatsapp_enabled: boolean;
    evolution_api_url: string;
    evolution_instance_name: string;
    evolution_api_key: string;
    google_review_url: string;
    whatsapp_templates: {
        confirmation: string;
        reminder: string;
        review: string;
    };
}

const DEFAULT_TEMPLATES = {
    confirmation: `✅ *Booking Confirmed!*\n\nDear {guest_name}, your stay is confirmed.\n\n🏠 Room: {room_type}\n📅 Check-in: {check_in} (after 12:00 PM)\n📅 Check-out: {check_out} (before 11:00 AM)\n🔖 Booking ID: {booking_id}\n\nFor assistance: {hotel_phone}`,
    reminder: `👋 See you tomorrow, {guest_name}!\n\nReminder: your check-in at {hotel_name} is tomorrow.\n⏰ After 12:00 PM\n📍 {hotel_address}\n\nQuestions? Reply here or call {hotel_phone}.`,
    review: `Thank you for staying with us, {guest_name}! 🙏\n\nWe hope you had a wonderful stay at {hotel_name}.\n\nA Google review would mean a lot to us:\n⭐ {google_review_url}\n\nWe hope to welcome you back soon!`,
};

const TEMPLATE_VARS = [
    '{guest_name}', '{hotel_name}', '{room_type}',
    '{check_in}', '{check_out}', '{booking_id}',
    '{hotel_phone}', '{hotel_address}', '{google_review_url}',
];

export default function WhatsAppSettings() {
    const { tenant } = useAuth();
    const [config, setConfig] = useState<WhatsAppConfig>({
        whatsapp_enabled: false,
        evolution_api_url: '',
        evolution_instance_name: '',
        evolution_api_key: '',
        google_review_url: '',
        whatsapp_templates: DEFAULT_TEMPLATES,
    });
    const [showApiKey, setShowApiKey] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState<'confirmation' | 'reminder' | 'review'>('confirmation');
    const [isSaving, setSaving] = useState(false);
    const [isTesting, setTesting] = useState(false);
    const [testPhone, setTestPhone] = useState('');
    const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
    const [testState, setTestState] = useState<'idle' | 'success' | 'error'>('idle');
    const [testError, setTestError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tenant?.id) return;
        loadConfig();
    }, [tenant?.id]);

    const loadConfig = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('tenants')
            .select('whatsapp_enabled, evolution_api_url, evolution_instance_name, evolution_api_key, google_review_url, whatsapp_templates')
            .eq('id', tenant!.id)
            .single();

        if (data) {
            setConfig({
                whatsapp_enabled: data.whatsapp_enabled ?? false,
                evolution_api_url: data.evolution_api_url ?? '',
                evolution_instance_name: data.evolution_instance_name ?? '',
                evolution_api_key: data.evolution_api_key ?? '',
                google_review_url: data.google_review_url ?? '',
                whatsapp_templates: data.whatsapp_templates ?? DEFAULT_TEMPLATES,
            });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!tenant?.id) return;
        setSaving(true);
        setSaveState('idle');

        const { error } = await supabase
            .from('tenants')
            .update({
                whatsapp_enabled: config.whatsapp_enabled,
                evolution_api_url: config.evolution_api_url,
                evolution_instance_name: config.evolution_instance_name,
                evolution_api_key: config.evolution_api_key,
                google_review_url: config.google_review_url,
                whatsapp_templates: config.whatsapp_templates,
            })
            .eq('id', tenant.id);

        setSaving(false);
        setSaveState(error ? 'error' : 'success');
        setTimeout(() => setSaveState('idle'), 3000);
    };

    const handleTest = async () => {
        if (!testPhone || !tenant?.id) return;
        setTesting(true);
        setTestState('idle');
        setTestError('');

        try {
            const { data } = await supabase.functions.invoke('send-whatsapp', {
                body: {
                    tenant_id: tenant.id,
                    phone: testPhone,
                    message: `🧪 Test message from your hotel automation system!\n\nIf you received this, WhatsApp is connected and working. 🎉`,
                },
            });

            if (data?.success) {
                setTestState('success');
            } else {
                setTestState('error');
                setTestError(data?.error || data?.reason || 'Unknown error');
            }
        } catch (err) {
            setTestState('error');
            setTestError(String(err));
        } finally {
            setTesting(false);
            setTimeout(() => setTestState('idle'), 5000);
        }
    };

    const updateTemplate = (key: keyof typeof DEFAULT_TEMPLATES, value: string) => {
        setConfig(prev => ({
            ...prev,
            whatsapp_templates: { ...prev.whatsapp_templates, [key]: value },
        }));
    };

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all text-sm";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-gray-300" size={32} />
            </div>
        );
    }

    const templateLabels = {
        confirmation: '📩 Booking Confirmation',
        reminder: '🔔 Check-in Reminder',
        review: '⭐ Google Review Request',
    };

    return (
        <div className="space-y-8">
            {/* Header + Enable Toggle */}
            <div className="flex items-start justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-50 rounded-xl">
                        <MessageCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">WhatsApp Automation</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Auto-send confirmations, reminders & review requests via WhatsApp.
                        </p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={config.whatsapp_enabled}
                        onChange={e => setConfig(p => ({ ...p, whatsapp_enabled: e.target.checked }))}
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
            </div>

            {/* Automation Flow */}
            {config.whatsapp_enabled && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Zap size={13} /> Automation Flow
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        {[
                            { label: 'Booking Confirmed', color: 'bg-white border border-green-200 text-green-800' },
                            { label: '→', color: 'text-green-400 font-bold' },
                            { label: '✅ Confirmation (instant)', color: 'bg-green-100 text-green-800' },
                            { label: '+', color: 'text-green-400 font-bold' },
                            { label: '🔔 Reminder (day before)', color: 'bg-green-100 text-green-800' },
                            { label: '+', color: 'text-green-400 font-bold' },
                            { label: '⭐ Review (2h after checkout)', color: 'bg-green-100 text-green-800' },
                        ].map((item, i) => (
                            <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${item.color}`}>{item.label}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Evolution API Config */}
            <div className="space-y-5">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Evolution API Connection</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Evolution API URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://your-evo-server.com"
                            value={config.evolution_api_url}
                            onChange={e => setConfig(p => ({ ...p, evolution_api_url: e.target.value }))}
                            className={inputClass}
                        />
                        <p className="text-xs text-gray-400 mt-1">Your self-hosted or managed Evolution API server URL</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Instance Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. ganesh-residency"
                            value={config.evolution_instance_name}
                            onChange={e => setConfig(p => ({ ...p, evolution_instance_name: e.target.value }))}
                            className={inputClass}
                        />
                        <p className="text-xs text-gray-400 mt-1">The name of your WhatsApp instance in Evolution</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
                    <div className="relative">
                        <input
                            type={showApiKey ? 'text' : 'password'}
                            placeholder="Your Evolution API Key"
                            value={config.evolution_api_key}
                            onChange={e => setConfig(p => ({ ...p, evolution_api_key: e.target.value }))}
                            className={`${inputClass} pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowApiKey(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Review URL</label>
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="https://g.page/r/your-business/review"
                            value={config.google_review_url}
                            onChange={e => setConfig(p => ({ ...p, google_review_url: e.target.value }))}
                            className={`${inputClass} pr-10`}
                        />
                        {config.google_review_url && (
                            <a href={config.google_review_url} target="_blank" rel="noopener noreferrer"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Sent in the post-checkout review request message</p>
                </div>
            </div>

            {/* Test Connection */}
            {config.evolution_api_url && config.evolution_instance_name && config.evolution_api_key && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Test Your Connection</h4>
                    <div className="flex gap-3">
                        <input
                            type="tel"
                            placeholder="Enter phone number (e.g. 919876543210)"
                            value={testPhone}
                            onChange={e => setTestPhone(e.target.value)}
                            className={`${inputClass} flex-1`}
                        />
                        <button
                            onClick={handleTest}
                            disabled={isTesting || !testPhone}
                            className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all text-sm whitespace-nowrap"
                        >
                            {isTesting ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                            {isTesting ? 'Sending...' : 'Send Test'}
                        </button>
                    </div>
                    {testState === 'success' && (
                        <p className="flex items-center gap-2 text-sm text-green-600 mt-2 font-medium">
                            <CheckCircle size={16} /> Message sent! Check your WhatsApp.
                        </p>
                    )}
                    {testState === 'error' && (
                        <p className="flex items-center gap-2 text-sm text-red-600 mt-2">
                            <XCircle size={16} /> Failed: {testError}
                        </p>
                    )}
                </div>
            )}

            {/* Message Templates */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Message Templates</h4>
                <p className="text-xs text-gray-400">
                    Available variables: {TEMPLATE_VARS.join(', ')}
                </p>

                {/* Template Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    {(Object.keys(templateLabels) as Array<keyof typeof templateLabels>).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveTemplate(key as typeof activeTemplate)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${activeTemplate === key
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {templateLabels[key]}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        rows={8}
                        value={config.whatsapp_templates[activeTemplate]}
                        onChange={e => updateTemplate(activeTemplate, e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all text-sm font-mono resize-none leading-relaxed"
                    />
                    <button
                        onClick={() => updateTemplate(activeTemplate, DEFAULT_TEMPLATES[activeTemplate])}
                        className="absolute bottom-3 right-3 text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        Reset to default
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] disabled:bg-gray-200 text-white font-semibold rounded-xl transition-all shadow-sm"
            >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                {isSaving ? 'Saving...' : 'Save WhatsApp Settings'}
            </button>

            {saveState === 'success' && (
                <p className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle size={16} /> Settings saved successfully!
                </p>
            )}
            {saveState === 'error' && (
                <p className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle size={16} /> Failed to save. Please try again.
                </p>
            )}
        </div>
    );
}
