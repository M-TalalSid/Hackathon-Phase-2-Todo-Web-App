/**
 * API Client
 * 
 * Centralized HTTP client with JWT attachment and error handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Get the current session token from Better Auth
 */
async function getSessionToken(): Promise<string | null> {
  // Better Auth stores session in cookies, handled automatically
  // For API calls, we need to get the token from the session
  try {
    // Better Auth uses /api/auth/get-session, not /api/auth/session
    const response = await fetch("/api/auth/get-session", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      // Better Auth session structure: { session: { token, id, ... }, user: { id, ... } }
      // The token we need is the session token for backend validation
      return data?.session?.token || data?.session?.id || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create headers with authentication
 */
async function createHeaders(includeAuth = true): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = await getSessionToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError = {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
    };

    try {
      const data = await response.json();
      if (data.detail) {
        if (typeof data.detail === "string") {
          errorData.message = data.detail;
        } else {
          errorData = {
            code: data.detail.code || "UNKNOWN_ERROR",
            message: data.detail.message || "An error occurred",
            details: data.detail.details,
          };
        }
      }
    } catch {
      // Response is not JSON
      errorData.message = response.statusText;
    }

    // Handle 401 - redirect to sign-in
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }

    throw new ApiClientError(
      response.status,
      errorData.code,
      errorData.message,
      errorData.details
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * API Client methods
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(path: string): Promise<T> {
    const headers = await createHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers,
      credentials: "include",
    });
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    const headers = await createHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(path: string, data?: unknown): Promise<T> {
    const headers = await createHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  async patch<T>(path: string, data?: unknown): Promise<T> {
    const headers = await createHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers,
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    const headers = await createHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });
    return handleResponse<T>(response);
  },
};
