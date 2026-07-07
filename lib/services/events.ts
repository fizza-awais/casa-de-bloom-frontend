import { API_URL } from "../api";

export interface EventSummary {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  capacity: number;
  created_at: string;
}

export interface EventOption {
  label: string;
  value: string;
}

export async function fetchEvents(): Promise<EventSummary[]> {
  const response = await fetch(`${API_URL}/api/events/`, {
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
  };
}
