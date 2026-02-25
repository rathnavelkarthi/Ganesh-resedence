"use client";

import React from "react";
import { motion } from "motion/react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function LoginForm() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#0F172A]/40 sm:bg-[#0F172A]/60 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden ring-1 ring-white/10"
        >
            {/* Subtle top highlight to simulate glass edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            <div className="text-center mb-10">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-[24px] font-semibold text-white tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Welcome Back
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-slate-400 mt-2 text-sm font-normal tracking-wide"
                >
                    Sign in to access your dashboard.
                </motion.p>
            </div>

            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <Input label="Email Address" type="email" id="email" required />

                <div>
                    <Input label="Password" type="password" id="password" required />
                    <div className="flex justify-start mt-3 px-1">
                        <a href="#" className="text-[13px] text-slate-400 hover:text-white transition-colors duration-200">
                            Forgot Password?
                        </a>
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit">
                        Sign In to Dashboard
                    </Button>
                </div>
            </motion.form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-10 text-center border-t border-white/5 pt-6"
            >
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-[0.2em] font-medium">
                    Role-based access enabled
                </p>
                <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest opacity-80">
                    Admin • Manager • Reception • Housekeeping • Accounts
                </p>
            </motion.div>
        </motion.div>
    );
}
