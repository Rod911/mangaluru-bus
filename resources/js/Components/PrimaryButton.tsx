import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const PrimaryButton = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", disabled, children, ...props }, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            className={cn(
                `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${
                    disabled && "opacity-25"
                } `,
                className
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
});

export default PrimaryButton;
