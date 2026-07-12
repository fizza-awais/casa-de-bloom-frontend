"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  ChevronDown,
  Clock,
  Gift,
  HandHeart,
  HeartHandshake,
  PartyPopper,
  Salad,
  Sparkles,
  Tag,
  Tv,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatEventDate } from "@/lib/date";
import { REGISTRATION_CELEBRATION_KEY } from "@/lib/registrationCelebration";
import { fetchEvents } from "@/lib/services/events";
import BloomCelebration, {
  type BloomCelebrationHandle,
} from "@/components/effects/BloomCelebration";
import { FloralFrame } from "@/components/branding/CasaBranding";

interface EventDetail {
  id?: string;
  name?: string;
  event_type?: string;
  event_date?: string;
  location?: string;
  address?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
}

interface DashboardEventRecord {
  id?: string;
  created_at?: string;
  status?: string;
  invitation_number?: string;
  skills_offered?: string;
  availability?: string;
  can_capture_media?: boolean;
  event_detail?: EventDetail;
}

interface WelcomeEventBriefingProps {
  firstName: string;
  participantType?: "guest" | "volunteer";
  registrations?: DashboardEventRecord[];
  volunteerDetails?: DashboardEventRecord[];
}

const beforeYouArriveItems = [
  {
    title: "Name tag",
    icon: Tag,
    body: "Please wear a visible name tag with your first and last name. It helps us welcome you, verify registration, and make connecting easier for everyone.",
  },
  {
    title: "Reality show",
    icon: Tv,
    body: "Casa de Bloom is a community-centered Reality Show, so photos and videos may be captured throughout the experience. Come ready to participate, connect, and be part of the story.",
  },
  {
    title: "Business owners",
    icon: BriefcaseBusiness,
    body: "Business owners, creators, sponsors, and community partners are welcome. The best fit is interactive: demonstrations, giveaways, games, samples, and memorable experiences that bring people together.",
  },
  {
    title: "Community values",
    icon: HeartHandshake,
    body: "Community comes first. Bring kindness, openness, respect, and a spirit of exchange. We are here to share value through skills, services, ideas, items, opportunities, friendship, and genuine connection.",
  },
];

function formatTimeRange(event?: EventDetail) {
  if (!event?.start_time && !event?.end_time) return "Time will be shared soon";
  if (event.start_time && event.end_time) {
    return `${event.start_time} - ${event.end_time}`;
  }
  return event.start_time ?? event.end_time;
}

export default function WelcomeEventBriefing({
  firstName,
  participantType = "guest",
  registrations = [],
  volunteerDetails = [],
}: WelcomeEventBriefingProps) {
  const celebrationRef = useRef<BloomCelebrationHandle>(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const eventRecords = useMemo(
    () =>
      [...events].sort((a, b) => {
        const aTime = new Date(`${a.event_date ?? ""}T12:00:00`).getTime();
        const bTime = new Date(`${b.event_date ?? ""}T12:00:00`).getTime();
        return aTime - bTime;
      }),
    [events]
  );

  const activeSpotlightIndex =
    eventRecords.length > 0 ? spotlightIndex % eventRecords.length : 0;
  const event = eventRecords[activeSpotlightIndex];
  const eventName = event?.name ?? "Casa de Bloom";
  const eventDate = event?.event_date
    ? formatEventDate(event.event_date)
    : "Date will be shared soon";
  const location =
    event?.location ?? event?.address ?? "Location will be shared soon";
  const isVolunteerExperience =
    participantType === "volunteer" ||
    (volunteerDetails.length > 0 && registrations.length === 0);
  const primaryVolunteerDetail = volunteerDetails[0];
  const mediaHelpLabel =
    primaryVolunteerDetail?.can_capture_media === undefined
      ? "Not provided yet"
      : primaryVolunteerDetail.can_capture_media
        ? "Yes"
        : "No";
  const volunteerDetailItems = [
    {
      label: "Availability",
      value: primaryVolunteerDetail?.availability || "Not provided yet",
      icon: Clock,
    },
    {
      label: "Skills/contribution",
      value: primaryVolunteerDetail?.skills_offered || "Not provided yet",
      icon: Sparkles,
    },
    {
      label: "Photo/video help",
      value: mediaHelpLabel,
      icon: Camera,
    },
  ];

  useEffect(() => {
    const shouldCelebrate =
      window.sessionStorage.getItem(REGISTRATION_CELEBRATION_KEY) === "1";
    if (!shouldCelebrate) return;

    window.sessionStorage.removeItem(REGISTRATION_CELEBRATION_KEY);
    const timer = window.setTimeout(
      () => celebrationRef.current?.celebrate(),
      350,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        setEventsError(null);
        const upcomingEvents = await fetchEvents(true);
        if (active) setEvents(upcomingEvents);
      } catch {
        if (active) {
          setEvents([]);
          setEventsError("Upcoming events will be shared soon.");
        }
      }
    };

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (eventRecords.length <= 1) return;

    const interval = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % eventRecords.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [eventRecords.length]);

  return (
    <section className="dashboard-shine relative isolate overflow-hidden rounded-3xl border border-ui-border bg-white/80 p-4 shadow-sm backdrop-blur-md md:p-6">
      <BloomCelebration
        ref={celebrationRef}
        variant={isVolunteerExperience ? "volunteer" : "guest"}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="dashboard-interactive-card dashboard-shine relative rounded-3xl border border-brand-primary/20 bg-gradient-to-br from-brand-light via-white to-brand-accent/10 p-4 text-ui-text-main shadow-sm md:p-5">
          <FloralFrame
            variant="garland"
            className="absolute -right-10 -top-6 z-0 hidden w-[38rem] opacity-[0.38] lg:block"
          />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="dashboard-float-icon mb-3 inline-flex items-center gap-2 rounded-full bg-brand-sunshine/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <Sparkles size={14} />
                {isVolunteerExperience ? "Volunteer welcome" : "Welcome to the platform"}
              </div>
              <h1 className="text-2xl font-extrabold leading-tight text-ui-text-main md:text-3xl">
                {isVolunteerExperience
                  ? `Welcome, ${firstName || "friend"}. Thank you for helping create the Casa de Bloom experience.`
                  : `Welcome, ${firstName || "friend"}. Your Casa de Bloom experience starts here.`}
              </h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-ui-text-muted md:text-base">
                {isVolunteerExperience
                  ? "Your time, service, and support help shape a day filled with connection, generosity, and community."
                  : "Casa de Bloom is a community-centered Reality Show where connections become opportunities through shared value, joyful participation, and genuine human connection."}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              rounded="2xl"
              size="sm"
              icon={<PartyPopper size={17} />}
              onClick={() => celebrationRef.current?.celebrate()}
            >
              Celebrate
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {eventRecords.length > 1 && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-primary/10 bg-white/55 px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                  Upcoming event {activeSpotlightIndex + 1} of {eventRecords.length}
                </p>
                <div className="flex gap-1.5" aria-hidden="true">
                  {eventRecords.map((record, index) => (
                    <span
                      key={record.id ?? `${record.created_at}-${index}`}
                      className={[
                        "h-2 rounded-full transition-all duration-500",
                        index === activeSpotlightIndex
                          ? "w-6 bg-brand-primary"
                          : "w-2 bg-ui-border",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
            <div className="dashboard-interactive-card rounded-2xl border border-brand-primary/15 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Event
              </p>
              <p
                key={`event-${activeSpotlightIndex}`}
                className="dashboard-value-swap mt-1 text-sm font-extrabold text-ui-text-main"
              >
                {eventsError ?? eventName}
              </p>
            </div>
            <div className="dashboard-interactive-card rounded-2xl border border-brand-secondary/25 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                Date & time
              </p>
              <p
                key={`date-${activeSpotlightIndex}`}
                className="dashboard-value-swap mt-1 text-sm font-extrabold text-ui-text-main"
              >
                {eventDate}
              </p>
              <p
                key={`time-${activeSpotlightIndex}`}
                className="dashboard-value-swap mt-0.5 text-xs font-semibold text-ui-text-muted"
              >
                {formatTimeRange(event)}
              </p>
            </div>
            <div className="dashboard-interactive-card rounded-2xl border border-brand-accent/25 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Location
              </p>
              <p
                key={`location-${activeSpotlightIndex}`}
                className="dashboard-value-swap mt-1 text-sm font-extrabold text-ui-text-main"
              >
                {location}
              </p>
            </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="dashboard-interactive-card rounded-2xl border-2 border-brand-sunshine bg-brand-sunshine/20 p-3 shadow-sm md:p-4">
            <div className="flex items-start gap-3">
              <div className="dashboard-float-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-dark shadow-sm">
                <Salad size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  {isVolunteerExperience
                    ? "Also joining the celebration?"
                    : "Potluck reminder"}
                </p>
                <h3 className="mt-1 text-base font-extrabold leading-snug text-ui-text-main md:text-lg">
                  {isVolunteerExperience
                    ? "Community Potluck is optional for volunteers."
                    : "Bring a dish and a drink to share."}
                </h3>
                <p className="mt-1 text-sm font-medium leading-5 text-ui-text-muted">
                  {isVolunteerExperience
                    ? "If you'll be participating beyond your volunteer role, you're welcome to bring one dish and one drink for the Community Potluck."
                    : "Please bring one dish and one drink for the Community Potluck so we can build one generous table together."}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-interactive-card rounded-2xl border-2 border-brand-accent bg-brand-accent/10 p-3 shadow-sm md:p-4">
            <div className="flex items-start gap-3">
              <div className="dashboard-float-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-accent shadow-sm">
                <Gift size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand-accent">
                  Give & Take Table
                </p>
                <h3 className="mt-1 text-base font-extrabold leading-snug text-ui-text-main md:text-lg">
                  {isVolunteerExperience
                    ? "You're welcome to bring one item, but it is optional."
                    : "Bring one beautiful item you no longer use."}
                </h3>
                <p className="mt-1 text-sm font-medium leading-5 text-ui-text-muted">
                  {isVolunteerExperience
                    ? "Your volunteer contribution already matters. If you want to join the table too, bring something someone else may love."
                    : "Choose something someone else may love, then explore the table with the same spirit of generosity."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isVolunteerExperience && (
          <div className="dashboard-interactive-card rounded-2xl border border-brand-primary/20 bg-white/75 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <HandHeart size={18} className="text-brand-primary" />
              <h2 className="text-base font-extrabold text-ui-text-main">
                Your Volunteer Details
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {volunteerDetailItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-ui-border bg-white/70 p-3"
                  >
                    <div className="mb-2 flex items-center gap-2 text-brand-primary">
                      <Icon size={15} />
                      <p className="text-[11px] font-extrabold uppercase tracking-wider">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-5 text-ui-text-main">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <BadgeCheck size={18} className="text-brand-primary" />
            <h2 className="text-base font-extrabold text-ui-text-main">
              Before You Arrive
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {beforeYouArriveItems.map((item) => {
              const Icon = item.icon;
              return (
                <details
                  key={item.title}
                  className="dashboard-interactive-card group rounded-2xl border border-ui-border bg-white/70 p-4 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                        <Icon size={17} />
                      </span>
                      <span className="text-sm font-extrabold text-ui-text-main">
                        {item.title}
                      </span>
                    </span>
                    <ChevronDown
                      size={17}
                      className="shrink-0 text-ui-text-muted transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-6 text-ui-text-muted">
                    {item.body}
                  </p>
                </details>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 p-4 text-sm font-bold text-ui-text-main">
          <HandHeart size={18} className="shrink-0 text-brand-secondary" />
          Thank you for helping make Casa de Bloom warm, generous, and
          community-centered.
        </div>
      </div>
    </section>
  );
}
