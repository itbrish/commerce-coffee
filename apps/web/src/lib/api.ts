export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:4000/api/v1`;
  }
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/${cleanEndpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store', // Always fetch fresh real-time data & uploaded images
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
}