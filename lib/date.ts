export function formatEventDate(eventDate: string) {
  if (!eventDate) return "Not available";
  try {
    return new Date(`${eventDate}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return eventDate;
  }
}

function formatEventTime(value?: string | null) {
  if (!value) return "";
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value.trim();
  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatEventTimeRange(start?: string | null, end?: string | null) {
  const formattedStart = formatEventTime(start);
  const formattedEnd = formatEventTime(end);
  if (formattedStart && formattedEnd) return `${formattedStart} – ${formattedEnd}`;
  return formattedStart || formattedEnd;
}
