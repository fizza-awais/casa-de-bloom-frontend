"use client";

import { useDashboardProfile } from "@/lib/context/DashboardContext";
import EventTracker from "@/components/dashboard/EventTracker";
import RegisterForEventModal from "@/components/dashboard/RegisterForEventModal";
import WelcomeEventBriefing from "@/components/dashboard/WelcomeEventBriefing";
import DashboardDonationSection from "@/components/dashboard/DashboardDonationSection";

export default function DashboardPage() {
  const profile = useDashboardProfile();

  return (
    <div className="flex w-full flex-col gap-4 pb-6 pt-3 md:pt-5">
      <section
        id="overview"
        className="dashboard-reveal scroll-mt-24"
        style={{ "--dashboard-delay": "0ms" } as React.CSSProperties}
      >
        <WelcomeEventBriefing
          firstName={profile.first_name}
          participantType={profile.participant_type}
          registrations={profile.registrations}
          volunteerDetails={profile.volunteer_details}
        />
      </section>

      <section
        id="events"
        className="dashboard-reveal scroll-mt-24"
        style={{ "--dashboard-delay": "120ms" } as React.CSSProperties}
      >
        <EventTracker
          registrations={profile.registrations}
          volunteerDetails={profile.volunteer_details}
          participantType={profile.participant_type}
          member={{
            cbId: profile.cb_id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone,
          }}
          action={<RegisterForEventModal />}
        />
      </section>

      <section
        id="donations"
        className="dashboard-reveal scroll-mt-24"
        style={{ "--dashboard-delay": "240ms" } as React.CSSProperties}
      >
        <DashboardDonationSection participantType={profile.participant_type} />
      </section>
    </div>
  );
}
