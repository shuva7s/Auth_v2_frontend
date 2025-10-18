import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const sessionToken = request.cookies.get("session_token");
	const { pathname } = request.nextUrl;

	const publicRoutes = ["/"];
	const authRoutes = ["/sign-in", "/sign-up"];

	const isPublicRoute = publicRoutes.includes(pathname);
	const isAuthRoute = authRoutes.includes(pathname);

	// 1. Public routes - always accessible
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// 2. Auth routes
	if (isAuthRoute) {
		// If already logged in, redirect away from auth pages
		if (sessionToken) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		// If not logged in, allow access to auth pages
		return NextResponse.next();
	}

	// 3. Protected routes - require authentication
	if (!sessionToken) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("redirect", pathname); // Save intended page
		return NextResponse.redirect(signInUrl);
	}

	// 4. User is authenticated, allow access
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
