import Link from "next/link";

/**
 * WedPlan wordmark used in both the navbar and the footer.
 * The mark is the favicon the project already ships in /public/wedplan.ico.
 * `compact` renders a smaller variant for the slim navbar.
 */
export default function BrandLogo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-bold tracking-tight text-rose-600 ${
        compact ? "text-base" : "text-xl"
      } ${className}`}
    >
      <img
        src="/wedplan.ico"
        alt=""
        aria-hidden="true"
        width={compact ? 20 : 28}
        height={compact ? 20 : 28}
        className={`shrink-0 object-contain ${compact ? "h-5 w-5" : "h-7 w-7"}`}
      />
      <span>WedPlan</span>
    </Link>
  );
}
