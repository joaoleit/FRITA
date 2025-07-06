import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

interface CardItem {
  id: string;
  content: string;
  x: number;
  y: number;
  columnId: string;
}

type CardsMap = Record<string, CardItem>;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let cards: CardsMap = {};

io.on("connection", (socket: Socket) => {
  // envia estado atual ao novo cliente
  socket.emit("initial_cards", cards);

  socket.on("add_card", (card: CardItem) => {
    cards[card.id] = card;
    io.emit("card_added", card);
  });

  socket.on(
    "update_card",
    ({ id, content }: { id: string; content: string }) => {
      if (cards[id]) {
        cards[id].content = content;
        io.emit("card_updated", { id, content });
      }
    }
  );

  socket.on("move_card", (moved: CardItem) => {
    cards[moved.id] = moved;
    io.emit("card_moved", moved);
  });
});

server.listen(3001, () => console.log("Socket.IO server na porta 3001"));
