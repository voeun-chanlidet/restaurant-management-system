import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
  baseURL: env.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config.url.includes("/auth/login");
      if (!isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
