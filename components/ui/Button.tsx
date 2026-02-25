"use client";

import React from "react";
import { motion } from "motion/react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full overflow-hidden bg-[#0c4a6e] hover:bg-[#075985] text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-300 shadow-[0_4px_20px_rgba(12,74,110,0.3)] hover:shadow-[0_4px_25px_rgba(12,74,110,0.5)] ${className}`}
                {...(props as any)}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-lg" />
                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";
