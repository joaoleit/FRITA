import { Divider } from "@mui/material";
import React from "react";

const WellBoard: React.FC<{
  columns: Record<string, any>;
  cardsByColumn: Record<string, any[]>;
  ColumnComponent: React.ComponentType<any>;
  DraggableCardItem: React.ComponentType<any>;
  handleUpdateCardContent: (id: string, content: string) => void;
  handleDeleteCard: (id: string) => void;
}> = ({
  columns,
  cardsByColumn,
  ColumnComponent,
  DraggableCardItem,
  handleUpdateCardContent,
  handleDeleteCard,
}) =>
  Object.entries(columns).map(([colId, colData], idx, arr) => (
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
  ));

export default WellBoard;
