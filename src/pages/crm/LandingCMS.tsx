import React, { useState } from 'react';
import { Save, Image as ImageIcon, Check } from 'lucide-react';
import { useCRM, PageContent } from '../../context/CRMDataContext';
import { toast } from 'sonner';

export default function LandingCMS() {
    const { pageContent, updatePageContent } = useCRM();
    const [isUploading, setIsUploading] = useState<string | null>(null);

    // Helper to get current content value safely
    const getContent = (section: string, key: string, field: 'content_text' | 'image_url' = 'content_text') => {
        const block = pageContent.find(p => p.section === section && p.block_key === key);
        return block ? block[field] : '';
    };

    // Local state for editing fields
    const [heroTitle, setHeroTitle] = useState(getContent('hero', 'title') || 'Welcome to Ganesh Residency');
    const [heroSubtitle, setHeroSubtitle] = useState(getContent('hero', 'subtitle') || 'Experience Tranquility & Comfort');
    const [heroBtn, setHeroBtn] = useState(getContent('hero', 'button_text') || 'Book Your Stay');

    const [aboutHeading, setAboutHeading] = useState(getContent('about', 'heading') || 'Your Home by the Sea');
    const [aboutBody, setAboutBody] = useState(getContent('about', 'body') || 'Ganesh Residency is a peaceful retreat...');

    const handleSaveSection = (section: string) => {
        if (section === 'hero') {
            updatePageContent('hero', 'title', { content_text: heroTitle });
            updatePageContent('hero', 'subtitle', { content_text: heroSubtitle });
            updatePageContent('hero', 'button_text', { content_text: heroBtn });
        } else if (section === 'about') {
            updatePageContent('about', 'heading', { content_text: aboutHeading });
            updatePageContent('about', 'body', { content_text: aboutBody });
        }
        toast.success(`${section.toUpperCase()} section saved`);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const blockId = `${section}-${key}`;
        setIsUploading(blockId);
        const toastId = toast.loading('Uploading image...');

        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_BASE_URL = isLocalhost ? 'http://localhost/Ganesh-resedence/api' : '/api';
        const formDataToUpload = new FormData();
        formDataToUpload.append('image', file);

        try {
            const response = await fetch(`${API_BASE_URL}/upload.php`, {
                method: 'POST',
                body: formDataToUpload,
            });

            const data = await response.json();
            if (data.success) {
                // Save the image URL immediately to the API
                updatePageContent(section, key, { image_url: data.url });
                toast.success('Image updated successfully', { id: toastId });
            } else {
                toast.error(data.error || 'Upload failed', { id: toastId });
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Network error during upload', { id: toastId });
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#0E2A38]">Landing Page CMS</h1>
                <p className="text-gray-500 mt-1">Control the text and images displayed on the main website.</p>
            </div>

            {/* Hero Section settings */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-serif text-[#0E2A38]">Hero Section</h2>
                    <button
                        onClick={() => handleSaveSection('hero')}
                        className="flex items-center gap-2 bg-[#0E2A38] text-[#C9A646] px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#091b24] transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Main Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] outline-none"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Subtitle</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] outline-none"
                                value={heroSubtitle}
                                onChange={(e) => setHeroSubtitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Button Text</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] outline-none"
                                value={heroBtn}
                                onChange={(e) => setHeroBtn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Hero Background Image</label>
                        <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group">
                            {getContent('hero', 'bgImage', 'image_url') ? (
                                <img src={getContent('hero', 'bgImage', 'image_url')} className="w-full h-full object-cover" alt="Hero background" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="text-gray-400 mx-auto mb-2" size={32} />
                                    <p className="text-sm font-medium text-gray-500">No image uploaded</p>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg text-gray-800 flex items-center gap-2 hover:bg-gray-100">
                                    <ImageIcon size={16} /> {isUploading === 'hero-bgImage' ? 'Uploading...' : 'Change Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'bgImage')} disabled={isUploading === 'hero-bgImage'} />
                                </label>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Recommended size: 1920x1080px (Darkened automatically in UI)</p>
                    </div>
                </div>
            </section>

            {/* About Section settings */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-serif text-[#0E2A38]">About Section</h2>
                    <button
                        onClick={() => handleSaveSection('about')}
                        className="flex items-center gap-2 bg-[#0E2A38] text-[#C9A646] px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#091b24] transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Section Heading</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] outline-none"
                                value={aboutHeading}
                                onChange={(e) => setAboutHeading(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">About Body Text</label>
                            <textarea
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] outline-none resize-none"
                                value={aboutBody}
                                onChange={(e) => setAboutBody(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">About Image</label>
                        <div className="relative aspect-square md:aspect-auto md:h-[220px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group">
                            {getContent('about', 'aboutImage', 'image_url') ? (
                                <img src={getContent('about', 'aboutImage', 'image_url')} className="w-full h-full object-cover" alt="About Resort" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="text-gray-400 mx-auto mb-2" size={32} />
                                    <p className="text-sm font-medium text-gray-500">No image uploaded</p>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg text-gray-800 flex items-center gap-2 hover:bg-gray-100">
                                    <ImageIcon size={16} /> {isUploading === 'about-aboutImage' ? 'Uploading...' : 'Change Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'about', 'aboutImage')} disabled={isUploading === 'about-aboutImage'} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
