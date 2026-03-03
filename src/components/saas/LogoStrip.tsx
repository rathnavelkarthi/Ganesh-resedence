import { useRef, useEffect } from 'react';

const brands = [
    'The Grand Palace',
    'Lakshmi Heritage',
    'Sunrise Residency',
    'Royal Comfort Inn',
    'Nandini Stays',
    'Blue Lagoon Resort',
    'Mahal Suites',
    'Krishnapriya Homes',
    'Viceroy Court',
    'The Palm Grove',
    'Sahyadri Retreat',
    'Golden Tulip Lodge',
];

export default function LogoStrip() {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animFrameId: number;
        let pos = 0;
        const speed = 0.4;

        const tick = () => {
            pos -= speed;
            const half = track.scrollWidth / 2;
            if (Math.abs(pos) >= half) pos = 0;
            track.style.transform = `translateX(${pos}px)`;
            animFrameId = requestAnimationFrame(tick);
        };

        animFrameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animFrameId);
    }, []);

    const doubled = [...brands, ...brands];

    return (
        <section className="py-8 border-y border-foreground/5 bg-white overflow-hidden">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/30 mb-5">
                Trusted by 500+ properties across India
            </p>

            <div className="relative">
                {/* left + right fade masks */}
                <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div ref={trackRef} className="flex gap-10 whitespace-nowrap will-change-transform">
                    {doubled.map((name, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 shrink-0 px-5 py-2 rounded-full border border-foreground/8 text-[11px] font-bold uppercase tracking-widest text-foreground/30"
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: '#C9A646', opacity: 0.6 }}
                            />
                            {name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
