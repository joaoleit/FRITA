// utils/auth.ts
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface JWTToken {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTToken>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const checkAuth = async (): Promise<string | null> => {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  if (access && !isTokenExpired(access)) {
    return access;
  }

  if (refresh) {
    try {
      const res = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh,
      });
      localStorage.setItem("access_token", res.data.access);
      return res.data.access;
    } catch (err) {
      console.warn("Refresh token inválido");
    }
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return null;
};
