import { cookies } from "next/headers";
import HomeFlow from "@/components/HomeFlow";
import { Sidebar } from "@/components/Sidebar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardPage from "@/app/dashboard/page";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import { fetchMemberMe } from "@/lib/services/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const profile = await fetchMemberMe(cookieHeader);

  if (!profile) return <HomeFlow />;

  return (
    <DashboardProvider profile={profile}>
      <div className="min-h-screen bg-ui-bg-page flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
        <Sidebar role={profile.participant_type} />

        <div className="flex-1 w-full max-w-7xl mx-auto space-y-6">
          <DashboardNav
            firstName={profile.first_name}
            lastName={profile.last_name}
            cbId={profile.cb_id}
          />
          <DashboardPage />
        </div>
      </div>
    </DashboardProvider>
  );
}
