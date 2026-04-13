import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
