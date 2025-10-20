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
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { Feedback, FeedbackTitle } from "@/components/ui/feedback";
import {
	CircleCheck,
	CircleXIcon,
	Loader2,
	MailIcon,
	ShieldHalf
} from "lucide-react";

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

const ForgotPasswordSchema = z.object({
	email: z.email("Invalid email")
});

const ForgotPassword = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);

	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: ""
		}
	});

	async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
		setError("");
		setLoading(true);
		try {
			const res: AxiosResponse = await api.post(
				"/auth/forgot-password",
				values
			);
			toast.success(res.data.message);
			setSuccess(true);
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
				<CardTitle className="text-lg">Forgot Password</CardTitle>
				<CardDescription className="text-base">
					You will receive an email with a link to reset your password
				</CardDescription>
				<CardAction>
					{loading ? (
						<Loader2 className="text-muted-foreground size-7 opacity-50 animate-spin" />
					) : (
						<ShieldHalf className="text-muted-foreground size-7 opacity-50" />
					)}
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-5">
				{error && (
					<Feedback variant={"destructive"}>
						<CircleXIcon />
						<FeedbackTitle>{error}</FeedbackTitle>
					</Feedback>
				)}
				{success && (
					<Feedback variant={"success"}>
						<CircleCheck />
						<FeedbackTitle>
							Password reset link sent to your email
						</FeedbackTitle>
					</Feedback>
				)}

				{!success && (
					<form
						id="forgot-password-form"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FieldGroup>
							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="forgot-password-email">
											Email
										</FieldLabel>
										<InputGroup inputSize="lg">
											<InputGroupInput
												{...field}
												id="forgot-password-email"
												placeholder="john@example.com"
												aria-invalid={fieldState.invalid}
												autoComplete="off"
												disabled={loading || success}
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
						</FieldGroup>
					</form>
				)}

				{!success && (
					<Button
						form="forgot-password-form"
						type="submit"
						disabled={loading || success}
						size={"lg"}
						className="w-full rounded-full"
					>
						{loading ? "Sending link..." : "Send reset link"}
					</Button>
				)}
			</CardContent>
			<CardFooter className="text-xs text-muted-foreground">
				Didn&apos;t receive an link?
				<Button variant="link" disabled size="xs">
					Resend
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ForgotPassword;
