import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, "../dist/public")));

// Import and register your API routes
// Note: You'll need to adapt your routes to work in serverless environment
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

export default app;
