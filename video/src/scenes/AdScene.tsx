/**
 * AdScene — 20-second YouTube/Instagram ad cut.
 * Structure: Hook (3s) → Pain (4s) → Dashboard flash (6s) → CTA (7s)
 * Reuses brand tokens. Designed to grab attention in the first 3 seconds.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

// Fast counter animation
const Counter: React.FC<{ from: number; to: number; prefix?: string; suffix?: string; color: string; delay: number }> = ({
    from, to, prefix = '', suffix = '', color, delay,
}) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame - delay, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const value = Math.round(from + (to - from) * progress);
    return (
        <span style={{ fontFamily: FONTS.serif, fontSize: 72, fontWeight: 700, color, lineHeight: 1 }}>
            {prefix}{value}{suffix}
        </span>
    );
};

// ---- HOOK: 0-90 frames (3s) ----
const HookSection: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sp = (d: number) => spring({ frame: frame - d, fps, config: { damping: 18, stiffness: 90 } });
    const line1 = sp(0);
    const line2 = sp(20);
    const strike = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                width: 800, height: 400,
                background: 'radial-gradient(ellipse, rgba(184,137,42,0.08) 0%, transparent 60%)',
            }} />
            <h1 style={{
                fontFamily: FONTS.serif, fontSize: 72, color: '#fff', margin: 0,
                opacity: line1, transform: `translateY(${interpolate(line1, [0, 1], [40, 0])}px)`,
                textAlign: 'center', lineHeight: 1.2, letterSpacing: -2,
            }}>
                Still running your hotel
            </h1>
            <h1 style={{
                fontFamily: FONTS.serif, fontSize: 72, margin: '8px 0 0',
                textAlign: 'center', lineHeight: 1.2, letterSpacing: -2, position: 'relative',
                opacity: line2, transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
            }}>
                <span style={{ color: '#ef4444' }}>on spreadsheets?</span>
                {/* Strikethrough animating */}
                <div style={{
                    position: 'absolute', top: '50%', left: 0,
                    width: `${strike * 100}%`, height: 4,
                    background: '#ef4444', borderRadius: 2,
                    boxShadow: '0 0 12px rgba(239,68,68,0.5)',
                }} />
            </h1>
        </AbsoluteFill>
    );
};

// ---- PAIN ICONS: 90-210 frames (4s) ----
const PainSection: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const tools = [
        { icon: '📋', label: 'Bookings' },
        { icon: '💳', label: 'POS' },
        { icon: '📊', label: 'Sheets' },
        { icon: '📦', label: 'Inventory' },
        { icon: '💬', label: 'Chat' },
    ];

    const textSp = spring({ frame: frame - 60, fps, config: EASE.crisp });

    return (
        <AbsoluteFill style={{ background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Tools flying apart */}
            <div style={{ display: 'flex', gap: 28, marginBottom: 48 }}>
                {tools.map((t, i) => {
                    const sp = spring({ frame: frame - i * 5, fps, config: { damping: 16, stiffness: 100 } });
                    const shake = Math.sin(frame * 0.15 + i * 2) * 6;
                    return (
                        <div key={t.label} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                            opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [60, 0])}px) rotate(${shake}deg)`,
                        }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 20,
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 36,
                            }}>{t.icon}</div>
                            <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{t.label}</span>
                        </div>
                    );
                })}
            </div>
            <p style={{
                fontFamily: FONTS.sans, fontSize: 28, color: 'rgba(255,255,255,0.5)',
                margin: 0, opacity: textSp,
                transform: `translateY(${interpolate(textSp, [0, 1], [20, 0])}px)`,
            }}>
                Too many tools. Zero visibility.
            </p>
        </AbsoluteFill>
    );
};

// ---- DASHBOARD FLASH: 210-390 frames (6s) ----
const DashFlash: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });
    const zoom = interpolate(frame, [0, 180], [1.1, 1], { extrapolateRight: 'clamp' });

    const metrics = [
        { icon: '💰', value: '₹8.2L', label: 'Revenue', trend: '+18%' },
        { icon: '🏠', value: '87%', label: 'Occupancy', trend: '+4.5%' },
        { icon: '📅', value: '142', label: 'Bookings', trend: '+28' },
    ];

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(184,137,42,0.06) 0%, transparent 55%)',
            }} />

            <AbsoluteFill style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transform: `scale(${zoom})`,
            }}>
                {/* Brand */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36,
                    opacity: sp(0),
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: `linear-gradient(135deg, ${C.gold}, #7a5a18)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, boxShadow: '0 0 40px rgba(184,137,42,0.3)',
                    }}>🏨</div>
                    <span style={{ fontFamily: FONTS.serif, fontSize: 36, color: '#fff', fontWeight: 700, letterSpacing: -1 }}>HospitalityOS</span>
                </div>

                {/* Metric cards */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                    {metrics.map((m, i) => (
                        <div key={m.label} style={{
                            width: 220, padding: '24px 20px', borderRadius: 18,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            opacity: sp(20 + i * 15),
                            transform: `translateY(${interpolate(sp(20 + i * 15), [0, 1], [40, 0])}px)`,
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                            <div style={{ fontFamily: FONTS.serif, fontSize: 40, color: '#fff', fontWeight: 700, lineHeight: 1 }}>{m.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8 }}>{m.label}</div>
                            <div style={{ color: C.green, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{m.trend}</div>
                        </div>
                    ))}
                </div>

                {/* Tagline */}
                <p style={{
                    fontFamily: FONTS.sans, fontSize: 22, color: 'rgba(255,255,255,0.4)',
                    margin: 0, opacity: sp(90),
                }}>
                    Everything in one platform. No more chaos.
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// ---- CTA: 390-600 frames (7s) ----
const CtaSection: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });
    const glowPulse = 0.7 + Math.sin(frame * 0.06) * 0.3;
    const lineW = interpolate(frame, [30, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const fadeOut = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            <div style={{
                position: 'absolute', left: '50%', top: '45%',
                transform: 'translate(-50%,-50%)',
                width: 1000, height: 600,
                background: `radial-gradient(ellipse, rgba(184,137,42,${0.08 * glowPulse}) 0%, transparent 55%)`,
            }} />

            <AbsoluteFill style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 20, marginBottom: 32,
                    background: `linear-gradient(135deg, ${C.gold}, #7a5a18)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 34,
                    opacity: sp(0), transform: `scale(${interpolate(sp(0), [0, 1], [0.5, 1])})`,
                    boxShadow: `0 0 ${60 * glowPulse}px rgba(184,137,42,0.4)`,
                }}>🏨</div>

                <h1 style={{
                    fontFamily: FONTS.serif, fontSize: 84, color: '#fff',
                    margin: 0, letterSpacing: -3, textAlign: 'center',
                    opacity: sp(10), transform: `translateY(${interpolate(sp(10), [0, 1], [30, 0])}px)`,
                }}>HospitalityOS</h1>

                <div style={{
                    height: 3, marginTop: 20, marginBottom: 24,
                    width: `${500 * lineW}px`,
                    background: 'linear-gradient(90deg, transparent, #B8892A 20%, #E8C96A 50%, #B8892A 80%, transparent)',
                    boxShadow: '0 0 20px rgba(184,137,42,0.5)',
                }} />

                <p style={{
                    fontFamily: FONTS.sans, fontSize: 22, color: 'rgba(255,255,255,0.42)',
                    margin: '0 0 40px', letterSpacing: 1,
                    opacity: sp(60),
                }}>
                    The operating system for modern hospitality.
                </p>

                <div style={{
                    padding: '16px 48px', borderRadius: 14,
                    background: `linear-gradient(135deg, ${C.gold}, #7a5a18)`,
                    color: '#fff', fontFamily: FONTS.sans,
                    fontWeight: 700, fontSize: 18,
                    boxShadow: '0 12px 40px rgba(184,137,42,0.4)',
                    opacity: sp(100), transform: `scale(${interpolate(sp(100), [0, 1], [0.9, 1])})`,
                    marginBottom: 24,
                }}>Start Free →</div>

                <p style={{
                    fontFamily: FONTS.sans, color: 'rgba(255,255,255,0.2)', fontSize: 14,
                    letterSpacing: 2, opacity: sp(130),
                }}>safestay.superbots.in</p>
            </AbsoluteFill>

            <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />
        </AbsoluteFill>
    );
};

// ---- MAIN AD COMPOSITION ----
export const AdScene: React.FC = () => (
    <AbsoluteFill style={{ background: '#000' }}>
        <Sequence from={0} durationInFrames={90}>
            <HookSection />
        </Sequence>
        <Sequence from={90} durationInFrames={120}>
            <PainSection />
        </Sequence>
        <Sequence from={210} durationInFrames={180}>
            <DashFlash />
        </Sequence>
        <Sequence from={390} durationInFrames={210}>
            <CtaSection />
        </Sequence>
    </AbsoluteFill>
);
