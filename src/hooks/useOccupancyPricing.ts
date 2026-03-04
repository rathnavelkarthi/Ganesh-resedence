import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCRM } from '../context/CRMDataContext';
import { useAuth } from '../context/AuthContext';

const UPSELL_THRESHOLD = 80;
const DOWNSELL_THRESHOLD = 40;

interface OccupancyPricingResult {
    adjustedPrice: (basePrice: number) => number;
    todayOccupancy: number;
    isUpsellActive: boolean;
    isDownsellActive: boolean;
}

/**
 * Hook for CRM-context pages (Rooms, RoomSelector, Booking).
 * Uses useCRM() for rooms/reservations and useAuth() for tenant.
 */
export function useOccupancyPricing(): OccupancyPricingResult {
    const { rooms, reservations } = useCRM();
    const { tenant } = useAuth();

    const [upsellEnabled, setUpsellEnabled] = useState(false);
    const [downsellEnabled, setDownsellEnabled] = useState(false);
    const [upsellPercentage, setUpsellPercentage] = useState(15);
    const [downsellPercentage, setDownsellPercentage] = useState(10);

    useEffect(() => {
        if (!tenant?.id) return;
        (async () => {
            const { data } = await supabase
                .from('room_pricing')
                .select('rule_type, price_override')
                .eq('tenant_id', tenant.id)
                .in('rule_type', ['occupancy_upsell', 'occupancy_downsell']);

            if (!data) return;
            const upsellRow = data.find(r => r.rule_type === 'occupancy_upsell');
            const downsellRow = data.find(r => r.rule_type === 'occupancy_downsell');
            setUpsellEnabled(!!upsellRow);
            setUpsellPercentage(upsellRow ? upsellRow.price_override : 15);
            setDownsellEnabled(!!downsellRow);
            setDownsellPercentage(downsellRow ? downsellRow.price_override : 10);
        })();
    }, [tenant?.id]);

    const todayOccupancy = computeOccupancy(rooms, reservations);

    const isUpsellActive = upsellEnabled && todayOccupancy >= UPSELL_THRESHOLD;
    const isDownsellActive = downsellEnabled && todayOccupancy <= DOWNSELL_THRESHOLD;

    const adjustedPrice = useCallback((basePrice: number): number => {
        if (isUpsellActive) {
            return Math.round(basePrice * (1 + upsellPercentage / 100));
        }
        if (isDownsellActive) {
            return Math.round(basePrice * (1 - downsellPercentage / 100));
        }
        return basePrice;
    }, [isUpsellActive, isDownsellActive, upsellPercentage, downsellPercentage]);

    return { adjustedPrice, todayOccupancy, isUpsellActive, isDownsellActive };
}

/**
 * Standalone hook for TenantSite (public page, no CRM/Auth context).
 * Pass tenantId and rooms directly.
 */
export function useTenantOccupancyPricing(
    tenantId: string | undefined,
    rooms: Array<{ id: number; is_available?: boolean }>,
    reservations?: Array<{ status: string; room_id?: number; room?: string; checkIn: string; checkOut: string }>
): OccupancyPricingResult {
    const [upsellEnabled, setUpsellEnabled] = useState(false);
    const [downsellEnabled, setDownsellEnabled] = useState(false);
    const [upsellPercentage, setUpsellPercentage] = useState(15);
    const [downsellPercentage, setDownsellPercentage] = useState(10);

    useEffect(() => {
        if (!tenantId) return;
        (async () => {
            const { data } = await supabase
                .from('room_pricing')
                .select('rule_type, price_override')
                .eq('tenant_id', tenantId)
                .in('rule_type', ['occupancy_upsell', 'occupancy_downsell']);

            if (!data) return;
            const upsellRow = data.find(r => r.rule_type === 'occupancy_upsell');
            const downsellRow = data.find(r => r.rule_type === 'occupancy_downsell');
            setUpsellEnabled(!!upsellRow);
            setUpsellPercentage(upsellRow ? upsellRow.price_override : 15);
            setDownsellEnabled(!!downsellRow);
            setDownsellPercentage(downsellRow ? downsellRow.price_override : 10);
        })();
    }, [tenantId]);

    const todayOccupancy = computeOccupancy(rooms as any[], reservations || []);

    const isUpsellActive = upsellEnabled && todayOccupancy >= UPSELL_THRESHOLD;
    const isDownsellActive = downsellEnabled && todayOccupancy <= DOWNSELL_THRESHOLD;

    const adjustedPrice = useCallback((basePrice: number): number => {
        if (isUpsellActive) {
            return Math.round(basePrice * (1 + upsellPercentage / 100));
        }
        if (isDownsellActive) {
            return Math.round(basePrice * (1 - downsellPercentage / 100));
        }
        return basePrice;
    }, [isUpsellActive, isDownsellActive, upsellPercentage, downsellPercentage]);

    return { adjustedPrice, todayOccupancy, isUpsellActive, isDownsellActive };
}

// --- Shared occupancy computation ---
function computeOccupancy(
    rooms: Array<{ id: number }>,
    reservations: Array<{ status: string; room_id?: number; room?: string; checkIn: string; checkOut: string }>
): number {
    if (rooms.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookedCount = rooms.filter(room => {
        return reservations.some(res => {
            if (res.status !== 'Confirmed' && res.status !== 'Pending') return false;
            if (res.room_id !== room.id) return false;
            const checkIn = new Date(res.checkIn);
            checkIn.setHours(0, 0, 0, 0);
            const checkOut = new Date(res.checkOut);
            checkOut.setHours(23, 59, 59, 999);
            return today >= checkIn && today <= checkOut;
        });
    }).length;

    return Math.round((bookedCount / rooms.length) * 100);
}
