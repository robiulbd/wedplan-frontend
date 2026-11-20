import React from "react";

type SocialPlatform = "facebook" | "instagram" | "x";

// TODO: replace these placeholder hrefs with the real WedPlan profile URLs.
const SOCIAL_LINKS: { platform: SocialPlatform; label: string; href: string }[] =
  [
    { platform: "facebook", label: "Facebook", href: "#" },
    { platform: "instagram", label: "Instagram", href: "#" },
    { platform: "x", label: "X (formerly Twitter)", href: "#" },
  ];

// Brand marks are inlined as SVG because lucide-react no longer ships brand
// icons. Keeping them here avoids a third-party icon dependency.
const BRAND_PATHS: Record<SocialPlatform, string> = {
  facebook:
    "M22 12.061C22 6.504 17.523 2 12 2S2 6.504 2 12.061C2 16.942 5.288 21.084 9.698 22v-7.03H7.078v-2.909h2.62V9.848c0-2.588 1.54-4.02 3.895-4.02 1.128 0 2.31.202 2.31.202v2.54h-1.301c-1.282 0-1.683.798-1.683 1.616v1.937h2.863l-.458 2.909h-2.405V22C18.712 21.084 22 16.942 22 12.061Z",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.89 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.14 0-3.5.01-4.73.07-2.1.1-3.13 1.13-3.23 3.23-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.1 2.1 1.13 3.13 3.23 3.23 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c2.1-.1 3.13-1.13 3.23-3.23.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.1-2.1-1.13-3.13-3.23-3.23-1.23-.06-1.59-.07-4.73-.07Zm0 3.05a4.99 4.99 0 1 1 0 9.98 4.99 4.99 0 0 1 0-9.98Zm0 1.8a3.19 3.19 0 1 0 0 6.38 3.19 3.19 0 0 0 0-6.38Zm5.18-3.4a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34Z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
};

export default function SocialLinks() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {SOCIAL_LINKS.map(({ platform, label, href }) => (
        <a
          key={platform}
          href={href}
          aria-label={label}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-600 hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="h-[18px] w-[18px]"
          >
            <path d={BRAND_PATHS[platform]} />
          </svg>
        </a>
      ))}
    </div>
  );
}
