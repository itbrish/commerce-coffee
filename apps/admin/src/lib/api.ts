export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  // 1. Utamakan membaca URL produksi/HTTPS dari .env (misal: https://services.brewparts.id/api/v1)
  if (envUrl && (envUrl.startsWith('https://') || !envUrl.includes('localhost'))) {
    return envUrl.replace(/\/+$/, '');
  }

  // 2. Client-side dynamic host resolution (Browser)
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;

    // Jika diakses langsung via port 3000/3001 (localhost, LAN IP, atau IP publik VPS), arahkan ke port 4000 host yang sama
    if (port === '3000' || port === '3001') {
      return `${protocol}//${hostname}:4000/api/v1`;
    }

    // Jika diakses via domain brewparts.id (Nginx/Cloudflare SSL reverse proxy), arahkan ke subdomain API
    if (hostname.endsWith('brewparts.id') && hostname !== 'services.brewparts.id') {
      return 'https://services.brewparts.id/api/v1';
    }

    // Fallback domain produksi lainnya tanpa port
    return `${protocol}//${hostname}/api/v1`;
  }

  // 3. Fallback server-side / SSR
  return process.env.INTERNAL_API_URL || envUrl || 'http://localhost:4000/api/v1';
}

export const API_URL = getApiUrl();

export async function fetchAdminApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/${cleanEndpoint}`;
  
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('atelier_admin_token');
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `Admin API Error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
}