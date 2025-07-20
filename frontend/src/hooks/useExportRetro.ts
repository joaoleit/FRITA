import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";

const exportRetrospective = async (id: number): Promise<Blob> => {
  const response = await api.get<Blob>(`/retrospectives/${id}/export/`, {
    responseType: "blob",
    requiresAuth: true,
  });
  return response.data;
};

export const useExportRetro = () => {
  return useMutation({
    mutationFn: exportRetrospective,
  });
};
