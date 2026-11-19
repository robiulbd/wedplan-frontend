"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  ServiceItem,
  ServicesListResponse,
} from "@/types";
import { apiRequest } from "@/lib/apiClient";
import ServiceCard from "@/components/shared/ServiceCard";

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>(initialCategory);
  const [location, setLocation] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const paramCat = searchParams.get("category");
    if (paramCat) {
      setCategory(paramCat);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function fetchFilteredServices() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category && category !== "All") params.set("category", category);
        if (location.trim()) params.set("location", location.trim());
        if (sort) params.set("sort", sort);

        const queryString = params.toString();
        const endpoint = queryString ? `/services?${queryString}` : "/services";

        const res = await apiRequest<ServicesListResponse>(endpoint);
        if (isMounted && Array.isArray(res.data)) {
          setServices(res.data);
        }
      } catch {
        if (isMounted) {
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFilteredServices();
    return () => {
      isMounted = false;
    };
  }, [search, category, location, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("");
    setSort("");
  };

  return (
    <main className="min-h-screen bg-rose-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Browse Wedding Services
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Search and filter approved wedding vendors by category, location,
            and price.
          </p>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Name */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service by name..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Categories</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter by location (e.g. Dhaka)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Price Sorting */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by price"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Sort: Default (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-2xl bg-white border border-rose-100 animate-pulse"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-rose-100 p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No matching wedding services found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search keyword, category, location, or sort
              option.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-80 bg-white border border-rose-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}