export type UserRole = "customer" | "vendor" | "admin";

export type ServiceStatus = "pending" | "approved" | "rejected";

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
export type UserRole = "customer" | "vendor" | "admin";
export type SignupRole = "customer" | "vendor";
export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked?: boolean;
  subscriptionPlan?: "free" | "premium";
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}