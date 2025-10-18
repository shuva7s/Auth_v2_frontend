"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		setLoading(true);
		try {
			await api.post("/auth/sign-out");
			router.refresh();
		} catch (error) {
			let error_message = "Something went wrong";
			if (error instanceof AxiosError) {
				error_message = error.response?.data.message || error.message;
			} else if (error instanceof Error) {
				error_message = error.message;
			}
			toast.error(error_message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Button
			onClick={handleLogout}
			variant="secondary"
			className="w-full"
			disabled={loading}
		>
			{loading ? "Signing out..." : "Sign out"}
		</Button>
	);
};

export default LogoutButton;
