import * as React from "react"
import { cn } from "../../lib/utils"

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-[#0E2A38] text-white shadow hover:bg-[#0a1f29]',
    destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
    outline: 'border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900',
    secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    link: 'text-[#0E2A38] underline-offset-4 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50',
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
