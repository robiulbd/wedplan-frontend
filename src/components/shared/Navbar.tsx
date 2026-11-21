"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/shared/BrandLogo";
import { signOut, useSession } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/utils/roleRedirect";

const NAV_LINK_CLASS = [
  "relative py-1 text-[13px] font-medium text-gray-700 transition-colors duration-200 hover:text-rose-600",
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full",
  "after:bg-rose-600 after:origin-left after:scale-x-0 after:transition-transform after:duration-200",
  "hover:after:scale-x-100",
].join(" ");

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
  <header className="sticky top-0 z-40 w-full rounded-b-[15px] border-b border-rose-100/80 bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-xl">
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[64px] lg:px-8">
        <div className="scale-110 origin-left transition-transform">
          <BrandLogo />
        </div>

        <nav className="flex items-center gap-5 text-[15px] font-medium text-gray-700 lg:gap-8 lg:text-[16px]">
          <Link href="/" className={NAV_LINK_CLASS}>
            Home
          </Link>
          <Link href="/services" className={NAV_LINK_CLASS}>
            Browse Services
          </Link>

          {isPending ? (
            <div className="h-8 w-24 rounded-md bg-gray-100 animate-pulse" />
          ) : !user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:border hover:border-rose-100 hover:bg-rose-50 hover:text-rose-700"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-rose-600 px-4 py-2 font-medium text-white shadow-sm shadow-rose-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/30"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3.5 hover:bg-gray-50 transition cursor-pointer"
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
                <span className="max-w-[135px] truncate text-gray-800">
                  {user.name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-gray-100 shadow-lg py-1.5 z-50">
                  <Link
                    href={getDashboardPathByRole(userRole)}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[14px] text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/dashboard/${userRole}/settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[14px] text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[14px] text-red-600 hover:bg-red-50 text-left cursor-pointer"
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