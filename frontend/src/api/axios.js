import axios from "axios";

const normalizeBaseUrl = (value) => value?.replace(/\/+$/, "") || "";
const ensureApiSuffix = (value) =>
  value.endsWith("/api") ? value : `${value}/api`;

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (configuredBaseUrl) {
    return ensureApiSuffix(configuredBaseUrl);
  }

  if (isLocalDevelopment) {
    return "http://localhost:8080/api";
  }

  console.warn(
    "VITE_API_URL is not configured. Set it to your deployed backend URL for production builds.",
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
