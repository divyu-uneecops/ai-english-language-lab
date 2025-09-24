"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface ForgotPasswordOtpVerificationProps {
  phone: string;
  onBack: () => void;
}

export function ForgotPasswordOtpVerification({
  phone,
  onBack,
}: ForgotPasswordOtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { verifyForgotPasswordOtp, isLoading } = useAuth();

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
      await verifyForgotPasswordOtp({ phone, otp });
    } catch (error) {
      console.error("OTP verification error:", error);
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
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {getMaskedPhone(phone)}
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
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="cursor-pointer mt-6">
          <span
            className="text-slate-600 flex items-center gap-1 justify-center"
            onClick={isLoading ? undefined : onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Phone Number
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
