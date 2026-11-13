export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Utamakan membaca HTTPS URL dari .env (misal: https://services.brewparts.id/api/v1)
  // atau jika diset ke domain produksi selain localhost default
  if (envUrl && (envUrl.startsWith('https://') || !envUrl.includes('localhost'))) {
    return envUrl;
  }

  // 2. Client-side dynamic host resolution (browser)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    // Jika halaman dibuka via HTTPS atau berada di domain publik (production)
    if (protocol === 'https:' || (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.startsWith('192.168.') && !host.startsWith('10.'))) {
      return envUrl || `${protocol}//${host}/api/v1`;
    }

    // Fallback pengujian lokal / LAN Wi-Fi (menghubungkan ke port 4000 host yang sama)
    return `http://${host}:4000/api/v1`;
  }

  // 3. Fallback server-side / SSR
  return process.env.INTERNAL_API_URL || envUrl || 'http://localhost:4000/api/v1';
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