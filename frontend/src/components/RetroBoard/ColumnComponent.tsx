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
        p: 2,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: "52px",
          letterSpacing: "0.2px",
          textAlign: "center",
        }}
      >
        {colData.name}
      </Typography>
      {children}
    </Box>
  );
};

export default ColumnComponent;
