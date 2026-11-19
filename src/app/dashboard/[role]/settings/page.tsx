import DashboardSettings from "@/components/dashboard/DashboardSettings";

// The settings view loads the signed-in user's profile at request time, so it
// can't be prerendered into a static shell. Opt this segment out of
// instant-navigation validation.
export const instant = false;

export default function DashboardSettingsPage() {
  return <DashboardSettings />;
}
