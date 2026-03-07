import * as React from "react"
import { cn } from "../../lib/utils"

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'

const variantClasses: Record<BadgeVariant, string> = {
    default: 'border-transparent bg-[#0E2A38] text-white shadow',
    secondary: 'border-transparent bg-gray-100 text-gray-800',
    destructive: 'border-transparent bg-red-100 text-red-700',
    outline: 'text-gray-700 border-gray-200',
    success: 'border-transparent bg-emerald-100 text-emerald-700',
    warning: 'border-transparent bg-amber-100 text-amber-700',
}

interface BadgeProps {
    variant?: BadgeVariant
    className?: string
    children?: React.ReactNode
    [key: string]: any
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export { Badge }
