import { useQuery } from "@tanstack/react-query";
import type { Project, Retrospective } from "../types";
import { api } from "../utils";

const getRetrospective = async (id: number): Promise<Retrospective> => {
  const response = await api.get<Retrospective>(`/retrospectives/get/${id}`, {
    requiresAuth: true,
  });
  return response.data;
};

export const useGetRetrospective = (
  id: number
) => {
  return useQuery({
    queryKey: ["retrospective", id],
    queryFn: () => getRetrospective(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
