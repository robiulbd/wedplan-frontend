"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

/**
 * Keeps the outgoing and incoming pages mounted for a brief moment so
 * Framer Motion `layoutId` elements can animate between routes (for example
 * a service card image expanding into the service detail image).
 */
function RouteTransitionContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={pathname}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.18,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function RouteTransition({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <RouteTransitionContent>{children}</RouteTransitionContent>
    </Suspense>
  );
}
