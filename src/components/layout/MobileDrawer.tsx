"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { signOut, useSession } from "@/lib/auth";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "My Tasks",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
];

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Hamburger Button - Ultra Premium animated icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden relative p-2.5 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-linear-to-br hover:from-slate-50 hover:to-slate-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 group active:scale-95"
        aria-label="Open menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className="block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out-back origin-left group-hover:w-4.5" />
          <span className="block w-4.5 h-0.5 bg-current rounded-full transition-all duration-300 ease-out-back group-hover:w-5 group-hover:translate-x-0.5" />
          <span className="block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-out-back origin-right group-hover:w-4.5" />
        </div>
      </button>

      {/* Drawer - Ultra Premium */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setIsOpen}>
          {/* Backdrop - Enhanced with gradient */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-linear-to-br from-slate-900/40 via-slate-900/30 to-indigo-900/40 backdrop-blur-md" />
          </TransitionChild>

          {/* Drawer Panel - Premium styling */}
          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transform transition ease-out-back duration-400"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative w-80 max-w-[85vw] h-full flex flex-col bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                {/* Decorative gradient edge */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-accent to-primary opacity-80" />
                
                {/* Header - Refined */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-br from-white to-slate-50/50">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300">
                      <svg
                        className="w-5.5 h-5.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <span className="text-lg font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      TaskFlow
                    </span>
                  </Link>

                  {/* Close Button - Enhanced */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-linear-to-br hover:from-slate-100 hover:to-slate-50 transition-all duration-300 active:scale-90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Section - Premium card */}
                {session?.user && (
                  <div className="px-5 py-4 border-b border-slate-100">
                    <div className="relative flex items-center gap-3.5 p-4 rounded-2xl bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                          <span className="text-base font-bold text-white">
                            {session.user.email?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate mb-0.5">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation - Premium styling */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300
                          ${
                            isActive
                              ? "bg-linear-to-br from-primary-lighter to-accent-light text-primary shadow-md hover:shadow-lg"
                              : "text-slate-600 hover:bg-linear-to-br hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 active:scale-98"
                          }
                        `}
                        style={{ 
                          minHeight: '56px',
                          animationDelay: `${(index + 1) * 50}ms`
                        }}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-linear-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                        }`}>
                          {item.icon}
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50 animate-pulse-gentle" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer / Sign Out - Premium */}
                <div className="p-4 border-t border-slate-100 bg-linear-to-br from-slate-50/50 to-white mt-auto space-y-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-linear-to-br hover:from-rose-50 hover:to-rose-100/50 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-200 hover:shadow-sm active:scale-98"
                    style={{ minHeight: '52px' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                  
                  {/* Footer branding - refined */}
                  <p className="text-center text-xs text-slate-400 font-medium">
                    © 2026 TaskFlow
                  </p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
