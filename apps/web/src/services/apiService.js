import { getStorage } from "./storageService.js";

const STORAGE_KEY = "@arroz:configuracoes";

const defaultConfig = {
  backendUrl: "http://127.0.0.1:8090"
};

export function getConfig() {
  return getStorage(STORAGE_KEY, defaultConfig);
}

export function getBackendUrl() {
  const config = getConfig();
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
