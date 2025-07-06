import React from "react";
import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { Column } from "./types";

interface ColumnComponentProps {
  colId: string;
  colData: Column;
  children: React.ReactNode;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
  colId,
  colData,
  children,
}) => {
  const { setNodeRef } = useDroppable({ id: colId });

  return (
    <Box
      ref={setNodeRef}
      key={colId}
      sx={{
        flex: 1,
        minHeight: 600,
        backgroundColor: "#f0f0f0",
        p: 2,
        borderRadius: 2,
        position: "relative",
        border: "2px dashed #ccc",
      }}
    >
      <Typography variant="h6" textAlign="center" gutterBottom>
        {colData.name}
      </Typography>
      {children}
    </Box>
  );
};

export default ColumnComponent;
