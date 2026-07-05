import axios from "axios";
import { clearAuth, getStoredToken } from "../auth/session";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    Accept: "application/json"
  },
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      clearAuth();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

