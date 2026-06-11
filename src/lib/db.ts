import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnected(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
      throw new Error("MONGODB_URL is missing in .env");
    }

    const db = await mongoose.connect(mongoUri);

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    throw error;
  }
}

export default dbConnected;