// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let cards = {};

io.on("connection", (socket) => {
  // envia estado atual ao novo cliente
  socket.emit("initial_cards", cards);

  socket.on("add_card", (card) => {
    cards[card.id] = card;
    io.emit("card_added", card);
  });

  socket.on("update_card", ({ id, content }) => {
    if (cards[id]) {
      cards[id].content = content;
      io.emit("card_updated", { id, content });
    }
  });

  socket.on("move_card", (moved) => {
    cards[moved.id] = moved;
    io.emit("card_moved", moved);
  });
});

server.listen(3001, () => console.log("Socket.IO server na porta 3001"));
