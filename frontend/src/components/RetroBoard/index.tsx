import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  DndContext,
  useDraggable,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSocket } from "../../hooks";

// --- Type Definitions ---

export interface CardItem {
  id: string;
  content: string;
  x: number;
  y: number;
  columnId: string;
}

interface Column {
  name: string;
}

interface Columns {
  [key: string]: Column;
}

// --- Draggable Card Item Component (with Editable Text and Drag Handle) ---

function DraggableCardItem({
  item,
  onUpdateContent,
}: {
  item: CardItem;
  onUpdateContent: (id: string, newContent: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      disabled: isEditing,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1, // Show a ghosted image while dragging
    position: "absolute" as const,
    left: item.x,
    top: item.y,
    touchAction: "none",
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdateContent(item.id, editedContent);
    } else {
      setEditedContent(item.content); // Revert if empty
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
      ref={setNodeRef} // The node is the entire card
      style={style}
      onDoubleClick={() => setIsEditing(true)} // This now works
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
        // Prevent card from being dragged when editing text
        cursor: isEditing ? "text" : "pointer",
      }}
    >
      {/* Drag Handle Area */}
      <Box
        textAlign="center"
        // The listeners are attached ONLY to the handle
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
            // Stop propagation so clicking the text field doesn't trigger card-level events
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              height: "100%",
              "& .MuiInputBase-root": { height: "100%" },
              "& .MuiInputBase-input": {
                height: "100% !important",
                overflowY: "auto",
              },
            }}
            InputProps={{ disableUnderline: true }}
          />
        ) : (
          <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {item.content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// --- Column (Droppable Area) Component ---

function ColumnComponent({
  colId,
  colData,
  children,
}: {
  colId: string;
  colData: Column;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: colId,
  });

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
}

// --- Main Retro Board Component ---

export default function RetroBoard() {
  const [roomCreated, setRoomCreated] = useState(true); // Default to created for simplicity
  const socket = useSocket("http://localhost:3001");
  const [cards, setCards] = useState<Record<string, CardItem>>({});
  const [newCardText, setNewCardText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const columns: Columns = {
    well: { name: "Well" },
    not_well: { name: "Not so Well" },
    new_ideas: { name: "New Ideas" },
  };

  const activeCard = activeId ? cards[activeId] : null;

  const findNextAvailablePosition = (
    columnId: string,
    allCards: Record<string, CardItem>
  ) => {
    const cardsInColumn = Object.values(allCards).filter(
      (c) => c.columnId === columnId
    );

    const CARD_HEIGHT = 150;
    const PADDING = 15;
    const COLUMN_HEADER_HEIGHT = 80;

    let newY = COLUMN_HEADER_HEIGHT;

    while (true) {
      let isOverlapping = false;
      for (const card of cardsInColumn) {
        if (
          newY < card.y + CARD_HEIGHT + PADDING &&
          newY + CARD_HEIGHT > card.y
        ) {
          newY = card.y + CARD_HEIGHT + PADDING;
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        break;
      }
    }
    return { x: 20, y: newY };
  };

  const handleCreateRoom = () => setRoomCreated(true);

  const handleAddCard = () => {
    if (!newCardText.trim()) return;
    const id = `card-${Date.now()}`;
    const { x, y } = findNextAvailablePosition("well", cards);
    const newCard: CardItem = {
      id,
      content: newCardText,
      x,
      y,
      columnId: "well",
    };
    setCards((prev) => ({ ...prev, [id]: newCard }));
    socket.emit("add_card", newCard);
    setNewCardText("");
  };

  const handleUpdateCardContent = (cardId: string, newContent: string) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], content: newContent },
    }));
    socket.emit("update_card", { id: cardId, content: newContent });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta, over } = event;
    const droppedId = String(active.id);

    if (!over) {
      setActiveId(null);
      return;
    }

    setCards((prev) => {
      const card = prev[droppedId];
      if (!card) return prev;

      const sourceColumnId = card.columnId;
      const destinationColumnId = String(over.id);

      let newCardState: CardItem;

      if (sourceColumnId !== destinationColumnId) {
        const { x, y } = findNextAvailablePosition(destinationColumnId, prev);
        newCardState = {
          ...card,
          columnId: destinationColumnId,
          x,
          y,
        };
      } else {
        newCardState = {
          ...card,
          x: card.x + delta.x,
          y: card.y + delta.y,
        };
      }

      const updated = { ...prev, [droppedId]: newCardState };
      socket.emit("move_card", newCardState);
      return updated;
    });

    setActiveId(null);
  };

  const cardsByColumn = useMemo(() => {
    const result: Record<string, CardItem[]> = {};
    for (const colId in columns) {
      result[colId] = [];
    }
    for (const cardId in cards) {
      const card = cards[cardId];
      if (result[card.columnId]) {
        result[card.columnId].push(card);
      }
    }
    return result;
  }, [cards]);

  useEffect(() => {
    // ao conectar, receber estado inicial
    socket.on("initial_cards", (serverCards: Record<string, CardItem>) => {
      setCards(serverCards);
    });

    // quando outro cliente adiciona um card
    socket.on("card_added", (newCard: CardItem) => {
      setCards((prev) => ({ ...prev, [newCard.id]: newCard }));
    });

    // quando outro cliente atualiza conteúdo
    socket.on(
      "card_updated",
      ({ id, content }: { id: string; content: string }) => {
        setCards((prev) => ({
          ...prev,
          [id]: { ...prev[id], content },
        }));
      }
    );

    // quando outro cliente move um card
    socket.on("card_moved", (movedCard: CardItem) => {
      setCards((prev) => ({ ...prev, [movedCard.id]: movedCard }));
    });

    return () => {
      socket.off("initial_cards");
      socket.off("card_added");
      socket.off("card_updated");
      socket.off("card_moved");
    };
  }, [socket]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {!roomCreated ? (
        <Box textAlign="center">
          <Button variant="contained" onClick={handleCreateRoom}>
            Create Room
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Retro Room ✨
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="New Card Content"
              variant="outlined"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
            />
            <Button variant="contained" onClick={handleAddCard}>
              Add Card
            </Button>
          </Box>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box display="flex" gap={3} alignItems="stretch">
              {Object.entries(columns).map(([colId, colData]) => (
                <ColumnComponent key={colId} colId={colId} colData={colData}>
                  {cardsByColumn[colId]?.map((item) => (
                    <DraggableCardItem
                      key={item.id}
                      item={item}
                      onUpdateContent={handleUpdateCardContent}
                    />
                  ))}
                </ColumnComponent>
              ))}
            </Box>

            <DragOverlay>
              {activeCard ? (
                <Card
                  sx={{
                    backgroundColor: "#fff59d",
                    boxShadow: 5,
                    width: 150,
                    height: 150,
                    padding: 1,
                    borderRadius: 2,
                    fontFamily: "Comic Sans MS",
                    cursor: "grabbing",
                    zIndex: 999,
                  }}
                >
                  <CardContent>
                    <Typography>{activeCard.content}</Typography>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </Container>
  );
}
