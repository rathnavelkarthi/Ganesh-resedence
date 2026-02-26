import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    room: string;
    checkIn: string;
    checkOut: string;
    source: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    payment: 'Paid' | 'Unpaid' | 'Partial' | 'Refunded';
};

export type Room = {
    id: number;
    name: string;
    type: string;
    description: string;
    price_per_night: number;
    max_occupancy: number;
    amenities: string[];
    images: string[];
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

// --- Initial Mock Data ---

const initialStaff: StaffMember[] = [
    { id: 'S-001', name: 'Admin User', email: 'admin@ganeshresidency.com', phone: '+91 98765 43210', role: 'SUPER_ADMIN', status: 'Active' },
    { id: 'S-002', name: 'Manager User', email: 'manager@ganeshresidency.com', phone: '+91 87654 32109', role: 'MANAGER', status: 'Active' },
    { id: 'S-003', name: 'Reception User', email: 'reception@ganeshresidency.com', phone: '+91 76543 21098', role: 'RECEPTION', status: 'Active' },
    { id: 'S-004', name: 'Housekeeping User', email: 'house@ganeshresidency.com', phone: '+91 65432 10987', role: 'HOUSEKEEPING', status: 'Active' },
    { id: 'S-005', name: 'Accountant User', email: 'account@ganeshresidency.com', phone: '+91 54321 09876', role: 'ACCOUNTANT', status: 'Inactive' },
];

const initialReservations: Reservation[] = [
    { id: 'RES-001', guest: 'Rahul Sharma', room: 'Executive Double AC', checkIn: '2023-10-25', checkOut: '2023-10-28', source: 'Direct', status: 'Confirmed', payment: 'Paid' },
    { id: 'RES-002', guest: 'Priya Patel', room: 'Triple Room AC', checkIn: '2023-10-26', checkOut: '2023-10-29', source: 'Booking.com', status: 'Pending', payment: 'Unpaid' },
    { id: 'RES-003', guest: 'Amit Kumar', room: 'Four Occupancy Room', checkIn: '2023-10-27', checkOut: '2023-10-30', source: 'Agoda', status: 'Confirmed', payment: 'Partial' },
    { id: 'RES-004', guest: 'Sneha Gupta', room: 'Six Bed AC Room', checkIn: '2023-10-28', checkOut: '2023-11-02', source: 'Direct', status: 'Cancelled', payment: 'Refunded' },
    { id: 'RES-005', guest: 'Vikram Singh', room: 'Executive Double AC', checkIn: '2023-10-29', checkOut: '2023-10-31', source: 'Direct', status: 'Confirmed', payment: 'Paid' },
];

const initialCMS: CMSSettings = {
    heroTitle: 'Ganesh Residency',
    heroSubtitle: 'Luxury Rooms at ECR, Chennai',
    contactEmail: 'ganeshresidency24@gmail.com',
    contactPhone: '+91 91763 32252',
    contactAddress: 'No. 2, East Coast Road, Uthandi, Chennai - 600119',
    aboutText: 'Experience the perfect blend of modern luxury and traditional hospitality at Ganesh Residency. Located on the scenic East Coast Road in Chennai, our resort offers a tranquil escape with world-class amenities.',
};

// --- Context Definition ---

interface CRMContextType {
    staff: StaffMember[];
    reservations: Reservation[];
    cmsSettings: CMSSettings;
    rooms: Room[];
    pageContent: PageContent[];
    addStaff: (member: Omit<StaffMember, 'id'>) => void;
    deleteStaff: (id: string) => void;
    addReservation: (reservation: Omit<Reservation, 'id'>) => void;
    deleteReservation: (id: string) => void;
    updateStaff: (id: string, updatedData: Partial<StaffMember>) => void;
    updateReservation: (id: string, updatedData: Partial<Reservation>) => void;
    updateCMSSetting: (key: keyof CMSSettings, value: string) => void;

    // Phase 3 CMS
    addRoom: (room: Omit<Room, 'id'>) => void;
    updateRoom: (id: number, room: Partial<Room>) => void;
    deleteRoom: (id: number) => void;

    updatePageContent: (section: string, blockKey: string, content: Partial<PageContent>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// --- Provider Component ---

// Automatically use relative path '/api' in production (Hostinger), and absolute path for local Vite dev server
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? 'http://localhost/Ganesh-resedence/api' : '/api';

export function CRMProvider({ children }: { children: ReactNode }) {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
    const [cmsSettings, setCmsSettings] = useState<CMSSettings>(initialCMS);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [pageContent, setPageContent] = useState<PageContent[]>([]);

    // Initial Data Fetch
    useEffect(() => {
        // Fetch CMS Settings
        fetch(`${API_BASE_URL}/settings.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error && Object.keys(data).length > 0) {
                    setCmsSettings(data as CMSSettings);
                }
            })
            .catch(err => console.error("Failed to load settings:", err));

        // Fetch Staff
        fetch(`${API_BASE_URL}/staff.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error && Array.isArray(data)) {
                    setStaff(data);
                }
            })
            .catch(err => console.error("Failed to load staff:", err));

        // Fetch Reservations
        fetch(`${API_BASE_URL}/reservations.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error && Array.isArray(data)) {
                    setReservations(data);
                }
            })
            .catch(err => console.error("Failed to load reservations:", err));

        // Fetch Rooms
        fetch(`${API_BASE_URL}/rooms.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error && Array.isArray(data)) {
                    // Parse JSON strings back to arrays
                    const parsedData = data.map((room: any) => ({
                        ...room,
                        amenities: typeof room.amenities === 'string' ? JSON.parse(room.amenities) : (room.amenities || []),
                        images: typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || []),
                        is_available: room.is_available === 1 || room.is_available === true
                    }));
                    setRooms(parsedData);
                }
            })
            .catch(err => console.error("Failed to load rooms:", err));

        // Fetch Page Content
        fetch(`${API_BASE_URL}/content.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error && Array.isArray(data)) {
                    const parsedData = data.map((item: any) => ({
                        ...item,
                        is_active: item.is_active === 1 || item.is_active === true
                    }));
                    setPageContent(parsedData);
                }
            })
            .catch(err => console.error("Failed to load page content:", err));
    }, []);

    // Actions
    const addStaff = async (member: Omit<StaffMember, 'id'>) => {
        const newId = `S-${String(staff.length + 1).padStart(3, '0')}`;
        const newStaffMember = { ...member, id: newId };

        try {
            const res = await fetch(`${API_BASE_URL}/staff.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaffMember)
            });
            const data = await res.json();
            if (data.success) {
                setStaff([...staff, newStaffMember]);
            }
        } catch (err) {
            console.error("Failed to add staff:", err);
            // Fallback for UI responsiveness in case DB is offline during demo
            setStaff([...staff, newStaffMember]);
        }
    };

    const deleteStaff = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/staff.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setStaff(staff.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete staff:", err);
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const addReservation = async (reservation: Omit<Reservation, 'id'>) => {
        const newId = `RES-${String(reservations.length + 1).padStart(3, '0')}`;
        const newReservation = { ...reservation, id: newId };

        try {
            const res = await fetch(`${API_BASE_URL}/reservations.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReservation)
            });
            const data = await res.json();
            if (data.success) {
                setReservations([...reservations, newReservation]);
            }
        } catch (err) {
            console.error("Failed to add reservation:", err);
            setReservations([...reservations, newReservation]);
        }
    };

    const deleteReservation = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reservations.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setReservations(reservations.filter(r => r.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete reservation:", err);
            setReservations(reservations.filter(r => r.id !== id));
        }
    };

    const updateStaff = async (id: string, updatedData: Partial<StaffMember>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/staff.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedData })
            });
            const data = await res.json();
            if (data.success) {
                setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
            }
        } catch (err) {
            console.error("Failed to update staff:", err);
            // Fallback for UI responsiveness
            setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
        }
    };

    const updateReservation = async (id: string, updatedData: Partial<Reservation>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reservations.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedData })
            });
            const data = await res.json();
            if (data.success) {
                setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
            }
        } catch (err) {
            console.error("Failed to update reservation:", err);
            // Fallback for UI responsiveness
            setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
        }
    };

    const updateCMSSetting = async (key: keyof CMSSettings, value: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/settings.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            const data = await res.json();
            if (data.success) {
                setCmsSettings(prev => ({ ...prev, [key]: value }));
            }
        } catch (err) {
            console.error("Failed to update setting:", err);
            setCmsSettings(prev => ({ ...prev, [key]: value }));
        }
    };

    // --- Phase 3 CMS Actions ---

    const addRoom = async (roomData: Omit<Room, 'id'>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/rooms.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData)
            });
            const data = await res.json();
            if (data.success) {
                setRooms([...rooms, { ...roomData, id: data.id }]);
            }
        } catch (err) {
            console.error("Failed to add room:", err);
        }
    };

    const updateRoom = async (id: number, updatedData: Partial<Room>) => {
        try {
            await fetch(`${API_BASE_URL}/rooms.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedData })
            });
            setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
        } catch (err) {
            console.error("Failed to update room:", err);
            setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
        }
    };

    const deleteRoom = async (id: number) => {
        try {
            await fetch(`${API_BASE_URL}/rooms.php?id=${id}`, {
                method: 'DELETE'
            });
            setRooms(rooms.filter(r => r.id !== id));
        } catch (err) {
            console.error("Failed to delete room:", err);
        }
    };

    const updatePageContent = async (section: string, blockKey: string, content: Partial<PageContent>) => {
        try {
            await fetch(`${API_BASE_URL}/content.php`, {
                method: 'POST', // The PHP script handles UPSERT on POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section, block_key: blockKey, ...content })
            });

            setPageContent(prev => {
                const exists = prev.find(p => p.section === section && p.block_key === blockKey);
                if (exists) {
                    return prev.map(p => (p.section === section && p.block_key === blockKey) ? { ...p, ...content } : p);
                } else {
                    return [...prev, { section, block_key: blockKey, ...content } as PageContent];
                }
            });

        } catch (err) {
            console.error("Failed to update page content:", err);
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

// --- Custom Hook ---

export function useCRM() {
    const context = useContext(CRMContext);
    if (context === undefined) {
        throw new Error('useCRM must be used within a CRMProvider');
    }
    return context;
}
