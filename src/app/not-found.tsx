import Link from "next/link";
import { Footer } from "@/components/ui/Footer";

export default function NotFound() {
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
          <div className="text-[120px] sm:text-[160px] font-black text-gradient leading-none mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Page not found
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Go Home
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-slate-700 bg-white hover:bg-slate-50 px-8 py-3.5 rounded-2xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
            >
              My Tasks
            </Link>
          </div>
        </div>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
