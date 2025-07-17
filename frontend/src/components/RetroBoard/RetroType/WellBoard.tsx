import { Box, Divider } from "@mui/material";
import React from "react";
import ColumnComponent from "../ColumnComponent";
import { getColumns } from "./retroTypeColumns";
import { RETROSPECTIVE_TYPES } from "../../../utils";
import DraggableCardItem from "../DraggableCardItem";

const columns = getColumns(RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL);

const WellBoard: React.FC<{
  cardsByColumn: Record<string, any[]>;
  handleUpdateCardContent: (id: string, content: string) => void;
  handleDeleteCard: (id: string) => void;
}> = ({ cardsByColumn, handleUpdateCardContent, handleDeleteCard }) => (
  <Box display="flex" alignItems="stretch" flex={1}>
    {Object.entries(columns).map(([colId, colData], idx, arr) => (
      <React.Fragment key={colId}>
        <ColumnComponent colId={colId} colData={colData}>
          {cardsByColumn[colId]?.map((item) => (
            <DraggableCardItem
              key={item.id}
              item={item}
              onUpdateContent={handleUpdateCardContent}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </ColumnComponent>
        {idx < arr.length - 1 && (
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, bgcolor: "#000" }}
          />
        )}
      </React.Fragment>
    ))}
  </Box>
);

export default WellBoard;
