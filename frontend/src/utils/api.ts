import axios from "axios";
import { checkAuth } from "../utils/auth";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

api.interceptors.request.use(async (config) => {
  if (config.requiresAuth) {
    const token = await checkAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
      throw new axios.Cancel("Token inválido. Redirecionando para login.");
    }
  }

  return config;
});
