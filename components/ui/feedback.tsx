import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const feedbackVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current has-[>svg]:[&>svg]:scale-125",
	{
		variants: {
			variant: {
				unavailable: "bg-accent text-card-foreground text-muted-foreground",
				destructive:
					"text-destructive border-destructive/20 bg-destructive/10 [&>svg]:text-current *:data-[slot=feedback-description]:text-destructive/90",
				success:
					"text-success bg-success/10 border-success/20 [&>svg]:text-current *:data-[slot=feedback-description]:text-success/90",
				warning:
					"text-warning bg-warning/10 border-warning/20 [&>svg]:text-current *:data-[slot=feedback-description]:text-warning/90",
				info: "text-info bg-info/10 border-info/20 [&>svg]:text-current *:data-[slot=feedback-description]:text-info/90"
			}
		},
		defaultVariants: {
			variant: "info"
		}
	}
);

function Feedback({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof feedbackVariants>) {
	return (
		<div
			data-slot="feedback"
			role="feedback"
			className={cn(feedbackVariants({ variant }), className)}
			{...props}
		/>
	);
}

function FeedbackTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="feedback-title"
			className={cn("col-start-2 line-clamp-1 min-h-4 font-medium", className)}
			{...props}
		/>
	);
}

function FeedbackDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="feedback-description"
			className={cn(
				"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
				className
			)}
			{...props}
		/>
	);
}

export { Feedback, FeedbackTitle, FeedbackDescription };
