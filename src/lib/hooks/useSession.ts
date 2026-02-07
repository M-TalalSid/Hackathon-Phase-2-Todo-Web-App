"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  user: User;
}

/**
 * Hook to get the current user session
 */
export function useSession() {
  return useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const session = await authClient.getSession();
      if (session.data?.user) {
        return {
          user: {
            id: session.data.user.id,
            email: session.data.user.email,
            name: session.data.user.name,
          },
        };
      }
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
