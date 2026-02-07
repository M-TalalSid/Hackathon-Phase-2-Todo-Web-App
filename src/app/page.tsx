"use client";

import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { useSession } from "@/lib/auth";

export default function Home() {
  const { data: session, isPending } = useSession();
  const isLoggedIn = !isPending && session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      {/* Header - Premium */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/35 transition-all duration-300">
                <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-sm font-bold text-white bg-linear-to-r from-primary to-accent hover:from-primary-hover hover:to-purple-600 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl transition-all hover:bg-white/70 duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-bold text-white bg-linear-to-r from-primary to-accent hover:from-primary-hover hover:to-purple-600 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/80 border border-indigo-100 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 animate-pulse-gentle"></span>
              <span className="text-sm font-semibold text-slate-700">Simple • Elegant • Powerful</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Manage your tasks
              <br />
              <span className="text-gradient">with clarity</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
              A beautiful, distraction-free task manager that helps you focus on what matters most.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Go to My Tasks
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Start for Free
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-slate-700 bg-white hover:bg-slate-50 px-8 py-4 rounded-2xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                  >
                    I have an account
                  </Link>
                </>
              )}
            </div>

            {/* Trust */}
            {!isLoggedIn && (
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Setup in seconds</span>
                </div>
              </div>
            )}

            {isLoggedIn && (
              <div className="mt-10 text-sm text-slate-500">
                <span>Welcome back! You&apos;re signed in as </span>
                <span className="font-semibold text-slate-700">{session?.user?.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="relative z-10 py-20 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-slate-600 max-w-lg mx-auto">
                Simple, powerful tools to help you stay organized and productive.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: "from-amber-400 to-orange-500",
                  shadow: "shadow-amber-500/20",
                  title: "Lightning Fast",
                  description: "Built for speed. Add tasks instantly and stay in your flow without interruptions."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  color: "from-emerald-400 to-teal-500",
                  shadow: "shadow-emerald-500/20",
                  title: "Secure by Design",
                  description: "Your data is encrypted and protected with enterprise-grade security."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  color: "from-indigo-400 to-purple-500",
                  shadow: "shadow-indigo-500/20",
                  title: "Works Everywhere",
                  description: "Access your tasks from any device. Beautiful on desktop, tablet, and mobile."
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg ${feature.shadow} group-hover:scale-105 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {isLoggedIn ? "Continue where you left off" : "Ready to get started?"}
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-lg mx-auto">
              {isLoggedIn 
                ? "Your tasks are waiting for you. Jump back into productivity."
                : "Join thousands of productive people who manage their tasks with TaskFlow."
              }
            </p>
            <Link
              href={isLoggedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center justify-center gap-2 font-semibold text-indigo-600 bg-white hover:bg-indigo-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer variant="default" />
    </div>
  );
}
