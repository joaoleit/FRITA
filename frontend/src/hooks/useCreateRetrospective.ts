import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";
import type { Project } from "../types";

interface RetroData {
    project_id: number;
    name: string;
    retro_type: string;
}

const create = async (retro: RetroData) => {
  const response = await api.post<Project>(
    "http://localhost:8000/retrospectives/create/",
    retro,
    {
        requiresAuth: true
    }
  );
  return response.data;
};

export const useCreateRetrospective = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: create,
    onSuccess,
    onError,
  });
};
