"use client";

import { Loader2, ShieldCheck, Trash2, UserCheck, UserX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/apiClient";
import type { AuthUser } from "@/types";

interface AdminUser extends AuthUser {
  createdAt?: string | null;
}

interface UsersResponse {
  success: boolean;
  count?: number;
  data: AdminUser[];
}

const FILTERS = ["all", "customer", "vendor", "admin"] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = filter === "all" ? "" : `?role=${filter}`;
      const res = await apiRequest<UsersResponse>(`/auth/users${query}`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleBlock = async (user: AdminUser) => {
    setBusyId(user.id);
    try {
      await apiRequest(`/auth/users/${user.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (
      !window.confirm(
        `Permanently delete ${user.name || user.email} and all related data? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(user.id);
    try {
      await apiRequest(`/auth/users/${user.id}`, { method: "DELETE" });
      toast.success("User deleted permanently");
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user",
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
            User Management
          </h2>
          <p className="text-sm text-gray-500">
            Review, block, unblock, or remove registered users.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
        >
          <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rose-200 p-8 text-center">
            <p className="font-medium text-gray-800">No users found</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Plan</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Joined</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {user.name || "—"}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 break-all">
                    {user.email}
                  </td>
                  <td className="py-3 pr-4 capitalize text-gray-700">
                    {user.role}
                  </td>
                  <td className="py-3 pr-4 capitalize text-gray-700">
                    {user.subscriptionPlan || "free"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                        user.isBlocked
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBlock(user)}
                        disabled={busyId === user.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                      >
                        {user.isBlocked ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={busyId === user.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
