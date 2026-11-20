"use client";

import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest, ensureBackendJwt } from "@/lib/apiClient";
import { signOut, useSession } from "@/lib/auth-client";
import type { AuthUser } from "@/types";
import { getDashboardPathByRole } from "@/utils/roleRedirect";

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const [profileFromApi, setProfileFromApi] = useState<AuthUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const userId = session?.user?.id;

  // Fall back to the better-auth session if /auth/me is unavailable, so the
  // dashboard still renders instead of spinning forever.
  const profile: AuthUser | null =
    profileFromApi ??
    (session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: "customer",
        }
      : null);

  // 1. No session -> send the user to sign-in and bring them back afterwards.
  // Wait a moment first: right after sign-in the better-auth store can report
  // "no user" for a tick before the new session lands, which would otherwise
  // bounce the user straight back to /sign-in.
  useEffect(() => {
    if (isPending || userId) return;

    const timer = setTimeout(() => {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isPending, userId, router, pathname]);

  // 2. Load the authoritative role/plan from the Express backend.
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function loadProfile() {
      try {
        // Google OAuth sessions arrive without the Express JWT — mint it first
        // so /auth/me (and the dashboard's other API calls) are authorized.
        if (session?.user?.email) {
          await ensureBackendJwt(session.user.email);
        }
        const res = await apiRequest<MeResponse>("/auth/me");
        if (isMounted) {
          setProfileFromApi(res.data);
        }
      } catch {
        // Keep the session-based fallback computed above.
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, session?.user?.email]);

  // 3. Keep users inside their own dashboard. Only trust the role from the
  // backend: redirecting on the session fallback would bounce everyone through
  // /dashboard/customer/overview before the real role arrives.
  const roleFromPath = pathname.split("/")[2];
  useEffect(() => {
    if (!profileFromApi) return;
    if (roleFromPath && roleFromPath !== profileFromApi.role) {
      router.replace(getDashboardPathByRole(profileFromApi.role));
    }
  }, [profileFromApi, roleFromPath, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("wedplan_jwt");
      toast.success("Logged out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  if (isPending || loadingProfile || !profile) {
    return <DashboardFallback />;
  }

  const role = profile.role;
  const base = `/dashboard/${role}`;

  const navItems = [
    { href: `${base}/overview`, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/settings`, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-rose-50/20">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-rose-100 bg-white p-5">
            <div className="flex items-center gap-3">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || "User"}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <span className="w-11 h-11 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {profile.name || "WedPlan user"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                {role === "admin" ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : role === "vendor" ? (
                  <Store className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {ROLE_LABELS[role] || role}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {profile.subscriptionPlan === "premium" ? "Premium" : "Free"}{" "}
                plan
              </span>
            </div>

            <nav className="mt-5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-rose-600 text-white"
                        : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/services"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition"
              >
                <Search className="w-4 h-4" />
                Browse services
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <section className="lg:col-span-3">{children}</section>
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      Loading your dashboard...
    </div>
  );
}
