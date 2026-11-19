import DashboardOverview from "@/components/dashboard/DashboardOverview";

// The overview reads the [role] param and the session at request time, so it
// can't be prerendered into a static shell. Opt this segment out of
// instant-navigation validation.
export const instant = false;

export default function DashboardOverviewPage() {
  return <DashboardOverview />;
}
