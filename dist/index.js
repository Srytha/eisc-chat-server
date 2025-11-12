"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
require("dotenv/config");
// Conexion desde el fronted
const origins = (process.env.ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
const io = new socket_io_1.Server({
    cors: {
        origin: origins,
        methods: ["GET", "POST"],
    },
});
let onlineUsers = [];
// Conexion de cliente
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Nuevo usuario
    socket.on("newUser", (userId) => {
        if (!onlineUsers.some(user => user.userId === userId) && userId !== "") {
            onlineUsers.push({ socketId: socket.id, userId });
            console.log(`New user: ${userId}`);
            io.emit("usersOnline", onlineUsers);
        }
    });
    // Mensajes
    socket.on("sendMessage", (messageData) => {
        console.log(" Message received:", messageData);
        io.emit("receiveMessage", messageData);
    });
    // Desconexion
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("usersOnline", onlineUsers);
        console.log(`User disconnected: ${socket.id}`);
    });
});
// Servidor
const port = Number(process.env.PORT) || 3000;
io.listen(port);
console.log(`server running on port ${port}`);
