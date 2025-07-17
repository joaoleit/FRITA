import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api } from "../utils";
import type { Card } from "../types";

interface CardData {
  retro_id: number;
  author: string;
  content: string;
  type: string;
  color: string;
}

const create = async (cardData: CardData) => {
  const response = await api.post<Card>(
    "http://localhost:8000/cards/create/",
    cardData,
    {
        requiresAuth: true
    }
  );
  return response.data;
};

export const useCreateCard = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: create,
    onSuccess,
    onError,
  });
};
