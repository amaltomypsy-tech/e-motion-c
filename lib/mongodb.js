import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MONGO_CONNECT_TIMEOUT_MS = 5000;

function withConnectTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`MongoDB connection timed out after ${MONGO_CONNECT_TIMEOUT_MS}ms`)),
        MONGO_CONNECT_TIMEOUT_MS
      );
    })
  ]);
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
      connectTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await withConnectTimeout(cached.promise);
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default connectDB;
