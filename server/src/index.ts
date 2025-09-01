import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageData, type JoinedUser } from "./type";

const PORT = 3000;
const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userNameToSocketId = new Map<string, string>();
const socketIdToUserName = new Map<string, string>();

io.on("connection", (socket: Socket) => {
  const socketId = socket.id;

  socket.on("user-join", (data: JoinedUser) => {
    const userName = data.currentUser;
    userNameToSocketId.set(userName, socketId);
   socketIdToUserName.set(socketId, userName);

    const connectedUser = Array.from(userNameToSocketId.keys());

    io.emit("connected-user", { user: connectedUser });
  });

  socket.on("send-message", (messageObject: MessageData) => {
    const sentToName = messageObject.sendTo;
    const sentToScketId = userNameToSocketId.get(sentToName);
    if (sentToScketId) {
      io.to(sentToScketId).emit("recived-message", messageObject);
    }
  });

  const connectedUser = Array.from(userNameToSocketId.keys());

  io.to(socketId).emit("connected-user", { user: connectedUser });

  socket.on("disconnect", () => {
    const disconnectedUser = socketIdToUserName.get(socketId);
    if (disconnectedUser) {
      socketIdToUserName.delete(socketId);
      userNameToSocketId.delete(disconnectedUser);

      const connectedUser = Array.from(userNameToSocketId.keys());

      io.to(socketId).emit("connected-user", { user: connectedUser });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
