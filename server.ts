import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const PORTFOLIO_FILE_PATH = path.join(process.cwd(), "src", "shared_portfolio.json");

async function startServer() {
  const app = express();

  // Allow larger payloads (e.g. up to 15MB) for portfolio imagery uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // API endpoints
  app.get("/api/portfolio", (req, res) => {
    try {
      if (fs.existsSync(PORTFOLIO_FILE_PATH)) {
        const fileContent = fs.readFileSync(PORTFOLIO_FILE_PATH, "utf8");
        return res.json(JSON.parse(fileContent));
      }
    } catch (e) {
      console.error("Error reading shared portfolio file:", e);
    }
    return res.json({ fallback: true });
  });

  app.post("/api/portfolio", (req, res) => {
    try {
      const data = req.body;
      const parentDir = path.dirname(PORTFOLIO_FILE_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(PORTFOLIO_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
      return res.json({ success: true, savedAt: new Date().toISOString() });
    } catch (e) {
      console.error("Error writing shared portfolio file:", e);
      return res.status(500).json({ error: "Failed to persist shared portfolio data" });
    }
  });

  // Serve static assets and frontend SPA in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
