import { UserRole } from "@/types";

export function getDashboardPathByRole(role?: string): string {
  const normalizedRole = role as UserRole | undefined;
  if (normalizedRole === "admin") return "/dashboard/admin/overview";
  if (normalizedRole === "vendor") return "/dashboard/vendor/overview";
  return "/dashboard/customer/overview";
}