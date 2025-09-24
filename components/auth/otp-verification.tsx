"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OtpVerificationProps {
  onBack: () => void;
}

export function OtpVerification({ onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { verifyOtp, resendOtp, isLoading, pendingUser } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    try {
      await verifyOtp({
        user: pendingUser,
        otp: { otp },
      });
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp();
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
  };

  const getMaskedPhone = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, -4)}****${cleaned.slice(-4)}`;
    }
    return phone;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <p className="text-slate-600 dark:text-slate-400">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {getMaskedPhone(pendingUser?.phone || "")}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Verifying..." : "Verify Account"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="link"
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-600 p-0 h-auto cursor-pointer"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Registration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
