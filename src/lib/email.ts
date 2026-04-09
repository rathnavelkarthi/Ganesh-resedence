// ═══════════════════════════════════════════════════════════════════
// EasyStay — Premium Transactional Email Service (Resend)
// Inspired by Stripe, Airbnb, Linear, Notion
// ═══════════════════════════════════════════════════════════════════

const RESEND_API_KEY = import.meta.env.VITE_RESENDAPIKEY as string;
const RESEND_URL = 'https://api.resend.com/emails';
const FROM = 'EasyStay <onboarding@resend.dev>';

// ─── Types ──────────────────────────────────────────────────────

export interface WelcomeEmailData {
  email: string;
  businessName: string;
  businessType: string;
}

export interface BookingConfirmationData {
  guestName: string;
  guestEmail: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  gstAmount: number;
  paymentStatus: string;
  source: string;
  reservationId: string;
  businessName: string;
}

export interface BookingCancelledData {
  guestName: string;
  guestEmail: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  gstAmount: number;
  reservationId: string;
  businessName: string;
}

export interface CheckInEmailData {
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkOutDate: string;
  businessName: string;
}

export interface CheckOutEmailData {
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  gstAmount: number;
  paymentMethod: string;
  businessName: string;
}

export interface StaffCredentialsData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  subdomain: string;
  businessName: string;
}

export interface BookingStatusChangeData {
  guestName: string;
  guestEmail: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  newStatus: string;
  reservationId: string;
  businessName: string;
}

// ─── Core sender ────────────────────────────────────────────────

async function sendResendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    if (!RESEND_API_KEY) {
      console.warn('[EasyStay Email] No API key configured');
      return;
    }
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('[EasyStay Email] Failed:', err);
    }
  } catch (err) {
    console.error('[EasyStay Email] Error:', err);
  }
}

// ─── Helpers ────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

// ─── Design Tokens ──────────────────────────────────────────────

const ff = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif";
const mono = "'SF Mono', 'Roboto Mono', 'IBM Plex Mono', Menlo, Consolas, monospace";

const T = {
  // Layout
  bgOuter: '#ffffff',
  bgCard: '#ffffff',
  bgMuted: '#f9fafb',
  bgAccentSoft: '#f0fdf4',
  bgWarnSoft: '#fef3c7',
  bgDangerSoft: '#fef2f2',
  bgInfoSoft: '#eff6ff',

  // Text
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  textOnAccent: '#ffffff',

  // Accent
  accent: '#059669',       // emerald-600 — fresh, modern, trustworthy
  accentDark: '#047857',   // emerald-700
  accentLight: '#d1fae5',  // emerald-100
  gold: '#b45309',         // amber-700

  // Borders & Dividers
  border: '#e5e7eb',       // gray-200
  borderLight: '#f3f4f6',  // gray-100
  borderAccent: '#a7f3d0', // emerald-200

  // Status
  green: '#059669',
  red: '#dc2626',
  blue: '#2563eb',
  orange: '#d97706',
  gray: '#6b7280',
};

// ─── Base Template (Notion/Linear inspired) ─────────────────────

function baseTemplate(opts: {
  preheader: string;
  businessName: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  accentColor?: string;
}): string {
  const accent = opts.accentColor || T.accent;
  const cta = opts.ctaText && opts.ctaUrl ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${accent};border-radius:8px;mso-padding-alt:14px 32px">
            <a href="${opts.ctaUrl}" target="_blank" style="color:${T.textOnAccent};font-family:${ff};font-size:14px;font-weight:600;text-decoration:none;display:inline-block;padding:14px 32px;border-radius:8px;mso-text-raise:3px">${opts.ctaText}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>` : '';

  return `<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,email=no,date=no"><!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><style>td,th,div,p,a,h1,h2,h3,h4,h5,h6{font-family:Arial,sans-serif!important}</style><![endif]-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body { margin:0; padding:0; }
  @media only screen and (max-width:600px) {
    .outer { padding: 16px 12px !important; }
    .card { border-radius: 12px !important; }
    .card-inner { padding: 28px 20px !important; }
    .detail-label, .detail-value { font-size: 13px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${T.bgOuter};font-family:${ff}">
  <span style="display:none;font-size:1px;color:${T.bgOuter};max-height:0;overflow:hidden;mso-hide:all">${opts.preheader}${'&nbsp;'.repeat(40)}</span>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${T.bgOuter}">
    <tr><td align="center" class="outer" style="padding:48px 24px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%">

        <!-- LOGO -->
        <tr><td style="padding-bottom:32px;text-align:center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
            <tr>
              <td style="width:32px;height:32px;background:${accent};border-radius:8px;text-align:center;vertical-align:middle">
                <span style="font-family:${ff};font-size:16px;font-weight:700;color:${T.textOnAccent};line-height:32px">E</span>
              </td>
              <td style="padding-left:10px;vertical-align:middle">
                <span style="font-family:${ff};font-size:17px;font-weight:700;color:${T.textPrimary};letter-spacing:-0.3px">EasyStay</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- MAIN CARD -->
        <tr><td class="card" style="background:${T.bgCard};border-radius:16px;border:1px solid ${T.border};box-shadow:0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.02)">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td class="card-inner" style="padding:40px 36px">
              ${opts.bodyContent}
              ${cta}
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:28px 0 0;text-align:center">
          ${opts.footerNote ? `<p style="margin:0 0 12px;font-family:${ff};font-size:13px;color:${T.textTertiary};line-height:1.6">${opts.footerNote}</p>` : ''}
          <p style="margin:0 0 4px;font-family:${ff};font-size:12px;color:${T.textTertiary}">Sent by <span style="color:${T.textSecondary};font-weight:500">EasyStay</span> on behalf of <span style="color:${T.textSecondary};font-weight:500">${opts.businessName}</span></p>
          <p style="margin:0;font-family:${ff};font-size:12px;color:${T.textTertiary}">&copy; ${new Date().getFullYear()} EasyStay &middot; Hospitality, simplified.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ─── Component Helpers ──────────────────────────────────────────

function heading(text: string, size: 'lg' | 'md' = 'lg'): string {
  const s = size === 'lg' ? '26px' : '20px';
  return `<h1 style="margin:0 0 6px;font-family:${ff};font-size:${s};font-weight:700;color:${T.textPrimary};letter-spacing:-0.4px;line-height:1.25">${text}</h1>`;
}

function subtitle(text: string): string {
  return `<p style="margin:0 0 24px;font-family:${ff};font-size:15px;color:${T.textSecondary};line-height:1.65">${text}</p>`;
}

function divider(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:20px 0"><div style="height:1px;background:${T.borderLight}"></div></td></tr></table>`;
}

function sectionLabel(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${ff};font-size:11px;font-weight:600;color:${T.textTertiary};text-transform:uppercase;letter-spacing:0.8px">${text}</p>`;
}

function detailRow(label: string, value: string, bold = false): string {
  return `<tr>
    <td class="detail-label" style="padding:8px 0;font-family:${ff};font-size:14px;color:${T.textTertiary};vertical-align:top;width:40%">${label}</td>
    <td class="detail-value" style="padding:8px 0;font-family:${ff};font-size:14px;color:${bold ? T.textPrimary : T.textSecondary};font-weight:${bold ? '600' : '400'};text-align:right;vertical-align:top">${value}</td>
  </tr>`;
}

function detailCard(rows: [string, string, boolean?][], borderLeft?: string): string {
  const bl = borderLeft ? `border-left:3px solid ${borderLeft};` : '';
  const inner = rows.map(([l, v, b]) => detailRow(l, v, !!b)).join('');
  return `<div style="background:${T.bgMuted};border-radius:12px;padding:20px 24px;margin:16px 0;${bl}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">${inner}</table>
  </div>`;
}

function amountBlock(rows: [string, string][], totalLabel: string, totalValue: string): string {
  const items = rows.map(([l, v]) =>
    `<tr>
      <td style="padding:6px 0;font-family:${ff};font-size:14px;color:${T.textTertiary}">${l}</td>
      <td style="padding:6px 0;font-family:${ff};font-size:14px;color:${T.textSecondary};text-align:right">${v}</td>
    </tr>`
  ).join('');
  return `<div style="background:${T.bgMuted};border-radius:12px;padding:20px 24px;margin:16px 0">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
      ${items}
      <tr><td colspan="2" style="padding:10px 0 0"><div style="height:1px;background:${T.border}"></div></td></tr>
      <tr>
        <td style="padding:12px 0 0;font-family:${ff};font-size:16px;font-weight:700;color:${T.textPrimary}">${totalLabel}</td>
        <td style="padding:12px 0 0;font-family:${ff};font-size:16px;font-weight:700;color:${T.textPrimary};text-align:right">${totalValue}</td>
      </tr>
    </table>
  </div>`;
}

function statusPill(label: string, color: string, bgColor: string): string {
  return `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-family:${ff};font-size:12px;font-weight:600;color:${color};background:${bgColor}">${label}</span>`;
}

function getStatusPill(status: string): string {
  const m: Record<string, [string, string, string]> = {
    'Confirmed': ['Confirmed', T.green, T.bgAccentSoft],
    'CONFIRMED': ['Confirmed', T.green, T.bgAccentSoft],
    'Cancelled': ['Cancelled', T.red, T.bgDangerSoft],
    'CANCELLED': ['Cancelled', T.red, T.bgDangerSoft],
    'Checked In': ['Checked In', T.blue, T.bgInfoSoft],
    'CHECKED_IN': ['Checked In', T.blue, T.bgInfoSoft],
    'Checked Out': ['Checked Out', T.green, T.bgAccentSoft],
    'CHECKED_OUT': ['Checked Out', T.green, T.bgAccentSoft],
    'Pending': ['Pending', T.orange, T.bgWarnSoft],
    'PENDING': ['Pending', T.orange, T.bgWarnSoft],
    'Paid': ['Paid', T.green, T.bgAccentSoft],
    'PAID': ['Paid', T.green, T.bgAccentSoft],
    'Unpaid': ['Unpaid', T.orange, T.bgWarnSoft],
    'UNPAID': ['Unpaid', T.orange, T.bgWarnSoft],
  };
  const [l, c, bg] = m[status] || [status, T.gray, T.bgMuted];
  return statusPill(l, c, bg);
}

function iconCircle(emoji: string, bgColor = T.bgAccentSoft): string {
  return `<div style="width:48px;height:48px;border-radius:50%;background:${bgColor};text-align:center;line-height:48px;font-size:22px;margin:0 0 20px">${emoji}</div>`;
}


// ═══════════════════════════════════════════════════════════════════
// 1. WELCOME EMAIL
// ═══════════════════════════════════════════════════════════════════

function welcomeEmailHtml(data: WelcomeEmailData): string {
  const body = `
    ${iconCircle('&#127919;')}
    ${heading('Welcome to EasyStay')}
    ${subtitle(`Your property <strong style="color:${T.textPrimary}">${data.businessName}</strong> is set up and ready. Start managing your ${data.businessType || 'property'} in minutes.`)}

    ${sectionLabel('Your property')}
    ${detailCard([
      ['Property', data.businessName, true],
      ['Type', (data.businessType || 'Hotel').charAt(0).toUpperCase() + (data.businessType || 'hotel').slice(1)],
      ['Account', getStatusPill('Confirmed')],
    ], T.accent)}

    ${divider()}

    <!-- Founder Note -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="padding:4px 0 16px">
        <p style="margin:0 0 4px;font-family:${ff};font-size:11px;font-weight:600;color:${T.textTertiary};text-transform:uppercase;letter-spacing:0.8px">A note from our founder</p>
      </td></tr>
      <tr><td style="padding:20px 24px;background:linear-gradient(135deg, #fefce8 0%, #fff7ed 100%);border-radius:12px;border:1px solid #fde68a">
        <p style="margin:0 0 12px;font-family:${ff};font-size:15px;color:${T.textPrimary};line-height:1.7">Hi ${data.businessName} team,</p>
        <p style="margin:0 0 12px;font-family:${ff};font-size:14px;color:${T.textSecondary};line-height:1.7">I'm Rathnavel Karthi, the founder of EasyStay. Thank you for trusting us with your property management.</p>
        <p style="margin:0 0 12px;font-family:${ff};font-size:14px;color:${T.textSecondary};line-height:1.7">We built EasyStay because every property &mdash; whether 5 rooms or 500 &mdash; deserves tools that just work. You're not just a customer; you're part of our story.</p>
        <p style="margin:0 0 12px;font-family:${ff};font-size:14px;color:${T.textSecondary};line-height:1.7">Need anything? Just reply to this email. I read every one.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px">
          <tr>
            <td style="vertical-align:middle">
              <div style="width:36px;height:36px;border-radius:50%;background:${T.accent};text-align:center;line-height:36px">
                <span style="font-family:${ff};font-size:14px;font-weight:700;color:${T.textOnAccent}">RK</span>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:middle">
              <p style="margin:0;font-family:${ff};font-size:14px;font-weight:600;color:${T.textPrimary}">Rathnavel Karthi</p>
              <p style="margin:0;font-family:${ff};font-size:12px;color:${T.textTertiary}">Founder, EasyStay</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  `;

  return baseTemplate({
    preheader: `Welcome to EasyStay — ${data.businessName} is ready to go.`,
    businessName: data.businessName,
    bodyContent: body,
    ctaText: 'Open Your Dashboard &rarr;',
    ctaUrl: 'https://esaystay.com/admin/login',
    footerNote: 'Set up rooms, configure pricing, and go live — all in under 15 minutes.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 2. BOOKING CONFIRMATION
// ═══════════════════════════════════════════════════════════════════

function bookingConfirmationHtml(data: BookingConfirmationData): string {
  const refId = `#${data.reservationId.slice(0, 8).toUpperCase()}`;
  const body = `
    ${iconCircle('&#9989;', T.bgAccentSoft)}
    ${heading('Booking Confirmed')}
    ${subtitle(`Great news! A reservation at <strong style="color:${T.textPrimary}">${data.businessName}</strong> has been confirmed.`)}

    ${sectionLabel('Reservation details')}
    ${detailCard([
      ['Reference', refId, true],
      ['Guest', data.guestName, true],
      ['Room', `${data.roomType}${data.roomNumber ? ` &middot; ${data.roomNumber}` : ''}`],
      ['Check-in', fmtDate(data.checkIn)],
      ['Check-out', fmtDate(data.checkOut)],
      ['Source', data.source],
      ['Payment', getStatusPill(data.paymentStatus)],
    ], T.green)}

    ${sectionLabel('Payment summary')}
    ${amountBlock(
      [
        ['Room charges', fmtCurrency(data.amount - data.gstAmount)],
        ['GST', fmtCurrency(data.gstAmount)],
      ],
      'Total',
      fmtCurrency(data.amount)
    )}
  `;

  return baseTemplate({
    preheader: `Booking confirmed for ${data.guestName} — ${fmtDate(data.checkIn)} at ${data.businessName}`,
    businessName: data.businessName,
    bodyContent: body,
    footerNote: 'For changes or cancellations, please contact the front desk or manage from your dashboard.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 3. BOOKING CANCELLED
// ═══════════════════════════════════════════════════════════════════

function bookingCancelledHtml(data: BookingCancelledData): string {
  const refId = `#${data.reservationId.slice(0, 8).toUpperCase()}`;
  const body = `
    ${iconCircle('&#10060;', T.bgDangerSoft)}
    ${heading('Booking Cancelled')}
    ${subtitle(`A reservation at <strong style="color:${T.textPrimary}">${data.businessName}</strong> has been cancelled.`)}

    ${sectionLabel('Cancelled reservation')}
    ${detailCard([
      ['Reference', refId, true],
      ['Guest', data.guestName, true],
      ['Room', data.roomType],
      ['Check-in', fmtDate(data.checkIn)],
      ['Check-out', fmtDate(data.checkOut)],
      ['Amount', fmtCurrency(data.amount)],
      ['Status', getStatusPill('Cancelled')],
    ], T.red)}

    <div style="background:${T.bgDangerSoft};border-radius:10px;padding:14px 20px;margin-top:8px">
      <p style="margin:0;font-family:${ff};font-size:13px;color:${T.red};line-height:1.6">If this was a mistake, please contact the front desk immediately to reinstate the booking.</p>
    </div>
  `;

  return baseTemplate({
    preheader: `Booking cancelled — ${data.guestName} at ${data.businessName}`,
    businessName: data.businessName,
    bodyContent: body,
    accentColor: T.red,
    footerNote: 'Refund policies vary. Contact the property for details.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 4. CHECK-IN CONFIRMATION
// ═══════════════════════════════════════════════════════════════════

function checkInConfirmationHtml(data: CheckInEmailData): string {
  const body = `
    ${iconCircle('&#128274;', T.bgInfoSoft)}
    ${heading(`Welcome to ${data.businessName}`)}
    ${subtitle(`You're all checked in! We hope you have a wonderful stay.`)}

    ${sectionLabel('Your stay')}
    ${detailCard([
      ['Guest', data.guestName, true],
      ['Room', `${data.roomType}${data.roomNumber ? ` &middot; ${data.roomNumber}` : ''}`, true],
      ['Check-out', fmtDate(data.checkOutDate)],
      ['Status', getStatusPill('Checked In')],
    ], T.blue)}

    <div style="background:${T.bgInfoSoft};border-radius:10px;padding:14px 20px;margin-top:8px">
      <p style="margin:0;font-family:${ff};font-size:13px;color:${T.blue};line-height:1.6">&#128161; Our front desk is available 24/7 for any assistance during your stay.</p>
    </div>
  `;

  return baseTemplate({
    preheader: `Welcome to ${data.businessName} — you're checked in!`,
    businessName: data.businessName,
    bodyContent: body,
    accentColor: T.blue,
    footerNote: 'Enjoy your stay! We\'re here if you need anything.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 5. CHECK-OUT RECEIPT
// ═══════════════════════════════════════════════════════════════════

function checkOutReceiptHtml(data: CheckOutEmailData): string {
  const nights = Math.max(1, Math.ceil(
    (new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const roomCharges = data.totalAmount - data.gstAmount;

  const body = `
    ${iconCircle('&#128522;')}
    ${heading('Thank you for your stay')}
    ${subtitle(`Here's your receipt from <strong style="color:${T.textPrimary}">${data.businessName}</strong>. We hope to see you again soon.`)}

    ${sectionLabel('Stay summary')}
    ${detailCard([
      ['Guest', data.guestName, true],
      ['Room', `${data.roomType}${data.roomNumber ? ` &middot; ${data.roomNumber}` : ''}`],
      ['Check-in', fmtDate(data.checkInDate)],
      ['Check-out', fmtDate(data.checkOutDate)],
      ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
    ])}

    ${sectionLabel('Invoice')}
    ${amountBlock(
      [
        ['Room charges', fmtCurrency(roomCharges)],
        ['GST', fmtCurrency(data.gstAmount)],
      ],
      'Total paid',
      fmtCurrency(data.totalAmount)
    )}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px">
      <tr>
        <td style="font-family:${ff};font-size:13px;color:${T.textTertiary}">Payment method</td>
        <td style="font-family:${ff};font-size:13px;color:${T.textSecondary};font-weight:500;text-align:right">${data.paymentMethod} &nbsp;${getStatusPill('Paid')}</td>
      </tr>
    </table>

    ${divider()}

    <p style="margin:0;font-family:${ff};font-size:13px;color:${T.textTertiary};line-height:1.6">This email serves as your official receipt. For billing queries, simply reply to this email.</p>
  `;

  return baseTemplate({
    preheader: `Your receipt from ${data.businessName} — ${fmtCurrency(data.totalAmount)}`,
    businessName: data.businessName,
    bodyContent: body,
    footerNote: 'Thank you for choosing us. Have a safe journey!',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 6. STAFF CREDENTIALS
// ═══════════════════════════════════════════════════════════════════

function staffCredentialsHtml(data: StaffCredentialsData): string {
  const loginUrl = data.subdomain
    ? `https://${data.subdomain}.esaystay.com/admin/login`
    : 'https://esaystay.com/admin/login';
  const roleName = data.role.replace(/_/g, ' ');

  const body = `
    ${iconCircle('&#128100;', T.bgInfoSoft)}
    ${heading(`Welcome to ${data.businessName}`)}
    ${subtitle(`You've been added as <strong style="color:${T.textPrimary}">${roleName}</strong> staff. Your account is ready to use.`)}

    ${sectionLabel('Your profile')}
    ${detailCard([
      ['Name', data.name, true],
      ['Role', roleName],
      ['Email', data.email],
      ['Phone', data.phone],
    ])}

    ${sectionLabel('Login credentials')}
    <div style="background:${T.bgMuted};border-radius:12px;padding:20px 24px;margin:16px 0;border:1px solid ${T.borderAccent}">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;font-family:${ff};font-size:13px;color:${T.textTertiary}">Login URL</td>
          <td style="padding:8px 0;font-family:${ff};font-size:13px;color:${T.accent};font-weight:500;text-align:right;word-break:break-all"><a href="${loginUrl}" style="color:${T.accent};text-decoration:none">${loginUrl}</a></td>
        </tr>
        <tr><td colspan="2" style="padding:4px 0"><div style="height:1px;background:${T.border}"></div></td></tr>
        <tr>
          <td style="padding:8px 0;font-family:${ff};font-size:13px;color:${T.textTertiary}">Email</td>
          <td style="padding:8px 0;font-family:${mono};font-size:14px;color:${T.textPrimary};font-weight:600;text-align:right">${data.email}</td>
        </tr>
        <tr><td colspan="2" style="padding:4px 0"><div style="height:1px;background:${T.border}"></div></td></tr>
        <tr>
          <td style="padding:8px 0;font-family:${ff};font-size:13px;color:${T.textTertiary}">Password</td>
          <td style="padding:8px 0;font-family:${mono};font-size:14px;color:${T.textPrimary};font-weight:600;text-align:right;letter-spacing:0.5px">${data.password}</td>
        </tr>
      </table>
    </div>

    <div style="background:${T.bgWarnSoft};border-radius:10px;padding:14px 20px;margin-top:8px">
      <p style="margin:0;font-family:${ff};font-size:13px;color:${T.orange};line-height:1.6;font-weight:500">&#9888;&#65039; Please change your password after your first login for security.</p>
    </div>
  `;

  return baseTemplate({
    preheader: `Your staff login for ${data.businessName} is ready`,
    businessName: data.businessName,
    bodyContent: body,
    ctaText: 'Login Now &rarr;',
    ctaUrl: loginUrl,
    footerNote: 'This email contains sensitive information. Do not forward it to anyone.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// 7. BOOKING STATUS CHANGE
// ═══════════════════════════════════════════════════════════════════

function bookingStatusChangeHtml(data: BookingStatusChangeData): string {
  const refId = `#${data.reservationId.slice(0, 8).toUpperCase()}`;
  const body = `
    ${iconCircle('&#128260;', T.bgWarnSoft)}
    ${heading('Booking Updated')}
    ${subtitle(`A reservation at <strong style="color:${T.textPrimary}">${data.businessName}</strong> has been updated.`)}

    ${sectionLabel('Updated reservation')}
    ${detailCard([
      ['Reference', refId, true],
      ['Guest', data.guestName, true],
      ['Room', data.roomType],
      ['Check-in', fmtDate(data.checkIn)],
      ['Check-out', fmtDate(data.checkOut)],
      ['New status', getStatusPill(data.newStatus)],
    ], T.orange)}
  `;

  return baseTemplate({
    preheader: `Booking status: ${data.newStatus} — ${data.guestName} at ${data.businessName}`,
    businessName: data.businessName,
    bodyContent: body,
    accentColor: T.orange,
    footerNote: 'Manage all reservations from your EasyStay dashboard.',
  });
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTED TRIGGERS (fire-and-forget)
// ═══════════════════════════════════════════════════════════════════

export function sendWelcomeEmail(data: WelcomeEmailData): void {
  if (!data.email) return;
  sendResendEmail(data.email, `Welcome to EasyStay, ${data.businessName}!`, welcomeEmailHtml(data));
}

export function sendBookingConfirmation(data: BookingConfirmationData): void {
  if (!data.guestEmail) return;
  sendResendEmail(data.guestEmail, `Booking confirmed — ${data.guestName} at ${data.businessName}`, bookingConfirmationHtml(data));
}

export function sendBookingCancelled(data: BookingCancelledData): void {
  if (!data.guestEmail) return;
  sendResendEmail(data.guestEmail, `Booking cancelled — ${data.businessName}`, bookingCancelledHtml(data));
}

export function sendCheckInEmail(data: CheckInEmailData): void {
  if (!data.guestEmail) return;
  sendResendEmail(data.guestEmail, `Welcome to ${data.businessName} — You're checked in!`, checkInConfirmationHtml(data));
}

export function sendCheckOutEmail(data: CheckOutEmailData): void {
  if (!data.guestEmail) return;
  sendResendEmail(data.guestEmail, `Your receipt from ${data.businessName}`, checkOutReceiptHtml(data));
}

export function sendStaffCredentials(data: StaffCredentialsData): void {
  if (!data.email) return;
  sendResendEmail(data.email, `Your login for ${data.businessName} — EasyStay`, staffCredentialsHtml(data));
}

export function sendBookingStatusChange(data: BookingStatusChangeData): void {
  if (!data.guestEmail) return;
  sendResendEmail(data.guestEmail, `Booking update: ${data.newStatus} — ${data.businessName}`, bookingStatusChangeHtml(data));
}
