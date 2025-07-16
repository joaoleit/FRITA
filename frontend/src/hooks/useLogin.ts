import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../utils";

interface LoginResponse {
  access: string;
  refresh: string;
}

const login = async (data: { email: string; password: string }) => {
  
  const response = await axios.post<LoginResponse>(
    "http://localhost:8000/api/token/",
    data
  );
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
};

export const useLogin = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError,
  });
};
