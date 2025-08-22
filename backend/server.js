require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const recipeRoutes = require("./routes/recipeRoutes");
const db = require("./config/db"); 

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e) {
    console.error("DB health check failed:", e.message);
    res.status(500).json({ status: "db_error", error: e.message });
  }
});

app.use("/api/recipes", recipeRoutes);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === "input") return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`API running at http://localhost:${PORT}`)
);


async function shutdown() {
  console.log("\nShutting down...");
  server.close(async () => {
    try { await db.end(); } catch (_) {}
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = app; 
