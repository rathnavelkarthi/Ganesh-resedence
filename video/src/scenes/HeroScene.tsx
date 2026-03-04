/**
 * HeroScene — Apple product launch style finale.
 * Minimal. Confident. Pure black. One CTA only.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

export const HeroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const logoSp = sp(0);
    const glowPulse = 0.7 + Math.sin(frame * 0.04) * 0.3;
    const lineW = interpolate(frame, [35, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const titleSp = sp(18);
    const tagSp = sp(70);
    const pillsSp = sp(80);
    const btnSp = sp(160);
    const urlSp = sp(220);

    // Slow zoom out — Apple style
    const zoom = interpolate(frame, [0, 410], [1.05, 1], { extrapolateRight: 'clamp' });

    // Fade to black at end
    const fadeToBlack = interpolate(frame, [370, 410], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const modules = ['Dashboard', 'Website Builder', 'Reservations', 'Restaurant', 'Inventory', 'Analytics', 'WhatsApp', 'Multi-property'];

    return (
        <AbsoluteFill>
            <AbsoluteFill style={{ background: '#000000' }} />

            {/* Pulsing gold center glow */}
            <div style={{
                position: 'absolute', left: '50%', top: '42%',
                transform: 'translate(-50%, -50%)',
                width: 1200, height: 800,
                background: `radial-gradient(ellipse, rgba(184,137,42,${0.07 * glowPulse}) 0%, transparent 55%)`,
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transform: `scale(${zoom})`,
            }}>
                {/* Logo mark */}
                <div style={{
                    width: 80, height: 80, borderRadius: 22, marginBottom: 40,
                    background: 'linear-gradient(135deg, #B8892A 0%, #7a5a18 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 38,
                    opacity: logoSp,
                    transform: `scale(${interpolate(logoSp, [0, 1], [0.5, 1])})`,
                    boxShadow: `0 0 ${80 * glowPulse}px rgba(184,137,42,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}>🏨</div>

                {/* Brand name — large and confident */}
                <h1 style={{
                    fontFamily: FONTS.serif, fontSize: 96, fontWeight: 700,
                    color: '#fff', margin: 0, letterSpacing: -3, lineHeight: 1,
                    textAlign: 'center',
                    opacity: titleSp,
                    transform: `translateY(${interpolate(titleSp, [0, 1], [40, 0])}px)`,
                }}>
                    HospitalityOS
                </h1>

                {/* Gold line draw */}
                <div style={{
                    height: 3, marginTop: 24, marginBottom: 26,
                    width: `${600 * lineW}px`,
                    background: 'linear-gradient(90deg, transparent, #B8892A 20%, #E8C96A 50%, #B8892A 80%, transparent)',
                    boxShadow: '0 0 20px rgba(184,137,42,0.5)',
                    borderRadius: 2,
                }} />

                {/* Tagline */}
                <p style={{
                    fontFamily: FONTS.sans, fontSize: 24,
                    color: 'rgba(255,255,255,0.42)',
                    margin: '0 0 42px', letterSpacing: 1, textAlign: 'center',
                    opacity: tagSp,
                    transform: `translateY(${interpolate(tagSp, [0, 1], [16, 0])}px)`,
                }}>
                    Run your entire hospitality business from one platform.
                </p>

                {/* Feature pills */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 10,
                    justifyContent: 'center', maxWidth: 720, marginBottom: 48,
                    opacity: pillsSp,
                }}>
                    {modules.map((m, i) => {
                        const pSp = sp(80 + i * 8);
                        return (
                            <div key={m} style={{
                                padding: '8px 18px', borderRadius: 100,
                                background: 'rgba(184,137,42,0.08)',
                                border: '1px solid rgba(184,137,42,0.22)',
                                color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500,
                                fontFamily: FONTS.sans,
                                opacity: pSp, transform: `scale(${interpolate(pSp, [0, 1], [0.85, 1])})`,
                            }}>{m}</div>
                        );
                    })}
                </div>

                {/* Single CTA — Apple style, no second button */}
                <div style={{
                    padding: '18px 56px', borderRadius: 14,
                    background: 'linear-gradient(135deg, #B8892A, #7a5a18)',
                    color: '#fff', fontFamily: FONTS.sans,
                    fontWeight: 700, fontSize: 19, letterSpacing: 0.5,
                    boxShadow: '0 12px 40px rgba(184,137,42,0.4)',
                    opacity: btnSp, transform: `scale(${interpolate(btnSp, [0, 1], [0.9, 1])})`,
                    marginBottom: 36,
                }}>Schedule a Demo →</div>

                {/* Website URL */}
                <p style={{
                    fontFamily: FONTS.sans, color: 'rgba(255,255,255,0.2)', fontSize: 15,
                    margin: 0, letterSpacing: 2, opacity: urlSp,
                }}>
                    safestay.superbots.in
                </p>
            </AbsoluteFill>

            {/* Final fade to black */}
            <AbsoluteFill style={{ background: '#000', opacity: fadeToBlack }} />
        </AbsoluteFill>
    );
};
