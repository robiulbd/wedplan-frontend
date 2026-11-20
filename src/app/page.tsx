"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Building2,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  ShieldCheck,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { SERVICE_CATEGORIES, ServiceItem, ServicesListResponse } from "@/types";
import { apiRequest } from "@/lib/apiClient";
import ServiceCard from "@/components/shared/ServiceCard";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Photography & Videography": <Camera className="w-6 h-6 text-rose-600" />,
  "Wedding Venues": <Building2 className="w-6 h-6 text-rose-600" />,
  "Decoration & Florist": <Flower2 className="w-6 h-6 text-rose-600" />,
  "Catering Services": <Utensils className="w-6 h-6 text-rose-600" />,
  "Makeup & Styling": <Sparkles className="w-6 h-6 text-rose-600" />,
  "Wedding Fashion": <Shirt className="w-6 h-6 text-rose-600" />,
};

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const res = await apiRequest<ServicesListResponse>(
          "/services?featured=true&limit=6"
        );
        if (isMounted && Array.isArray(res.data)) {
          setFeaturedServices(res.data);
        }
      } catch {
        if (isMounted) {
          setFeaturedServices([]);
        }
      } finally {
        if (isMounted) {
          setLoadingFeatured(false);
        }
      }
    }

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Banner Section */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-rose-950 px-4 py-24 text-center text-white sm:min-h-[640px]">
        <img
          src="/images/hero-wedding.jpg"
          alt="WedPlan wedding celebration"
          className="absolute inset-0 h-full w-full object-cover object-center z-0"
        />
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.25)_100%)]"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-20 mx-auto max-w-4xl"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-rose-50 shadow-sm backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-rose-200" />
            WedPlan · Wedding Planning Platform
          </span>

          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            Plan Your Dream Wedding with Trusted Vendors
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/90 drop-shadow sm:text-lg lg:text-xl">
            Discover curated wedding venues, photography, catering, floral
            decor, and bridal styling—or join as a vendor to showcase your
            services effortlessly.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950 sm:text-base"
            >
              Explore Wedding Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/15 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950 sm:text-base"
            >
              Get Started Today
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Dynamic Section 2: Wedding Service Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Wedding Service Categories
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Browse specialized wedding professionals across every celebration
            essential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                href={`/services?category=${encodeURIComponent(category)}`}
                className="flex items-center gap-4 p-5 rounded-2xl border border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-200 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {CATEGORY_ICONS[category] || (
                    <Sparkles className="w-6 h-6 text-rose-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <p className="text-xs text-rose-600 font-medium mt-0.5">
                    Explore services →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Section 1: Featured Wedding Services */}
      <section className="bg-rose-50/40 py-16 px-4 border-y border-rose-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Wedding Services
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-gray-600">
                Handpicked, approved services ready for your upcoming wedding.
              </p>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              View All Services →
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-80 rounded-2xl bg-white border border-rose-100 animate-pulse"
                />
              ))}
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="rounded-2xl bg-white border border-rose-100 p-10 text-center">
              <p className="text-gray-700 font-medium">
                No approved wedding services available right now.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Check back soon or explore all listings on the services page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Section: Why Choose WedPlan? */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Why Choose WedPlan?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Designed to make wedding booking transparent, organized, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-2xs">
            <ShieldCheck className="w-8 h-8 text-rose-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Reviewed & Trusted Vendors
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Every listed service goes through review and quality checks so you
              can book with confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-2xs">
            <Clock className="w-8 h-8 text-rose-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Seamless Booking Tracking
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Send booking requests for your event date and track status updates
              directly from your dashboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-2xs">
            <HeartHandshake className="w-8 h-8 text-rose-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              All Categories in One Place
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Compare venues, photographers, caterers, and decorators without
              jumping across scattered listings.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}