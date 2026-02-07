"use client";

import Link from "next/link";

interface FooterProps {
  variant?: "default" | "minimal" | "dashboard";
}

export function Footer({ variant = "default" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Dashboard variant - refined minimal
  if (variant === "dashboard") {
    return (
      <footer className="relative z-10 py-6 px-4 border-t border-slate-100 bg-linear-to-br from-slate-50/50 to-white mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 font-medium">
              © {currentYear} TaskFlow • Crafted with care
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <button className="hover:text-slate-600 transition-colors duration-200">
                Privacy
              </button>
              <span>•</span>
              <button className="hover:text-slate-600 transition-colors duration-200">
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Minimal variant - for auth pages with premium touch
  if (variant === "minimal") {
    return (
      <footer className="relative z-10 py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
            <Link 
              href="/" 
              className="font-medium hover:text-slate-700 transition-all duration-200 hover:scale-105"
            >
              ← Back to Home
            </Link>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium">© {currentYear} TaskFlow</span>
            <span className="hidden sm:inline">•</span>
            <span>Productivity Simplified</span>
          </div>
        </div>
      </footer>
    );
  }

  // Default variant - for homepage (ultra premium)
  return (
    <footer className="relative z-10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand - Enhanced */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300">
                  <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white">TaskFlow</span>
            </Link>
            <p className="text-slate-400 max-w-xs leading-relaxed text-[15px]">
              A beautiful, distraction-free task manager that helps you focus on what matters most.
            </p>
            
            {/* Social Links - Enhanced */}
            <div className="flex items-center gap-2.5 mt-8">
              {["twitter", "github", "linkedin"].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-linear-to-br hover:from-primary/20 hover:to-accent/20 border border-slate-700 hover:border-primary/30 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                  aria-label={`Follow us on ${social}`}
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    {social === "twitter" && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                    {social === "github" && <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />}
                    {social === "linkedin" && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links - Enhanced */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Product</h4>
            <ul className="space-y-3.5">
              <li>
                <Link 
                  href="/sign-up" 
                  className="text-[15px] text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-0.5 inline-block"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link 
                  href="/sign-in" 
                  className="text-[15px] text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-0.5 inline-block"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <span className="text-[15px] text-slate-600">Pricing</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Legal</h4>
            <ul className="space-y-3.5">
              <li>
                <button className="text-[15px] text-slate-600 hover:text-slate-400 transition-colors duration-200">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-[15px] text-slate-600 hover:text-slate-400 transition-colors duration-200">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom - Enhanced */}
        <div className="mt-16 pt-8 border-t border-slate-800/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 font-medium">
              © {currentYear} TaskFlow. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-primary to-accent animate-pulse-gentle" />
              <p className="text-sm text-slate-500">
                Built For Productivity Enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
