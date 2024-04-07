import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import messageRouter from "./routes/messageRoute";
import userRouter from "./routes/userRoute";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the allowed origin(s)
    credentials: true, // Allow credentials in cross-origin requests
  })
);

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
