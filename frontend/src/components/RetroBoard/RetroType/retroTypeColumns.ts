import { RETROSPECTIVE_TYPES } from "../../../utils";
import type { Columns } from "../types";

const columnsMap: Record<RETROSPECTIVE_TYPES, Columns> = {
  [RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL]: {
    well: { name: "Well" },
    not_well: { name: "Not so Well" },
    new_ideas: { name: "New Ideas" },
  },
  [RETROSPECTIVE_TYPES.OPEN_THE_BOX]: {
    new_ideas: { name: "Novas Ideias" },
    stop: { name: "Parar!" },
    recycle: { name: "Reciclar" },
  },
  [RETROSPECTIVE_TYPES.EASY_AS_PIE]: {
    humblePie: { name: "Humble Pie" },
    easyAsPie: { name: "Easy as Pie" },
    cutiePie: { name: "Cutie Pie" },
    pieInTheSky: { name: "Pie in the Sky" },
    shooFlyPie: { name: "Shoo Fly Pie" },
  },
};

export const getColumns = (type: RETROSPECTIVE_TYPES): Columns => {
  return columnsMap[type] || columnsMap[RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL];
};
