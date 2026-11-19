"use client";

import type React from "react";
import { Suspense } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

// usePathname()/useSession() are runtime-only, so the shell streams inside a
// Suspense boundary (required by cacheComponents). The boundary must live in a
// Client Component: a Suspense boundary in a Server Component layout would
// block the streamed shell in production.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
          Loading your dashboard...
        </div>
      }
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
