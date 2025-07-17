import { useQuery } from "@tanstack/react-query";
import type { Card, Project, Retrospective } from "../types";
import { api } from "../utils";

const get = async (id: number): Promise<Card[]> => {
  const response = await api.get<Card[]>(`/retrospectives/cards/${id}`, {
    requiresAuth: true,
  });
  return response.data;
};

export const useGetRetroCards = (
  id: number
) => {
  return useQuery({
    queryKey: ["retrospective-cards", id],
    queryFn: () => get(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
