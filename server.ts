import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiApp from "./api/index";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Mount API (includes DB seed, JSON parser, and all /api routes)
  app.use(apiApp);

  // --- Vite / Frontend Middleware ---
  if (process.env.NODE_ENV !== "production") {
    // In development, let Vite serve frontend assets and handle HMR
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // --- Socket.io Setup ---
  const { Server } = await import("socket.io");
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-admin", () => {
      socket.join("admins");
      console.log("Admin joined chat:", socket.id);
    });

    socket.on("join-user", (userId) => {
      socket.join(`user_${userId}`);
      console.log("User joined chat:", userId);
    });

    socket.on("send-message", (data) => {
      // data: { sender: 'admin' | 'user', userId: string, text: string }
      if (data.sender === 'user') {
        // Send to admins
        io.to("admins").emit("receive-message", data);
        // Echo to the sender user
        io.to(`user_${data.userId}`).emit("receive-message", data);
      } else {
        // Send to specific user
        io.to(`user_${data.userId}`).emit("receive-message", data);
        // Echo to admins
        io.to("admins").emit("receive-message", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

startServer();
