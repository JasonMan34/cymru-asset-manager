import { logger } from './logger';

let isSettingUp = false;
export const setup = async () => {
  if (isSettingUp) return;
  isSettingUp = true;

  // DB
  logger.info('Connecting to DB...');
  // await createConnection();
  logger.info('Successfully connected to DB');

  isSettingUp = false;
};

let isTearing = false;
export const teardown = async () => {
  if (isTearing) return;
  isTearing = true;

  logger.info('Closing DB connection...');
  // await getConnection().close();
  logger.info('DB connection closed');

  isTearing = false;
};
