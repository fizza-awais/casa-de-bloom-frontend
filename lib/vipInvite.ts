import { EventOption } from "./services/events";

export interface VipInviteParams {
  email: string;
  event: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface SearchParamsLike {
  get(name: string): string | null;
}

export function getVipInviteParams(
  searchParams: SearchParamsLike,
): VipInviteParams | null {
  const isSpecialInvite =
    searchParams.get("special_invite")?.trim().toLowerCase() === "true";
  const email = searchParams.get("email")?.trim() ?? "";
  const event = searchParams.get("event")?.trim() ?? "";
  const firstName = searchParams.get("first_name")?.trim() ?? "";
  const lastName = searchParams.get("last_name")?.trim() ?? "";
  const phone = searchParams.get("phone")?.trim() ?? "";

  if (!isSpecialInvite || !email || !event || !firstName || !lastName || !phone) {
    return null;
  }

  return {
    email,
    event,
    firstName,
    lastName,
    phone,
  };
}

export function resolveVipEventDate(
  eventParam: string,
  eventOptions: EventOption[],
): string {
  const matchedEvent = eventOptions.find(
    (option) => option.eventId === eventParam || option.value === eventParam,
  );

  if (matchedEvent) return matchedEvent.value;

  return /^\d{4}-\d{2}-\d{2}$/.test(eventParam) ? eventParam : "";
}
