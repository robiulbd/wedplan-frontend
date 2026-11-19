"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiClient";
import type { Booking } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: Booking[] }>(
        "/bookings/customer/mine",
      );
      const list: Booking[] = Array.isArray(res.data) ? res.data : [];
      setBookings(list);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load your bookings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (booking: Booking) => {
    setBusyId(booking._id);
    try {
      await apiRequest(`/bookings/${booking._id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        Track booking requests you have submitted and manage pending ones.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-rose-200 p-8 text-center">
          <p className="font-medium text-gray-800">No booking requests yet</p>
          <p className="mt-1 text-sm text-gray-500">
            When you book a wedding service, it will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {booking.service?.serviceName || "Service"}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Vendor:{" "}
                  <span className="font-medium">
                    {booking.service?.vendorName || "Verified WedPlan Vendor"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Event date:{" "}
                  <span className="font-medium">{booking.eventDate}</span>
                </p>
                {booking.eventLocation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    Event location:{" "}
                    <span className="font-medium">{booking.eventLocation}</span>
                  </p>
                ) : null}
                {booking.message ? (
                  <p className="mt-1 text-sm text-gray-600">
                    Message: <span className="italic">{booking.message}</span>
                  </p>
                ) : null}
                {booking.createdAt ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Requested on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center">
                {booking.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking)}
                    disabled={busyId === booking._id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                  >
                    Cancel booking
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
