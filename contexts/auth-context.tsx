"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  verifyOtp: (payload: any) => Promise<void>;
  resendOtp: () => Promise<void>;
  forgotPassword: (phone: any) => Promise<void>;
  verifyForgotPasswordOtp: (payload: any) => Promise<void>;
  resetPassword: (password: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isOtpSent: boolean;
  pendingUser: any | null;
  isForgotPasswordOtpSent: boolean;
  isPasswordResetVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isForgotPasswordOtpSent, setIsForgotPasswordOtpSent] = useState(false);
  const [isPasswordResetVerified, setIsPasswordResetVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for user session on mount
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Optionally verify token with server
            // await authAPI.getProfile();
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      // Store token and user data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.register({ phone: payload?.phone || "" });
      setPendingUser(payload);

      setIsOtpSent(true);

      // Don't set user as logged in yet - wait for OTP verification
    } catch (error: any) {
      setError(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (payload: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.verifyOtp(payload);

      // Store token and user data after successful OTP verification
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      setIsOtpSent(false);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "OTP verification failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.resendOtp();
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (payload: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.forgotPassword(payload);
      setIsForgotPasswordOtpSent(true);
    } catch (error: any) {
      setError(error.message || "Failed to send OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (payload: any) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.verifyForgotPasswordOtp(payload);
      setIsPasswordResetVerified(true);
    } catch (error: any) {
      setError(error.message || "OTP verification failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (payload: any) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.resetPassword(payload);

      // Reset all forgot password states
      setIsForgotPasswordOtpSent(false);
      setIsPasswordResetVerified(false);

      // Redirect to login
      router.push("/auth/login");
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Call logout API
      // await authService.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoading(false);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        verifyForgotPasswordOtp,
        resetPassword,
        logout,
        isLoading,
        isOtpSent,
        pendingUser,
        isForgotPasswordOtpSent,
        isPasswordResetVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
