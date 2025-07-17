import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";
import type { Project } from "../types";

const create = async (name: string) => {
  const response = await api.post<Project>(
    "http://localhost:8000/projects/create/",
    {
        name
    },
    {
        requiresAuth: true
    }
  );
  return response.data;
};

export const useCreateProject = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: create,
    onSuccess,
    onError,
  });
};
