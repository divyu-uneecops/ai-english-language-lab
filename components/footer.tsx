"use client";

import Link from "next/link";
import {
  BookOpen,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Zap,
  ArrowUp,
  Facebook,
  Youtube,
  Instagram,
  Phone,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6D25 0%, #FF8A50 50%, #FF6D25 100%)' }}>
      {/* Floating background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 109, 37, 0.3)' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                English Lab
              </span>
            </div>
            <p className="text-white/90 leading-relaxed mb-6 text-sm">
              AI-Powered Learning Experience for English Language Development
            </p>
          </div>

          {/* Learning Modules */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Learning Modules
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/reading"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Reading Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/speaking"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Speaking Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/writing"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Writing Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Progress
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-white rounded-full group-hover:scale-150 transition-transform duration-300" />
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Contact Us
            </h4>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="#"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </Link>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Phone className="h-4 w-4" />
                <span>Mon-Sat: 12:30-20:30</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Phone className="h-4 w-4" />
                <span>+918059490098</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-white/80 text-sm">
            <span>Privacy Policy | Children's Privacy Policy</span>
            <span className="hidden sm:inline">|</span>
            <span>email: info@englishlabai.com</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">© {new Date().getFullYear()} English Lab</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-white group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
