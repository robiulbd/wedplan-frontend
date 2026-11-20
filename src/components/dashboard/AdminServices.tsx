"use client";

import { Check, Loader2, MapPin, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiClient";
import type { ServiceItem, ServicesListResponse } from "@/types";

const FILTERS = ["pending", "approved", "rejected", "all"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminServices() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<ServicesListResponse>(
        `/services/admin/all?status=${filter}`,
      );
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load services",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const setStatus = async (
    service: ServiceItem,
    status: "approved" | "rejected",
  ) => {
    if (
      status === "rejected" &&
      !window.confirm(
        `Permanently delete "${service.serviceName}" and all of its bookings? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(service._id);
    try {
      await apiRequest(`/services/${service._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Service ${status}`);
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Service Moderation
          </h2>
          <p className="text-sm text-gray-500">
            Approve or reject vendor submissions before they appear publicly.
          </p>
        </div>

        <button
          type="button"
          onClick={loadServices}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
              filter === option
                ? "bg-rose-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rose-200 p-8 text-center">
            <p className="font-medium text-gray-800">
              No {filter === "all" ? "" : filter} services
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Nothing to moderate in this view right now.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service._id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {service.serviceName}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      STATUS_STYLES[service.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                  <span className="font-medium text-rose-600">
                    ${service.price.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {service.location}
                  </span>
                  <span>{service.category}</span>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {service.vendorName || "Vendor"}
                  {service.vendorEmail ? ` • ${service.vendorEmail}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(service, "approved")}
                  disabled={
                    busyId === service._id || service.status === "approved"
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(service, "rejected")}
                  disabled={
                    busyId === service._id || service.status === "rejected"
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
