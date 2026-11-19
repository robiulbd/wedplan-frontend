"use client";

import { CalendarCheck, Heart, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminServices from "@/components/dashboard/AdminServices";
import VendorServices from "@/components/dashboard/VendorServices";
import { useSession } from "@/lib/auth-client";

export default function DashboardOverview() {
  const params = useParams<{ role: string }>();
  const role = Array.isArray(params?.role) ? params.role[0] : params?.role;
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

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
        <VendorServices />
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
