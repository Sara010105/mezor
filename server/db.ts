import mongoose from 'mongoose';

/**
 * Force 127.0.0.1 instead of localhost to avoid IPv6 issues (ECONNREFUSED ::1)
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mezor_db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
  if (cached.conn) {
    console.log('[Database] Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Force IPv4
      family: 4 
    };

    console.log('[Database] Attempting new connection to:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[Database] Connected successfully to MongoDB (IPv4)');
      return mongoose;
    }).catch((err) => {
      console.error('[Database] Connection promise rejected:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('--------------------------------------------------');
    console.error('[Database] FATAL ERROR: Could not connect to MongoDB.');
    console.error('[Reason]:', e.message);
    if (e.message.includes('ECONNREFUSED')) {
      console.error('[Solution]: Make sure the MongoDB service is running (mongod).');
    }
    console.error('--------------------------------------------------');
    throw e;
  }

  return cached.conn;
}
