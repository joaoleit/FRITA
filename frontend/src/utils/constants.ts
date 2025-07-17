export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  RETROSPECTIVE: "/retrospective",
  RETROBOARD: "/retroboard",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
  RETROSPECTIVE_FINISHED: "/retrospective-finished",
};

export const RETROSPECTIVE_TYPES = {
  EASY_AS_PIE: "easy_as_pie",
  OPEN_THE_BOX: "open_the_box",
  WELL_NOT_SO_WELL: "well/not_so_well/new_ideas",
} as const;

export type RETROSPECTIVE_TYPES = typeof RETROSPECTIVE_TYPES[keyof typeof RETROSPECTIVE_TYPES];
