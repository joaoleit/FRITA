export interface CardItem {
  id: string;
  content: string;
  x: number;
  y: number;
  columnId: string;
  user: string;
  color?: string;
}

export interface Column {
  name: string;
}

export interface Columns {
  [key: string]: Column;
}

export interface User {
  name: string;
  id: string;
  isScrumMaster: boolean;
}

export interface Board {
  id: string;
  type: string;
  scrumMaster: string;
  cards: Record<string, CardItem>;
  users: Record<string, User>;
  // retroTime: number;
  // retroTimeRunning: boolean;
}
