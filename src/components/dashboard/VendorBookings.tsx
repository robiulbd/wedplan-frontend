"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiClient";
import type { Booking, ServicesListResponse } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function VendorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: Booking[] }>(
        "/bookings/vendor/mine",
      );
      const list: Booking[] = Array.isArray(res.data) ? res.data : [];
      setBookings(list);

      const ownRes = await apiRequest<ServicesListResponse>(
        "/services/vendor/my-services",
      );
      setServices(Array.isArray(ownRes.data) ? ownRes.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load bookings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (booking: Booking) => {
    setBusyId(booking._id);
    try {
      await apiRequest(`/bookings/${booking._id}/accept`, { method: "PATCH" });
      toast.success("Booking request accepted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept booking");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (booking: Booking) => {
    setBusyId(booking._id);
    try {
      await apiRequest(`/bookings/${booking._id}/reject`, { method: "PATCH" });
      toast.success("Booking request rejected");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject booking");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading booking requests...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Booking Requests
        </h2>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        Review customer booking requests for your services. Pending requests can
        be accepted or rejected.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-rose-200 p-8 text-center">
          <p className="font-medium text-gray-800">No booking requests yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Booking requests for your services will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {booking.service?.serviceName || "Service"}
                  </h3>
                  {booking.service?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.service.images[0]}
                      alt={booking.service.serviceName}
                      className="mt-2 h-24 w-full rounded-lg object-cover"
                    />
                  ) : null}
                  <p className="mt-2 text-sm text-gray-600">
                    Customer: <span className="font-medium">{booking.customerName}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Event date: <span className="font-medium">{booking.eventDate}</span>
                  </p>
                  {booking.eventLocation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      Event location: <span className="font-medium">{booking.eventLocation}</span>
                    </p>
                  ) : null}
                  {booking.message ? (
                    <p className="mt-1 text-sm text-gray-600">
                      Message: <span className="italic">{booking.message}</span>
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {booking.status}
                  </span>
                  {booking.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(booking)}
                        disabled={busyId === booking._id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(booking)}
                        disabled={busyId === booking._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
