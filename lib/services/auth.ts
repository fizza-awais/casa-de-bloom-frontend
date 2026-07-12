import { API_URL, INTERNAL_API_URL } from "../api";
import {
  appendProfileFields,
  ProfileImage,
  PROFILE_IMAGE_REQUEST_TOO_LARGE_MESSAGE,
} from "../profileImages";

export interface MemberEventDetail {
  id?: string;
  name?: string;
  event_type?: string;
  event_date?: string;
  capacity?: number | null;
  created_at?: string;
  location?: string;
  address?: string;
  google_maps_url?: string;
  start_time?: string;
  end_time?: string;
}

export interface MemberEventRecord {
  id?: string;
  invitation_number?: string;
  how_heard?: string;
  why_attend?: string;
  attending_as?: string;
  emergency_contact?: string;
  food_allergies?: string;
  bringing_to_grill?: string;
  give_take_contribution?: string;
  service_offering?: string;
  owns_business?: boolean | null;
  interested_in_business_podcast?: boolean | null;
  willing_to_share_social?: boolean;
  status?: string;
  skills_offered?: string;
  availability?: string;
  can_capture_media?: boolean;
  created_at?: string;
  event_detail?: MemberEventDetail;
}

export interface MemberConsent {
  id: string;
  reality_show_understood: boolean;
  community_guidelines_accepted: boolean;
  community_guidelines_version: string;
  photo_video_release_accepted: boolean;
  positive_experience_agreed: boolean;
  age_confirmed_21_plus: boolean;
  accepted_at: string;
}

export interface MemberProfile {
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
  consents: MemberConsent[];
  registrations: MemberEventRecord[];
  volunteer_details: MemberEventRecord[];
  donations: unknown[];
  images?: ProfileImage[];
}

/**
 * Server-side or client-side verify token endpoint.
 * When called on server (e.g. middleware), must pass the cookie header manually.
 */
export async function verifyToken(cookieHeader?: string): Promise<{ valid: boolean; member_id?: string; cb_id?: string; email?: string; first_name?: string; last_name?: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  try {
    const url = typeof window === "undefined" ? `${INTERNAL_API_URL}/api/auth/verify/` : `${API_URL}/api/auth/verify/`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Token verification failed:", err);
  }

  return { valid: false };
}

/**
 * Silently refresh tokens server-side or client-side.
 */
export async function refreshToken(cookieHeader?: string): Promise<{ success: boolean; headers?: Record<string, string> }> {
  const headers: Record<string, string> = {};
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  try {
    const url = typeof window === "undefined" ? `${INTERNAL_API_URL}/api/auth/refresh/` : `${API_URL}/api/auth/refresh/`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      // If we are on the server side, we must forward the Set-Cookie headers back to the browser
      const setCookie = res.headers.get("Set-Cookie");
      if (setCookie) {
        return { success: true, headers: { "Set-Cookie": setCookie } };
      }
      return { success: true };
    }
  } catch (err) {
    console.error("Token refresh failed:", err);
  }

  return { success: false };
}

/**
 * Fetch current user profile details.
 */
export async function fetchMemberMe(cookieHeader?: string): Promise<MemberProfile | null> {
  const headers: Record<string, string> = {};
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  try {
    const url = typeof window === "undefined" ? `${INTERNAL_API_URL}/api/auth/me/` : `${API_URL}/api/auth/me/`;
    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Fetch profile failed:", err);
  }

  return null;
}

/**
 * Patch member profile data (Complete Profile card).
 */
export async function patchMemberProfile(
  data: Record<string, unknown> | FormData,
  cookieHeader?: string,
): Promise<MemberProfile> {
  const isFormData = data instanceof FormData;
  const headers: Record<string, string> = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
      };
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const url = typeof window === "undefined" ? `${INTERNAL_API_URL}/api/auth/me/patch/` : `${API_URL}/api/auth/me/patch/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    let errMsg = "Failed to update profile.";
    if (res.status === 413) {
      throw new Error(PROFILE_IMAGE_REQUEST_TOO_LARGE_MESSAGE);
    }
    try {
      const errData = await res.json();
      if (errData && errData.error) {
        errMsg = errData.error;
      } else if (errData && typeof errData === "object") {
        const messages = Object.values(errData).map((val) => {
          if (Array.isArray(val)) return val.join(" ");
          return String(val);
        });
        if (messages.length > 0) {
          errMsg = messages.join(" ");
        }
      }
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
}

export function buildMemberProfileFormData({
  data,
  images,
  removeImageIds,
}: {
  data: Record<string, unknown>;
  images?: File[];
  removeImageIds?: string[];
}): FormData {
  const formData = new FormData();
  appendProfileFields(formData, data);
  images?.forEach((image) => formData.append("images", image));
  removeImageIds?.forEach((id) => formData.append("remove_image_ids", id));
  return formData;
}

/**
 * Logout the user.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
