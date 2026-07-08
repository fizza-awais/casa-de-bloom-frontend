"use client";

import { useDashboardProfile } from "@/lib/context/DashboardContext";
import EventTracker from "@/components/dashboard/EventTracker";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export default function DashboardPage() {
  const profile = useDashboardProfile();

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-end flex-wrap">        
        <Link
          href="/register/guest"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-hover active:bg-brand-dark text-white text-sm font-bold rounded-xl px-5 py-2.5 shadow-sm transition-all"
        >
          <CalendarPlus size={16} />
          Register for New Event
        </Link>
      </div>

      {/* Event Tracker */}
      <EventTracker
        registrations={profile.registrations}
        volunteerDetails={profile.volunteer_details}
      />

    </div>
  );
}
