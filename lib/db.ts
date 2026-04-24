import mongoose from "mongoose";

type GlobalMongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: GlobalMongooseCache | undefined;
}

const cache: GlobalMongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

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

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Create .env.local using .env.example.");
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
        connectTimeoutMS: MONGO_CONNECT_TIMEOUT_MS,
        socketTimeoutMS: 45000
      })
      .then((m) => m);
  }

  try {
    cache.conn = await withConnectTimeout(cache.promise);
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
