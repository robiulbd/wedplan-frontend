import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white">
      <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center justify-center bg-rose-950 px-4 py-20 text-center text-white overflow-hidden">
        <Image
          src="/images/hero-wedding.jpg"
          alt="WedPlan wedding celebration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0"
        />

        <div
          className="absolute inset-0 bg-black/55 z-10"
          aria-hidden="true"
        />

        <div className="relative z-20 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/15 border border-white/25 text-rose-100 mb-5">
            WedPlan • Wedding Planning Platform
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Plan Your Dream Wedding with Trusted Vendors
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Discover curated wedding venues, photography, catering, floral
            decor, and bridal styling—or join as a vendor to showcase your
            services effortlessly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm sm:text-base font-medium shadow-md transition"
            >
              Explore Wedding Services
            </Link>

            <Link
              href="/sign-up"
              className="px-6 py-3 rounded-lg bg-white/15 hover:bg-white/25 border border-white/35 text-white text-sm sm:text-base font-medium transition"
            >
              Join as Vendor or Customer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}