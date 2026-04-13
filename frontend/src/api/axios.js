import axios from "axios";

const normalizeBaseUrl = (value) => value?.replace(/\/+$/, "") || "";

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);

  if (configuredBaseUrl) {
    return `${configuredBaseUrl}/api`;
  }

  console.warn(
    "VITE_API_URL is not configured. Set it to your deployed backend URL in Render.",
  );
  return "/api";
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const requestUrl = config.url || "";
  const isAuthRequest = requestUrl.startsWith("/auth/");
  const token = localStorage.getItem("token");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
