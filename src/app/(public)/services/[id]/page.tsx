"use client";

import {
  ArrowLeft,
  Loader2,
  Mail,
  MapPin,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import type { ServiceItem, SingleServiceResponse } from "@/types";

function ServiceDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadService() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest<SingleServiceResponse>(`/services/${id}`);
        if (isMounted) {
          setService(res.data);
          setActiveImage(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load this service",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadService();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-rose-50/20">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading service...
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-rose-50/20 px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Service unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error || "This service could not be found."}
          </p>
          <Link
            href="/services"
            className="mt-5 inline-block rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  const images =
    service.images && service.images.length > 0
      ? service.images
      : ["/images/hero-wedding.jpg"];
  const cover = images[Math.min(activeImage, images.length - 1)];

  return (
    <main className="min-h-screen bg-rose-50/20 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
              <img
                src={cover}
                alt={service.serviceName}
                className="h-72 sm:h-96 w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                      index === activeImage
                        ? "border-rose-500"
                        : "border-transparent hover:border-rose-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${service.serviceName} ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                About this service
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {service.description}
              </p>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-rose-100 bg-white p-6 lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                <Sparkles className="w-3 h-3" />
                {service.category}
              </span>

              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                {service.serviceName}
              </h1>

              <p className="mt-2 text-3xl font-bold text-rose-600">
                ${service.price.toLocaleString()}
              </p>

              <dl className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{service.vendorName || "Verified WedPlan Vendor"}</span>
                </div>
              </dl>

              {service.vendorEmail ? (
                <a
                  href={`mailto:${service.vendorEmail}?subject=${encodeURIComponent(
                    `Enquiry about ${service.serviceName}`,
                  )}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 transition"
                >
                  <Mail className="w-4 h-4" />
                  Contact vendor
                </a>
              ) : null}

              <p className="mt-4 text-xs text-gray-500">
                Booking requests are handled directly with the vendor.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// useParams() is runtime-only, so the content must stream inside a Suspense
// boundary (required by cacheComponents).
export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-rose-50/20">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading service...
          </div>
        </main>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
