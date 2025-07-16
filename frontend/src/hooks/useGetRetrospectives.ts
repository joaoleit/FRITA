import { useQuery } from "@tanstack/react-query";
import type { Project, Retrospective } from "../types";
import { api } from "../utils";

const getRetrospectives = async (
  name?: string,
  project?: number,
  retro_type?: string,
  date?: string,
): Promise<Retrospective[]> => {
  const response = await api.get<Retrospective[]>("/retrospectives/get/", {
    requiresAuth: true,
    params: {
      name,
      project,
      retro_type,
      date
    },
  });
  return response.data;
};

export const useGetRetrospectives = (
  name?: string,
  project?: number,
  retro_type?: string,
  date?: string,
) => {
  return useQuery({
    queryKey: ["retrospectives", name, project, retro_type, date],
    queryFn: () => getRetrospectives(name, project, retro_type, date),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
