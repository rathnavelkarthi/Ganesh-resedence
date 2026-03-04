import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONTS } from '../fonts';

const useCount = (target: number, startFrame: number, duration = 180) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    });
    return Math.round(target * progress);
};

export const NumbersScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const bgFill = interpolate(frame, [0, 450], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: { damping: 20, stiffness: 65 } });

    const hotels = useCount(500, 40);
    const bookings = useCount(28000, 80);
    const revenue = useCount(42, 120);
    const timeSaved = useCount(12, 160);
    const setupTime = useCount(3, 200);

    const cards = [
        { value: `${hotels}+`, label: 'Hotels on Platform', icon: '🏨', color: '#3b9ee8', s: sp(40) },
        { value: `${bookings.toLocaleString()}+`, label: 'Bookings This Quarter', icon: '📅', color: '#22c55e', s: sp(70) },
        { value: `₹${revenue}L+`, label: 'Revenue Tracked / Month', icon: '💰', color: '#f59e0b', s: sp(100) },
        { value: `${timeSaved}h`, label: 'Saved Per Week', icon: '⏱️', color: '#a855f7', s: sp(130) },
        { value: '4.9★', label: 'Average App Rating', icon: '⭐', color: '#f43f5e', s: sp(160) },
        { value: `${setupTime} min`, label: 'Time to First Booking', icon: '🚀', color: '#14b8a6', s: sp(190) },
    ];

    return (
        <AbsoluteFill style={{ background: '#060c1a', opacity: bgIn, overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 150% 100% at 50% 100%, rgba(26,109,181,${0.12 * bgFill}) 0%, transparent 60%)`,
            }} />
            <AbsoluteFill style={{ padding: '50px 80px', fontFamily: FONTS.sans }}>
                <div style={{
                    opacity: sp(0), transform: `translateY(${interpolate(sp(0), [0, 1], [40, 0])}px)`,
                    marginBottom: 50,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                        <div style={{ width: 5, height: 40, borderRadius: 3, background: 'linear-gradient(to bottom, #f59e0b, #d97706)' }} />
                        <div>
                            <p style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 4px' }}>Traction</p>
                            <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: '#fff', margin: 0, letterSpacing: -1 }}>
                                The Numbers Speak For Themselves
                            </h2>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {cards.map((c) => (
                        <div key={c.label} style={{
                            borderRadius: 24,
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${c.color}22`,
                            padding: '40px 44px',
                            opacity: c.s,
                            transform: `scale(${interpolate(c.s, [0, 1], [0.88, 1])}) translateY(${interpolate(c.s, [0, 1], [40, 0])}px)`,
                            boxShadow: `0 20px 60px ${c.color}12`,
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', right: -10, bottom: -20,
                                fontSize: 110, color: `${c.color}08`,
                                fontFamily: FONTS.serif, lineHeight: 1, pointerEvents: 'none',
                            }}>{c.icon}</div>
                            <div style={{ fontSize: 64, fontWeight: 800, color: c.color, fontFamily: FONTS.serif, lineHeight: 1 }}>
                                {c.value}
                            </div>
                            <div style={{ fontSize: 17, color: '#fff', fontWeight: 600, marginTop: 14 }}>{c.label}</div>
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
