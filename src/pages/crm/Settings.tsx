import React, { useState } from 'react';
import { Save, Globe, Info, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useCRM } from '../../context/CRMDataContext';

export default function Settings() {
    const { cmsSettings, updateCMSSetting } = useCRM();

    // Local state for the form so we don't update context on every single keystroke.
    // Instead, we only update context when "Save Changes" is clicked.
    const [formData, setFormData] = useState({ ...cmsSettings });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const activeTabClass = "px-4 py-3 border-b-2 border-[var(--color-ocean-500)] text-[var(--color-ocean-700)] font-semibold flex items-center gap-2 transition-colors";
    const inactiveTabClass = "px-4 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors";

    const [activeTab, setActiveTab] = useState<'website' | 'contact' | 'about'>('website');

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setSaveSuccess(false);
    };

    const handleSave = () => {
        setIsSaving(true);

        // Simulate a network request for realistic UI feedback
        setTimeout(() => {
            // Update global context
            (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
                updateCMSSetting(key, formData[key]);
            });

            setIsSaving(false);
            setSaveSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 600);
    };

    return (
        <div className="max-w-4xl mx-auto relative pb-24">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-gray-900">Website CMS & Settings</h1>
                <p className="text-gray-500 mt-1">Manage the content that appears on the public-facing website.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('website')}
                        className={activeTab === 'website' ? activeTabClass : inactiveTabClass}
                    >
                        <Globe size={18} />
                        Hero Banner
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={activeTab === 'about' ? activeTabClass : inactiveTabClass}
                    >
                        <Info size={18} />
                        About Section
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={activeTab === 'contact' ? activeTabClass : inactiveTabClass}
                    >
                        <MessageSquare size={18} />
                        Contact Info
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    {activeTab === 'website' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-[var(--color-ocean-50)] text-[var(--color-ocean-600)] rounded-xl">
                                    <ImageIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Hero Section Content</h3>
                                    <p className="text-sm text-gray-500">Edit the main text overlaid securely on the homepage background video.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Main Heading (H1)</label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all font-serif text-lg"
                                    placeholder="e.g. Ganesh Residency"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Heading (Subtitle)</label>
                                <input
                                    type="text"
                                    value={formData.heroSubtitle}
                                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                                    placeholder="e.g. Luxury Rooms at ECR, Chennai"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-[var(--color-ocean-50)] text-[var(--color-ocean-600)] rounded-xl">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">About Section Content</h3>
                                    <p className="text-sm text-gray-500">This text appears in the "About Us" section on the homepage.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Description</label>
                                <textarea
                                    rows={6}
                                    value={formData.aboutText}
                                    onChange={(e) => handleChange('aboutText', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Enter a description of the residency..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-[var(--color-ocean-50)] text-[var(--color-ocean-600)] rounded-xl">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                                    <p className="text-sm text-gray-500">Used in the website footer, contact forms, and automated emails.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Public Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                                        placeholder="e.g. hello@ganeshresidency.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Public Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all"
                                        placeholder="e.g. +91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Physical Address</label>
                                <textarea
                                    rows={2}
                                    value={formData.contactAddress}
                                    onChange={(e) => handleChange('contactAddress', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all resize-none"
                                    placeholder="Enter the full physical address..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg z-40 transform transition-transform duration-300">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-left-4">
                                Changes saved successfully!
                            </span>
                        )}
                        {!saveSuccess && JSON.stringify(formData) !== JSON.stringify(cmsSettings) && (
                            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-left-4">
                                You have unsaved changes.
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving || JSON.stringify(formData) === JSON.stringify(cmsSettings)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${isSaving || JSON.stringify(formData) === JSON.stringify(cmsSettings)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white hover:scale-[1.02]'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
