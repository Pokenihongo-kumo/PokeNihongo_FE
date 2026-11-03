import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@utils/CN";
import { Button } from "@ui/Button";
import EyeShowPassword from "@atoms/EyeShowPassword";
import React from "react";
import { Search } from "lucide-react";

const inputContainerVariants = cva(
    "relative flex items-center rounded-md border h-10 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
    {
        variants: {
            variant: {
                default: "bg-white/20",
                destructive: "bg-white/20 border-red-500 focus-within:ring-red-500 focus-within:border-red-500",
                original: "bg-white border-[#d1d5db] focus-within:ring-primary focus-within:border-primary",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

const textInputVariants = cva("flex-1 h-full bg-transparent px-5 text-sm outline-none", {
    variants: {
        variant: {
            default: "text-black placeholder:text-black/60",
            destructive: "text-black placeholder:text-black/60",
            original: "text-[#111827] placeholder:text-[#9ca3af]",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputContainerVariants> {
    label?: string;
    error?: string;
    containerClassName?: string;
    isPassword?: boolean;
    isSearch?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, containerClassName, className, variant, isPassword, id, isSearch, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const activeVariant = error ? "destructive" : variant;
        const inputId = id || React.useId();

        return (
            <div className={cn(containerClassName)}>
                {label && (
                    <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className={cn(inputContainerVariants({ variant: activeVariant }))}>
                    {isSearch && <Search className="h-4 w-4 mx-3 text-muted-foreground" />}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            textInputVariants({ variant: activeVariant }),
                            isPassword && "pr-12",
                            isSearch && "pl-0 pr-1",
                            className,
                        )}
                        type={isPassword ? (showPassword ? "text" : "password") : "text"}
                        {...props}
                    />

                    {isPassword && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-black hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <EyeShowPassword showPassword={showPassword} size={20} color="black" />
                        </Button>
                    )}
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    },
);

Input.displayName = "Input";

export { Input, inputContainerVariants as inputVariants };

export type { InputProps };
