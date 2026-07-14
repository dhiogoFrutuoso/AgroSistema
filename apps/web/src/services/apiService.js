import { getStorage } from "./storageService.js";

const STORAGE_KEY = "@arroz:configuracoes";

let defaultBackendUrl = "http://127.0.0.1:8090";
if (import.meta.env.VITE_API_URL?.includes("agrosistema.onrender.com")) {
  defaultBackendUrl = "https://agrosistema.onrender.com";
}

const defaultConfig = {
  backendUrl: defaultBackendUrl
};

export function getConfig() {
  return getStorage(STORAGE_KEY, defaultConfig);
}

export function getBackendUrl() {
  const config = getConfig();
  
  if (config.backendUrl && config.backendUrl.includes("agrosistema.onrender.com") && config.backendUrl.includes("[")) {
    return "https://agrosistema.onrender.com";
  }
  
  return config.backendUrl || defaultConfig.backendUrl;
}

export async function apiRequest(path, options = {}) {
  const url = `${getBackendUrl()}/api/v1${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json"
  };

  const mergedOptions = {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options
  };

  const response = await fetch(url, mergedOptions);
  return response;
}