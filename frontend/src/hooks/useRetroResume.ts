import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";



const request = async (retroId: number) => {
  const response = await api.post(
    `http://localhost:8000/retrospectives/resume/${retroId}/`,
    {},
    {
        requiresAuth: true
    }
  );
  return response.data;
};

export const useRetroResume = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: request,
    onSuccess,
    onError,
  });
};
