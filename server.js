import express from "express";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverRouter from "./routes/server.route.js";
import http from "http";
import { Server } from "socket.io";
import { playerHandle, hostHandle } from "./controllers/socketHandle/index.js";
import GameManager from "./utils/class/GameManager.js";
import Game from "./utils/class/game.js";

const exampleGame1 = new Game("2000");
const exampleGame2 = new Game("1000");
const gameManager = new GameManager();
gameManager.addGame(exampleGame1);
gameManager.addGame(exampleGame2);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT_SERVER || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/server", serverRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connect to socket server`);

  // Binding
  playerHandle(io, socket, gameManager);
  hostHandle(io, socket, gameManager);

  // Player disconnect
  socket.on("disconnect", async () => {
    const id = socket.id;
    const room = socket?.player?.room ?? socket?.host?.room;
    const isHost = socket.host;

    console.log(isHost);
    if (room) {
      const game = gameManager.getGame(room);
      if (game) {
        // If user is host
        if (isHost) {
          gameManager.removeGame(game);

          io.to(room).emit("hostDisconnect");

          // Kick all client out of the room
          const clients = await io.in(room).fetchSockets();
          clients.forEach((client) => {
            client.leave(room);

            // Reset client socket
            client.player = {};
          });
          console.log(`Host of room ${room} has disconnected`);
        }
        // If user is normal player
        else {
          // Remove player from game

          game.removePlayer(id);
          console.log(`Player ${socket.player.name} has disconnected`);

          // Notify host new player list

          const playersInRoom = game.getPlayersInGame();
          const host = socket?.player?.host;
          io.to(host).emit("receive__players", playersInRoom);
        }
      }
    }
    // If user is not player or host
    else {
      console.log(`user ${id} has disconneted`);
    }
  });
});

server.listen(port, () => {
  console.log(`socket is listening on: ${port}`);
});
