import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

export interface CardItem {
  id: string;
  content: string;
  x: number;
  y: number;
  columnId: string;
  user: string;
  color?: string;
}

interface User {
  name: string;
  id: string;
}

interface Board {
  id: string;
  type: string;
  scrumMaster: string;
  cards: Record<string, CardItem>;
  users: Record<string, User>;
}

type BoardsMap = Record<string, Board>;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let boards: BoardsMap = {};

io.on("connection", (socket: Socket) => {
  socket.emit("initial_boards", boards);

  socket.on("create_board", (board: Board) => {
    boards[board.id] = board;
    io.emit("board_created", board);
    console.log("Boards atuais:", boards);
  });

  socket.on("add_card", ({ boardId, card }: { boardId: string; card: CardItem }) => {
    if (boards[boardId]) {
      boards[boardId].cards[card.id] = card;
      io.emit("card_added", { boardId, card });
    }
  });

  socket.on(
    "update_card",
    ({ boardId, id, content }: { boardId: string; id: string; content: string }) => {
      if (boards[boardId] && boards[boardId].cards[id]) {
        boards[boardId].cards[id].content = content;
        io.emit("card_updated", { boardId, id, content });
      }
    }
  );

  socket.on("move_card", ({ boardId, moved }: { boardId: string; moved: CardItem }) => {
    if (boards[boardId]) {
      boards[boardId].cards[moved.id] = moved;
      io.emit("card_moved", { boardId, moved });
    }
  });

  socket.on(
    "add_user",
    ({ boardId, user }: { boardId: string; user: User }) => {
      if (boards[boardId]) {
        boards[boardId].users[user.id] = user;
        io.emit("user_added", { boardId, user });
      }
    }
  );

  socket.on(
    "remove_user",
    ({ boardId, userId }: { boardId: string; userId: string }) => {
      if (boards[boardId] && boards[boardId].users[userId]) {
        delete boards[boardId].users[userId];
        io.emit("user_removed", { boardId, userId });
      }
    }
  );
});

app.get("/boards", (req, res) => {
  res.json(boards);
});

server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
  console.log("Current boards:", boards); // Log the current boards
});