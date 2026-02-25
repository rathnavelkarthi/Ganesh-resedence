"use client";

import React from "react";
import { LoginForm } from "../../../components/LoginForm";
import { motion } from "motion/react";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0A1F29] relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Deep ocean background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0E2A38] to-[#0A1F29] z-0" />

            {/* Subtle radial glow behind login card (right side) */}
            <div className="absolute right-0 top-1/2 -translate-y-[40%] w-[800px] h-[800px] bg-[#0c4a6e]/20 rounded-full blur-[140px] pointer-events-none z-0" />

            {/* Noise/grain texture overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* LEFT SIDE (BRAND PANEL) - 40% */}
            <div className="relative z-10 w-full md:w-[45%] lg:w-[40%] p-8 md:p-16 lg:p-24 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">

                <div className="flex-1 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1
                            className="text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-[1.15] mb-6 tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Ganesh Residency
                            <span className="block text-slate-400 font-normal text-2xl md:text-3xl lg:text-4xl mt-3 font-sans tracking-normal">Hotel Operations System</span>
                        </h1>

                        <p className="text-slate-400 text-[15px] md:text-base max-w-md leading-relaxed mb-12 font-light">
                            Powering seamless guest experiences, real-time bookings, and intelligent hotel management.
                        </p>

                        <ul className="space-y-5 text-slate-300">
                            {[
                                "Real-time Reservations",
                                "Multi-role Access Control",
                                "Revenue Analytics",
                                "Smart Room Management"
                            ].map((feature, i) => (
                                <motion.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                    <span className="text-[14px] font-medium tracking-wide text-slate-200">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Footer for Left Side / Mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 md:mt-0 opacity-40 text-[10px] text-white tracking-[0.2em] uppercase md:hidden xl:block text-left"
                >
                    © 2026 Ganesh Residency<br />
                    Secure Hotel CRM System
                </motion.div>
            </div>

            {/* RIGHT SIDE (LOGIN PANEL) - 60% */}
            <div className="relative z-10 w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 sm:p-12 lg:p-24 min-h-[600px] md:min-h-0">
                <LoginForm />

                {/* Minimal Footer for Right Side Desktop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-100 transition-opacity duration-300 text-[10px] text-white tracking-[0.2em] uppercase hidden md:block xl:hidden text-center"
                >
                    © 2026 Ganesh Residency<br />
                    Secure Hotel CRM System
                </motion.div>
            </div>
        </div>
    );
}
