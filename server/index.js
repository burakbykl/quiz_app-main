const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 3001;

const rooms = new Map();
const colors = ["red", "blue"];

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", (callback) => {
    const room_code = generate_room_code();
    const room = {
      code: room_code,
      creator: socket.id,
      users: [],
      gameStarted: false,
      regions: generateInitialRegions(),
      currentPlayerIndex: 0,
    };
    rooms.set(room_code, room);

    socket.join(room_code);
    socket.emit("roomCreated", room_code);

    callback(socket.id === room.creator, room_code);
    console.log(`Room created: ${room_code}`);
  });

  socket.on("joinRoom", (room_code, username) => {
    const room = rooms.get(room_code);
    if (room && !room.gameStarted) {
      const player = {
        id: socket.id,
        username,
        color: assignPlayerColor(room),
      };
      room.users.push(player);

      socket.join(room_code);
      socket.emit("joinRoomResponse", "joined");

      io.to(room_code).emit("userJoined", {
        username,
        userId: socket.id,
        users: room.users,
      });
      console.log(`${username} joined room ${room_code}`);
      console.log(`Emitted 'userJoined' event to room ${room_code}`);

      if (room.users.length === 2) {
        room.gameStarted = true;
        io.to(room_code).emit("gameStart");
        io.to(room_code).emit(
          "playerTurn",
          room.users[room.currentPlayerIndex].id
        );
        console.log(`Game started in room ${room_code}`);
      }
    } else {
      socket.emit("joinRoomResponse", "failed");
    }
  });

  socket.on("updateRegion", (room_code, updatedRegion) => {
    const room = rooms.get(room_code);
    if (room && room.gameStarted) {
      const currentPlayer = room.users[room.currentPlayerIndex];
      if (socket.id === currentPlayer.id) {
        room.regions = room.regions.map((region) =>
          region.id === updatedRegion.id ? updatedRegion : region
        );

        io.to(room_code).emit("regionUpdated", updatedRegion);
        switchTurn(room);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    rooms.forEach((room, room_code) => {
      const index = room.users.findIndex((user) => user.id === socket.id);
      if (index !== -1) {
        const username = room.users[index].username;
        room.users.splice(index, 1);
        io.to(room_code).emit("userLeft", {
          username,
          userId: socket.id,
          users: room.users,
        });
        console.log(`${username} left room ${room_code}`);
      }
    });
  });

  socket.on("startGame", (room_code) => {
    const room = rooms.get(room_code);
    if (room && !room.gameStarted) {
      room.gameStarted = true;
      io.to(room_code).emit("gameStarted");
      console.log(`Game started in room ${room_code}`);
    }
  });
});

function generate_room_code() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateInitialRegions() {
  return [
    { id: 1, color: "default" },
    { id: 2, color: "default" },
    { id: 3, color: "default" },
    { id: 4, color: "default" },
    { id: 5, color: "default" },
    { id: 6, color: "default" },
    { id: 7, color: "default" },
    { id: 8, color: "default" },
  ];
}

function assignPlayerColor(room) {
  const availableColors = colors.filter(
    (color) => !room.users.some((player) => player.color === color)
  );
  return availableColors.length > 0 ? availableColors[0] : null;
}

function switchTurn(room) {
  room.currentPlayerIndex = room.currentPlayerIndex === 0 ? 1 : 0;
  io.to(room.code).emit("playerTurn", room.users[room.currentPlayerIndex].id);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
