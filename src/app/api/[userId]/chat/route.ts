import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { headers, cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

/**
 * POST /api/[userId]/chat
 * 
 * Frontend API route that proxies chat requests to the backend.
 * All AI logic is handled by the backend - this is just a pass-through.
 * 
 * Phase 3 Compliant: No AI logic in frontend.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Authenticate user
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please log in to use the chat" },
        { status: 401 }
      );
    }

    // Verify user ID matches
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "Cannot access another user's chat" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { message, conversation_id, model } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Bad Request", message: "Message is required" },
        { status: 400 }
      );
    }

    // Log model selection if provided
    if (model) {
      console.log(`[Chat API] Model selected: ${model}`);
    }

    // Get authentication token for backend
    // The session object from Better Auth contains the token
    const sessionToken = session.session?.token || session.session?.id;
    
    if (!sessionToken) {
      console.error("[Chat API] No session token found in auth session");
      console.log("[Chat API] Session object keys:", Object.keys(session || {}));
      console.log("[Chat API] Session.session keys:", Object.keys(session?.session || {}));
      
      // Try fallback from cookies
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      console.log("[Chat API] Available cookies:", allCookies.map(c => c.name));
      
      // Try common Better Auth cookie names
      const betterAuthCookies = [
        "better-auth.session_token",
        "better-auth_session_token", 
        "betterauth.session_token",
        "__Secure-better-auth.session_token",
      ];
      
      let cookieToken: string | undefined;
      for (const cookieName of betterAuthCookies) {
        const cookie = cookieStore.get(cookieName);
        if (cookie?.value) {
          cookieToken = cookie.value;
          console.log(`[Chat API] Found token in cookie: ${cookieName}`);
          break;
        }
      }
      
      if (!cookieToken) {
        return NextResponse.json(
          { 
            error: "Authentication Required", 
            message: "Session token not found",
            response: "I couldn't authenticate with the backend. Please try logging out and back in."
          },
          { status: 401 }
        );
      }
    }

    const authToken = `Bearer ${sessionToken}`;
    console.log("[Chat API] Forwarding to backend with token prefix:", sessionToken?.substring(0, 8) + "...");

    // Call backend chat endpoint
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/${userId}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({
          message: message.trim(),
          conversation_id: conversation_id || null,
        }),
      }
    );

    // Handle backend errors
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("[Chat API] Backend error:", backendResponse.status, errorData);
      
      return NextResponse.json(
        {
          error: errorData.error || "Backend Error",
          message: errorData.detail?.message || errorData.detail || "Failed to process your request",
          response: errorData.detail?.message || errorData.detail || "I'm sorry, I encountered an error. Please try again.",
        },
        { status: backendResponse.status }
      );
    }

    // Return backend response
    const data = await backendResponse.json();
    
    return NextResponse.json({
      response: data.response,
      conversation_id: data.conversation_id,
      tool_calls: data.tool_calls || [],
    });

  } catch (error: unknown) {
    console.error("[Chat API] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Handle specific error types
    if (errorMessage.includes("fetch failed") || errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        {
          error: "Service Unavailable",
          message: "Unable to connect to the chat service",
          response: "I'm sorry, the chat service is currently unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        response: "I'm sorry, something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
