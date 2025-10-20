"use client";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import api from "@/lib/axios";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Feedback, FeedbackTitle } from "@/components/ui/feedback";
import {
	CircleXIcon,
	LockIcon,
	MailIcon,
	ShieldPlus,
	UserIcon
} from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "@/components/ui/input-group";

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from "@/components/ui/field";

const SignupFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters")
});

const SignupForm = ({
	setPendingCookie
}: {
	setPendingCookie: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const form = useForm<z.infer<typeof SignupFormSchema>>({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	});

	async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
		setError("");
		setLoading(true);
		try {
			await api.post("/auth/sign-up", values);
			const cookieVal = Cookies.get("signup_pending");
			if (cookieVal) {
				setPendingCookie(cookieVal);
			}
			toast.success("Otp sent to your email");
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message || error.message);
			} else if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader className="gap-y-0.5">
				<CardTitle className="text-lg">Sign Up</CardTitle>
				<CardDescription className="text-base">
					Create an account
				</CardDescription>
				<CardAction>
					<ShieldPlus className="text-muted-foreground size-7 opacity-50" />
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-5">
				{error && (
					<Feedback variant={"destructive"}>
						<CircleXIcon />
						<FeedbackTitle>{error}</FeedbackTitle>
					</Feedback>
				)}
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-name">Name</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											id="signup-name"
											placeholder="John Doe"
											aria-invalid={fieldState.invalid}
											autoComplete="off"
										/>
										<InputGroupAddon align="inline-start">
											<UserIcon />
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-email">Email</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											id="signup-email"
											placeholder="john@example.com"
											aria-invalid={fieldState.invalid}
											autoComplete="off"
										/>
										<InputGroupAddon align="inline-start">
											<MailIcon />
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signup-password">Password</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											type="password"
											id="signup-password"
											placeholder="Enter your password"
											aria-invalid={fieldState.invalid}
										/>
										<InputGroupAddon align="inline-start">
											<LockIcon />
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<Button
					form="signup-form"
					type="submit"
					size={"lg"}
					disabled={loading}
					className="w-full rounded-full"
				>
					{loading ? "Signing up..." : "Sign Up"}
				</Button>
			</CardContent>
			<CardFooter className="text-xs text-muted-foreground justify-center flex-wrap">
				Already have an account?
				<Button size={"xs"} disabled={loading} asChild variant={"link"}>
					<Link href="/sign-in">Sign In</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default SignupForm;
