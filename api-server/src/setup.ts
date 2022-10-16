import mongoose from 'mongoose';
import { logger } from './logger';

const connectToDb = () => {
  const { MONGO_USER, MONGO_PASS, MONGO_URL, MONGO_DB } = process.env;
  if (!MONGO_USER || !MONGO_PASS || !MONGO_URL || !MONGO_DB) {
    throw new Error(
      'Misssing required environment variables to connect to the database. Terminating...'
    );
  }

  return mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}/${MONGO_DB}`);
};

let isSettingUp = false;
export const setup = async () => {
  if (isSettingUp) return;
  isSettingUp = true;

  // DB
  logger.info('Connecting to DB...');
  await connectToDb();
  logger.info('Successfully connected to DB');

  isSettingUp = false;
};

let isTearing = false;
export const teardown = async () => {
  if (isTearing) return;
  isTearing = true;

  logger.info('Closing DB connection...');
  await mongoose.disconnect();
  logger.info('DB connection closed');

  isTearing = false;
};
