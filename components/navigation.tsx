"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, MessageCircle, TrendingUp, User, LogOut, PenTool, Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function Navigation() {
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {user && (
        <>
          <Link href="/reading" onClick={() => mobile && setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                mobile ? "w-full justify-start" : ""
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Reading Lab
            </Button>
          </Link>
          <Link href="/speaking" onClick={() => mobile && setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                mobile ? "w-full justify-start" : ""
              }`}
            >
              <Mic className="h-4 w-4" />
              Speaking Lab
            </Button>
          </Link>
          <Link href="/writing" onClick={() => mobile && setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                mobile ? "w-full justify-start" : ""
              }`}
            >
              <PenTool className="h-4 w-4" />
              Writing Lab
            </Button>
          </Link>
          <Link href="/chat" onClick={() => mobile && setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                mobile ? "w-full justify-start" : ""
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              AI Assistant
            </Button>
          </Link>
          <Link href="/progress" onClick={() => mobile && setMobileMenuOpen(false)}>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors ${
                mobile ? "w-full justify-start" : ""
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Progress
            </Button>
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav className="glass-effect border-b border-border/50 sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:scale-110" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black gradient-text">English Lab</h1>
              <span className="text-xs text-muted-foreground hidden sm:block">AI-Powered Learning</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLinks />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 ml-4 modern-shadow hover:scale-105 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden xl:inline font-medium">{user?.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect">
                  <DropdownMenuItem onClick={logout} className="hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login" className="ml-4">
                <Button className="modern-shadow hover:scale-105 transition-all">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {!user && (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="modern-shadow">
                  Sign In
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 modern-shadow hover:scale-105 transition-all"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 glass-effect animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1 p-4">
              <NavLinks mobile />

              {user && (
                <div className="pt-4 mt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
