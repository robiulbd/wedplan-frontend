"use client";

import { Briefcase, CalendarCheck, CheckCircle2, Clock, Heart, Loader2, Search, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import AdminServices from "@/components/dashboard/AdminServices";
import AdminUsers from "@/components/dashboard/AdminUsers";
import CustomerBookings from "@/components/dashboard/CustomerBookings";
import VendorBookings from "@/components/dashboard/VendorBookings";
import VendorServices from "@/components/dashboard/VendorServices";
import { useSession } from "@/lib/auth-client";
import type { ServiceItem, ServicesListResponse } from "@/types";

interface VendorStats {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  acceptedBookings: number;
}

export default function DashboardOverview() {
  const params = useParams<{ role: string }>();
  const role = Array.isArray(params?.role) ? params.role[0] : params?.role;
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const [vendorStats, setVendorStats] = useState<VendorStats | null>(null);
  const [vendorProfile, setVendorProfile] = useState<{
    subscriptionPlan?: string;
    subscriptionExpiresAt?: string | null;
  } | null>(null);
  const [upgrading, setUpgrading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (role !== "vendor") return;
    let isMounted = true;

    async function loadStats() {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          apiRequest<ServicesListResponse>("/services/vendor/my-services"),
          apiRequest<{ success: boolean; data: { status: string }[] }>(
            "/bookings/vendor/mine",
          ),
        ]);
        const services: ServiceItem[] = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : [];
        const bookings: { status: string }[] = Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : [];

        if (!isMounted) return;
        setVendorStats({
          totalServices: services.length,
          activeServices: services.filter(
            (s) => s.isActive && s.status === "approved",
          ).length,
          pendingBookings: bookings.filter((b) => b.status === "pending").length,
          acceptedBookings: bookings.filter((b) => b.status === "accepted").length,
        });
      } catch {
        if (isMounted) setVendorStats(null);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [role]);

  useEffect(() => {
    if (role !== "vendor") return;
    let isMounted = true;
    apiRequest<{
      success: boolean;
      data: { subscriptionPlan?: string; subscriptionExpiresAt?: string | null };
    }>("/auth/me")
      .then((res) => {
        if (isMounted) setVendorProfile(res.data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [role]);

  useEffect(() => {
    if (role !== "vendor") return;
    if (searchParams.get("subscription") !== "success") return;
    toast.success("Premium subscription activated!");
    router.replace("/dashboard/vendor/overview");
  }, [role, searchParams, router]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await apiRequest<{ sessionId: string; url: string }>(
        "/stripe/create-subscription-session",
        {
          method: "POST",
          body: JSON.stringify({ priceInCents: 2900 }),
        },
      );
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      toast.error("Failed to start checkout");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start checkout",
      );
    } finally {
      setUpgrading(false);
    }
  };

  if (role === "vendor") {
    return (
      <div className="space-y-6">
        <header className="rounded-2xl border border-rose-100 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your wedding services and keep your listings up to date.
          </p>
        </header>

        {vendorStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-rose-100 bg-white p-5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Total Services
                </h2>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {vendorStats.totalServices}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Active Services
                </h2>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {vendorStats.activeServices}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white p-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Pending Booking Requests
                </h2>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {vendorStats.pendingBookings}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white p-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-rose-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Accepted Bookings
                </h2>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {vendorStats.acceptedBookings}
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-rose-100 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Subscription Plan
              </h2>
              <p className="text-sm text-gray-500">
                Free plan: up to 3 active services. Premium: unlimited listings.
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                vendorProfile?.subscriptionPlan === "premium"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {vendorProfile?.subscriptionPlan === "premium"
                ? "Premium"
                : "Free"}
            </span>
          </div>

          {vendorProfile?.subscriptionPlan === "premium" ? (
            <p className="mt-3 text-sm text-gray-600">
              Premium active
              {vendorProfile.subscriptionExpiresAt
                ? ` until ${new Date(vendorProfile.subscriptionExpiresAt).toLocaleDateString()}`
                : ""}
              .
            </p>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {upgrading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Upgrade to Premium ($29)
              </button>
            </div>
          )}
        </div>

        <VendorServices />
        <VendorBookings />
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="space-y-6">
        <header className="rounded-2xl border border-rose-100 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin overview</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review vendor submissions and keep the marketplace trustworthy.
          </p>
        </header>
        <AdminServices />
        <AdminUsers />
      </div>
    );
  }

  if (role === "customer") {
    return (
      <div className="space-y-6">
        <header className="rounded-2xl border border-rose-100 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer overview</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your wedding bookings and manage your plans.
          </p>
        </header>
        <CustomerBookings />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-rose-100 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Everything you need to plan your wedding in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/services"
          className="rounded-2xl border border-rose-100 bg-white p-5 hover:border-rose-200 hover:bg-rose-50/40 transition"
        >
          <Search className="w-6 h-6 text-rose-600" />
          <h2 className="mt-3 font-semibold text-gray-900">
            Browse wedding services
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Explore venues, photography, catering, decor and more.
          </p>
        </Link>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <CalendarCheck className="w-6 h-6 text-rose-600" />
          <h2 className="mt-3 font-semibold text-gray-900">Your bookings</h2>
          <p className="mt-1 text-sm text-gray-600">
            You have no booking requests yet. Contact a vendor from any service
            page to get started.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <Heart className="w-6 h-6 text-rose-600" />
          <h2 className="mt-3 font-semibold text-gray-900">Saved vendors</h2>
          <p className="mt-1 text-sm text-gray-600">
            Shortlist your favourite vendors as you explore.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <Sparkles className="w-6 h-6 text-rose-600" />
          <h2 className="mt-3 font-semibold text-gray-900">Planning tips</h2>
          <p className="mt-1 text-sm text-gray-600">
            Set a budget, pick a date, and book your must-have vendors first.
          </p>
        </div>
      </div>
    </div>
  );
}
