"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use current origin for same-origin auth
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export const { signIn, signUp, signOut, useSession } = authClient;
