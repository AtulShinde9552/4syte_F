
const DEFAULT_API_BASE_URL = "/clientportal";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_BASE_URL || "https://api.4syte.io"
).replace(/\/+$/, "");

export function apiUrl(path = "") {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}

async function request(path, options = {}) {
  const finalHeaders = {
    "ngrok-skip-browser-warning": "69420",
    ...(options.headers || {})
  };

  const response = await fetch(apiUrl(path), { 
    ...options, 
    headers: finalHeaders 
  });
  
  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch (e) {
    result = text;
  }

  if (!response.ok) {
    const message = typeof result === "object" ? result?.message : result;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return result;
}

export function get(path, options = {}) {
  return request(path, { ...options, method: "GET" });
}

export function post(path, body, options = {}) {
  return request(path, {
    ...options,
    method: "POST",
    headers:
      body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export function put(path, body, options = {}) {
  return request(path, {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options.headers },
    body: JSON.stringify(body),
  });
}

export function patch(path, body, options = {}) {
  return request(path, {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options.headers },
    body: JSON.stringify(body),
  });
}

export function del(path, options = {}) {
  return request(path, { ...options, method: "DELETE" });
}

export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = String(path).replace(/^\/+/, "");
  if (normalizedPath.startsWith("uploads/")) {
    return `${ASSET_BASE_URL}/${normalizedPath}`;
  }

  return apiUrl(path);
}