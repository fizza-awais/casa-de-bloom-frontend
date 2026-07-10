import { API_URL } from "../api";
import { appendProfileFields } from "../profileImages";

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
  reality_show_understood: boolean;
  community_guidelines_accepted: boolean;
  community_guidelines_version: string;
  photo_video_release_accepted: boolean;
  positive_experience_agreed: boolean;
  age_confirmed_21_plus: boolean;

  // Guest specific fields
  how_heard?: string;
  why_attend?: string;
  attending_as?: string;
  emergency_contact?: string;
  food_allergies?: string;
  bringing_to_grill?: string;
  give_take_contribution?: string;
  service_offering?: string;
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

export class RegistrationCheckError extends Error {
  field?: "email" | "eventDate";

  constructor(message: string, field?: "email" | "eventDate") {
    super(message);
    this.name = "RegistrationCheckError";
    this.field = field;
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
  capacity: number | null;
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

export async function registerMember(
  payload: RegisterPayload,
  options: RegisterMemberOptions = {},
): Promise<RegisterResponse> {
  const hasImages = !!options.images?.length;
  const body = hasImages ? new FormData() : JSON.stringify(payload);
  const headers: HeadersInit = hasImages
    ? {}
    : {
        "Content-Type": "application/json",
      };

  if (body instanceof FormData) {
    appendProfileFields(body, payload);
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
    try {
      const errorData = await response.json();
      if (errorData && typeof errorData === "object") {
        // If it is a dictionary of field errors, map them to a friendly message
        const messages = Object.values(errorData).map((val) => {
          if (Array.isArray(val)) {
            return val.join(" ");
          }
          return String(val);
        });
        if (messages.length > 0) {
          errorMessage = messages.join(" ");
        }
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
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
