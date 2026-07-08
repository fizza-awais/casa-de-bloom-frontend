"use client";

import { useDashboardProfile } from "@/lib/context/DashboardContext";
import EventTracker from "@/components/dashboard/EventTracker";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export default function EventsPage() {
  const profile = useDashboardProfile();

  return (
    <div className="space-y-6">
      <div className="flex justify-end flex-wrap gap-3">
        <Link
          href="/register/guest"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-xl px-5 py-2.5 shadow-sm transition-all"
        >
          <CalendarPlus size={16} />
          Register for New Event
        </Link>
      </div>
      <EventTracker
        registrations={profile.registrations}
        volunteerDetails={profile.volunteer_details}
      />
    </div>
  );
}