import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

export const ReservationScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const headerSp = sp(0);
    const calSp = sp(20);
    const guestSp = sp(100);
    const textSp = sp(60);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const rooms = ['Deluxe Suite', 'Suite 201', 'Premium Room', 'Standard AC', 'Ocean View'];

    const bookings = [
        { r: 0, ds: 0, de: 3, color: C.blue, guest: 'Arjun Mehta' },
        { r: 1, ds: 1, de: 4, color: C.green, guest: 'Priya Sharma' },
        { r: 2, ds: 3, de: 6, color: C.gold, guest: 'Ravi Kumar' },
        { r: 3, ds: 0, de: 2, color: C.blue, guest: 'Sunita Nair' },
        { r: 4, ds: 4, de: 6, color: C.green, guest: 'Deepak Singh' },
    ];

    const blockProgress = interpolate(frame, [60, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ opacity: fadeIn, fontFamily: FONTS.sans }}>
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #071a26 0%, ${C.navy} 100%)` }} />
            <div style={{
                position: 'absolute', top: -100, right: -150, width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(77,163,255,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{ padding: '52px 80px', display: 'flex', gap: 60 }}>
                <div style={{ flex: 1.8 }}>
                    <div style={{
                        opacity: headerSp, transform: `translateY(${interpolate(headerSp, [0, 1], [30, 0])}px)`,
                        marginBottom: 30,
                    }}>
                        <p style={{ color: C.gold, fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 8px' }}>Reservation Management</p>
                        <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: C.white, margin: 0, letterSpacing: -1 }}>
                            Manage reservations in real time.
                        </h2>
                    </div>

                    {/* Calendar */}
                    <div style={{
                        borderRadius: 20, overflow: 'hidden',
                        background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(20px)',
                        opacity: calSp,
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr)',
                            background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{ padding: '14px 16px', color: C.muted, fontSize: 13 }}>Room</div>
                            {days.map((d) => (
                                <div key={d} style={{ padding: '14px 8px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>{d}</div>
                            ))}
                        </div>
                        {rooms.map((room, ri) => (
                            <div key={room} style={{
                                display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr)',
                                borderBottom: ri < rooms.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                position: 'relative', minHeight: 52,
                            }}>
                                <div style={{ padding: '16px', color: C.muted, fontSize: 13, display: 'flex', alignItems: 'center' }}>{room}</div>
                                {days.map((_, di) => (
                                    <div key={di} style={{ background: di % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }} />
                                ))}
                                {bookings.filter(b => b.r === ri).map((b, bi) => {
                                    const blockW = (b.de - b.ds) / 7;
                                    const blockL = b.ds / 7;
                                    const bProgress = Math.min(1, Math.max(0, (blockProgress - bi * 0.15) / 0.5));
                                    return (
                                        <div key={bi} style={{
                                            position: 'absolute',
                                            left: `calc(140px + ${blockL * 100}% * (100% - 140px) / 100%)`,
                                            top: 8, bottom: 8,
                                            width: `${blockW * 100}%`,
                                            borderRadius: 8,
                                            background: `${b.color}22`,
                                            border: `1px solid ${b.color}55`,
                                            display: 'flex', alignItems: 'center', paddingLeft: 10,
                                            overflow: 'hidden',
                                            opacity: bProgress,
                                            transform: `scaleX(${bProgress})`,
                                            transformOrigin: 'left center',
                                        }}>
                                            <span style={{ color: b.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{b.guest}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guest profile */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    opacity: guestSp, transform: `translateX(${interpolate(guestSp, [0, 1], [40, 0])}px)`,
                }}>
                    <div style={{
                        borderRadius: 20, padding: 28,
                        background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 14,
                                background: `${C.blue}22`, border: `1px solid ${C.blue}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: C.blue, fontWeight: 700, fontSize: 22,
                            }}>A</div>
                            <div>
                                <div style={{ color: C.white, fontWeight: 700, fontSize: 17 }}>Arjun Mehta</div>
                                <div style={{ color: C.muted, fontSize: 13 }}>Guest · 3rd visit</div>
                            </div>
                        </div>
                        {[
                            { label: 'Check-in', value: 'Mar 5, 12:00 PM', icon: '📥' },
                            { label: 'Check-out', value: 'Mar 8, 11:00 AM', icon: '📤' },
                            { label: 'Room', value: 'Deluxe Suite', icon: '🏠' },
                            { label: 'Total', value: '₹12,600', icon: '💰' },
                        ].map((f) => (
                            <div key={f.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <span style={{ color: C.muted, fontSize: 14 }}>{f.icon} {f.label}</span>
                                <span style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>{f.value}</span>
                            </div>
                        ))}
                        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                            <div style={{
                                flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center',
                                background: `${C.green}1a`, color: C.green, fontWeight: 700, fontSize: 14,
                                border: `1px solid ${C.green}33`,
                            }}>Check In</div>
                            <div style={{
                                flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center',
                                background: `${C.gold}1a`, color: C.gold, fontWeight: 700, fontSize: 14,
                                border: `1px solid ${C.gold}33`,
                            }}>Assign Room</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <p style={{ color: C.muted, fontSize: 14, textAlign: 'center', opacity: textSp }}>
                            Check-in · Check-out · Room availability — all in one view.
                        </p>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
