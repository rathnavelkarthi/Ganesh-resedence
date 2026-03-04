// HospitalityOS Video — Exact Website Brand Tokens
// Source: safestay.superbots.in

export const VIDEO = {
    fps: 30,
    width: 1920,
    height: 1080,
    // TransitionSeries: 8 transitions × 20 frames = 160 frames overlap
    // Effective playback = sum(durations) - 160 = 2800 - 160 = 2640 frames = 88s
    durationInFrames: 2640,
};

export const DURATIONS = {
    intro: 170,  //  ~5.7s
    problem: 260,  //  ~8.7s
    solution: 240,  //  ~8s
    dashboard: 440,  //  ~14.7s
    website: 320,  //  ~10.7s
    reservation: 320,  //  ~10.7s
    restaurant: 320,  //  ~10.7s
    analytics: 320,  //  ~10.7s
    hero: 410,  //  ~13.7s
    // Sum = 2800.  Effective = 2800 - 160 = 2640 = 88s ✓
};

// Exact brand colors from the website
export const C = {
    // From safestay.superbots.in
    cream: '#F2F0E9',   // page background
    navy: '#0C2B35',   // dark sections
    navyMid: '#0E3444',
    navyLight: '#16485C',
    gold: '#B8892A',   // CTA buttons
    goldLight: '#D4A93E',
    goldPale: '#E8C96A',

    // Semantic
    white: '#FFFFFF',
    offWhite: 'rgba(242,240,233,0.9)',
    text: '#1a3040',   // dark text on light bg
    textLight: '#4a6070',   // secondary text on light bg
    muted: 'rgba(242,240,233,0.55)',  // text on dark bg
    subtle: 'rgba(242,240,233,0.25)',

    // Status
    green: '#2E7D5B',
    blue: '#4DA3FF',
    orange: '#f97316',

    // Glass (for dark-bg cards)
    glass: 'rgba(12,43,53,0.75)',
    glassBorder: 'rgba(184,137,42,0.2)',
    glassSub: 'rgba(255,255,255,0.07)',

    // Light cards (cream bg)
    lightCard: '#FFFFFF',
    lightBorder: 'rgba(0,0,0,0.08)',
};

export const EASE = {
    smooth: { damping: 26, stiffness: 55, mass: 1 } as const,
    crisp: { damping: 22, stiffness: 80 } as const,
    pop: { damping: 14, stiffness: 100 } as const,
};
