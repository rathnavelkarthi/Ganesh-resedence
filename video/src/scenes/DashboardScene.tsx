/**
 * DashboardScene — mirrors the ACTUAL HospitalityOS dashboard
 * from safestay.superbots.in:
 *   Revenue ₹8.2L (+18%), Occupancy 87% (+4.5%), Bookings 142 (+28)
 *   Revenue trend bar chart
 *   Recent bookings: Rahul M. ₹4,500 | Priya S. ₹2,200
 *   Direct bookings +28% badge
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

// Exact replica of the website's bar chart style
const RevenueChart: React.FC<{ progress: number }> = ({ progress }) => {
    const bars = [0.45, 0.58, 0.52, 0.75, 0.68, 0.82, 0.79, 0.91];
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
            {bars.map((h, i) => {
                const barProg = Math.min(1, Math.max(0, (progress - i * 0.08) / 0.4));
                return (
                    <div key={i} style={{
                        flex: 1, borderRadius: '4px 4px 0 0',
                        background: i === bars.length - 1
                            ? `linear-gradient(to top, ${C.gold}, ${C.goldLight})`
                            : 'rgba(184,137,42,0.25)',
                        height: h * 80 * barProg,
                        boxShadow: i === bars.length - 1 ? `0 0 16px rgba(184,137,42,0.4)` : 'none',
                    }} />
                );
            })}
        </div>
    );
};

export const DashboardScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const chartProg = interpolate(frame, [80, 280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const tableSp = sp(100);
    const badgeSp = sp(200);

    const metrics = [
        { label: 'Revenue', value: '₹8.2L', sub: '+18%', subColor: C.green, sp: sp(15) },
        { label: 'Occupancy', value: '87%', sub: '+4.5%', subColor: C.green, sp: sp(30) },
        { label: 'Bookings', value: '142', sub: '+28', subColor: C.green, sp: sp(45) },
    ];

    const recentBookings = [
        { name: 'Rahul M.', room: 'Deluxe Suite', amount: '₹4,500', avatar: 'R', color: C.gold },
        { name: 'Priya S.', room: 'Standard Room', amount: '₹2,200', avatar: 'P', color: C.navyLight },
    ];

    return (
        <AbsoluteFill style={{ opacity: fadeIn }}>
            {/* Background: dark navy matching website */}
            <AbsoluteFill style={{ background: C.navy }} />
            {/* Subtle texture */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 80% 20%, rgba(184,137,42,0.06) 0%, transparent 45%),
          radial-gradient(circle at 20% 80%, rgba(77,163,255,0.04) 0%, transparent 45%)`,
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{ padding: '48px 80px', fontFamily: FONTS.sans }}>
                {/* Section label */}
                <div style={{
                    opacity: sp(0), transform: `translateY(${interpolate(sp(0), [0, 1], [24, 0])}px)`,
                    marginBottom: 28,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 4, height: 36, borderRadius: 2, background: C.gold }} />
                        <div>
                            <p style={{ color: C.gold, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                                HospitalityOS Dashboard
                            </p>
                            <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: C.white, margin: 0, letterSpacing: -1, lineHeight: 1.1 }}>
                                Your entire operation. One screen.
                            </h2>
                        </div>
                    </div>
                    {/* Trusted by badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Trusted by 500+ properties across India</span>
                    </div>
                </div>

                {/* Main dashboard card — mimics the actual website UI */}
                <div style={{
                    borderRadius: 20, overflow: 'hidden',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    background: 'rgba(8,22,30,0.9)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                }}>
                    {/* Top bar like Chrome extension bar */}
                    <div style={{
                        background: '#050f15', padding: '12px 20px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
                        ))}
                        <div style={{
                            marginLeft: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 6,
                            padding: '4px 16px', color: 'rgba(255,255,255,0.3)', fontSize: 12,
                        }}>
                            dashboard.hospitalityos.in
                        </div>
                    </div>

                    <div style={{ padding: '24px 28px' }}>
                        {/* Metric cards row */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                            {metrics.map((m, i) => (
                                <div key={m.label} style={{
                                    flex: 1, padding: '18px 20px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    opacity: m.sp, transform: `translateY(${interpolate(m.sp, [0, 1], [30, 0])}px)`,
                                }}>
                                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 8 }}>{m.label}</div>
                                    <div style={{ fontFamily: FONTS.serif, fontSize: 36, color: '#fff', fontWeight: 700, lineHeight: 1 }}>{m.value}</div>
                                    <div style={{ color: m.subColor, fontSize: 13, marginTop: 6, fontWeight: 600 }}>{m.sub}</div>
                                </div>
                            ))}

                            {/* Revenue trend chart */}
                            <div style={{
                                flex: 2, padding: '18px 20px', borderRadius: 14,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                opacity: tableSp,
                            }}>
                                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 12 }}>Revenue trend</div>
                                <RevenueChart progress={chartProg} />
                            </div>

                            {/* Direct bookings badge */}
                            <div style={{
                                flex: 1, padding: '18px 20px', borderRadius: 14,
                                background: `rgba(184,137,42,0.08)`,
                                border: `1px solid rgba(184,137,42,0.2)`,
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                opacity: badgeSp, transform: `scale(${interpolate(badgeSp, [0, 1], [0.8, 1])})`,
                            }}>
                                <div style={{ fontFamily: FONTS.serif, fontSize: 42, color: C.gold, fontWeight: 700 }}>+28%</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginTop: 6 }}>Direct bookings</div>
                                <div style={{
                                    marginTop: 10, padding: '4px 14px', borderRadius: 100,
                                    background: 'rgba(184,137,42,0.15)', color: C.gold, fontSize: 11, fontWeight: 600,
                                }}>vs last month</div>
                            </div>
                        </div>

                        {/* Recent bookings */}
                        <div style={{
                            borderRadius: 14, overflow: 'hidden',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            opacity: tableSp,
                        }}>
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Recent bookings</span>
                                <span style={{ color: C.gold, fontSize: 13 }}>View all</span>
                            </div>
                            {recentBookings.map((b, i) => (
                                <div key={b.name} style={{
                                    display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 14,
                                    borderBottom: i < recentBookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                        background: `${b.color}22`, border: `1px solid ${b.color}33`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: b.color, fontWeight: 700, fontSize: 16,
                                    }}>{b.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{b.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{b.room}</div>
                                    </div>
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{b.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
