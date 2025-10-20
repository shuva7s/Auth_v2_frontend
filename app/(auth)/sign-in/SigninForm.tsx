"use client";
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
import { Feedback, FeedbackTitle } from "@/components/ui/feedback";
import { CircleXIcon, LockIcon, MailIcon, ShieldEllipsis } from "lucide-react";
import { useRouter } from "next/navigation";

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "@/components/ui/input-group";
import Link from "next/link";

const SigninFormSchema = z.object({
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters")
});

const SigninForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof SigninFormSchema>>({
		resolver: zodResolver(SigninFormSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
		setError("");
		setLoading(true);
		try {
			await api.post("/auth/sign-in", values);
			toast.success("Logged in successfully");
			setSuccess(true);
			router.replace("/");
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
				<CardTitle className="text-lg">Sign In</CardTitle>
				<CardDescription className="text-base">
					Sign in to your account
				</CardDescription>
				<CardAction>
					<ShieldEllipsis className="text-muted-foreground size-7 opacity-50" />
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-5">
				{error && (
					<Feedback variant={"destructive"}>
						<CircleXIcon />
						<FeedbackTitle>{error}</FeedbackTitle>
					</Feedback>
				)}
				<form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="signin-email">Email</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											id="signin-email"
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
									<FieldLabel htmlFor="signin-password">Password</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											type="password"
											id="signin-password"
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
					form="signin-form"
					type="submit"
					disabled={loading || success}
					size={"lg"}
					className="w-full rounded-full"
				>
					{loading ? "Signing in..." : success ? "Signed in" : "Sign in"}
				</Button>
			</CardContent>
			<CardFooter className="text-xs text-muted-foreground justify-center flex-wrap">
				Don&apos;t have an account?
				<Button
					size={"xs"}
					disabled={loading || success}
					asChild
					variant={"link"}
				>
					<Link
						className={`${
							(loading || success) && "pointer-events-none opacity-50"
						}`}
						href="/sign-up"
					>
						Sign Up
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default SigninForm;
