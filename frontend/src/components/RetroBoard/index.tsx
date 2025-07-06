import { useState, useMemo, useEffect } from "react";
import { Container, Button, TextField, Typography, Box } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useSocket } from "../../hooks";
import DraggableCardItem from "./DraggableCardItem";
import ColumnComponent from "./ColumnComponent";
import DragOverlayCard from "./DragOverlayCard";
import { CardItem, Columns } from "./types";
import React from "react";

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
              {activeCard ? <DragOverlayCard card={activeCard} /> : null}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </Container>
  );
}
