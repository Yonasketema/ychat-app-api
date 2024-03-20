import express from "express";
import morgan from "morgan";
import path from "path";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

/**
 * Router
 */

/**
 * Global error handler
 */

export default app;
