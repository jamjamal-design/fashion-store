import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { createApp } from "./app";
import { getDatabaseConfig } from "./config/database";

async function bootstrap() {
  try {
    if (!process.env.ADMIN_JWT_SECRET) {
      throw new Error("ADMIN_JWT_SECRET is required");
    }

    const { uri, dbName } = getDatabaseConfig();
    const port = Number(process.env.PORT || 4000);

    // Connect to MongoDB
    await mongoose.connect(uri, {
      dbName,
    });

    console.log("✅ Connected to MongoDB");

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();