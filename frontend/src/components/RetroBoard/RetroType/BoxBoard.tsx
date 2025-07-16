import { Box, Divider } from "@mui/material";
import React from "react";
import { getColumns } from "./retroTypeColumns";
import { RETROSPECTIVE_TYPES } from "../../../utils";
import ColumnComponent from "../ColumnComponent";
import DraggableCardItem from "../DraggableCardItem";

const columns = getColumns(RETROSPECTIVE_TYPES.OPEN_THE_BOX);

const BoxBoard: React.FC<{
  cardsByColumn: Record<string, any[]>;
  handleUpdateCardContent: (id: string, content: string) => void;
  handleDeleteCard: (id: string) => void;
}> = ({ cardsByColumn, handleUpdateCardContent, handleDeleteCard }) => {
  // Layout variables
  const gridRows = ["70%", "30%"]; // heights
  const gridCols = ["50%", "50%"]; // widths
  const dividerColor = "#000";
  const verticalDividerHeight = "55%";
  const horizontalDividerWidth = "45%";
  const horizontalDividerTop = gridRows[0];
  const verticalDividerLeft = gridCols[0];
  const imageSize = { width: 180, height: 160 };
  const imageTop = "65%";
  const imageLeft = "50%";
  const gapPercent = 10; // percent gap for image in horizontal divider

  // Get column keys for layout
  const colKeys = Object.keys(columns);
  const [col1, col2, col3] = colKeys;

  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateRows: gridRows.join(" "),
        gridTemplateColumns: gridCols.join(" "),
        height: "100%",
        width: "100%",
        gap: 0,
      }}
      flex={1}
    >
      {/* First column: top left */}
      <Box sx={{ gridRow: "1", gridColumn: "1", height: "100%" }}>
        <ColumnComponent
          colId={col1}
          colData={columns[col1]}
          headerRenderer={(text) => (
            <Box
              sx={{
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "0.2px",
                textAlign: "center",
                display: "inline-block",
                position: "absolute",
                bottom: 200,
                right: 70,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: "50%",
                  right: 30,
                  transform: "translateY(-50%)",
                  width: 120,
                  height: 120,
                  backgroundImage: "url(/lamp%201.png)",
                  backgroundRepeat: "no-repeat",
                },
                "&::after": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 50,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 100,
                  backgroundImage: "url(/seta%201.png)",
                  backgroundRepeat: "no-repeat",
                },
              }}
            >
              {text.split(" ").map((word, idx) => (
                <span key={idx} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
            </Box>
          )}
        >
          {cardsByColumn[col1]?.map((item) => (
            <DraggableCardItem
              key={item.id}
              item={item}
              onUpdateContent={handleUpdateCardContent}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </ColumnComponent>
      </Box>
      {/* Second column: top right */}
      <Box sx={{ gridRow: "1", gridColumn: "2", height: "100%" }}>
        <ColumnComponent colId={col2} colData={columns[col2]}>
          {cardsByColumn[col2]?.map((item) => (
            <DraggableCardItem
              key={item.id}
              item={item}
              onUpdateContent={handleUpdateCardContent}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </ColumnComponent>
      </Box>
      {/* Third column: bottom, spans both columns */}
      <Box sx={{ gridRow: "2", gridColumn: "1 / span 2", height: "100%" }}>
        <ColumnComponent colId={col3} colData={columns[col3]}>
          {cardsByColumn[col3]?.map((item) => (
            <DraggableCardItem
              key={item.id}
              item={item}
              onUpdateContent={handleUpdateCardContent}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </ColumnComponent>
      </Box>

      {/* Vertical divider between first and second columns (shorter) */}
      <Divider
        orientation="vertical"
        sx={{
          position: "absolute",
          top: 0,
          left: verticalDividerLeft,
          height: verticalDividerHeight,
          bgcolor: dividerColor,
          zIndex: 1,
        }}
      />
      {/* Horizontal divider between top and bottom rows, with gap for image */}
      {/* Left segment */}
      <Divider
        orientation="horizontal"
        sx={{
          position: "absolute",
          top: horizontalDividerTop,
          left: 0,
          width: horizontalDividerWidth,
          bgcolor: dividerColor,
          zIndex: 1,
        }}
      />
      {/* Right segment */}
      <Divider
        orientation="horizontal"
        sx={{
          position: "absolute",
          top: horizontalDividerTop,
          left: `calc(100% - ${horizontalDividerWidth})`,
          width: horizontalDividerWidth,
          bgcolor: dividerColor,
          zIndex: 1,
        }}
      />

      {/* Image at intersection of dividers */}
      <Box
        sx={{
          position: "absolute",
          top: imageTop,
          left: imageLeft,
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img src="/caixa.svg" alt="caixa" style={imageSize} />
      </Box>
    </Box>
  );
};

export default BoxBoard;
