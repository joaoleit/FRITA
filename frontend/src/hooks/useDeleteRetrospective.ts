import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";
import type { Card } from "../types";

const deleteReq = async (retroId: number) => {
  const response = await api.delete(
    `http://localhost:8000/retrospectives/delete/${retroId}/`,
    {
        requiresAuth: true
    }
  );
  return response.data;
};

export const useDeleteRetrospective = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: deleteReq,
    onSuccess,
    onError,
  });
};
