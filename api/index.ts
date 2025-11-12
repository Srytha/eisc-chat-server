const {Server} = require("socket.io");
import type { Socket } from "socket.io";
import "dotenv/config";

const origins = (process.env.ORIGIN ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const io = new Server({
  cors: {
    origin: origins
  }
});

let onlineUsers: {socketId: string, userId: string}[] = [];

io.on("connection", (socket: Socket) => {
  console.log(
    "A user connected with id: ", 
    socket.id, 
    " there are now ", 
    onlineUsers.length, 
    " online users");



    socket.on("newUser", (userId: string) => {
      if (!onlineUsers.some(user => user.userId === userId) && userId !== "") {
        onlineUsers.push({ socketId: socket.id, userId });
        socket.emit("usersOnline", onlineUsers);
      }
    });


    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
      socket.emit("usersOnline", onlineUsers);
    });
});

const port = Number(process.env.PORT);

io.listen(port);
console.log(`Server is running on port ${port}`);





