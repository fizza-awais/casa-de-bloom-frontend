import { API_URL } from "../api";

export interface EventSummary {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  capacity: number;
  male_quota: number | null;
  female_quota: number | null;
  created_at: string;
}

export interface EventOption {
  label: string;
  value: string;
  eventId: string;
}

export async function fetchEvents(upcomingOnly = true): Promise<EventSummary[]> {
  const url = new URL(`${API_URL}/api/events/`);
  if (upcomingOnly) url.searchParams.set("upcoming", "true");

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load events right now.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export function formatEventOption(event: EventSummary): EventOption {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${event.event_date}T00:00:00`));

  return {
    label: `${dateLabel} - ${event.name}`,
    value: event.event_date,
    eventId: event.id,
  };
}
