import express from "express";
import morgan from "morgan";
import path from "path";

import messageRouter from "./routes/messageRoute";
import userRouter from "./routes/userRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/users", userRouter);

/**
 * Global error handler
 */

export default app;
