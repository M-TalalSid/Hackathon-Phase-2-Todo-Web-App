import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Create Account - TaskFlow",
  description: "Join TaskFlow and start managing your tasks",
};

export default function SignUpPage() {
  return (
    <>
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent to-pink-500 opacity-10 blur-xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-accent to-pink-500 flex items-center justify-center shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all duration-500 hover:scale-105">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Create your account
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Start managing your tasks today
        </p>
      </div>
      <Suspense fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
          <div className="h-14 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl" />
        </div>
      }>
        <SignUpForm />
      </Suspense>
    </>
  );
}
