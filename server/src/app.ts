import cors from "cors";
import express from "express";
import { createApiRouter } from "./routes";
import { errorMiddleware, notFoundMiddleware } from "./middleware";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use("/api", createApiRouter());

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}