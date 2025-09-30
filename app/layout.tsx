import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI English Language Lab - Master English with AI-Powered Learning",
  description:
    "Comprehensive English learning platform with Reading, Speaking, Writing labs and AI-powered feedback. Improve your English skills with personalized lessons and instant evaluation.",
  generator: "v0.app",
  keywords:
    "English learning, AI tutor, writing evaluation, speaking practice, reading comprehension, language lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Navigation />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}
