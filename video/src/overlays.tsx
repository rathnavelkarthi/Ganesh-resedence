// Cinematic overlays used across the entire video
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * FilmGrain — SVG turbulence noise layer for cinematic texture.
 * Renders as an almost-invisible semi-transparent noise over every frame.
 * This is the single biggest thing that makes browser-rendered video
 * look like professional motion design rather than a webpage.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
    const frame = useCurrentFrame();
    // Shift the noise every frame to animate the grain
    const seed = (frame * 127) % 1000;
    return (
        <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity }}>
                <filter id={`grain-${frame}`}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        seed={seed}
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
            </svg>
        </AbsoluteFill>
    );
};

/**
 * Vignette — darkens the edges of the frame for cinematic depth.
 */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
    <AbsoluteFill style={{
        background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(0,0,0,${strength}) 100%)`,
        pointerEvents: 'none',
    }} />
);

/**
 * SceneLabel — the small uppercase category label (e.g. "The Problem")
 * used in Stripe/Linear-style product videos.
 */
export const SceneLabel: React.FC<{ text: string; color?: string; opacity?: number }> = ({
    text, color = '#C9A646', opacity = 1,
}) => (
    <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, opacity,
        padding: '7px 20px', borderRadius: 100,
        background: `${color}12`, border: `1px solid ${color}33`,
    }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
        <span style={{
            fontFamily: 'var(--font-sans, system-ui)',
            fontSize: 13, color, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 600,
        }}>{text}</span>
    </div>
);
