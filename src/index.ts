import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { initSocket } from "./socket";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

const PORT = 3000;

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı.", socket.id);

  socket.on("register", (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`Kullanıcı ${userId}, oda user_${userId}'ye katıldı.`);
  });

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı.", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
