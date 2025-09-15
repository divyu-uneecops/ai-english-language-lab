"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Zap,
  ArrowUp,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-blue-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-16">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-black gradient-text">
                English Lab
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-sm">
              Learn English with interactive AI-powered modules: Reading,
              Speaking, Writing, and more. Transform your language skills with
              cutting-edge technology.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </Link>
              <Link
                href="#"
                className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </Link>
              <Link
                href="#"
                className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </Link>
              <Link
                href="mailto:support@example.com"
                className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 gradient-text">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/reading"
                  className="text-slate-300 hover:text-indigo-400 transition-colors duration-300 group flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Reading Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/speaking"
                  className="text-slate-300 hover:text-purple-400 transition-colors duration-300 group flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Speaking Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/writing"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 group flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Writing Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-slate-300 hover:text-emerald-400 transition-colors duration-300 group flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {new Date().getFullYear()} English Lab. Built with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>and AI.</span>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="#"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-slate-300 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
