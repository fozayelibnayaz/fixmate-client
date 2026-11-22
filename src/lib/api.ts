import { API_URL } from "./constants";

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(0, "Cannot reach the server. Please try again.");
  }

  const payload = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      (payload as { message?: string })?.message ?? `Request failed (${response.status})`,
    );
  }
  return payload as T;
};

export const post = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });

export const patch = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) });

export const remove = <T>(path: string) => apiFetch<T>(path, { method: "DELETE" });
