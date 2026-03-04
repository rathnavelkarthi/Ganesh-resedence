import { describe, it, expect } from 'vitest';
import {
  calculateNights,
  calculateBookingPrice,
  formatBookingDate,
  generateSubdomain,
  mapReservationStatus,
  mapPaymentStatus,
  hasPermission,
  formatINR,
} from '../lib/booking';

// --- calculateNights ---

describe('calculateNights', () => {
  it('returns correct nights for a normal stay', () => {
    expect(calculateNights('2026-03-01', '2026-03-04')).toBe(3);
  });

  it('returns 1 for a single-night stay', () => {
    expect(calculateNights('2026-03-01', '2026-03-02')).toBe(1);
  });

  it('returns 0 when dates are the same', () => {
    expect(calculateNights('2026-03-01', '2026-03-01')).toBe(0);
  });

  it('returns 0 when check-out is before check-in', () => {
    expect(calculateNights('2026-03-05', '2026-03-01')).toBe(0);
  });

  it('returns 0 when check-in is empty', () => {
    expect(calculateNights('', '2026-03-04')).toBe(0);
  });

  it('returns 0 when check-out is empty', () => {
    expect(calculateNights('2026-03-01', '')).toBe(0);
  });

  it('returns 0 when both are empty', () => {
    expect(calculateNights('', '')).toBe(0);
  });

  it('handles month boundaries correctly', () => {
    expect(calculateNights('2026-01-30', '2026-02-02')).toBe(3);
  });

  it('handles year boundaries correctly', () => {
    expect(calculateNights('2025-12-30', '2026-01-02')).toBe(3);
  });
});

// --- calculateBookingPrice ---

describe('calculateBookingPrice', () => {
  it('calculates correct price for a standard booking', () => {
    const result = calculateBookingPrice(2000, 3);
    expect(result.roomPrice).toBe(6000);
    expect(result.taxes).toBe(720); // 12% of 6000
    expect(result.total).toBe(6720);
  });

  it('rounds GST to nearest integer', () => {
    const result = calculateBookingPrice(101, 1);
    expect(result.taxes).toBe(12); // 101 * 0.12 = 12.12, rounds to 12
  });

  it('returns all zeros for 0 nights', () => {
    const result = calculateBookingPrice(2000, 0);
    expect(result.roomPrice).toBe(0);
    expect(result.taxes).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns all zeros for 0 price', () => {
    const result = calculateBookingPrice(0, 3);
    expect(result.roomPrice).toBe(0);
    expect(result.taxes).toBe(0);
    expect(result.total).toBe(0);
  });

  it('handles large amounts correctly', () => {
    const result = calculateBookingPrice(15000, 7);
    expect(result.roomPrice).toBe(105000);
    expect(result.taxes).toBe(12600);
    expect(result.total).toBe(117600);
  });
});

// --- formatBookingDate ---

describe('formatBookingDate', () => {
  it('formats a date string correctly', () => {
    const result = formatBookingDate('2026-03-04');
    expect(result).toBe('Mar 4, 2026');
  });

  it('returns placeholder for empty string', () => {
    expect(formatBookingDate('')).toBe('Select date');
  });
});

// --- generateSubdomain ---

describe('generateSubdomain', () => {
  it('converts to lowercase and replaces spaces with hyphens', () => {
    expect(generateSubdomain('Ganesh Residency')).toBe('ganesh-residency');
  });

  it('removes special characters', () => {
    expect(generateSubdomain('Hotel & Resort!!')).toBe('hotel-resort');
  });

  it('trims leading/trailing hyphens', () => {
    expect(generateSubdomain('---My Hotel---')).toBe('my-hotel');
  });

  it('truncates to 30 characters', () => {
    const longName = 'A Very Long Business Name That Exceeds The Limit';
    expect(generateSubdomain(longName).length).toBeLessThanOrEqual(30);
  });

  it('handles names with only special characters', () => {
    expect(generateSubdomain('!!!@@@###')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(generateSubdomain('')).toBe('');
  });

  it('collapses multiple consecutive special chars into one hyphen', () => {
    expect(generateSubdomain('Hotel   &   Spa')).toBe('hotel-spa');
  });
});

// --- mapReservationStatus ---

describe('mapReservationStatus', () => {
  it('maps CONFIRMED correctly', () => {
    expect(mapReservationStatus('CONFIRMED')).toBe('Confirmed');
  });

  it('maps PENDING correctly', () => {
    expect(mapReservationStatus('PENDING')).toBe('Pending');
  });

  it('maps CANCELLED correctly', () => {
    expect(mapReservationStatus('CANCELLED')).toBe('Cancelled');
  });

  it('maps CHECKED_OUT correctly', () => {
    expect(mapReservationStatus('CHECKED_OUT')).toBe('Checked Out');
  });

  it('is case-insensitive', () => {
    expect(mapReservationStatus('confirmed')).toBe('Confirmed');
    expect(mapReservationStatus('Pending')).toBe('Pending');
  });

  it('defaults to Pending for unknown status', () => {
    expect(mapReservationStatus('UNKNOWN')).toBe('Pending');
  });

  it('defaults to Pending for null', () => {
    expect(mapReservationStatus(null)).toBe('Pending');
  });

  it('defaults to Pending for undefined', () => {
    expect(mapReservationStatus(undefined)).toBe('Pending');
  });
});

// --- mapPaymentStatus ---

describe('mapPaymentStatus', () => {
  it('maps PAID correctly', () => {
    expect(mapPaymentStatus('PAID')).toBe('Paid');
  });

  it('maps UNPAID correctly', () => {
    expect(mapPaymentStatus('UNPAID')).toBe('Unpaid');
  });

  it('maps PENDING to Unpaid (website bookings)', () => {
    expect(mapPaymentStatus('PENDING')).toBe('Unpaid');
  });

  it('maps PARTIAL correctly', () => {
    expect(mapPaymentStatus('PARTIAL')).toBe('Partial');
  });

  it('maps REFUNDED correctly', () => {
    expect(mapPaymentStatus('REFUNDED')).toBe('Refunded');
  });

  it('is case-insensitive', () => {
    expect(mapPaymentStatus('paid')).toBe('Paid');
  });

  it('defaults to Unpaid for unknown', () => {
    expect(mapPaymentStatus('SOMETHING_ELSE')).toBe('Unpaid');
  });

  it('defaults to Unpaid for null', () => {
    expect(mapPaymentStatus(null)).toBe('Unpaid');
  });
});

// --- hasPermission ---

describe('hasPermission', () => {
  it('returns true when role is in allowed list', () => {
    expect(hasPermission('SUPER_ADMIN', ['SUPER_ADMIN', 'MANAGER'])).toBe(true);
  });

  it('returns false when role is not in allowed list', () => {
    expect(hasPermission('HOUSEKEEPING', ['SUPER_ADMIN', 'MANAGER'])).toBe(false);
  });

  it('returns false when role is null', () => {
    expect(hasPermission(null, ['SUPER_ADMIN'])).toBe(false);
  });

  it('returns false when role is undefined', () => {
    expect(hasPermission(undefined, ['SUPER_ADMIN'])).toBe(false);
  });

  it('returns false for empty allowed list', () => {
    expect(hasPermission('SUPER_ADMIN', [])).toBe(false);
  });
});

// --- formatINR ---

describe('formatINR', () => {
  it('formats a simple number', () => {
    expect(formatINR(1000)).toBe('&#8377;1,000');
  });

  it('formats a large number with Indian grouping', () => {
    // en-IN locale groups as 1,00,000
    expect(formatINR(100000)).toBe('&#8377;1,00,000');
  });

  it('formats zero', () => {
    expect(formatINR(0)).toBe('&#8377;0');
  });
});
