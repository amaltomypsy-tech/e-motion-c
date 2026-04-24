import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose cache
declare global {
  var mongoose: CachedConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MONGO_CONNECT_TIMEOUT_MS = 5000;

function withConnectTimeout<T>(promise: Promise<T>) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(
        () => reject(new Error(`MongoDB connection timed out after ${MONGO_CONNECT_TIMEOUT_MS}ms`)),
        MONGO_CONNECT_TIMEOUT_MS
      );
    })
  ]);
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI in .env.local or Vercel environment variables");
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
      connectTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached!.conn = await withConnectTimeout(cached!.promise);
  } catch (error) {
    cached!.promise = null;
    throw error;
  }
  return cached!.conn;
}

export default connectDB;
