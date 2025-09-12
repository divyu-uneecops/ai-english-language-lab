import serverInterfaceService from "./serverInterfaceService";

export const authService = {
  login: (user: { name: string; email: string }) =>
    serverInterfaceService.post("/auth/login", user),
  register: (payload: { phone: string }) =>
    serverInterfaceService.post(`/auth/register`, payload),
  verifyOtp: (payload: any) =>
    serverInterfaceService.post("/auth/verify-phone", payload),
  resendOtp: () => serverInterfaceService.post("/auth/resend-otp"),
  forgotPassword: (payload: any) =>
    serverInterfaceService.post("/auth/send-otp", payload),
  verifyForgotPasswordOtp: (payload: any) =>
    serverInterfaceService.post("/auth/confirm-otp", payload),
  resetPassword: (payload: any) =>
    serverInterfaceService.post("/auth/update-password", payload),
};
