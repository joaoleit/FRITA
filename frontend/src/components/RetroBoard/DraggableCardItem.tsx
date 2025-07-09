import React, { useState } from "react";
import { Card, CardContent, Typography, Box, TextField } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { CardItem } from "./types";
interface DraggableCardItemProps {
  item: CardItem;
  onUpdateContent: (id: string, newContent: string) => void;
}

const DraggableCardItem: React.FC<DraggableCardItemProps> = ({
  item,
  onUpdateContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: isEditing,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    position: "absolute" as const,
    left: item.x,
    top: item.y,
    touchAction: "none",
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdateContent(item.id, editedContent);
    } else {
      setEditedContent(item.content);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedContent(item.content);
      setIsEditing(false);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => setIsEditing(true)}
      sx={{
        backgroundColor: "#fff59d",
        boxShadow: 3,
        width: 150,
        height: 150,
        padding: "2px",
        borderRadius: 2,
        fontFamily: "Comic Sans MS",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        cursor: isEditing ? "text" : "pointer",
      }}
    >
      <Box
        textAlign="center"
        {...listeners}
        {...attributes}
        sx={{ cursor: isEditing ? "default" : "move", touchAction: "none" }}
      >
        <DragIndicatorIcon sx={{ fontSize: 20, color: "#9E9E9E" }} />
      </Box>
      <CardContent sx={{ flexGrow: 1, padding: "0 8px 8px 8px" }}>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            variant="standard"
            autoFocus
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              // height: "100%",
              "& .MuiInputBase-root": {
                // height: "100%",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                margin: 0,
                padding: "0px",
              },
              "& .MuiInputBase-input": {
                height: "100% !important",
                overflowY: "auto",
              },
            }}
            InputProps={{ disableUnderline: true }}
          />
        ) : (
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
            }}
          >
            {item.content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DraggableCardItem;
