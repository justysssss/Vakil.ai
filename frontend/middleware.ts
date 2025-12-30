import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect routes starting with /upload, /profile, /api/proxy
    const protectedPaths = ["/upload", "/profile", "/api/proxy"];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected) {
        // Check for session cookie
        // Better Auth usually sets "better-auth.session_token" or similar.
        // We can check strictly or just check presence.
        // For now, let's check the standard cookie name.
        const sessionCookie = request.cookies.get("better-auth.session_token");

        if (!sessionCookie) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/upload/:path*",
        "/profile/:path*",
        "/api/proxy/:path*",
    ],
};
