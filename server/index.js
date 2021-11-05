import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("call_ended");
  });

  socket.on("call_user", ({ userToCall, SignalData, from, name }) => {
    io.to(userToCall).emit("call_user", { signal: SignalData, from, name });
  });

  socket.on("answer_call", (data) => {
    io.to(data.to).emit("call_accepted", data.signal);
  });
});

httpServer.listen(PORT, () => console.log(`server running on port:${PORT}`));
