import express from "express";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverRouter from "./routes/server.route.js";
import http from "http";
import { Server } from "socket.io";
import { playerJoinHandle } from "./controllers/sockets/index.js";

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
  playerJoinHandle(io, socket);

  // Player disconnect
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

server.listen(port, () => {
  console.log(`socket is listening on: ${port}`);
});
