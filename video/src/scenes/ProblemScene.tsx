/**
 * ProblemScene — YouTube reference style: 
 * Kinetic text on dark navy with the website's exact palette.
 * Floating disconnected tool icons representing what hotels use today.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

// Tool icon that floats with individual drift
const Tool: React.FC<{ icon: string; label: string; x: number; y: number; delay: number; color: string }> = ({
    icon, label, x, y, delay, color,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const sp = spring({ frame: frame - delay, fps, config: EASE.smooth });
    const driftX = Math.sin(frame * 0.014 + delay) * 9;
    const driftY = Math.cos(frame * 0.011 + delay * 1.2) * 11;
    const rot = Math.sin(frame * 0.009 + delay) * 5;

    return (
        <div style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            transform: `translate(${driftX}px, ${driftY}px) rotate(${rot}deg)`,
            opacity: sp * 0.85,
        }}>
            <div style={{
                width: 96, height: 96, borderRadius: 26,
                background: `linear-gradient(145deg, ${color}18, ${color}08)`,
                border: `1.5px solid ${color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44,
                boxShadow: `0 16px 48px rgba(0,0,0,0.45), 0 0 24px ${color}18`,
            }}>{icon}</div>
            <span style={{
                fontFamily: FONTS.sans, fontSize: 14, color: 'rgba(255,255,255,0.4)',
                fontWeight: 500, whiteSpace: 'nowrap',
                textShadow: '0 1px 6px rgba(0,0,0,0.8)',
            }}>{label}</span>
        </div>
    );
};

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const textSp = spring({ frame: frame - 50, fps, config: EASE.smooth });
    const subSp = spring({ frame: frame - 80, fps, config: EASE.smooth });

    const tools = [
        { icon: '📋', label: 'Booking System', x: 6, y: 14, delay: 0, color: C.blue },
        { icon: '💳', label: 'POS Machine', x: 26, y: 8, delay: 5, color: C.gold },
        { icon: '📊', label: 'Spreadsheets', x: 52, y: 6, delay: 10, color: '#a855f7' },
        { icon: '📦', label: 'Inventory', x: 74, y: 11, delay: 3, color: C.green },
        { icon: '💬', label: 'WhatsApp', x: 88, y: 20, delay: 8, color: '#25d366' },
        { icon: '🏨', label: 'OTA Platforms', x: 12, y: 60, delay: 6, color: '#f97316' },
        { icon: '👥', label: 'Guest Records', x: 82, y: 58, delay: 12, color: C.blue },
        { icon: '🧾', label: 'Invoicing', x: 48, y: 64, delay: 15, color: C.gold },
    ];

    return (
        <AbsoluteFill style={{ opacity: fadeIn }}>
            {/* Navy background matching website */}
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #0a2230 0%, #071820 60%, ${C.navy} 100%)` }} />

            {/* Colored radial glows in corners */}
            <div style={{ position: 'absolute', left: -100, top: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(77,163,255,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: -100, bottom: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(184,137,42,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

            {/* Dot grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
                backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.5,
            }} />

            {/* Floating tools */}
            {tools.map((t) => <Tool key={t.label} {...t} />)}

            {/* Center headline */}
            <div style={{
                position: 'absolute', bottom: 72, left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                {/* Red pill label */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
                    padding: '7px 20px', borderRadius: 100,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    opacity: textSp,
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ fontFamily: FONTS.sans, color: '#f87171', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600 }}>
                        The Problem
                    </span>
                </div>

                <h2 style={{
                    fontFamily: FONTS.serif, fontSize: 68, color: '#fff', margin: 0,
                    textAlign: 'center', lineHeight: 1.18, letterSpacing: -2,
                    opacity: textSp, transform: `translateY(${interpolate(textSp, [0, 1], [32, 0])}px)`,
                    textShadow: '0 4px 32px rgba(0,0,0,0.7)',
                }}>
                    Hotels run on too many<br />disconnected tools.
                </h2>

                <p style={{
                    fontFamily: FONTS.sans, fontSize: 22, color: 'rgba(255,255,255,0.4)', margin: '20px 0 0',
                    opacity: subSp, transform: `translateY(${interpolate(subSp, [0, 1], [16, 0])}px)`,
                }}>
                    Replace all of them with HospitalityOS.
                </p>
            </div>
        </AbsoluteFill>
    );
};
