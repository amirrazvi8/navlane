import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnected(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database")
    return
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || ' ')
    connection.isConnected = db.connections[0].readyState
    console.log("Db connected successfully")

  } catch (error) {
    console.log("Db connection error", error)
    process.exit(1)
  }
}
export default dbConnected;