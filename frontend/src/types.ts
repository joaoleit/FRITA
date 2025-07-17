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
  resume: string;
}

export interface ScrumMaster {
  name: string;
  id: number;
  email: string;
}

export interface Card {
  retro: number;
  author: string;
  content: string;
  type: string;
  created_at: string;
  color: string;
}