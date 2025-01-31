const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const clients = [];

io.on("connection", (socket) => {
  const id = socket.handshake.query.userId;
  const userId = Number(id);

  if (!id || isNaN(userId)) {
    console.error("Invalid or missing userId in connection query.");
    return;
  }

  const existingClient = clients.find((client) => client.userId === userId);
  if (existingClient) {
    existingClient.socketId = socket.id;
  } else {
    clients.push({ userId, socketId: socket.id });
  }

  socket.on("disconnect", () => {
    const index = clients.findIndex((client) => client.socketId === socket.id);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    socket.broadcast.emit("callEnded", { userId });
  });

  socket.on("callEnded", (data) => {
    const client = clients.find((client) => client.userId === data.callEnder);
    if (client) {
      io.to(client.socketId).emit("callEnded");
    }
  });

  socket.on("callUser", (data) => {
    const client = clients.find((client) => client.userId === data.toUserId);
    if (client) {
      const callUserData = {
        signal: data.signalData,
        from: data.fromUserId,
        socketId: client.socketId,
      };
      io.to(client.socketId).emit("callUser", callUserData);
    }
  });

  socket.on("answerCall", (data) => {
    const client = clients.find((client) => client.userId === data.toUserId);
    if (client) {
      io.to(client.socketId).emit("callAccepted", {
        signal: data.signal,
        socketId: socket.id,
      });
    }
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
