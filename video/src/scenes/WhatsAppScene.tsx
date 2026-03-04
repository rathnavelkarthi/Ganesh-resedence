import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONTS } from '../fonts';

// Animated WhatsApp message bubble
const Bubble: React.FC<{ text: string; time: string; shown: boolean; sp: number }> = ({ text, time, sp }) => {
    const x = interpolate(sp, [0, 1], [-30, 0]);
    return (
        <div style={{
            opacity: sp, transform: `translateX(${x}px)`,
            alignSelf: 'flex-start', maxWidth: '82%',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '2px 16px 16px 16px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                position: 'relative',
            }}>
                <p style={{ color: '#303030', fontSize: 13, margin: 0, lineHeight: 1.55, whiteSpace: 'pre-line', fontFamily: FONTS.sans }}>{text}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    <span style={{ color: '#a0a0a0', fontSize: 10 }}>{time} ✓✓</span>
                </div>
            </div>
        </div>
    );
};

export const WhatsAppScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 22, stiffness: 70 } });

    const hOp = s(0); const phoneScale = s(10);
    const msg1 = s(40); const msg2 = s(160); const msg3 = s(290);
    const rPanelOp = s(30);

    const messages = [
        { text: '✅ *Booking Confirmed!*\n\nDear Arjun, your stay is confirmed.\n🏠 Deluxe Suite\n📅 Mar 5 → Mar 8\n🔖 GR-482910', time: '10:32 AM', sp: msg1 },
        { text: '👋 See you tomorrow!\n\nCheck-in at Ganesh Residency is tomorrow. After 12 PM.\n📍 Chinna Kalapet, Puducherry', time: 'Mar 4  9:00 AM', sp: msg2 },
        { text: 'Thank you for your stay! 🙏\n\nWe loved hosting you. A Google review would mean the world:\n⭐ g.page/GaneshResidency', time: '11:03 AM', sp: msg3 },
    ];

    const timeline = [
        { label: 'Booking Confirmation', sub: 'Sent instantly', color: '#22c55e', sp: msg1 },
        { label: 'Check-in Reminder', sub: 'Day before · 9am', color: '#3b9ee8', sp: msg2 },
        { label: 'Google Review Request', sub: '2 hours after checkout', color: '#a855f7', sp: msg3 },
    ];

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(160deg, #060c1a 0%, #071220 100%)',
            opacity: bgIn, fontFamily: FONTS.sans, overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: 100, right: -100, width: 700, height: 700,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,211,102,0.06) 0%, transparent 70%)',
            }} />

            <AbsoluteFill style={{ padding: '50px 80px', display: 'flex', gap: 70 }}>
                {/* Left column: header + phone */}
                <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ opacity: hOp, transform: `translateY(${interpolate(hOp, [0, 1], [40, 0])}px)`, marginBottom: 44 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                            <div style={{ width: 5, height: 40, borderRadius: 3, background: 'linear-gradient(to bottom, #25d366, #128c7e)' }} />
                            <div>
                                <p style={{ color: '#25d366', fontSize: 14, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 4px' }}>Feature 03</p>
                                <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: '#fff', margin: 0, letterSpacing: -1 }}>WhatsApp Automation</h2>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20, margin: '14px 0 0 21px', lineHeight: 1.5 }}>
                            3 messages. Zero effort. Guests feel remembered.
                        </p>
                    </div>

                    {/* Phone mockup */}
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: `scale(${phoneScale})`,
                    }}>
                        <div style={{
                            width: 280, height: 520, borderRadius: 42,
                            background: '#1a1a1a', border: '7px solid #2a2a2a',
                            overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {/* WhatsApp status bar */}
                            <div style={{ background: '#075e54', padding: '14px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏨</div>
                                <div>
                                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Ganesh Residency</div>
                                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 }}>Business Account</div>
                                </div>
                            </div>
                            {/* Chat bg */}
                            <div style={{
                                flex: 1, padding: 12, overflowY: 'hidden',
                                background: '#ece5dd',
                                display: 'flex', flexDirection: 'column', gap: 10,
                            }}>
                                {/* Date stamp */}
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ background: 'rgba(225,245,254,0.75)', color: '#777', fontSize: 11, padding: '3px 12px', borderRadius: 8 }}>Today</span>
                                </div>
                                {messages.filter((_, i) => i === 0).map((m, i) => (
                                    msg1 > 0.05 && <Bubble key={i} {...m} shown={msg1 > 0.05} />
                                ))}
                                {messages.filter((_, i) => i === 2).map((m, i) => (
                                    msg3 > 0.05 && <Bubble key={i} {...m} shown={msg3 > 0.05} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: timeline */}
                <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, opacity: rPanelOp }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 4px' }}>
                        Automated message sequence
                    </p>
                    {timeline.map((t, i) => (
                        <div key={t.label} style={{
                            borderLeft: `4px solid ${t.color}`,
                            borderRadius: '0 20px 20px 0',
                            background: `rgba(255,255,255,0.03)`,
                            border: `1px solid ${t.color}26`, borderLeftWidth: 4,
                            padding: '24px 28px',
                            opacity: t.sp,
                            transform: `translateX(${interpolate(t.sp, [0, 1], [40, 0])}px)`,
                            boxShadow: `0 10px 40px ${t.color}10`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ color: t.color, fontWeight: 700, fontSize: 17 }}>{t.label}</span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: 20 }}>{t.sub}</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
                                {['Booking details, room info, and booking ID sent to guest instantly.',
                                    'Friendly reminder the morning before check-in with hotel location.',
                                    'Personalised thank you message with your Google review link.'][i]}
                            </p>
                        </div>
                    ))}
                    <div style={{
                        marginTop: 10, padding: '18px 24px', borderRadius: 16,
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                        opacity: msg3, display: 'flex', gap: 12, alignItems: 'center',
                    }}>
                        <span style={{ fontSize: 28 }}>🤖</span>
                        <div>
                            <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 16 }}>Fully automated — no manual work</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 3 }}>Triggers on every new booking, every time</div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
