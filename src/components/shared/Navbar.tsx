"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/shared/BrandLogo";
import { signOut, useSession } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/utils/roleRedirect";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user;
  const userRole =
    user && "role" in user && typeof user.role === "string"
      ? user.role
      : "customer";

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("wedplan_jwt");
      setDropdownOpen(false);
      toast.success("Logged out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <BrandLogo />

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-rose-600 transition">
            Home
          </Link>
          <Link href="/services" className="hover:text-rose-600 transition">
            Browse Services
          </Link>

          {isPending ? (
            <div className="h-8 w-20 rounded-md bg-gray-100 animate-pulse" />
          ) : !user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-3.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 py-1 pl-1.5 pr-3 hover:bg-gray-50 transition cursor-pointer"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </span>
                )}
                <span className="max-w-[130px] truncate text-gray-800">
                  {user.name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-gray-100 shadow-lg py-1.5 z-50">
                  <Link
                    href={getDashboardPathByRole(userRole)}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/dashboard/${userRole}/settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}