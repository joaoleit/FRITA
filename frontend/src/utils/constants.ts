export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  RETROSPECTIVE: "/retrospective",
  RETROBOARD: "/retroboard",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
};

export const RETROSPECTIVE_TYPES = {
  EASY_AS_PIE: "easy-as-pie",
  OPEN_THE_BOX: "open-the-box",
  WELL_NOT_SO_WELL: "well-not-so-well",
} as const;

export type RETROSPECTIVE_TYPES = typeof RETROSPECTIVE_TYPES[keyof typeof RETROSPECTIVE_TYPES];
