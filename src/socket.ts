import { Server } from "socket.io";
import http from "http";
import app from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});
const onlineUsers = {};

export const getReceiverSocketId = (receiverId) => {
  return onlineUsers[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string; ////????

  console.log("user connect ", userId);
  if (userId != "undefined") {
    onlineUsers[userId] = socket.id;
  }
  io.emit("onlineUsers", Object.keys(onlineUsers));
  socket.on("disconnect", () => {
    delete onlineUsers[userId];
    console.log("user  disconnect ", userId);
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

export { io, server };
