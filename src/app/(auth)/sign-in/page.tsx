import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In - TaskFlow",
  description: "Sign in to your TaskFlow account",
};

export default function SignInPage() {
  return (
    <>
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary to-accent opacity-10 blur-xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-105">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Welcome back
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Sign in to continue to your tasks
        </p>
      </div>
      <Suspense fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
        </div>
      }>
        <SignInForm />
      </Suspense>
    </>
  );
}
