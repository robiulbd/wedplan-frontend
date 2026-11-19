"use client";

import {
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiClient";
import {
  SERVICE_CATEGORIES,
  type ServiceItem,
  type ServicesListResponse,
} from "@/types";

const EMPTY_FORM = {
  serviceName: "",
  category: SERVICE_CATEGORIES[0] as string,
  description: "",
  price: "",
  location: "",
  images: "",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function VendorServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<ServicesListResponse>(
        "/services/vendor/my-services",
      );
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load your services",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const images = form.images
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);

    if (images.length === 0) {
      toast.error("Add at least one image URL");
      return;
    }

    setSaving(true);
    try {
      await apiRequest("/services", {
        method: "POST",
        body: JSON.stringify({
          serviceName: form.serviceName.trim(),
          category: form.category,
          description: form.description.trim(),
          price: Number(form.price),
          location: form.location.trim(),
          images,
        }),
      });

      toast.success("Service submitted for admin approval");
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create service",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    setBusyId(service._id);
    try {
      await apiRequest(`/services/${service._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      toast.success(
        service.isActive
          ? "Service hidden from listings"
          : "Service is live again",
      );
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (service: ServiceItem) => {
    if (
      !window.confirm(`Delete "${service.serviceName}"? This cannot be undone.`)
    ) {
      return;
    }

    setBusyId(service._id);
    try {
      await apiRequest(`/services/${service._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Services</h2>
          <p className="text-sm text-gray-500">
            Free plan: up to 3 active services. Every new or edited service is
            reviewed by an admin before it appears publicly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadServices}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 cursor-pointer"
          >
            {showForm ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {showForm ? "Cancel" : "Add service"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-rose-100 bg-rose-50/30 p-4"
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="service-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Service name
            </label>
            <input
              id="service-name"
              required
              value={form.serviceName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, serviceName: e.target.value }))
              }
              placeholder="Royal Garden Photography"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="service-category"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="service-category"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="service-price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Price (USD)
            </label>
            <input
              id="service-price"
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="1200"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="service-location"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="service-location"
              required
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Dhaka"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label
              htmlFor="service-images"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URLs (comma separated)
            </label>
            <input
              id="service-images"
              required
              value={form.images}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, images: e.target.value }))
              }
              placeholder="https://..., https://..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="service-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="service-description"
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what makes this service special..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Submitting..." : "Submit for approval"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading your services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rose-200 p-8 text-center">
            <p className="font-medium text-gray-800">No services yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first wedding service to start receiving enquiries.
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
                  {!service.isActive && (
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                      hidden
                    </span>
                  )}
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
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(service)}
                  disabled={busyId === service._id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
                >
                  {service.isActive ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  {service.isActive ? "Hide" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service)}
                  disabled={busyId === service._id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
