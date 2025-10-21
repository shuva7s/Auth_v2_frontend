"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

const LogoutButton = ({ className }: { className?: string }) => {
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
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className={cn(className)}
					disabled={loading}
				>
					{loading ? "Signing out..." : "Sign out"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This action will log you out.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleLogout} disabled={loading}>
							{loading ? "Signing out..." : "Sign out"}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LogoutButton;
