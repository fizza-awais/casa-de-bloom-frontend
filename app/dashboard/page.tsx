"use client";

import { useDashboardProfile } from "@/lib/context/DashboardContext";
import EventTracker from "@/components/dashboard/EventTracker";
import RegisterForEventModal from "@/components/dashboard/RegisterForEventModal";

export default function DashboardPage() {
  const profile = useDashboardProfile();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex justify-end flex-wrap">        
        <RegisterForEventModal />
      </div>

      {/* Event Tracker */}
      <EventTracker
        registrations={profile.registrations}
        volunteerDetails={profile.volunteer_details}
      />

    </div>
  );
}
