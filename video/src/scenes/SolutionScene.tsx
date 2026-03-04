import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

export const SolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const merge = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: 'clamp' });
    const uiForm = spring({ frame: frame - 100, fps, config: EASE.smooth });
    const textSp = spring({ frame: frame - 130, fps, config: EASE.smooth });

    const icons = ['📋', '💳', '📊', '📦', '💬', '🏨'];
    const colors = [C.blue, C.gold, '#a855f7', C.green, '#25d366', C.orange];
    const radii = [320, 280, 310, 295, 305, 315];
    const angles = icons.map((_, i) => (i * Math.PI * 2) / icons.length);

    return (
        <AbsoluteFill style={{ background: '#000000', opacity: fadeIn }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 60% 60% at 50% 45%, rgba(184,137,42,0.08) 0%, transparent 65%)`,
            }} />

            {/* Merging icons */}
            {icons.map((icon, i) => {
                const r = radii[i] * (1 - merge);
                const cx = 960 + Math.cos(angles[i]) * r;
                const cy = 480 + Math.sin(angles[i]) * r;
                const col = colors[i];
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: cx - 40, top: cy - 40,
                        width: 80, height: 80, borderRadius: 22,
                        background: `${col}18`,
                        border: `1px solid ${col}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 36,
                        opacity: 1 - merge * 0.9,
                        boxShadow: `0 0 ${30 * merge}px ${col}33`,
                    }}>{icon}</div>
                );
            })}

            {/* Platform card forming */}
            <div style={{
                position: 'absolute', left: '50%', top: '38%',
                transform: 'translate(-50%, -50%)',
                opacity: uiForm,
                scale: `${interpolate(uiForm, [0, 1], [0.7, 1])}`,
            }}>
                <div style={{
                    width: 520, borderRadius: 28,
                    background: 'rgba(12,43,53,0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(24px)',
                    padding: 36,
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(184,137,42,0.12)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `linear-gradient(135deg, ${C.gold}, #7a5a18)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 22,
                        }}>🏨</div>
                        <div>
                            <div style={{ fontFamily: FONTS.serif, color: C.white, fontSize: 20, fontWeight: 700 }}>HospitalityOS</div>
                            <div style={{ fontFamily: FONTS.sans, color: C.muted, fontSize: 13 }}>Unified Platform</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        {['CRM', 'Bookings', 'Analytics', 'Website', 'POS', 'Inventory'].map((m) => (
                            <div key={m} style={{
                                padding: '10px 14px', borderRadius: 10,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                fontFamily: FONTS.sans, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
                                textAlign: 'center',
                                opacity: interpolate(uiForm, [0, 1], [0, 1]),
                            }}>{m}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Text */}
            <div style={{
                position: 'absolute', bottom: 90, left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                opacity: textSp, transform: `translateY(${interpolate(textSp, [0, 1], [20, 0])}px)`,
            }}>
                <h2 style={{
                    fontFamily: FONTS.serif, fontSize: 56, color: C.white, margin: 0,
                    textAlign: 'center',
                }}>Replace everything with one platform.</h2>
            </div>
        </AbsoluteFill>
    );
};
