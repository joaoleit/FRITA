import { useState, useMemo, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Dialog,
} from "@mui/material";
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
import type { Board, CardItem, Columns, User } from "./types";
import InfoIcon from "@mui/icons-material/InfoOutline";
import { useSearchParams } from "react-router-dom";

import React from "react";
import { RETROSPECTIVE_TYPES, toRem } from "../../utils";
import InfoDialog from "./InfoDialog";
import GridViewIcon from "@mui/icons-material/GridView";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { MainButton } from "../MainButton/MainButton";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Popover from "../Popover/Popover";
import { v4 as uuidv4 } from "uuid";
import CountdownTimer from "./CountdownTimer";
import WellBoard from "./RetroType/WellBoard";

const styles = {
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "0%",
    verticalAlign: "middle",
    color: "#5C5C5C",
  },
  normalText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    verticalAlign: "middle",
    color: "#5C5C5C",
  },
  textField: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1B1B1B",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
      height: "56px",
    },
    "& .MuiInputBase-input::placeholder": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "16px",
      color: "888888",
      lineSpacing: "0%",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "16px",
      color: "#888888",
      lineSpacing: "0%",
    },
  },
};

const colors = [
  "#CECECE",
  "#FAA389",
  "#5ED0D5",
  "#FBC935",
  "#C4DCFB",
  "#CFC4E8",
  "#B7E6DB",
  "#FFD9DB",
  "#FFCDD2",
  "#F8BBD0",
  "#E1BEE7",
  "#D1C4E9",
  "#C5CAE9",
  "#BBDEFB",
  "#B3E5FC",
  "#B2EBF2",
  "#B2DFDB",
  "#C8E6C9",
];

export default function RetroBoard() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const boardIdParam = searchParams.get("boardId") ?? `board-${Date.now()}`;

  const [boards, setBoards] = useState<Record<string, Board>>({});
  const socket = useSocket("http://localhost:3001");
  const [boardId] = useState(boardIdParam);
  const [cards, setCards] = useState<Record<string, CardItem>>({});
  const [newCardText, setNewCardText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openAddCardDialog, setOpenAddCardDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [user, setUser] = useState<User | null>(() => {
    let stored = localStorage.getItem("retro-user");
    if (stored) {
      const json = JSON.parse(stored)
      return {
        id: json['id'].toString(),
        name: json['name'],
        isScrumMaster: true
      }
    };
    
    return null;
  });
  const [userName, setUserName] = useState("");
  // const [user, setUser] = useState<User | null>(null);
  const [retroTime, setRetroTime] = useState(720);
  const [running, setRunning] = useState(false);

  const id = Boolean(anchorEl) ? "simple-popover" : undefined;

  const retroType = useMemo(() => {
    let retroType: RETROSPECTIVE_TYPES;

    if (
      typeParam === RETROSPECTIVE_TYPES.EASY_AS_PIE ||
      typeParam === RETROSPECTIVE_TYPES.OPEN_THE_BOX ||
      typeParam === RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL
    ) {
      retroType = typeParam as RETROSPECTIVE_TYPES;
    } else {
      retroType = RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL;
    }

    return retroType;
  }, [typeParam]);

  const boardTitle = useMemo(() => {
    switch (retroType) {
      case RETROSPECTIVE_TYPES.EASY_AS_PIE:
        return "Easy As Pie";
      case RETROSPECTIVE_TYPES.OPEN_THE_BOX:
        return "Open The Box";
      case RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL:
        return "Well, Not so well, New ideas";
      default:
        return "Well, Not so well, New ideas";
    }
  }, [retroType]);

  const boardUsers = useMemo(() => {
    return Object.values(boards?.[boardId]?.users ?? {});
  }, [boards, boardId, user]);

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

  const handleClickShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddCard = () => {
    if (!newCardText.trim() || !user) return;
    const id = `card-${Date.now()}`;
    const { x, y } = findNextAvailablePosition("well", cards);

    const boardUsers = Object.values(
      boards?.[boardId]?.users ?? { [user.id]: user }
    );
    const userIdx = boardUsers.findIndex((u) => u.id === user.id);

    const newCard: CardItem = {
      id,
      content: newCardText,
      x,
      y,
      columnId: "well",
      user: user.name,
      color: colors[userIdx >= 0 ? userIdx % colors.length : 0],
    };
    setCards((prev) => ({ ...prev, [id]: newCard }));
    socket.emit("add_card", { boardId, card: newCard });
    setNewCardText("");
  };

  const handleUpdateCardContent = (cardId: string, newContent: string) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], content: newContent },
    }));
    socket.emit("update_card", { boardId, id: cardId, content: newContent });
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => {
      const updated = { ...prev };
      delete updated[cardId];
      return updated;
    });
    socket.emit("remove_card", { boardId, cardId });
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
      socket.emit("move_card", { boardId, moved: newCardState });
      return updated;
    });

    setActiveId(null);
  };

  const handleRetroTimeChange = (newTime: number) => {
    setRetroTime(newTime);
    socket.emit("update_retro_time", { boardId, retroTime: newTime });
  };

  const handleRetroRunningChange = (isRunning: boolean) => {
    setRunning(isRunning);
    socket.emit("toggle_retro_time_running", { boardId, retroTimeRunning: isRunning });
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
    if (user) {
      socket.emit("add_user", { boardId, user });
    }
  }, [boards, boardId, user]);

  useEffect(() => {
    socket.on("initial_boards", (boards: Record<string, Board>) => {
      setBoards(boards);
      if (boards[boardId]) {
        setCards(boards[boardId].cards);
        setRetroTime(boards[boardId].retroTime);
        setRunning(boards[boardId].retroTimeRunning);
      } else {
        const newBoard: Board = {
          id: boardId,
          type: retroType,
          scrumMaster: "anon",
          cards: {},
          users: {},
          retroTime: retroTime,
          retroTimeRunning: running,
        };
        socket.emit("create_board", newBoard);
      }
    });

    socket.on("board_created", (board: Board) => {
      setBoards((prev) => ({ ...prev, [board.id]: board }));
      if (board.id === boardId) setCards(board.cards);
    });

    socket.on(
      "card_added",
      ({ boardId: incomingId, card }: { boardId: string; card: CardItem }) => {
        if (incomingId === boardId)
          setCards((prev) => ({ ...prev, [card.id]: card }));
      }
    );

    socket.on(
      "card_updated",
      ({
        boardId: incomingId,
        id,
        content,
      }: {
        boardId: string;
        id: string;
        content: string;
      }) => {
        if (incomingId === boardId)
          setCards((prev) => ({ ...prev, [id]: { ...prev[id], content } }));
      }
    );

    socket.on(
      "card_moved",
      ({
        boardId: incomingId,
        moved,
      }: {
        boardId: string;
        moved: CardItem;
      }) => {
        if (incomingId === boardId)
          setCards((prev) => ({ ...prev, [moved.id]: moved }));
      }
    );

    socket.on(
      "user_added",
      ({ boardId: incomingId, user }: { boardId: string; user: User }) => {
        if (incomingId === boardId) {
          setBoards((prev) => ({
            ...prev,
            [boardId]: {
              ...prev[boardId],
              users: { ...prev[boardId].users, [user.id]: user },
            },
          }));
        }
      }
    );

    socket.on("card_removed", ({ boardId: incomingId, cardId }) => {
      if (incomingId === boardId) {
        setCards((prev) => {
          const updated = { ...prev };
          delete updated[cardId];
          return updated;
        });
      }
    });

    socket.on("retro_time_updated", ({ boardId, retroTime }) => {
      if (boardId === boardId) {
        setRetroTime(retroTime);
      }
    });

    socket.on("retro_time_running_toggled", ({ boardId, retroTimeRunning }) => {
      if (boardId === boardId) {
        setRunning(retroTimeRunning);
      }
    });

    return () => {
      socket.off("initial_boards");
      socket.off("board_created");
      socket.off("card_added");
      socket.off("card_updated");
      socket.off("card_moved");
      socket.off("user_added");
      socket.off("card_removed");
      socket.off("retro_time_updated");
      socket.off("retro_time_running_toggled");
    };
  }, [socket, boardId, retroType, user, retroTime, running]);

  return (
    <Box
      minHeight="100vh"
      display={"flex"}
      flexDirection={"column"}
      sx={{ bgcolor: "#FCF8F7", padding: "2rem", boxSizing: "border-box" }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            bgcolor: "#FFF",
            padding: "1rem",
            borderRadius: "16px",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: toRem(68),
          }}
          boxShadow={1}
          mb={1}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: "'Josefin Slab', serif",
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "35px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#1B1B1B",
            }}
          >
            FRITAS{" "}
          </Typography>
          <Divider sx={{ bgcolor: "#000" }} orientation="vertical" flexItem />{" "}
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "52px",
              letterSpacing: "0.16px",
            }}
          >
            {boardTitle}
          </Typography>
          <IconButton onClick={() => setOpenInfoDialog(true)}>
            <InfoIcon sx={{ cursor: "pointer" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            bgcolor: "#FFF",
            padding: "1rem",
            borderRadius: "16px",
            width: "fit-content",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            height: toRem(68),
            position: "fixed",
            top: 85,
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
          boxShadow={1}
          mb={1}
        >
          <CountdownTimer
            isScrumMaster={user?.isScrumMaster ?? false}
            handleRetroRunningChange={handleRetroRunningChange}
            handleRetroTimeChange={handleRetroTimeChange}
            retroTime={retroTime}
            retroTimeRunning={running}
          />
        </Box>
        <Box
          sx={{
            bgcolor: "#FFF",
            padding: "1rem",
            borderRadius: "16px",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: toRem(68),
          }}
          boxShadow={1}
          mb={1}
        >
          <Box display="flex">
            {boardUsers.map((user, idx) => (
              <Box
                key={user.id}
                sx={{
                  height: toRem(42),
                  width: toRem(42),
                  borderRadius: "50%",
                  bgcolor: colors[idx % colors.length],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: idx === 0 ? 0 : `-${toRem(14)}`,
                  zIndex: boardUsers.length,
                  fontFamily: "'Josefin Slab', serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                {user.name[0].toUpperCase()}
              </Box>
            ))}
          </Box>
          <Divider sx={{ bgcolor: "#000" }} orientation="vertical" flexItem />
          <MainButton
            onClick={(e) => {
              handleClickShare(e);
            }}
            sx={{
              bgcolor: "#FCF8F7",
              color: "#1B1B1B",
              border: "1px solid #1B1B1B",
              borderRadius: "3px",
              gap: "8px",
            }}
          >
            <ShareOutlinedIcon />
            Compartilhar
          </MainButton>
          <MainButton
            onClick={() => {
              return;
            }}
            sx={{ marginLeft: "16px" }}
          >
            Finalizar
          </MainButton>
        </Box>
      </Box>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box display="flex" alignItems="stretch" flex={1}>
          {retroType === RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL ? (
            <WellBoard
              ColumnComponent={ColumnComponent}
              DraggableCardItem={DraggableCardItem}
              cardsByColumn={cardsByColumn}
              columns={columns}
              handleDeleteCard={handleDeleteCard}
              handleUpdateCardContent={handleUpdateCardContent}
            />
          ) : (
            // CHANGE THIS TO THE APPROPRIATE COMPONENT FOR OTHER RETRO TYPES
            <WellBoard
              ColumnComponent={ColumnComponent}
              DraggableCardItem={DraggableCardItem}
              cardsByColumn={cardsByColumn}
              columns={columns}
              handleDeleteCard={handleDeleteCard}
              handleUpdateCardContent={handleUpdateCardContent}
            />
          )}
        </Box>

        <DragOverlay>
          {activeCard ? <DragOverlayCard card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
      {/* <Box display="flex" gap={2} mt={2}>
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
      </Box> */}
      <Box
        sx={{
          bgcolor: "#FFF",
          padding: "1rem",
          borderRadius: "16px",
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 1000,
        }}
        boxShadow={1}
        mb={1}
      >
        <IconButton onClick={() => setOpenAddCardDialog(true)}>
          <img src="/icon-add-post-it.png" alt="icon-post-it" />
        </IconButton>
      </Box>
      <InfoDialog
        boardTitle={boardTitle}
        open={openInfoDialog}
        setOpen={setOpenInfoDialog}
        retroType={retroType}
      />
      <Dialog
        open={openAddCardDialog}
        maxWidth="md"
        onClose={() => setOpenAddCardDialog(false)}
      >
        <Box sx={{ padding: toRem(32), width: toRem(612) }}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Novo conteúdo do card"
              variant="outlined"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddCard();
                  setOpenAddCardDialog(false);
                  e.preventDefault();
                }
              }}
              sx={styles.textField}
            />
            <MainButton
              variant="contained"
              onClick={() => {
                handleAddCard();
                setOpenAddCardDialog(false);
              }}
              sx={{
                height: "53px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                mb: toRem(3),
              }}
            >
              Adicionar
            </MainButton>
          </Box>
        </Box>
      </Dialog>
      <Dialog open={user === null} maxWidth="md">
        <Box sx={{ padding: toRem(32), width: toRem(612) }}>
          <Typography sx={[styles.normalText, { mb: toRem(16) }].flat()}>
            Para continuar, por favor, informe seu nome:
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUser({
                    name: userName,
                    id: uuidv4(),
                    isScrumMaster: boardUsers.length === 0,
                  });
                }
              }}
              sx={styles.textField}
            />
            <MainButton
              variant="contained"
              onClick={() =>
                setUser({
                  name: userName,
                  id: uuidv4(),
                  isScrumMaster: boardUsers.length === 0,
                })
              }
              sx={{
                height: "53px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                mb: toRem(3),
              }}
            >
              Entrar
            </MainButton>
          </Box>
        </Box>
      </Dialog>
      <Popover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        id={id}
        title="Compartilhar retrospectiva"
        hasCloseButton
        children={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: toRem(26),
            }}
          >
            <TextField
              value={window.location.href}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="outlined"
              sx={styles.textField}
            />
            <MainButton
              variant="contained"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              sx={{
                height: "53px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                mb: toRem(3),
              }}
            >
              Copiar
            </MainButton>
          </Box>
        }
      />
    </Box>
  );
}
