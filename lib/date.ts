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
