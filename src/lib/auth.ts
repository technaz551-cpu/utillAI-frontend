export type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};

const AUTH_KEY = "utilai_auth_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
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
