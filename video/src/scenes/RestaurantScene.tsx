import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { C, EASE } from '../constants';
import { FONTS } from '../fonts';

export const RestaurantScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const sp = (d: number) => spring({ frame: frame - d, fps, config: EASE.smooth });

    const headerSp = sp(0);
    const posSp = sp(20);
    const invSp = sp(120);
    const kitchenSp = sp(160);
    const textSp = sp(80);

    const orderItems = [
        { name: 'Butter Chicken', qty: 2, price: '₹640', status: 'Preparing' },
        { name: 'Garlic Naan', qty: 4, price: '₹200', status: 'Ready' },
        { name: 'Dal Makhani', qty: 1, price: '₹280', status: 'Preparing' },
    ];

    const inventory = [
        { name: 'Chicken', stock: 4.2, unit: 'kg', color: C.gold },
        { name: 'Tomatoes', stock: 3.1, unit: 'kg', color: C.green },
        { name: 'Cream', stock: 1.8, unit: 'L', color: C.blue },
    ];

    const orderProgress = interpolate(frame, [60, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ opacity: fadeIn, fontFamily: FONTS.sans }}>
            <AbsoluteFill style={{ background: `linear-gradient(160deg, #071a26 0%, ${C.navy} 100%)` }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(46,125,91,0.05) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            <AbsoluteFill style={{ padding: '52px 80px' }}>
                <div style={{
                    opacity: headerSp, transform: `translateY(${interpolate(headerSp, [0, 1], [30, 0])}px)`,
                    marginBottom: 36,
                }}>
                    <p style={{ color: C.gold, fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 8px' }}>
                        Restaurant & Inventory
                    </p>
                    <h2 style={{ fontFamily: FONTS.serif, fontSize: 48, color: C.white, margin: 0, letterSpacing: -1 }}>
                        From tables to rooms — everything connected.
                    </h2>
                </div>

                <div style={{ display: 'flex', gap: 24 }}>
                    {/* POS panel */}
                    <div style={{
                        flex: 1.4,
                        borderRadius: 20, overflow: 'hidden',
                        background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(20px)',
                        opacity: posSp,
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: C.white, fontWeight: 600 }}>Table 4 — Active Order</span>
                            <span style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>● Live</span>
                        </div>
                        {orderItems.map((item, i) => {
                            const itemProg = Math.min(1, Math.max(0, (orderProgress - i * 0.2) / 0.4));
                            return (
                                <div key={item.name} style={{
                                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    opacity: itemProg, transform: `translateX(${interpolate(itemProg, [0, 1], [-20, 0])}px)`,
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: C.white, fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                                        <div style={{ color: C.muted, fontSize: 13 }}>Qty: {item.qty}</div>
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{item.price}</div>
                                    <div style={{
                                        padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                        color: item.status === 'Ready' ? C.green : C.gold,
                                        background: item.status === 'Ready' ? `${C.green}18` : `${C.gold}18`,
                                    }}>{item.status}</div>
                                </div>
                            );
                        })}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: C.muted }}>Total</span>
                            <span style={{ color: C.gold, fontWeight: 700, fontSize: 18 }}>₹1,120</span>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{
                            borderRadius: 20, padding: 24,
                            background: C.glass, border: '1px solid rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(20px)',
                            opacity: invSp, transform: `translateX(${interpolate(invSp, [0, 1], [30, 0])}px)`,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        }}>
                            <div style={{ color: C.white, fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
                                🧑‍🍳 Inventory (auto-updated)
                            </div>
                            {inventory.map((inv) => (
                                <div key={inv.name} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{inv.name}</span>
                                        <span style={{ color: inv.color, fontSize: 14, fontWeight: 600 }}>
                                            {(inv.stock * (1 - orderProgress * 0.15)).toFixed(1)} {inv.unit}
                                        </span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                        <div style={{
                                            height: '100%', borderRadius: 3,
                                            background: inv.color,
                                            width: `${(inv.stock * (1 - orderProgress * 0.15)) / inv.stock * 100}%`,
                                            boxShadow: `0 0 8px ${inv.color}66`,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderRadius: 20, padding: 24,
                            background: `${C.green}0a`, border: `1px solid ${C.green}22`,
                            opacity: kitchenSp, transform: `translateX(${interpolate(kitchenSp, [0, 1], [30, 0])}px)`,
                        }}>
                            <div style={{ color: C.green, fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
                                🍳 Kitchen Display
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7 }}>
                                Order #T04-07 received<br />
                                Butter Chicken × 2 · Naan × 4<br />
                                <span style={{ color: C.gold }}>Est. ready: 12 min</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: 24, textAlign: 'center',
                    opacity: textSp, transform: `translateY(${interpolate(textSp, [0, 1], [16, 0])}px)`,
                }}>
                    <p style={{ color: C.muted, fontSize: 18 }}>
                        Orders sync with inventory. Kitchen stays informed. Nothing falls through.
                    </p>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
