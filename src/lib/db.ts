import mongoose from "mongoose";

console.log("env var", process.env.MONGODB_URL)
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnected(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }


  try {
    const mongoUri = process.env.MONGODB_URL;
    console.log("env var mongoUri", mongoUri);

    if (!mongoUri) {
      throw new Error("MONGODB_URL is missing in .env");
    }

    const db = await mongoose.connect(mongoUri);

    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection error:", error);
    throw error;
  }
}

export default dbConnected;