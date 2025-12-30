import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Ensure this path is correct
import { checkUsageLimits } from "@/lib/actions";
import { headers } from "next/headers";

// Prevent body size issues with large files if needed, standard fetch handles it but Next.js limits body size.
// By default it is 4MB. For PDFs it should be enough, but keep in mind.

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Limits
        const limitCheck = await checkUsageLimits(session.user.id, 'upload');
        if (!limitCheck.allowed) {
            return NextResponse.json({
                error: `Upload limit reached. You have used ${limitCheck.count}/${limitCheck.limit} uploads. Upgrade to Pro for more.`
            }, { status: 403 });
        }

        // Forward to Python Backend
        // We need to parse FormData and re-send it, or just stream the body?
        // Streaming body is better to avoid buffering.

        const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

        // We cannot blindly pass req.body if it's a stream that has been read?
        // But here we haven't read it yet.
        // However, fetch(req) might not work directly if headers are messed up.
        // We need to preserve Content-Type (multipart/form-data with boundary).

        const contentType = req.headers.get("content-type");

        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            headers: {
                // Do NOT set Content-Type manually for multipart, let the browser/fetch handle boundaries
                // But since we are proxying, we need to pass the incoming Content-Type header which contains boundary.
                "Content-Type": contentType || "",
            },
            body: req.body, // Stream the body
            // @ts-expect-error - duplex is required for streaming bodies in Node.js fetch
            duplex: 'half',
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Backend Error: ${response.status} ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
