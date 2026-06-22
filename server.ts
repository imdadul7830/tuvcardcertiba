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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
