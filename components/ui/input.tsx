import * as React from "react";
import { cn } from "@/lib/utils";

type InputSize = "sm" | "default" | "lg" | "xl";

interface InputProps extends React.ComponentProps<"input"> {
	inputSize?: InputSize;
}

function Input({
	className,
	type,
	inputSize = "default",
	...props
}: InputProps) {
	const sizeClasses = {
		sm: "h-8 px-2 rounded-md text-sm",
		default: "h-9 px-3 text-base",
		lg: "h-10 px-4 rounded-md text-lg",
		xl: "h-11 px-4 rounded-md text-lg"
	}[inputSize];

	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1.5px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				sizeClasses,
				className
			)}
			{...props}
		/>
	);
}

export { Input };
