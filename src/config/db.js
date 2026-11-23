import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB() {
  if (!config.mongoUri) {
    throw new Error(`Missing MONGO_URI for environment "${config.env}"`);
  }

  await mongoose.connect(config.mongoUri, {
    dbName: config.dbName,
  });

  console.log(`[${config.env}] Connected to MongoDB -> database: ${config.dbName}`);
}