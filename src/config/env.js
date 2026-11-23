import dotenv from 'dotenv';
import path from 'node:path';

const ALLOWED_ENVS = ['staging', 'preprod', 'prod'];
const currentEnv = (process.env.APP_ENV || 'staging').toLowerCase();

if (!ALLOWED_ENVS.includes(currentEnv)) {
  throw new Error(
    `Invalid APP_ENV "${currentEnv}". Expected one of: ${ALLOWED_ENVS.join(', ')}`
  );
}

const envFilePath = path.resolve(process.cwd(), `.env.${currentEnv}`);
dotenv.config({ path: envFilePath });
dotenv.config();

export const config = {
  env: currentEnv,
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || '',
  dbName: process.env.DB_NAME || `app_${currentEnv}`,
};