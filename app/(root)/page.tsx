import { ModeToggle } from "@/components/mode-toggle";
import { cookies } from "next/headers";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/shared/LogoutButton";
const NotLoggedIn = () => (
	<main className="wrapper py-5 min-h-screen fl_center flex-col gap-4">
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader>
				<CardTitle className="text-lg">You are logged out</CardTitle>
				<CardDescription className="text-base">
					Sign In if you already have an account or Sign Up to create a new one.
				</CardDescription>
				<CardAction>
					<ModeToggle />
				</CardAction>
			</CardHeader>
			<CardFooter className="grid grid-cols-2 gap-2 border-t">
				<Button asChild variant="outline" className="rounded-full" size="lg">
					<Link href="/sign-up">Sign Up</Link>
				</Button>
				<Button asChild className="rounded-full" size="lg">
					<Link href="/sign-in">Sign In</Link>
				</Button>
			</CardFooter>
		</Card>
	</main>
);

export default async function Home() {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("session_token");

	if (!sessionToken) return <NotLoggedIn />;

	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/get-session-data`,
			{
				headers: { Cookie: `session_token=${sessionToken.value}` }
			}
		);

		const { user } = res.data;

		return (
			<main className="wrapper py-5 min-h-screen fl_center flex-col gap-4">
				<ModeToggle />
				<Card className="w-full max-w-sm">
					<CardHeader className="!flex gap-4 items-center">
						<Avatar className="size-12">
							<AvatarImage
								src={user.avatarUrl ?? "https://github.com/shadcn.png"}
							/>
							<AvatarFallback>{user.name[0]}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="flex items-center gap-2 flex-wrap">
								{user.name}
								<Badge>{user.role}</Badge>
							</CardTitle>
							<CardDescription className="mt-1">{user.email}</CardDescription>
						</div>
					</CardHeader>
					<CardFooter className="justify-end">
						<LogoutButton />
					</CardFooter>
				</Card>
			</main>
		);
	} catch {
		return <NotLoggedIn />;
	}
}
