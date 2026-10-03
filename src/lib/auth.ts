export type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};

const AUTH_KEY = "utilai_auth_user";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api/v1";

type AuthResponse = {
  success?: boolean;
  message?: string;
  detail?: string | { msg?: string }[];
  data?: {
    access_token?: string;
    user?: {
      id?: string;
      full_name?: string;
      email?: string;
    };
  };
};

async function submitAuth(
  endpoint: "login" | "register",
  body: Record<string, string>
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
      "Authentication server is unavailable. Make sure the backend is running."
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
      validationMessage || result?.message || "Authentication failed."
    );
  }

  const user: AuthUser = {
    id: backendUser.id,
    name:
      backendUser.full_name ||
      backendUser.email.split("@")[0] ||
      "UtilAI User",
    email: backendUser.email,
    token: authData.access_token,
  };

  setStoredUser(user);
  return user;
}

export function loginWithPassword(email: string, password: string) {
  return submitAuth("login", { email, password });
}

export function registerWithPassword(
  name: string,
  email: string,
  password: string
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
