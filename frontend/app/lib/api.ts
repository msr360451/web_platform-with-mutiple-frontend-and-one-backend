function getBaseUrl() {
  // ✅ fallback also added so it never breaks in local dev
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
}

// ✅ helper to get access token stored after login
function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function apiGet(path: string, useAuth: boolean = false) {
  const BASE_URL = getBaseUrl();

  const token = useAuth ? getAccessToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(data?.message || text || "GET request failed");
  return data;
}

export async function apiPost(path: string, body: any, useAuth: boolean = false) {
  const BASE_URL = getBaseUrl();

  const token = useAuth ? getAccessToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(data?.message || text || "POST request failed");
  return data;
}
