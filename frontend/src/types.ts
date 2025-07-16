import type { RETROSPECTIVE_TYPES } from "./utils";

export interface Project {
  id: number;
  name: string;
}

export interface Retrospective {
  id: number;
  name: string;
  retro_type: RETROSPECTIVE_TYPES;
  created_at: string;
  project: Project;
}

export interface ScrumMaster {
  name: string;
  id: number;
  email: string;
}