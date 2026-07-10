import PageLoader from "@/components/ui/PageLoader";

export default function DashboardLoading() {
  return (
    <PageLoader
      title="Loading your dashboard"
      message="Pulling in your profile, event invites, and images..."
    />
  );
}
