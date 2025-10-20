"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from "@/components/ui/input-otp";
import { useState } from "react";
import api from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CircleXIcon, Loader2 } from "lucide-react";
import { Feedback, FeedbackTitle } from "@/components/ui/feedback";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
} from "@/components/ui/field";

const FormSchema = z.object({
	otp: z.string().min(6, {
		message: "Your one-time password must be 6 characters."
	})
});

const SuccessCard = () => {
	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader>
				<CardTitle className="text-success">Success</CardTitle>
				<CardDescription>Account created successfully...!</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					disabled
					className="w-full gap-2"
					variant={"secondary"}
					size={"sm"}
				>
					<div className="inline-flex gap-2 items-center text-xs animate-pulse">
						<Loader2 className="animate-spin" />
						Redirecting...
					</div>
				</Button>
			</CardContent>
		</Card>
	);
};

const VerifySignUp = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			otp: ""
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setError("");
		setLoading(true);
		try {
			const res: AxiosResponse = await api.post(
				"/auth/verify-signup-otp",
				data
			);
			toast.success(res.data.message);
			setSuccess(true);
			const auto_sign_in_enabled = res.data.redirectPath === "/";
			if (auto_sign_in_enabled) {
				router.replace("/");
			} else {
				router.push(res.data.redirectPath);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			} else if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	}

	if (success) return <SuccessCard />;

	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader className="!flex gap-4 items-center">
				<CardTitle className="text-lg">Verify OTP</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				{error && (
					<Feedback variant={"destructive"}>
						<CircleXIcon />
						<FeedbackTitle>{error}</FeedbackTitle>
					</Feedback>
				)}
				<form id="verify-otp-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="otp"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="verify-otp-field">Enter OTP</FieldLabel>
									<FieldDescription>
										Enter the OTP sent to your email
									</FieldDescription>
									<InputOTP
										id="verify-otp-field"
										disabled={loading}
										maxLength={6}
										{...field}
									>
										<InputOTPGroup className="w-full">
											{Array.from({ length: 6 }).map((_, index) => (
												<InputOTPSlot
													key={"otp-slot" + index}
													index={index}
													className="flex-1 h-11"
													aria-invalid={!!form.formState.errors.otp}
												/>
											))}
										</InputOTPGroup>
									</InputOTP>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<Button
					form="verify-otp-form"
					type="submit"
					disabled={loading}
					size={"lg"}
					className="w-full rounded-full"
				>
					{loading ? "Submitting..." : "Submit"}
				</Button>
			</CardContent>

			<CardFooter className="text-xs text-muted-foreground">
				Didn&apos;t receive an otp?
				<Button variant="link" disabled>
					Resend
				</Button>
			</CardFooter>
		</Card>
	);
};

export default VerifySignUp;
