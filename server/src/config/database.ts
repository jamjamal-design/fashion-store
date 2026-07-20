import mongoose from "mongoose";

export type DatabaseConfig = {
  uri: string;
  dbName: string;
};

export function getDatabaseConfig(): DatabaseConfig {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGODB_URI (or MONGO_URI) is required");
  }

  return {
    uri,
    dbName: process.env.MONGODB_DB_NAME ?? "fashion-store",
  };
}

let cachedConnection: typeof mongoose | null = null;

export async function connectDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const { uri, dbName } = getDatabaseConfig();

  cachedConnection = await mongoose.connect(uri, { dbName });
  console.log(`Connected to MongoDB — database: ${dbName}`);

  return cachedConnection;
}