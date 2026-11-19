"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { MapPin, Sparkles, UserCheck } from "lucide-react";
import { ServiceItem } from "@/types";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Unauthenticated users are sent to Sign In before they can view details
  // (only customers may book, and booking requires an account).
  const handleViewDetails = () => {
    if (!isPending && !session?.user) {
      router.push(
        `/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`,
      );
      return;
    }
    router.push(`/services/${service._id}`);
  };

  const coverImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : "/images/hero-wedding.jpg";

  return (
    <article className="group bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col">
      <div className="relative h-48 w-full overflow-hidden bg-rose-50">
        <img
          src={coverImage}
          alt={service.serviceName}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 text-rose-700 shadow-xs">
          <Sparkles className="w-3 h-3" />
          {service.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {service.serviceName}
            </h3>
            <span className="text-base font-bold text-rose-600 shrink-0">
              ${service.price.toLocaleString()}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="line-clamp-1">{service.location}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="line-clamp-1">
                {service.vendorName || "Verified WedPlan Vendor"}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          className="mt-5 w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition cursor-pointer"
        >
          View Details
        </button>
      </div>
    </article>
  );
}