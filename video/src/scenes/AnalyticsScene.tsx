import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

const LineChart: React.FC<{ progress: number }> = ({ progress }) => {
    const points = [
        [0, 80], [60, 65], [130, 55], [200, 40], [270, 30], [340, 15], [400, 5],
    ];

    const totalLength = 380;
    const drawnLength = progress * totalLength;

    const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

    return (
        <svg viewBox="0 0 400 90" style={{ width: '100%', height: 140, overflow: 'visible' }}>
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.gold} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${pathD} L 400 90 L 0 90 Z`} fill="url(#chartGrad)" opacity={progress} />
            <path d={pathD} fill="none" stroke={C.gold} strokeWidth={2.5}
                strokeDasharray={totalLength} strokeDashoffset={totalLength - drawnLength}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${C.gold}88)` }}
            />
            {progress > 0.9 && (
                <circle cx={400} cy={5} r={5} fill={C.gold}
                    style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }}
                />
            )}
        </svg>
    );
};

export const AnalyticsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const headerSp = sp(0);
    const chartProg = interpolate(frame, [40, 220], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const stat1 = sp(80); const stat2 = sp(110);
    const metricsSp = sp(50);

    return (
        <AbsoluteFill style={{ opacity: fadeIn, fontFamily: FONTS.sans }}>
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #071a26 0%, ${C.navy} 100%)` }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(184,137,42,0.06) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{ padding: '52px 80px' }}>
                <div style={{
                    opacity: headerSp, transform: `translateY(${interpolate(headerSp, [0, 1], [30, 0])}px)`,
                    marginBottom: 40,
                }}>
                    <p style={{ color: C.gold, fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 8px' }}>Analytics & Revenue</p>
                    <h2 style={{ fontFamily: FONTS.serif, fontSize: 52, color: C.white, margin: 0, letterSpacing: -1, lineHeight: 1.15 }}>
                        Increase direct bookings.<br />Reduce operational chaos.
                    </h2>
                </div>

                {/* Chart card */}
                <div style={{
                    borderRadius: 24,
                    background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(24px)',
                    padding: '32px 36px', marginBottom: 24,
                    boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
                    opacity: metricsSp,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                        <div>
                            <div style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>Revenue Growth</div>
                            <div style={{ fontFamily: FONTS.serif, fontSize: 44, color: C.white, fontWeight: 700, lineHeight: 1 }}>
                                ₹{(4.2 + chartProg * 1.8).toFixed(1)}L
                            </div>
                        </div>
                        <div style={{
                            padding: '8px 20px', borderRadius: 100,
                            background: `${C.green}15`, border: `1px solid ${C.green}33`,
                            color: C.green, fontWeight: 700, fontSize: 16,
                        }}>
                            ↑ {Math.round(chartProg * 28)}%
                        </div>
                    </div>
                    <LineChart progress={chartProg} />
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 20 }}>
                    {[
                        { label: 'Direct Bookings', delta: '+28%', desc: 'vs OTA commissions', color: C.gold, sp: stat1, icon: '📈' },
                        { label: 'Operational Efficiency', delta: '+40%', desc: 'vs manual processes', color: C.green, sp: stat2, icon: '⚡' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            flex: 1, borderRadius: 20,
                            background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(20px)',
                            padding: '28px 32px',
                            opacity: s.sp, transform: `scale(${interpolate(s.sp, [0, 1], [0.9, 1])})`,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                            <div style={{ fontFamily: FONTS.serif, fontSize: 52, color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.delta}</div>
                            <div style={{ color: C.white, fontSize: 17, fontWeight: 600, marginTop: 10 }}>{s.label}</div>
                            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
