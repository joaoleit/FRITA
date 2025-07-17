import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";
import type { Card } from "../types";

const request = async (data: {retroId: number,name: string}) => {
  const response = await api.post(
    `http://localhost:8000/retrospectives/${data.retroId}/add_participant/`,
    { name: data.name },
    {
      requiresAuth: true,
    }
  );
  return response.data;
};

export const useAddParticipant = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: request,
    onSuccess,
    onError,
  });
};
