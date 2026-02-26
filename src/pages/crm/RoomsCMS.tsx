import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM, Room } from '../../context/CRMDataContext';
import { toast } from 'sonner';

export default function RoomsCMS() {
    const { rooms, addRoom, updateRoom, deleteRoom } = useCRM();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const initialFormState: Omit<Room, 'id'> = {
        name: '',
        type: 'Standard',
        description: '',
        price_per_night: 0,
        max_occupancy: 2,
        amenities: [],
        images: [],
        is_available: true
    };

    const [formData, setFormData] = useState<Omit<Room, 'id'>>(initialFormState);
    const [newAmenity, setNewAmenity] = useState('');

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoomId(room.id);
            setFormData({
                name: room.name,
                type: room.type,
                description: room.description,
                price_per_night: room.price_per_night,
                max_occupancy: room.max_occupancy,
                amenities: [...room.amenities],
                images: [...room.images],
                is_available: room.is_available
            });
        } else {
            setEditingRoomId(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // We fetch the API_BASE_URL dynamically to support Hostinger production vs Localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_BASE_URL = isLocalhost ? 'http://localhost/Ganesh-resedence/api' : '/api';

        const formDataToUpload = new FormData();
        formDataToUpload.append('image', file);

        setIsUploading(true);
        const toastId = toast.loading('Uploading image...');

        try {
            const response = await fetch(`${API_BASE_URL}/upload.php`, {
                method: 'POST',
                body: formDataToUpload,
            });

            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
                toast.success('Image uploaded successfully', { id: toastId });
            } else {
                toast.error(data.error || 'Upload failed', { id: toastId });
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Network error during upload', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const addAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newAmenity.trim()) {
            e.preventDefault();
            if (!formData.amenities.includes(newAmenity.trim())) {
                setFormData(prev => ({
                    ...prev,
                    amenities: [...prev.amenities, newAmenity.trim()]
                }));
            }
            setNewAmenity('');
        }
    };

    const removeAmenity = (amenityToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenityToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoomId) {
            updateRoom(editingRoomId, formData);
            toast.success('Room updated successfully');
        } else {
            addRoom(formData);
            toast.success('Room added successfully');
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0E2A38]">Rooms Management</h1>
                    <p className="text-gray-500 mt-1">Add or modify the rooms available for booking.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#C9A646] hover:bg-[#b5953f] text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-semibold"
                >
                    <Plus size={20} />
                    <span>Add Room</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 mb-6 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search rooms by name or type..."
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                            {room.images && room.images.length > 0 ? (
                                <img
                                    src={room.images[0]}
                                    alt={room.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback to placeholder if backend image missing
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000';
                                    }}
                                />
                            ) : (
                                <ImageIcon className="text-gray-300 w-12 h-12" />
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${room.is_available ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    {room.is_available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-[#0E2A38]">{room.name}</h3>
                                <p className="font-bold text-[#C9A646]">₹{room.price_per_night}</p>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{room.type} • Up to {room.max_occupancy} Guests</p>

                            <div className="flex flex-wrap gap-1.5 mb-6 line-clamp-2 min-h-[48px]">
                                {room.amenities && room.amenities.slice(0, 4).map((amenity, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                        {amenity}
                                    </span>
                                ))}
                                {room.amenities && room.amenities.length > 4 && (
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                        +{room.amenities.length - 4} more
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Room">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => deleteRoom(room.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Room">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredRooms.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="font-medium text-lg text-gray-900">No rooms found</p>
                        <p>Try adjusting your search or add a new room.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0 z-10">
                                <h2 className="text-xl font-bold font-serif text-[#0E2A38]">
                                    {editingRoomId ? 'Edit Room Details' : 'Add New Room'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                <form id="roomForm" onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Room Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Ocean View Suite"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Room Type</label>
                                            <select
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>Standard</option>
                                                <option>Deluxe</option>
                                                <option>Executive</option>
                                                <option>Suite</option>
                                                <option>Villa</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Price Per Night (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all"
                                                value={formData.price_per_night}
                                                onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Occupancy</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all"
                                                value={formData.max_occupancy}
                                                onChange={(e) => setFormData({ ...formData, max_occupancy: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Description</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter a captivating description of this room for the main website..."
                                        />
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Amenities (Press Enter to add)</label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.amenities.map(amenity => (
                                                <span key={amenity} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                    {amenity}
                                                    <button type="button" onClick={() => removeAmenity(amenity)} className="text-gray-400 hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C9A646] focus:border-transparent outline-none transition-all"
                                            value={newAmenity}
                                            onChange={(e) => setNewAmenity(e.target.value)}
                                            onKeyDown={addAmenity}
                                            placeholder="e.g. Free Wi-Fi, Ocean View, King Bed..."
                                        />
                                    </div>

                                    {/* Image Upload Gallery */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Photo Gallery</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                                            {formData.images.map((imgUrl, index) => (
                                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                                    <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Upload Button */}
                                            <div className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#C9A646] bg-gray-50 hover:bg-[#C9A646]/5 transition-colors flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <ImageIcon className="text-gray-400 mb-2" size={24} />
                                                <span className="text-sm font-bold text-gray-500 px-2">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">First image will be used as the main thumbnail. Recommended aspect ratio 16:9.</p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value=""
                                                className="sr-only peer"
                                                checked={formData.is_available}
                                                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            <span className="ml-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Available for Booking</span>
                                        </label>
                                    </div>

                                </form>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="roomForm"
                                    disabled={isUploading}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-[#0E2A38] hover:bg-[#091b24] text-[#C9A646] shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Check size={18} />
                                    {editingRoomId ? 'Save Changes' : 'Create Room'}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
