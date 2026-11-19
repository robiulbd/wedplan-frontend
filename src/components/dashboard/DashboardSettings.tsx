"use client";

import { Loader2, Mail, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import type { AuthUser } from "@/types";

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

export default function DashboardSettings() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const res = await apiRequest<MeResponse>("/auth/me");
        if (isMounted) {
          setProfile(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load your profile",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile settings</h1>
      <p className="mt-1 text-sm text-gray-600">
        Your account details are managed by WedPlan. Contact support to change
        your name or email.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading profile...
        </div>
      ) : error || !profile ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || "Profile unavailable"}
        </p>
      ) : (
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
              <User className="w-3.5 h-3.5" />
              Name
            </dt>
            <dd className="mt-1 font-medium text-gray-900">
              {profile.name || "—"}
            </dd>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
              <Mail className="w-3.5 h-3.5" />
              Email
            </dt>
            <dd className="mt-1 font-medium text-gray-900 break-all">
              {profile.email}
            </dd>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role
            </dt>
            <dd className="mt-1 font-medium capitalize text-gray-900">
              {profile.role}
            </dd>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Subscription
            </dt>
            <dd className="mt-1 font-medium capitalize text-gray-900">
              {profile.subscriptionPlan || "free"}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}
