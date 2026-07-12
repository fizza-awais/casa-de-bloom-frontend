import { API_URL } from "../api";
import {
  appendProfileFields,
  PROFILE_IMAGE_REQUEST_TOO_LARGE_MESSAGE,
} from "../profileImages";
import { normalizeRegistrationGender } from "../registrationGender";

export interface RegisterPayload {
  participant_type: "guest" | "volunteer";
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  profession?: string;
  business_name?: string;
  city?: string;
  age_range?: string;
  exact_age?: number;
  gender?: string;
  event_date: string;
  reality_show_understood?: boolean;
  community_guidelines_accepted?: boolean;
  community_guidelines_version?: string;
  photo_video_release_accepted?: boolean;
  positive_experience_agreed?: boolean;
  age_confirmed_21_plus?: boolean;
  special_invite?: boolean;

  // Guest specific fields
  how_heard?: string;
  why_attend?: string;
  attending_as?: string;
  emergency_contact?: string;
  food_allergies?: string;
  bringing_to_grill?: string;
  give_take_contribution?: string;
  service_offering?: string;
  owns_business?: boolean;
  interested_in_business_podcast?: boolean;
  willing_to_share_social?: boolean;

  // Volunteer specific fields
  availability?: string;
  skills_offered?: string;
  can_capture_media?: boolean;
}

export interface RegisterMemberOptions {
  images?: File[];
}

export interface RegisterResponse {
  cb_id: string;
  invitation_number: string;
  participant_type: "guest" | "volunteer";
  member_id?: string;
  registration_id?: string;
  volunteer_id?: string;
  record_type: "registration" | "volunteer";
  record_id: string;
}

interface RegistrationCheckApiResponse {
  email?: string;
  event?: string;
  event_id?: string;
  event_date?: string;
  already_registered?: boolean;
  email_exists?: boolean;
  registered?: boolean;
  exists?: boolean;
  email_registered?: boolean;
  available?: boolean;
  registration_type?: "registration" | "volunteer" | null;
}

export interface RegistrationCheckResult {
  isRegistered: boolean;
  emailExists: boolean;
}

export interface RegistrationGenderQuota {
  gender: string;
  quota: number | null;
  registered: number;
  remaining: number | null;
  quota_reached: boolean;
  can_register: boolean;
  message?: string;
}

export interface RegistrationQuotaResponse {
  event_id: string;
  event_date: string;
  registration_closed: boolean;
  unavailable_genders: string[];
  message?: string;
  male: RegistrationGenderQuota;
  female: RegistrationGenderQuota;
}

export class RegistrationCheckError extends Error {
  field?: "email" | "eventDate";

  constructor(message: string, field?: "email" | "eventDate") {
    super(message);
    this.name = "RegistrationCheckError";
    this.field = field;
  }
}

export class RegistrationApiError extends Error {
  fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "RegistrationApiError";
    this.fieldErrors = fieldErrors;
  }
}

export interface RegistrationMemberDetail {
  id: string;
  cb_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  website: string;
  profession: string;
  business_name: string;
  city: string;
  age_range: string;
  exact_age: number | null;
  gender: string;
  participant_type: "guest" | "volunteer";
  created_at: string;
  updated_at: string;
}

export interface RegistrationEventDetail {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  google_maps_url: string;
  capacity: number | null;
  male_quota: number | null;
  female_quota: number | null;
  created_at: string;
}

export interface RegistrationDetail {
  id: string;
  invitation_number: string;
  how_heard: string;
  why_attend: string;
  attending_as: string;
  emergency_contact: string;
  food_allergies: string;
  bringing_to_grill: string;
  give_take_contribution: string;
  service_offering: string;
  owns_business: boolean | null;
  interested_in_business_podcast: boolean | null;
  willing_to_share_social: boolean;
  status: string;
  created_at: string;
  member_detail: RegistrationMemberDetail;
  event_detail: RegistrationEventDetail;
}

export interface VolunteerDetail {
  id: string;
  invitation_number: string;
  skills_offered: string;
  availability: string;
  can_capture_media: boolean;
  created_at: string;
  member_detail: RegistrationMemberDetail;
  event_detail: RegistrationEventDetail;
}

export async function checkRegistrationEmail(
  email: string,
  eventDate: string,
  participantType: "guest" | "volunteer",
): Promise<RegistrationCheckResult> {
  const response = await fetch(`${API_URL}/api/registration/check/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      event_date: eventDate,
      participant_type: participantType,
    }),
  });

  let data: RegistrationCheckApiResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const field = data?.email ? "email" : data?.event ? "eventDate" : undefined;
    const message =
      field === "email"
        ? "Enter a valid email address."
        : field === "eventDate"
          ? "Please choose a valid upcoming event."
          : "Unable to check registration availability right now. Please try again.";

    throw new RegistrationCheckError(
      message,
      field,
    );
  }

  const isRegistered =
    data?.already_registered ??
    data?.registered ??
    data?.email_registered ??
    (typeof data?.available === "boolean" ? !data.available : false);
  const emailExists = data?.email_exists ?? data?.exists ?? isRegistered;

  return {
    isRegistered,
    emailExists,
  };
}

export async function fetchRegistrationQuota(
  params: { eventId?: string; event?: string; eventDate?: string },
  options: { signal?: AbortSignal } = {},
): Promise<RegistrationQuotaResponse> {
  const url = new URL(`${API_URL}/api/registration/quota/`);

  if (params.eventId) {
    url.searchParams.set("event_id", params.eventId);
  } else if (params.event) {
    url.searchParams.set("event", params.event);
  } else if (params.eventDate) {
    url.searchParams.set("event_date", params.eventDate);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
    credentials: "include",
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error("Unable to check event registration availability right now.");
  }

  return response.json();
}

export async function registerMember(
  payload: RegisterPayload,
  options: RegisterMemberOptions = {},
): Promise<RegisterResponse> {
  const normalizedGender = normalizeRegistrationGender(payload.gender);
  const requestPayload: RegisterPayload = {
    ...payload,
    gender: normalizedGender || payload.gender,
  };
  const hasImages = !!options.images?.length;
  const body = hasImages ? new FormData() : JSON.stringify(requestPayload);
  const headers: HeadersInit = hasImages
    ? {}
    : {
        "Content-Type": "application/json",
      };

  if (body instanceof FormData) {
    appendProfileFields(body, requestPayload);
    options.images?.forEach((image) => body.append("images", image));
  }

  const response = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    headers,
    credentials: "include",
    body,
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong. Please try again.";
    if (response.status === 413) {
      throw new Error(PROFILE_IMAGE_REQUEST_TOO_LARGE_MESSAGE);
    }
    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    if (errorData && typeof errorData === "object") {
      const fieldErrors: Record<string, string> = {};
      Object.entries(errorData).forEach(([field, val]) => {
        const message = Array.isArray(val) ? val.join(" ") : String(val);
        fieldErrors[field] = message;
      });

      const messages = Object.values(fieldErrors);
      if (messages.length > 0) {
        errorMessage = messages.join(" ");
      }
      throw new RegistrationApiError(errorMessage, fieldErrors);
    }

    errorMessage = response.statusText || errorMessage;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchRegistrationDetail(registrationId: string): Promise<RegistrationDetail> {
  const response = await fetch(`${API_URL}/api/registrations/${registrationId}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load your saved registration.");
  }

  return response.json();
}

export async function fetchVolunteerDetail(volunteerId: string): Promise<VolunteerDetail> {
  const response = await fetch(`${API_URL}/api/volunteers/${volunteerId}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load your saved volunteer registration.");
  }

  return response.json();
}

export async function fetchRegistrationRecordDetail(
  recordType: "registration" | "volunteer",
  recordId: string,
): Promise<RegistrationDetail | VolunteerDetail> {
  return recordType === "volunteer"
    ? fetchVolunteerDetail(recordId)
    : fetchRegistrationDetail(recordId);
}
