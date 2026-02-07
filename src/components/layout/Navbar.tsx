"use client";

import Link from "next/link";
import { signOut } from "@/lib/auth";

interface NavbarProps {
  userEmail?: string;
}

export function Navbar({ userEmail }: NavbarProps) {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <svg
            className="w-7 h-7 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span className="hidden sm:inline">TaskFlow</span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-gray-600 hidden md:block">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
