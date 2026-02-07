/**
 * Chat API service for frontend.
 * 
 * Handles communication with the chat backend API.
 * Updated to call backend directly like tasks API.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  createdAt: Date;
}

export interface ToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export interface ChatResponse {
  conversationId: number;
  response: string;
  toolCalls: ToolCall[];
}

export interface ChatError {
  error: string;
  message: string;
  retry: boolean;
}

// Backend URL - same as api.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Get the session token from Better Auth.
 * Fetches from /api/auth/get-session endpoint.
 */
async function getSessionToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/get-session", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      // Better Auth session structure: { session: { token, id, ... }, user: { id, ... } }
      return data?.session?.token || data?.session?.id || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Send a chat message to the backend.
 * 
 * @param userId - The authenticated user's ID
 * @param message - The message content
 * @param conversationId - Optional existing conversation ID
 * @param _token - JWT authentication token (deprecated - now fetched internally)
 * @param model - Optional model selection
 * @returns ChatResponse with assistant reply and tool calls
 * @throws Error with user-friendly message on failure
 */
export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId: number | null,
  _token: string, // Kept for backward compatibility but not used
  model?: string
): Promise<ChatResponse> {
  // Call backend directly like tasks API does
  const url = `${BACKEND_URL}/api/${userId}/chat`;
  
  const body: Record<string, unknown> = { message };
  if (conversationId !== null) {
    body.conversation_id = conversationId;
  }
  
  // Log model selection
  if (model) {
    console.log(`[Chat] Model selected: ${model}`);
  }
  
  try {
    // Get fresh token from session
    const sessionToken = await getSessionToken();
    
    if (!sessionToken) {
      throw new ChatApiError(
        "Please sign in to continue.",
        401,
        false
      );
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorData = data as { detail?: ChatError | string | { message?: string } };
      
      // Handle structured error response
      if (typeof errorData.detail === "object" && errorData.detail !== null) {
        const chatError = errorData.detail as ChatError;
        throw new ChatApiError(
          chatError.message || "An error occurred",
          response.status,
          chatError.retry ?? response.status >= 500
        );
      }
      
      // Handle string error
      throw new ChatApiError(
        typeof errorData.detail === "string" 
          ? errorData.detail 
          : getDefaultErrorMessage(response.status),
        response.status,
        response.status >= 500
      );
    }
    
    // Transform snake_case to camelCase
    return {
      conversationId: data.conversation_id,
      response: data.response,
      toolCalls: (data.tool_calls || []).map((tc: { tool_name: string; arguments: Record<string, unknown>; result?: Record<string, unknown> }) => ({
        toolName: tc.tool_name,
        arguments: tc.arguments,
        result: tc.result,
      })),
    };
  } catch (error) {
    if (error instanceof ChatApiError) {
      throw error;
    }
    
    // Network error
    throw new ChatApiError(
      "Unable to connect. Please check your internet connection.",
      0,
      true
    );
  }
}

/**
 * Custom error class for chat API errors.
 */
export class ChatApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly canRetry: boolean
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

/**
 * Get default error message for HTTP status codes.
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid message. Please try again.";
    case 401:
      return "Please sign in to continue.";
    case 403:
      return "You don't have access to this conversation.";
    case 404:
      return "Conversation not found.";
    case 504:
      return "The assistant is taking too long. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/**
 * Generate a unique message ID.
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
