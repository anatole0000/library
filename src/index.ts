import "reflect-metadata";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { connectDB } from "./config/db";
import { createApp } from "./app";

declare global {
  // Add SocketIO type to globalThis
  var io: import("socket.io").Server | undefined;
}

async function start() {
  try {
    await connectDB();
    const app = await createApp();

    // Tạo HTTP server từ Koa app
    const httpServer = createServer(app.callback());

    // Gắn Socket.IO vào server
    const io = new IOServer(httpServer, {
      cors: {
        origin: "*", // đổi thành domain nếu cần bảo mật
      },
    });

    // Gán io vào global để dùng ở chỗ khác
    globalThis.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });

    httpServer.listen(4000, () => {
      console.log("🚀 Server ready at http://localhost:4000/graphql");
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
}

start();
