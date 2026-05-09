const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: "USER" | "ADMIN" | "HOTEL_OWNER";
  isVerified: boolean;
  isAffiliateMember: boolean;
  avatar: string | null;
  address?: string | null;
  memberSince?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // for HttpOnly refresh_token cookie
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Request failed");
  }
  return data as T;
}

export async function apiRegister(body: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  role?: "USER" | "HOTEL_OWNER";
  isAffiliateMember?: boolean;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiLogin(body: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiLogout(token: string): Promise<void> {
  await request("/auth/logout", { method: "POST" }, token);
}

export async function apiRefresh(): Promise<{ accessToken: string }> {
  return request<{ accessToken: string }>("/auth/refresh", { method: "POST" });
}

export async function apiMe(token: string): Promise<AuthUser> {
  return request<AuthUser>("/auth/me", {}, token);
}
