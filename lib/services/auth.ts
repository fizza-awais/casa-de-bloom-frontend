import { API_URL, INTERNAL_API_URL } from "../api";

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
  consents: any[];
  registrations: any[];
  volunteer_details: any[];
  donations: any[];
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
export async function patchMemberProfile(data: Record<string, any>, cookieHeader?: string): Promise<MemberProfile> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const url = typeof window === "undefined" ? `${INTERNAL_API_URL}/api/auth/me/patch/` : `${API_URL}/api/auth/me/patch/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errMsg = "Failed to update profile.";
    try {
      const errData = await res.json();
      if (errData && errData.error) {
        errMsg = errData.error;
      }
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
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
