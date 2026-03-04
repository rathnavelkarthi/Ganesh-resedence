/**
 * IntroScene — YouTube reference style: kinetic text on black.
 * Like the reference video: bold white text, minimal, confident, fast.
 * Pure #000 background. Single focused statement. Gold accent only.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { EASE } from '../constants';
import { FONTS } from '../fonts';

// Letter-by-letter reveal for kinetic feel
const KineticText: React.FC<{ text: string; startFrame: number; fontSize: number; color?: string }> = ({
    text, startFrame, fontSize, color = '#FFFFFF',
}) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const words = text.split(' ');

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.25em' }}>
            {words.map((word, wi) => {
                const wordFrame = startFrame + wi * 4;
                const sp = spring({ frame: frame - wordFrame, fps, config: EASE.crisp });
                return (
                    <span key={wi} style={{
                        fontFamily: FONTS.serif,
                        fontSize, fontWeight: 700, color,
                        opacity: sp,
                        transform: `translateY(${interpolate(sp, [0, 1], [32, 0])}px)`,
                        display: 'inline-block',
                        letterSpacing: -2,
                    }}>
                        {word}
                    </span>
                );
            })}
        </div>
    );
};

export const IntroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
    // "H" logo fades in first
    const logoSp = spring({ frame: frame - 0, fps, config: EASE.smooth });
    // Gold line draw
    const lineW = interpolate(frame, [20, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // Tagline
    const tagSp = spring({ frame: frame - 90, fps, config: EASE.smooth });

    return (
        <AbsoluteFill style={{ background: '#000000', opacity: fadeIn }}>
            {/* Barely-visible center glow — like Apple keynote */}
            <div style={{
                position: 'absolute', left: '50%', top: '44%',
                transform: 'translate(-50%, -50%)',
                width: 1100, height: 700,
                background: 'radial-gradient(ellipse, rgba(184,137,42,0.07) 0%, transparent 55%)',
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 0,
            }}>
                {/* Logo block */}
                <div style={{
                    width: 80, height: 80, borderRadius: 20, marginBottom: 42,
                    background: 'linear-gradient(135deg, #B8892A 0%, #7a5a18 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 40,
                    opacity: logoSp,
                    transform: `scale(${interpolate(logoSp, [0, 1], [0.5, 1])})`,
                    boxShadow: '0 0 60px rgba(184,137,42,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}>🏨</div>

                {/* Kinetic title — words animate in staggered */}
                <div style={{ textAlign: 'center', marginBottom: 0 }}>
                    <KineticText text="HospitalityOS" startFrame={8} fontSize={118} />
                </div>

                {/* Gold underline draws */}
                <div style={{
                    height: 3, marginTop: 22, marginBottom: 26,
                    width: `${620 * lineW}px`,
                    background: 'linear-gradient(90deg, transparent, #B8892A 20%, #E8C96A 50%, #B8892A 80%, transparent)',
                    borderRadius: 2,
                    boxShadow: '0 0 24px rgba(184,137,42,0.55)',
                }} />

                {/* Tagline */}
                <p style={{
                    fontFamily: FONTS.sans, fontSize: 26,
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0, letterSpacing: 3,
                    textTransform: 'uppercase', fontWeight: 400,
                    opacity: tagSp,
                    transform: `translateY(${interpolate(tagSp, [0, 1], [16, 0])}px)`,
                }}>
                    The Operating System for Modern Hospitality
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
