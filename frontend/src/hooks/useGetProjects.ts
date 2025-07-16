import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "../types";


const getProjects = async () => {
  const response = await axios.get<Project[]>("http://localhost:8000/projects/");
  return response;
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};
