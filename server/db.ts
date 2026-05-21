import mongoose from 'mongoose';

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
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://saraezzogary2_db_user:yPONBW4b3a016lSG@mezordb.kje5nkz.mongodb.net/';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    console.log('[Database] Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const isLocal = !MONGODB_URI.startsWith('mongodb+srv://');
    const opts = {
      bufferCommands: false,
      ...(isLocal && { family: 4 })
    };

    console.log('[Database] Attempting new connection to:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[Database] Connected successfully to MongoDB');
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
