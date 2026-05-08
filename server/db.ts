import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mezor_db';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  const conn = await mongoose.connect(MONGODB_URI);
  isConnected = conn.connection.readyState === 1;
  return conn.connection;
}
