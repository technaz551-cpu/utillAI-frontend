export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";
export const SITE_NAME = "ToolForge";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Request failed");
  return (body.data ?? body) as T;
}

export async function fetchTool(category: string, slug: string) {
  const res = await fetch(`${API_BASE}/tools/${category}/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function fetchCategories() {
  return apiFetch<Array<Record<string, unknown>>>("/categories");
}

export async function fetchTools(params?: { category?: string; popular?: boolean }) {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.popular) q.set("popular", "true");
  return apiFetch<Array<Record<string, unknown>>>(`/tools?${q}`);
}
