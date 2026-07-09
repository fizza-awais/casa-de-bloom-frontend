"use client";

import { useDashboardProfile } from "@/lib/context/DashboardContext";
import EventTracker from "@/components/dashboard/EventTracker";
import RegisterForEventModal from "@/components/dashboard/RegisterForEventModal";

export default function EventsPage() {
  const profile = useDashboardProfile();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex justify-end flex-wrap gap-3">
        <RegisterForEventModal />
      </div>
      <EventTracker
        registrations={profile.registrations}
        volunteerDetails={profile.volunteer_details}
      />
    </div>
  );
}
