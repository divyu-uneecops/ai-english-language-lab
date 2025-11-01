"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut, Menu, X, Zap, Search } from "lucide-react";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

export function Navigation() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-4 group flex-shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FF7B3A] to-[#FF6B2A] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
                <BookOpen className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-5 md:h-5 bg-gradient-to-r from-[#FFB347] to-[#FF7B3A] rounded-full flex items-center justify-center">
                <Zap className="h-1.5 w-1.5 md:h-2.5 md:w-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300 truncate">
                English Lab
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-[#FF7B3A] dark:group-hover:text-[#FFB347] transition-colors duration-300 truncate">
                AI-Powered Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 ml-4 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#FF7B3A] dark:hover:text-[#FFB347] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF7B3A] to-[#FF6B2A] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden xl:inline font-semibold">
                      {user?.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl p-2 min-w-[200px]"
                >
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login" className="ml-4">
                <Button className="px-8 py-3 font-bold bg-gradient-to-r from-[#FF7B3A] to-[#FF6B2A] hover:from-[#FF6B2A] hover:to-[#FF5B1A] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-1 md:gap-3 flex-shrink-0">
            {!user && (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-semibold text-sm hover:bg-orange-50 hover:text-[#FF7B3A] transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:p-3 rounded-lg md:rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#FF7B3A] dark:hover:text-[#FFB347] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-2 p-4 md:p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {user && (
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-orange-50 dark:bg-slate-800 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-[#FF7B3A] to-[#FF6B2A] flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Premium User
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group min-h-[48px]"
                  >
                    <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
