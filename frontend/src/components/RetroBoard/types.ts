export interface CardItem {
  id: string;
  content: string;
  x: number;
  y: number;
  columnId: string;
}

export interface Column {
  name: string;
}

export interface Columns {
  [key: string]: Column;
}
