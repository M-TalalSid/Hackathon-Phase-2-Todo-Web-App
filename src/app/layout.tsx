import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { ToastProvider } from "@/lib/contexts/ToastContext";
import { Toast } from "@/components/ui/Toast";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TaskFlow - Manage Your Tasks Efficiently",
  description:
    "A modern, secure task management application to help you stay organized and productive.",
  keywords: ["todo", "tasks", "productivity", "task management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ToastProvider>
            {children}
            <Toast />
            <FloatingChatWidget />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

