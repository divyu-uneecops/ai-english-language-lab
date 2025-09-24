"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone_or_email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.phone_or_email) {
      errors.phone_or_email = "Email or phone number is required";
    } else if (/\S+@\S+\.\S+/.test(formData.phone_or_email)) {
      // Valid email format
    } else if (/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_or_email)) {
      // Valid phone format
    } else {
      errors.phone_or_email =
        "Please enter a valid email address or phone number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the auth context
      console.error("Login error:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone_or_email">Email or Phone Number</Label>
            <Input
              id="phone_or_email"
              type="text"
              placeholder="Enter your email or phone number"
              value={formData.phone_or_email}
              onChange={(e) =>
                handleInputChange("phone_or_email", e.target.value)
              }
              className={
                validationErrors.phone_or_email
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
              required
            />
            {validationErrors.phone_or_email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.phone_or_email}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can enter either your email address or phone number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={
                  validationErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
                required
              />
              <div
                className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </div>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
