import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth, Tenant } from './AuthContext';

// --- Types ---

export type StaffMember = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'Active' | 'Inactive';
};

export type Reservation = {
    id: string;
    guest: string;
    guest_email?: string;
    guest_phone?: string;
    guest_location?: string;
    room: string;
    room_id?: number;
    checkIn: string;
    checkOut: string;
    source: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked Out';
    payment: 'Paid' | 'Unpaid' | 'Partial' | 'Refunded';
    payment_method?: string;
    amount?: number;
    gst_amount?: number;
    payment_date?: string;
};

export type Room = {
    id: number;
    room_number: string;
    name: string;
    type: string;
    description: string;
    price_per_night: number;
    max_occupancy: number;
    amenities: string[];
    images: string[];
    status: 'Available' | 'Occupied' | 'Maintenance';
    cleaning_status: 'Clean' | 'Dirty';
    is_available: boolean;
};

export type PageContent = {
    id: number;
    section: string;
    block_key: string;
    content_text: string;
    image_url: string | null;
    is_active: boolean;
    order_index: number;
};

export type CMSSettings = {
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    aboutText: string;
};

// --- Initial Mock Data (Fallback) ---

const initialCMS: CMSSettings = {
    heroTitle: 'HospitalityOS',
    heroSubtitle: 'All-in-One Hotel & Restaurant Management',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    aboutText: '',
};

// --- Context Definition ---

interface CRMContextType {
    staff: StaffMember[];
    reservations: Reservation[];
    cmsSettings: CMSSettings;
    rooms: Room[];
    pageContent: PageContent[];
    addStaff: (member: Omit<StaffMember, 'id'>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    addReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;
    updateStaff: (id: string, updatedData: Partial<StaffMember>) => Promise<void>;
    updateReservation: (id: string, updatedData: Partial<Reservation>) => Promise<void>;
    updateCMSSetting: (key: keyof CMSSettings, value: string) => Promise<void>;
    addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
    updateRoom: (id: number, room: Partial<Room>) => Promise<void>;
    deleteRoom: (id: number) => Promise<void>;
    updatePageContent: (section: string, blockKey: string, content: Partial<PageContent>) => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// --- Provider Component ---

export function CRMProvider({ children }: { children: ReactNode }) {
    const { tenant } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [cmsSettings, setCmsSettings] = useState<CMSSettings>(initialCMS);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [pageContent, setPageContent] = useState<PageContent[]>([]);

    // Reload data when tenant changes
    useEffect(() => {
        if (!tenant) {
            setStaff([]);
            setReservations([]);
            setRooms([]);
            setPageContent([]);
            setCmsSettings(initialCMS);
            return;
        }

        const loadInitialData = async () => {
            // RLS handles tenant filtering automatically via get_my_tenant_id()

            // Fetch CMS Settings
            const { data: settingsData } = await supabase.from('settings').select('*');
            if (settingsData && settingsData.length > 0) {
                const settingsObj = { ...initialCMS };
                settingsData.forEach(item => {
                    const key = item.setting_key as keyof CMSSettings;
                    if (key in settingsObj) {
                        (settingsObj as any)[key] = item.setting_value;
                    }
                });
                setCmsSettings(settingsObj);
            }

            // Fetch Staff
            const { data: staffData } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
            if (staffData) {
                setStaff(staffData.map(s => ({
                    ...s,
                    status: s.status.charAt(0) + s.status.slice(1).toLowerCase() as any
                })));
            }

            // Fetch Reservations
            const { data: resData } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
            if (resData && resData.length > 0) {
                setReservations(resData.map(r => {
                    // Map DB status to UI status
                    const statusMap: Record<string, Reservation['status']> = {
                        'CONFIRMED': 'Confirmed', 'PENDING': 'Pending', 'CANCELLED': 'Cancelled', 'CHECKED_OUT': 'Checked Out',
                    };
                    // Map DB payment_status to UI payment -- 'PENDING' from website bookings maps to 'Unpaid'
                    const paymentMap: Record<string, Reservation['payment']> = {
                        'PAID': 'Paid', 'UNPAID': 'Unpaid', 'PENDING': 'Unpaid', 'PARTIAL': 'Partial', 'REFUNDED': 'Refunded',
                    };
                    return {
                        id: r.id,
                        guest: r.guest_name,
                        guest_email: r.guest_email,
                        guest_phone: r.guest_phone,
                        guest_location: r.guest_location,
                        room: r.room_type,
                        room_id: r.room_id,
                        checkIn: r.check_in,
                        checkOut: r.check_out,
                        source: r.source === 'WEBSITE' ? 'Website' : r.source,
                        status: statusMap[r.status?.toUpperCase()] || 'Pending',
                        payment: paymentMap[r.payment_status?.toUpperCase()] || 'Unpaid',
                        payment_method: r.payment_method,
                        amount: r.amount,
                        gst_amount: r.gst_amount,
                        payment_date: r.payment_date,
                    };
                }));
            } else {
                // Inject mock reservations for prototype demonstration
                setReservations([
                    {
                        id: 'RES-001', guest: 'Rahul Sharma', room: 'Executive Double AC',
                        checkIn: '2023-11-05', checkOut: '2023-11-08', source: 'MakeMyTrip',
                        status: 'Confirmed', payment: 'Paid', amount: 12500
                    },
                    {
                        id: 'RES-002', guest: 'Sarah Jenkins', room: 'Six Bed AC Room',
                        checkIn: '2023-11-10', checkOut: '2023-11-14', source: 'Booking.com',
                        status: 'Confirmed', payment: 'Partial', amount: 24000
                    },
                    {
                        id: 'RES-003', guest: 'Priya Desai', room: 'Triple Room AC',
                        checkIn: '2023-11-12', checkOut: '2023-11-13', source: 'Agoda',
                        status: 'Pending', payment: 'Unpaid', amount: 4500
                    }
                ]);
            }

            // Fetch Rooms
            const { data: roomsData } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });
            if (roomsData) {
                setRooms(roomsData as any);
            }

            // Fetch Page Content
            const { data: contentData } = await supabase.from('page_content').select('*').order('order_index', { ascending: true });
            if (contentData) {
                setPageContent(contentData as any);
            }
        };

        loadInitialData();
    }, [tenant?.id]);

    // Helper to get the tenant_id for inserts
    const tid = () => tenant?.id;

    // Actions
    const addStaff = async (member: Omit<StaffMember, 'id'>) => {
        const newId = `S-${String(staff.length + 1).padStart(3, '0')}`;
        const newStaffMember = { ...member, id: newId };

        const { error } = await supabase.from('staff').insert([{
            id: newId,
            name: member.name,
            role: member.role,
            status: member.status.toUpperCase(),
            email: member.email,
            phone: member.phone,
            tenant_id: tid(),
        }]);

        if (!error) {
            setStaff([newStaffMember, ...staff]);
        }
    };

    const deleteStaff = async (id: string) => {
        const { error } = await supabase.from('staff').delete().eq('id', id);
        if (!error) {
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const addReservation = async (reservation: Omit<Reservation, 'id'>) => {
        const newId = `RES-${String(reservations.length + 1).padStart(3, '0')}`;
        const newReservation = { ...reservation, id: newId };

        const { error } = await supabase.from('reservations').insert([{
            id: newId,
            guest_name: reservation.guest,
            guest_email: reservation.guest_email,
            guest_phone: reservation.guest_phone,
            guest_location: reservation.guest_location,
            room_type: reservation.room,
            room_id: reservation.room_id,
            check_in: reservation.checkIn,
            check_out: reservation.checkOut,
            source: reservation.source,
            status: reservation.status.toUpperCase(),
            payment_status: reservation.payment.toUpperCase(),
            payment_method: reservation.payment_method,
            amount: reservation.amount || 0,
            gst_amount: reservation.gst_amount || 0,
            tenant_id: tid(),
        }]);

        if (!error) {
            setReservations([newReservation, ...reservations]);
        }
    };

    const deleteReservation = async (id: string) => {
        const { error } = await supabase.from('reservations').delete().eq('id', id);
        if (!error) {
            setReservations(reservations.filter(r => r.id !== id));
        }
    };

    const updateStaff = async (id: string, updatedData: Partial<StaffMember>) => {
        const updatePayload: any = { ...updatedData };
        if (updatedData.status) updatePayload.status = updatedData.status.toUpperCase();

        const { error } = await supabase.from('staff').update(updatePayload).eq('id', id);
        if (!error) {
            setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
        }
    };

    const updateReservation = async (id: string, updatedData: Partial<Reservation>) => {
        const updatePayload: any = {};
        if (updatedData.guest) updatePayload.guest_name = updatedData.guest;
        if (updatedData.guest_email) updatePayload.guest_email = updatedData.guest_email;
        if (updatedData.guest_phone) updatePayload.guest_phone = updatedData.guest_phone;
        if (updatedData.guest_location) updatePayload.guest_location = updatedData.guest_location;
        if (updatedData.room) updatePayload.room_type = updatedData.room;
        if (updatedData.room_id) updatePayload.room_id = updatedData.room_id;
        if (updatedData.checkIn) updatePayload.check_in = updatedData.checkIn;
        if (updatedData.checkOut) updatePayload.check_out = updatedData.checkOut;
        if (updatedData.status) updatePayload.status = updatedData.status === 'Checked Out' ? 'CHECKED_OUT' : updatedData.status.toUpperCase();
        if (updatedData.payment) updatePayload.payment_status = updatedData.payment.toUpperCase();
        if (updatedData.payment_method) updatePayload.payment_method = updatedData.payment_method;
        if (updatedData.amount !== undefined) updatePayload.amount = updatedData.amount;
        if (updatedData.gst_amount !== undefined) updatePayload.gst_amount = updatedData.gst_amount;

        const { error } = await supabase.from('reservations').update(updatePayload).eq('id', id);
        if (!error) {
            setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
        }
    };

    const updateCMSSetting = async (key: keyof CMSSettings, value: string) => {
        const { error } = await supabase.from('settings').upsert({
            setting_key: key,
            setting_value: value,
            updated_at: new Date().toISOString(),
            tenant_id: tid(),
        });

        if (!error) {
            setCmsSettings(prev => ({ ...prev, [key]: value }));
        }
    };

    const addRoom = async (roomData: Omit<Room, 'id'>) => {
        const { data, error } = await supabase.from('rooms').insert([{
            ...roomData,
            tenant_id: tid(),
        }]).select();
        if (!error && data) {
            setRooms([{ ...roomData, id: data[0].id }, ...rooms]);
        }
    };

    const updateRoom = async (id: number, updatedData: Partial<Room>) => {
        const { error } = await supabase.from('rooms').update(updatedData).eq('id', id);
        if (!error) {
            setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
        }
    };

    const deleteRoom = async (id: number) => {
        const { error } = await supabase.from('rooms').delete().eq('id', id);
        if (!error) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    const updatePageContent = async (section: string, blockKey: string, content: Partial<PageContent>) => {
        const { error } = await supabase.from('page_content').upsert({
            section,
            block_key: blockKey,
            ...content,
            tenant_id: tid(),
        });

        if (!error) {
            setPageContent(prev => {
                const exists = prev.find(p => p.section === section && p.block_key === blockKey);
                if (exists) {
                    return prev.map(p => (p.section === section && p.block_key === blockKey) ? { ...p, ...content } : p);
                } else {
                    return [...prev, { section, block_key: blockKey, ...content } as PageContent];
                }
            });
        }
    };

    return (
        <CRMContext.Provider value={{
            staff,
            reservations,
            cmsSettings,
            rooms,
            pageContent,
            addStaff,
            deleteStaff,
            addReservation,
            deleteReservation,
            updateStaff,
            updateReservation,
            updateCMSSetting,
            addRoom,
            updateRoom,
            deleteRoom,
            updatePageContent
        }}>
            {children}
        </CRMContext.Provider>
    );
}

export function useCRM() {
    const context = useContext(CRMContext);
    if (context === undefined) {
        throw new Error('useCRM must be used within a CRMProvider');
    }
    return context;
}
