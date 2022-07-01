import express from "express";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverRouter from "./routes/server.route.js";
import http from "http";
import { Server } from "socket.io";
import { checkConnect } from "./utils/db.js";
import {
  playerHandle,
  hostHandle,
  disconnectHandle,
} from "./controllers/socketHandle/index.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 8000;
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
app.use("/server", serverRouter);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connect to socket server`);
  // Binding
  playerHandle(io, socket);
  hostHandle(io, socket);
  disconnectHandle(io, socket);
});

if (checkConnect) {
  server.listen(port, () => {
    console.log(`socket is listening on: ${port}`);
  });
} else {
  server.close();
}
