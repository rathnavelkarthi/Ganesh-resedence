import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, useVideoConfig,
    spring, interpolate,
} from 'remotion';
import { FONTS } from '../fonts';

const Step: React.FC<{
    num: string; title: string; desc: string; detail: React.ReactNode;
    color: string; sp: number; icon: string;
}> = ({ num, title, desc, detail, color, sp, icon }) => {
    const y = interpolate(sp, [0, 1], [60, 0]);
    return (
        <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${color}26`,
            borderTop: `3px solid ${color}`,
            borderRadius: '0 0 24px 24px',
            padding: '36px 32px',
            opacity: sp, transform: `translateY(${y}px)`,
            boxShadow: `0 20px 60px ${color}10`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: `${color}1a`, border: `1px solid ${color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                }}>{icon}</div>
                <div style={{ color, fontFamily: FONTS.serif, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
                    Step {num}
                </div>
            </div>
            <h3 style={{ color: '#fff', fontSize: 26, fontFamily: FONTS.serif, margin: '0 0 10px', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, margin: '0 0 24px', lineHeight: 1.6 }}>{desc}</p>
            {detail}
        </div>
    );
};

export const BookingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 20, stiffness: 65 } });

    const hOp = s(0); const s1 = s(30); const s2 = s(100); const s3 = s(180);
    const arrowOp = s(80);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(160deg, #060c1a 0%, #0a1836 100%)',
            opacity: bgIn, padding: '50px 80px',
            fontFamily: `${FONTS.sans}, sans-serif`, overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', bottom: -300, left: -200, width: 900, height: 900,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ opacity: hOp, transform: `translateY(${interpolate(hOp, [0, 1], [40, 0])}px)`, marginBottom: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 40, borderRadius: 3, background: 'linear-gradient(to bottom, #22c55e, #16a34a)' }} />
                    <div>
                        <p style={{ color: '#22c55e', fontSize: 14, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 4px' }}>Feature 02</p>
                        <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: '#fff', margin: 0, letterSpacing: -1 }}>Seamless Online Booking</h2>
                    </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 22, margin: '14px 0 0 21px' }}>
                    Direct bookings. Zero OTA commissions. 100% your revenue.
                </p>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                <Step
                    num="01" icon="🏠" color="#3b9ee8" sp={s1}
                    title="Guest Chooses Room"
                    desc="A gorgeous room catalog — photos, pricing, and live availability updated in real time."
                    detail={
                        <div style={{ background: 'rgba(59,158,232,0.08)', border: '1px solid rgba(59,158,232,0.2)', borderRadius: 14, padding: '16px 20px' }}>
                            <div style={{ color: '#93c5fd', fontWeight: 700, fontSize: 15 }}>Deluxe Suite</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Mar 5 → Mar 8 · ₹4,200/night</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                {['AC', 'WiFi', 'Sea View', 'Breakfast'].map(a => (
                                    <span key={a} style={{ fontSize: 11, background: 'rgba(59,158,232,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: 20 }}>{a}</span>
                                ))}
                            </div>
                        </div>
                    }
                />

                {/* Arrow */}
                <div style={{
                    opacity: arrowOp, alignSelf: 'center', padding: '0 20px', marginTop: 60,
                    fontSize: 28, color: 'rgba(255,255,255,0.25)',
                }}>→</div>

                <Step
                    num="02" icon="📝" color="#f59e0b" sp={s2}
                    title="Fills Details"
                    desc="Clean, fast form. Name, phone, email — all auto-saved to the guest database."
                    detail={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Full Name', val: 'Arjun Mehta' },
                                { label: 'Mobile', val: '+91 98765 43210' },
                                { label: 'Email', val: 'arjun@email.com' },
                            ].map(f => (
                                <div key={f.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 16px' }}>
                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 2 }}>{f.label}</div>
                                    <div style={{ color: '#fff', fontSize: 15 }}>{f.val}</div>
                                </div>
                            ))}
                        </div>
                    }
                />

                <div style={{
                    opacity: arrowOp, alignSelf: 'center', padding: '0 20px', marginTop: 60,
                    fontSize: 28, color: 'rgba(255,255,255,0.25)',
                }}>→</div>

                <Step
                    num="03" icon="✅" color="#22c55e" sp={s3}
                    title="Instantly Confirmed"
                    desc="Booking ID generated. Guest saved to CRM. WhatsApp confirmation fires automatically."
                    detail={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                                <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 15 }}>✅ GR-482910 Confirmed</div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 4 }}>Deluxe Suite · ₹12,600 total</div>
                            </div>
                            <div style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ fontSize: 20 }}>💬</span>
                                <div>
                                    <div style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>WhatsApp sent</div>
                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Confirmation + booking details</div>
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
        </AbsoluteFill>
    );
};
