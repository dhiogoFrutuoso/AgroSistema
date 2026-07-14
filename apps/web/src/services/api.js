let envUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

if (envUrl.includes("agrosistema.onrender.com")) {
  envUrl = "https://agrosistema.onrender.com";
}

const API_BASE_URL = envUrl;

function getToken() {
  return localStorage.getItem("@arroz:token") || "";
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const data = contentType && contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      return {
        ok: false,
        offline: false,
        status: response.status,
        data,
        error: data?.error || data?.message || "Erro na API",
      };
    }

    return {
      ok: true,
      offline: false,
      status: response.status,
      data,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      offline: true,
      status: 0,
      data: null,
      error: "Backend offline ou inacessivel",
    };
  }
}

export const api = {
  get: (path) => request(path, { method: "GET" }),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path) => request(path, { method: "DELETE" }),
};

export { API_BASE_URL };