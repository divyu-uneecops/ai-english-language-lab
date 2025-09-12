"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgotPasswordOtpVerification } from "./forgot-password-otp-verification";
import { ResetPasswordForm } from "./reset-password-form";

export function ForgotPasswordForm() {
  const [phone, setPhone] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const {
    forgotPassword,
    isLoading,
    isForgotPasswordOtpSent,
    isPasswordResetVerified,
  } = useAuth();

  const validatePhone = () => {
    const errors: Record<string, string> = {};

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone()) {
      return;
    }

    try {
      await forgotPassword({ phone });
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  const handleInputChange = (value: string) => {
    setPhone(value);

    // Clear validation error when user starts typing
    if (validationErrors.phone) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleBack = () => {
    setPhone("");
  };

  // Show OTP verification if OTP has been sent
  if (isForgotPasswordOtpSent && !isPasswordResetVerified) {
    return <ForgotPasswordOtpVerification phone={phone} onBack={handleBack} />;
  }

  // Show reset password form if OTP is verified
  if (isPasswordResetVerified) {
    return <ResetPasswordForm />;
  }

  // Show phone number input form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Enter your phone number to receive a verification code
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => handleInputChange(e.target.value)}
              className={
                validationErrors.phone
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
              required
            />
            {validationErrors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.phone}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We'll send a verification code to this number
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-2.5"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Sending Code..." : "Send Verification Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
