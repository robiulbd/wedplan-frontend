export type UserRole = "customer" | "vendor" | "admin";
export type SignupRole = "customer" | "vendor";
export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export const SERVICE_CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export interface ServiceItem {
  _id: string;
  vendorId: string;
  vendorName?: string;
  vendorEmail?: string;
  serviceName: string;
  category: ServiceCategory | string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt?: string;
}

export interface ServicesListResponse {
  success: boolean;
  count?: number;
  data: ServiceItem[];
}

export interface SingleServiceResponse {
  success: boolean;
  data: ServiceItem;
}

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