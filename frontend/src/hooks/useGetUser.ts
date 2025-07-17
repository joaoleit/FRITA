import { useQuery } from "@tanstack/react-query";
import type { Project, ScrumMaster } from "../types";
import { api } from "../utils";

const getUser = async (): Promise<ScrumMaster> => {
  const response = await api.get<ScrumMaster>("/scrumasters/user/", {
    requiresAuth: true,
  });
  return response.data;
};

export const useGetUser = (enabled = false) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled
  });
};
