import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUsageLimits } from "@/lib/actions";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Limits
        const limitCheck = await checkUsageLimits(session.user.id, 'chat');
        if (!limitCheck.allowed) {
            return NextResponse.json({
                error: `Monthly chat limit reached (${limitCheck.limit} messages). Upgrade to Pro for unlimited access.`
            }, { status: 403 });
        }

        const body = await req.json();
        const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

        const response = await fetch(`${backendUrl}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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
