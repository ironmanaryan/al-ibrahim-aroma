export async function adminApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isForm = options.body instanceof FormData;
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(String(data.error ?? "Request failed"));
  }
  return data as T;
}
