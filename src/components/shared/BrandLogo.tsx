import Link from "next/link";

/**
 * WedPlan wordmark used in both the navbar and the footer.
 * The mark is the favicon the project already ships in /public/wedplan.ico.
 */
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-xl font-bold tracking-tight text-rose-600 ${className}`}
    >
      <img
        src="/wedplan.ico"
        alt=""
        aria-hidden="true"
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 object-contain"
      />
      <span>WedPlan</span>
    </Link>
  );
}
