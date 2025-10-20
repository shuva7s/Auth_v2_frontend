import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const sessionToken = request.cookies.get("session_token");
	const { pathname } = request.nextUrl;

	const publicRoutes = ["/", "/forgot-password", "/reset-password"];
	const authRoutes = ["/sign-in", "/sign-up"];

	const isPublicRoute = publicRoutes.includes(pathname);
	const isAuthRoute = authRoutes.includes(pathname);

	// 1. Public routes - always accessible
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// 2. Auth routes
	if (isAuthRoute) {
		// If already logged in, verify session is valid
		if (sessionToken) {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/get-session-data`,
					{
						headers: {
							Cookie: `session_token=${sessionToken.value}`
						}
					}
				);

				// If session is valid, redirect away from auth pages
				if (response.ok) {
					return NextResponse.redirect(new URL("/", request.url));
				}

				// If session is invalid, clear cookie and allow access to auth pages
				const res = NextResponse.next();
				res.cookies.delete("session_token");
				return res;
			} catch (error) {
				// On error, clear cookie and allow access to auth pages
				const res = NextResponse.next();
				res.cookies.delete("session_token");
				return res;
			}
		}
		// If not logged in, allow access to auth pages
		return NextResponse.next();
	}

	// 3. Protected routes - require authentication
	if (!sessionToken) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(signInUrl);
	}

	// 4. Verify session is valid for protected routes
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/get-session-data`,
			{
				headers: {
					Cookie: `session_token=${sessionToken.value}`
				}
			}
		);

		// If session is invalid, clear cookie and redirect to sign in
		if (!response.ok) {
			const signInUrl = new URL("/sign-in", request.url);
			signInUrl.searchParams.set("redirect", pathname);
			const res = NextResponse.redirect(signInUrl);
			res.cookies.delete("session_token");
			return res;
		}
	} catch (error) {
		// On error, clear cookie and redirect to sign in
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect", pathname);
		const res = NextResponse.redirect(signInUrl);
		res.cookies.delete("session_token");
		return res;
	}

	// User is authenticated with valid session, allow access
	return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
	]
};
