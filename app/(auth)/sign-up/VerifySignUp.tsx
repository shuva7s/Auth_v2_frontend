"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	Card,
	CardContent,
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
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CircleCheckBigIcon, CircleXIcon } from "lucide-react";
import Link from "next/link";
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
			await api.post("/auth/verify-signup-otp", data);
			toast.success("Account created successfully, Please login to continue.");
			setSuccess(true);
			router.push("/sign-in");
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

	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader className="!flex gap-4 items-center">
				{success && (
					<div className="size-12 fl_center rounded-full bg-success/10">
						<CircleCheckBigIcon className="text-success" />
					</div>
				)}
				<div>
					<CardTitle className={`text-lg ${success && "text-success"}`}>
						{success ? "Account Created" : "Verify OTP"}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				{success ? (
					<div className="flex justify-end">
						<Button size={"sm"} asChild>
							<Link href="/sign-in">Login</Link>
						</Button>
					</div>
				) : (
					<>
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
											<FieldLabel htmlFor="verify-otp-field">
												Enter OTP
											</FieldLabel>
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
					</>
				)}
			</CardContent>
			{!success && (
				<CardFooter className="text-xs text-muted-foreground">
					Didn&apos;t receive an otp?
					<Button variant="link" disabled>
						Resend
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};

export default VerifySignUp;
