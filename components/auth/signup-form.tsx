"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OtpVerification } from "./otp-verification";
import { toast } from "sonner";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    standard: "",
    school: "",
    state: "",
    city: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { register, isLoading } = useAuth();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    // if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    //   errors.email = "Please enter a valid email address";
    // }

    if (!formData.standard) {
      errors.standard = "Please select your standard";
    }

    if (!formData.school.trim()) {
      errors.school = "School name is required";
    } else if (formData.school.trim().length < 2) {
      errors.school = "School name must be at least 2 characters";
    }

    if (!formData.state) {
      errors.state = "State is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 3) {
      errors.password = "Password must be stronger";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
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
      const { confirmPassword, ...registerPayload } = formData;
      await register(registerPayload);
      setIsOtpSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Registration error:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Calculate password strength
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return "bg-red-500";
    if (strength < 3) return "bg-yellow-500";
    if (strength < 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return "Weak";
    if (strength < 3) return "Fair";
    if (strength < 4) return "Good";
    return "Strong";
  };

  // Show OTP verification if OTP has been sent
  if (isOtpSent) {
    return <OtpVerification onBack={() => window.location.reload()} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={
                validationErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
              required
            />
            {validationErrors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
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
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email (optional)"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={
                validationErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {validationErrors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.email}
              </p>
            )}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="standard">Standard *</Label>
            <select
              id="standard"
              value={formData.standard}
              onChange={(e) => handleInputChange("standard", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground ${
                validationErrors.standard
                  ? "border-red-500 focus:border-red-500"
                  : "border-input focus:border-ring"
              }`}
            >
              <option value="">Select your standard</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Class {i + 1}
                </option>
              ))}
            </select>
            {validationErrors.standard && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.standard}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School Name *</Label>
            <Input
              id="school"
              type="text"
              placeholder="Enter your school name"
              value={formData.school}
              onChange={(e) => handleInputChange("school", e.target.value)}
              className={
                validationErrors.school
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
              required
            />
            {validationErrors.school && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.school}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={
                  validationErrors.state
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
                required
              />
              {validationErrors.state && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {validationErrors.state}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={
                  validationErrors.city
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
                required
              />
              {validationErrors.city && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {validationErrors.city}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor(
                        passwordStrength
                      )}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <p>Password must contain:</p>
                  <ul className="mt-1 space-y-1">
                    <li
                      className={`flex items-center gap-1 ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[0-9]/.test(formData.password)
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      One number
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {validationErrors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={
                  validationErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
                required
              />
              <div
                className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </div>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
