import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">English Lab</h1>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">Reset password</h2>
          <p className="text-muted-foreground mt-2">Enter your email to receive reset instructions</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
