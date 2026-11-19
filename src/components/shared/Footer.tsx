"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-20 bg-white border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight text-rose-600">
            WedPlan
          </Link>
          <p className="mt-3 text-sm text-gray-600 max-w-xs leading-relaxed">
            Your trusted wedding planning platform — discover curated wedding
            services and book trusted vendors for your special day.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Explore
          </h3>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-rose-600 transition">
              Home
            </Link>
            <Link href="/services" className="hover:text-rose-600 transition">
              Browse Services
            </Link>
            <Link href="/sign-in" className="hover:text-rose-600 transition">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-rose-600 transition">
              Sign Up
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Contact
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
            <a
              href="mailto:support@wedplan.com"
              className="hover:text-rose-600 transition"
            >
              support@wedplan.com
            </a>
            <span>Available 24/7 for wedding planning support</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
            Connect
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <a
              href="#"
              className="rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-rose-700 hover:bg-rose-100 transition"
            >
              Facebook
            </a>
            <a
              href="#"
              className="rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-rose-700 hover:bg-rose-100 transition"
            >
              Instagram
            </a>
            <a
              href="#"
              className="rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-rose-700 hover:bg-rose-100 transition"
            >
              Twitter / X
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-rose-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            © {currentYear} WedPlan. All rights reserved. Made with love for
            couples planning their wedding.
          </p>
          <p>Wedding Planning Platform • Vendors, Services &amp; Bookings</p>
        </div>
      </div>
    </footer>
  );
}
