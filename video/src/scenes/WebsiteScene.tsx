import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

export const WebsiteScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const headerSp = sp(0);
    const browserSp = sp(15);
    const card1 = sp(50); const card2 = sp(70); const card3 = sp(90);
    const btnSp = sp(160);
    const textSp = sp(100);

    const rooms = [
        { name: 'Deluxe Suite', price: '₹4,200/night', emoji: '🛏️', badge: 'Popular' },
        { name: 'Standard AC', price: '₹2,100/night', emoji: '🪟', badge: 'Available' },
        { name: 'Premium Room', price: '₹3,500/night', emoji: '✨', badge: 'New' },
    ];

    return (
        <AbsoluteFill style={{ opacity: fadeIn, fontFamily: FONTS.sans }}>
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #071a26 0%, ${C.navy} 100%)` }} />
            <div style={{
                position: 'absolute', bottom: -200, left: -100, width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(184,137,42,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{ padding: '52px 80px', display: 'flex', gap: 70 }}>
                {/* Left */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{
                        color: C.gold, fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 16px',
                        opacity: headerSp,
                    }}>Website Builder</p>
                    <h2 style={{
                        fontFamily: FONTS.serif, fontSize: 52, color: C.white, margin: '0 0 20px', lineHeight: 1.15,
                        opacity: headerSp, transform: `translateY(${interpolate(headerSp, [0, 1], [30, 0])}px)`,
                    }}>
                        Create stunning hotel websites in minutes.
                    </h2>
                    <p style={{
                        fontSize: 20, color: C.muted, lineHeight: 1.6, marginBottom: 40,
                        opacity: textSp, transform: `translateY(${interpolate(textSp, [0, 1], [16, 0])}px)`,
                    }}>
                        Beautiful templates. Live booking integration. Launch-ready instantly.
                    </p>
                    <div style={{
                        display: 'flex', gap: 12, opacity: btnSp,
                        transform: `translateY(${interpolate(btnSp, [0, 1], [20, 0])}px)`,
                    }}>
                        <div style={{
                            padding: '14px 32px', borderRadius: 12,
                            background: `linear-gradient(135deg, ${C.gold}, #7a5a18)`,
                            color: '#fff', fontWeight: 700, fontSize: 16,
                            boxShadow: '0 8px 28px rgba(184,137,42,0.35)',
                        }}>Check Availability</div>
                        <div style={{
                            padding: '14px 32px', borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.7)', fontSize: 16,
                        }}>Book Now</div>
                    </div>
                </div>

                {/* Right: Browser mockup */}
                <div style={{
                    flex: 1.2,
                    opacity: browserSp,
                    transform: `scale(${interpolate(browserSp, [0, 1], [0.9, 1])}) translateX(${interpolate(browserSp, [0, 1], [40, 0])}px)`,
                }}>
                    <div style={{
                        borderRadius: 16, overflow: 'hidden',
                        background: '#050f15',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    }}>
                        {/* Browser chrome */}
                        <div style={{
                            background: '#050f15', padding: '12px 16px',
                            display: 'flex', alignItems: 'center', gap: 8,
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
                            ))}
                            <div style={{
                                flex: 1, marginLeft: 12,
                                background: 'rgba(255,255,255,0.06)',
                                borderRadius: 8, padding: '5px 14px',
                                color: 'rgba(255,255,255,0.3)', fontSize: 12,
                            }}>
                                safestay.superbots.in
                            </div>
                        </div>

                        {/* Hotel website content */}
                        <div style={{ padding: 24, background: `linear-gradient(160deg, #081820 0%, ${C.navy} 100%)` }}>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <div style={{ fontFamily: FONTS.serif, fontSize: 28, color: C.white }}>SafeStay</div>
                                <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Chinna Kalapet, Puducherry</div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {rooms.map((r, i) => {
                                    const cardSps = [card1, card2, card3];
                                    return (
                                        <div key={r.name} style={{
                                            flex: 1, borderRadius: 14,
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            padding: 16,
                                            opacity: cardSps[i],
                                            transform: `translateY(${interpolate(cardSps[i], [0, 1], [20, 0])}px)`,
                                        }}>
                                            <div style={{ fontSize: 30, marginBottom: 8 }}>{r.emoji}</div>
                                            <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                                            <div style={{ color: C.gold, fontSize: 13, marginTop: 4 }}>{r.price}</div>
                                            <div style={{
                                                marginTop: 10, padding: '4px 10px', borderRadius: 6, display: 'inline-block',
                                                background: 'rgba(184,137,42,0.15)', color: C.gold, fontSize: 11, fontWeight: 600,
                                            }}>{r.badge}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
