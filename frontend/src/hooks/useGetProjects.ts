import { useQuery } from "@tanstack/react-query";
import type { Project } from "../types";
import { api } from "../utils";

const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects/", {
    requiresAuth: true,
  });
  return response.data;
};

export const useGetProjects = (enabled = true) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled
  });
};
