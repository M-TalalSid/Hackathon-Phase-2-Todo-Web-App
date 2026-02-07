"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900">TaskFlow</span>
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-rose-500/25">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            An unexpected error occurred. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={reset} size="lg">
              Try Again
            </Button>
            <Button variant="secondary" size="lg" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
