import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface ScrumMasterData {
  name: string;
  email: string;
  password: string;
}

const create = async (scrumMaster: ScrumMasterData) => {
  const response = await axios.post(
    "http://localhost:8000/scrumasters/create/",
    scrumMaster,
  );
  return response.data;
};

export const useCreateScrumMaster = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: create,
    onSuccess,
    onError,
  });
};
