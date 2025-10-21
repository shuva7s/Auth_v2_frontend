"use client";
import { useEffect, useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	CircleXIcon,
	Eye,
	EyeClosed,
	Loader2,
	LockIcon,
	ShieldEllipsis,
	ShieldX
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Feedback, FeedbackTitle } from "@/components/ui/feedback";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
import { Button } from "@/components/ui/button";

const InvalidToken = ({ message }: { message?: string }) => (
	<Card className="w-full max-w-sm shadow-lg">
		<CardHeader>
			<CardTitle className="text-lg text-destructive">Invalid Token</CardTitle>
			<CardDescription className="text-base">
				{message ?? "You don't have a valid token to reset your password"}
			</CardDescription>
			<CardAction>
				<ShieldX className="text-destructive" />
			</CardAction>
		</CardHeader>
	</Card>
);

const ResetPasswordSchema = z
	.object({
		new_password: z.string().min(8, "Password must be at least 8 characters"),
		confirm_new_password: z
			.string()
			.min(8, "Password must be at least 8 characters")
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: "Passwords do not match",
		path: ["confirm_new_password"]
	});

const ResetPassword = () => {
	const [token, setToken] = useState<string | null>(null);
	const [isValid, setIsValid] = useState(false);
	const [validating, setValidating] = useState(true);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const t = params.get("token");
		setToken(t);

		if (!t) {
			setError("No token provided");
			setValidating(false);
			return;
		}

		(async () => {
			try {
				await api.post("/auth/validate-reset-password-token", { token: t });
				setIsValid(true);
			} catch (err) {
				if (err instanceof AxiosError)
					setError(err.response?.data.message || err.message);
				else if (err instanceof Error) setError(err.message);
				else setError("Invalid token");
			} finally {
				setValidating(false);
			}
		})();
	}, []);

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			new_password: "",
			confirm_new_password: ""
		}
	});

	async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
		setError("");
		setLoading(true);
		try {
			const res = await api.post("/auth/reset-password", { token, ...values });
			form.reset();
			toast.success(res.data.message);
			window.location.replace("/");
		} catch (err) {
			if (err instanceof AxiosError)
				setError(err.response?.data.message || err.message);
			else if (err instanceof Error) setError(err.message);
			else setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	// Loading UI
	if (validating)
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<Loader2 className="animate-spin size-8 text-muted-foreground" />
			</div>
		);

	// Invalid token UI
	if (!isValid)
		return <InvalidToken message={error || "Token validation failed"} />;

	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader className="gap-y-0.5">
				<CardTitle className="text-lg">Reset Password</CardTitle>
				<CardDescription className="text-base">
					Enter your new password and confirm it
				</CardDescription>
				<CardAction>
					{loading ? (
						<Loader2 className="text-muted-foreground size-7 opacity-50 animate-spin" />
					) : (
						<ShieldEllipsis className="text-muted-foreground size-7 opacity-50" />
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
				<form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="new_password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="new-password">Password</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											type={showNewPassword ? "text" : "password"}
											id="new-password"
											placeholder="Enter new password"
											aria-invalid={fieldState.invalid}
											disabled={loading}
										/>
										<InputGroupAddon align="inline-start">
											<LockIcon />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											<Button
												disabled={loading}
												type="button"
												size="icon-sm"
												variant="ghost"
												className="text-muted-foreground"
												onClick={() => setShowNewPassword((show) => !show)}
											>
												<span className="sr-only">Show / Hide Password</span>
												{showNewPassword ? <EyeClosed /> : <Eye />}
											</Button>
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="confirm_new_password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="confirm-new-password">
										Confirm Password
									</FieldLabel>
									<InputGroup inputSize="lg">
										<InputGroupInput
											{...field}
											type={showConfirmPassword ? "text" : "password"}
											id="confirm-new-password"
											placeholder="Confirm new password"
											aria-invalid={fieldState.invalid}
											disabled={loading}
										/>
										<InputGroupAddon align="inline-start">
											<LockIcon />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											<Button
												disabled={loading}
												type="button"
												size="icon-sm"
												variant="ghost"
												className="text-muted-foreground"
												onClick={() => setShowConfirmPassword((show) => !show)}
											>
												<span className="sr-only">Show / Hide Password</span>
												{showConfirmPassword ? <EyeClosed /> : <Eye />}
											</Button>
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
			</CardContent>
			<CardFooter>
				<Button
					form="reset-password-form"
					type="submit"
					disabled={loading}
					size={"lg"}
					className="w-full rounded-full col-span-2"
				>
					{loading ? "Resetting..." : "Reset Password"}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ResetPassword;
