import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONTS } from '../fonts';

export const CTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bgIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: { damping: 16, stiffness: 70 } });

    const logoSp = sp(0);
    const pulse = 0.85 + Math.sin(frame * 0.07) * 0.15;
    const titleOp = sp(25);
    const tagOp = sp(65);
    const btn1 = sp(105);
    const btn2 = sp(125);
    const contactOp = sp(180);

    // Orbiting particles
    const orbitRadius = 200;
    const orbitProgress = (frame * 0.012);

    return (
        <AbsoluteFill style={{ background: '#050810', opacity: bgIn, overflow: 'hidden' }}>
            {/* Deep space gradient */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 120% 90% at 50% 50%, #0a1836 0%, #050810 70%)',
            }} />

            {/* Pulsing outer glow */}
            <div style={{
                position: 'absolute',
                left: '50%', top: '42%',
                transform: 'translate(-50%, -50%)',
                width: 600, height: 600, borderRadius: '50%',
                background: `radial-gradient(circle, rgba(59,158,232,${0.18 * pulse}) 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Orbiting dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = orbitProgress + (i * Math.PI * 2) / 6;
                const x = 50 + Math.cos(angle) * (orbitRadius / 19.2);
                const y = 42 + Math.sin(angle) * (orbitRadius / 10.8);
                const size = 4 + (i % 2) * 3;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${x}%`, top: `${y}%`,
                        width: size, height: size, borderRadius: '50%',
                        background: i % 2 === 0 ? '#3b9ee8' : '#93c5fd',
                        boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? '#3b9ee8' : '#93c5fd'}`,
                        opacity: 0.7 * logoSp,
                    }} />
                );
            })}

            {/* Dot grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '56px 56px', pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 0, fontFamily: FONTS.sans,
            }}>
                {/* Logo mark */}
                <div style={{
                    transform: `scale(${logoSp})`, marginBottom: 36, position: 'relative',
                }}>
                    <div style={{
                        width: 120, height: 120, borderRadius: 34,
                        background: 'linear-gradient(135deg, #3b9ee8 0%, #1a6db5 60%, #0a3260 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 62,
                        boxShadow: `0 0 ${100 * pulse}px rgba(59,158,232,0.55), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}>🏨</div>
                </div>

                {/* Title */}
                <h1 style={{
                    fontFamily: FONTS.serif, fontSize: 92, fontWeight: 700,
                    color: '#fff', margin: '0 0 24px',
                    letterSpacing: -3,
                    opacity: titleOp, transform: `translateY(${interpolate(titleOp, [0, 1], [30, 0])}px)`,
                    textShadow: '0 4px 40px rgba(59,158,232,0.4)',
                }}>
                    HospitalityOS
                </h1>

                {/* Tagline */}
                <p style={{
                    fontSize: 28, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px',
                    opacity: tagOp, transform: `translateY(${interpolate(tagOp, [0, 1], [20, 0])}px)`,
                    textAlign: 'center', maxWidth: 700, lineHeight: 1.4,
                }}>
                    The operating system every Indian hotel deserves.
                </p>
                <p style={{
                    fontSize: 20, color: 'rgba(255,255,255,0.3)', margin: '0 0 64px',
                    opacity: tagOp,
                }}>
                    Smart · Automated · Built for growth.
                </p>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 60 }}>
                    <div style={{
                        opacity: btn1, transform: `scale(${interpolate(btn1, [0, 1], [0.85, 1])})`,
                        padding: '22px 60px', borderRadius: 16,
                        background: 'linear-gradient(135deg, #1a6db5, #0a3260)',
                        border: '1px solid rgba(59,158,232,0.5)',
                        color: '#fff', fontSize: 20, fontWeight: 700,
                        boxShadow: '0 12px 40px rgba(26,109,181,0.45)',
                        letterSpacing: 0.3,
                    }}>
                        Join the Waitlist
                    </div>
                    <div style={{
                        opacity: btn2, transform: `scale(${interpolate(btn2, [0, 1], [0.85, 1])})`,
                        padding: '22px 60px', borderRadius: 16,
                        border: '2px solid rgba(255,255,255,0.18)',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'rgba(255,255,255,0.7)', fontSize: 20,
                        backdropFilter: 'blur(8px)',
                    }}>
                        Schedule Demo
                    </div>
                </div>

                {/* Contact */}
                <div style={{ opacity: contactOp, textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16, margin: 0 }}>
                        hello@hospitalityos.in · +91 98765 43210 · hospitalityos.in
                    </p>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
