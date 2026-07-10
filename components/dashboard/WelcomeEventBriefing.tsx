"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
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
  event_detail?: EventDetail;
}

interface WelcomeEventBriefingProps {
  firstName: string;
  registrations?: DashboardEventRecord[];
  volunteerDetails?: DashboardEventRecord[];
}

interface ConfettiPiece {
  id: number;
  left: number;
  drift: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = [
  "#FF3F82",
  "#99CC00",
  "#33C9DC",
  "#FFD23F",
  "#B32B5C",
  "#1F1B24",
];

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

function buildConfettiBurst(): ConfettiPiece[] {
  return Array.from({ length: 34 }, (_, index) => ({
    id: Date.now() + index,
    left: 8 + Math.random() * 84,
    drift: -90 + Math.random() * 180,
    delay: Math.random() * 0.2,
    duration: 1.6 + Math.random() * 1.2,
    rotate: -240 + Math.random() * 480,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    size: 7 + Math.random() * 7,
  }));
}

function formatTimeRange(event?: EventDetail) {
  if (!event?.start_time && !event?.end_time) return "Time will be shared soon";
  if (event.start_time && event.end_time) {
    return `${event.start_time} - ${event.end_time}`;
  }
  return event.start_time ?? event.end_time;
}

export default function WelcomeEventBriefing({
  firstName,
}: WelcomeEventBriefingProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
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

  const fireConfetti = useCallback(() => {
    const burst = buildConfettiBurst();
    setConfetti((current) => [...current.slice(-20), ...burst]);
    window.setTimeout(() => {
      setConfetti((current) =>
        current.filter(
          (piece) => !burst.some((newPiece) => newPiece.id === piece.id)
        )
      );
    }, 3200);
  }, []);

  useEffect(() => {
    const shouldCelebrate =
      window.sessionStorage.getItem(REGISTRATION_CELEBRATION_KEY) === "1";
    if (!shouldCelebrate) return;

    window.sessionStorage.removeItem(REGISTRATION_CELEBRATION_KEY);
    const timer = window.setTimeout(fireConfetti, 350);
    return () => window.clearTimeout(timer);
  }, [fireConfetti]);

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
      <div
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        aria-hidden="true"
      >
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="absolute top-0 rounded-sm opacity-90"
            style={
              {
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 1.45}px`,
                backgroundColor: piece.color,
                animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
                "--confetti-drift": `${piece.drift}px`,
                "--confetti-rotate": `${piece.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="dashboard-interactive-card dashboard-shine rounded-3xl border border-brand-primary/20 bg-gradient-to-br from-brand-light via-white to-brand-accent/10 p-4 text-ui-text-main shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="dashboard-float-icon mb-3 inline-flex items-center gap-2 rounded-full bg-brand-sunshine/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <Sparkles size={14} />
                Welcome to the platform
              </div>
              <h1 className="text-2xl font-extrabold leading-tight text-ui-text-main md:text-3xl">
                Welcome, {firstName || "friend"}. Your Casa de Bloom experience
                starts here.
              </h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-ui-text-muted md:text-base">
                Casa de Bloom is a community-centered Reality Show where
                connections become opportunities through shared value, joyful
                participation, and genuine human connection.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              rounded="2xl"
              size="sm"
              icon={<PartyPopper size={17} />}
              onClick={fireConfetti}
            >
              Celebrate
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {eventRecords.length > 1 && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-primary/10 bg-white/55 px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                  Showing event {activeSpotlightIndex + 1} of {eventRecords.length}
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
                  Potluck reminder
                </p>
                <h3 className="mt-1 text-base font-extrabold leading-snug text-ui-text-main md:text-lg">
                  Bring a dish and a drink to share.
                </h3>
                <p className="mt-1 text-sm font-medium leading-5 text-ui-text-muted">
                  This is part of the Casa de Bloom experience, so please plan
                  ahead.
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
                  Bring something meaningful to give, and discover something to
                  take.
                </h3>
                <p className="mt-1 text-sm font-medium leading-5 text-ui-text-muted">
                  Items, samples, services, skills, resources, or thoughtful
                  community offerings are welcome.
                </p>
              </div>
            </div>
          </div>
        </div>

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
