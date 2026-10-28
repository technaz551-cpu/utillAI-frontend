import { API_BASE } from "@/lib/api-config";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
  refreshToken?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  plan?: string;
  created_at?: string;
};

const AUTH_KEY = "utilai_auth_user";

type AuthUserPayload = {
  id?: string;
  full_name?: string;
  email?: string;
};

type AuthResponse = {
  success?: boolean;
  message?: string;
  detail?: string | { msg?: string }[];
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: AuthUserPayload;
  } & AuthUserPayload;
};

function userIdFromMePayload(data: AuthResponse["data"]): string | undefined {
  if (!data) return undefined;
  if (data.user?.id) return data.user.id;
  if (typeof data.id === "string" && data.id.trim() !== "") return data.id;
  return undefined;
}

function authUserFromResponse(authData: NonNullable<AuthResponse["data"]>): AuthUser {
  const backendUser = authData.user ?? authData;
  const id = backendUser.id;
  const email = backendUser.email;
  if (!id || !email || !authData.access_token) {
    throw new Error("Invalid authentication response.");
  }
  return {
    id,
    email,
    name:
      backendUser.full_name ||
      email.split("@")[0] ||
      "UtilAI User",
    token: authData.access_token,
    refreshToken: authData.refresh_token,
  };
}

async function submitAuth(
  endpoint: "login" | "register",
  body: Record<string, string>,
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Authentication server is unavailable. Make sure the backend is running.",
    );
  }

  const result = (await response.json().catch(() => null)) as AuthResponse | null;
  const authData = result?.data;
  const backendUser = authData?.user;

  if (
    !response.ok ||
    !result?.success ||
    !authData?.access_token ||
    !backendUser?.id ||
    !backendUser.email
  ) {
    const detail = result?.detail;
    const validationMessage = Array.isArray(detail)
      ? detail.map((item) => item.msg).filter(Boolean).join(" ")
      : detail;
    throw new Error(
      validationMessage || result?.message || "Authentication failed.",
    );
  }

  const user = authUserFromResponse(authData);
  setStoredUser(user);
  return user;
}

export function loginWithPassword(email: string, password: string) {
  return submitAuth("login", { email, password });
}

export function registerWithPassword(
  name: string,
  email: string,
  password: string,
) {
  return submitAuth("register", {
    full_name: name,
    email,
    password,
  });
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    if (!user.token || user.token.startsWith("demo_")) {
      window.localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth:state-change"));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth:state-change"));
}

let refreshInFlight: Promise<boolean> | null = null;

/** Exchange refresh token for a new access token (keeps user signed in for days). */
export async function refreshSession(): Promise<boolean> {
  const user = getStoredUser();
  if (!user?.refreshToken) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: user.refreshToken }),
        });
        const body = (await response.json().catch(() => null)) as AuthResponse | null;
        if (!response.ok || !body?.success || !body.data?.access_token) {
          return false;
        }
        const next = authUserFromResponse(body.data);
        setStoredUser({
          ...next,
          refreshToken: body.data.refresh_token || user.refreshToken,
        });
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const user = getStoredUser();
  if (!user?.token) return null;

  const load = async (token: string) => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  };

  let response = await load(user.token);
  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) return null;
    const again = getStoredUser();
    if (!again?.token) return null;
    response = await load(again.token);
  }

  if (!response.ok) return null;
  const body = (await response.json().catch(() => null)) as AuthResponse | null;
  const data = body?.data;
  if (!data?.id || !data.email) return null;

  const profile: UserProfile = {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: (data as { role?: string }).role,
    plan: (data as { plan?: string }).plan,
    created_at: (data as { created_at?: string }).created_at,
  };

  setStoredUser({
    ...user,
    id: profile.id,
    email: profile.email,
    name: profile.full_name || user.name,
  });

  return profile;
}

let sessionValidation: Promise<boolean> | null = null;

/**
 * Validates session; refreshes access token when expired.
 * Keeps the user signed in on brief network errors (local session retained).
 */
export async function ensureValidSession(): Promise<boolean> {
  const user = getStoredUser();
  if (!user?.token) return false;

  if (!sessionValidation) {
    sessionValidation = (async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
          const body = (await response.json().catch(() => null)) as AuthResponse | null;
          if (body?.success && body.data) {
            const data = body.data;
            if (data.email && userIdFromMePayload(data)) {
              setStoredUser({
                ...user,
                id: data.id || data.user?.id || user.id,
                email: data.email || data.user?.email || user.email,
                name:
                  data.full_name ||
                  data.user?.full_name ||
                  user.name,
              });
            }
          }
          return true;
        }

        if (response.status === 401) {
          const refreshed = await refreshSession();
          if (refreshed) return true;
          clearStoredUser();
          return false;
        }

        // Server error — don't force re-login if we still have a stored session.
        return true;
      } catch {
        return true;
      } finally {
        sessionValidation = null;
      }
    })();
  }
  return sessionValidation;
}

/** @deprecated Use ensureValidSession */
export async function validateStoredSession(): Promise<boolean> {
  return ensureValidSession();
}
