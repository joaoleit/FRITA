import React from "react";
import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import type { Column } from "./types";

interface ColumnComponentProps {
  colId: string;
  colData: Column;
  children: React.ReactNode;
  headerRenderer?: (
    text: string,
    style?: React.CSSProperties
  ) => React.ReactNode;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
  colId,
  colData,
  children,
  headerRenderer,
}) => {
  const { setNodeRef } = useDroppable({ id: colId });

  return (
    <Box
      ref={setNodeRef}
      key={colId}
      sx={{
        flex: 1,
        height: "inherit",
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
        {headerRenderer ? (
          headerRenderer(colData.name)
        ) : (
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
        )}
      </Typography>
      {children}
    </Box>
  );
};

export default ColumnComponent;
