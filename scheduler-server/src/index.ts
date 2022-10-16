import './dotenv';
import { initDbListener, initQueue, initWorker } from './scheduler';
import { setup } from './setup';

async function main() {
  await setup();
  initQueue();
  initWorker();
  initDbListener();
}

main();
