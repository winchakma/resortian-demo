import type { AffiliateBlog, AffiliateBlogDetail } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

interface ListResponse {
  data: AffiliateBlog[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

async function handle(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message ?? "Request failed");
  }
  return json;
}

export async function listMyBlogs(
  token: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
): Promise<ListResponse> {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_BASE}/blogs/affiliate/mine?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return handle(res);
}

export async function getMyBlog(
  token: string,
  id: string,
): Promise<AffiliateBlogDetail> {
  const res = await fetch(`${API_BASE}/blogs/affiliate/mine/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return handle(res);
}

export async function createMyBlog(
  token: string,
  formData: FormData,
): Promise<AffiliateBlogDetail> {
  const res = await fetch(`${API_BASE}/blogs/affiliate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handle(res);
}

export async function updateMyBlog(
  token: string,
  id: string,
  formData: FormData,
): Promise<AffiliateBlogDetail> {
  const res = await fetch(`${API_BASE}/blogs/affiliate/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handle(res);
}

export async function deleteMyBlog(
  token: string,
  id: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/blogs/affiliate/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

/**
 * Upload an inline image used inside the rich-text body. Returns a URL
 * the editor can drop into an `<img src>`.
 */
export async function uploadContentImage(
  token: string,
  file: File,
): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${API_BASE}/blogs/affiliate/content-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const json = await handle(res);
  if (!json?.url) throw new Error("No URL returned");
  // Backend returns a relative path like /images/blogs/content/xxx.webp.
  return blogImageUrl(json.url as string);
}

export function blogImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}
