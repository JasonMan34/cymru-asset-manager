import './dotenv';
import { initDbListener, initQueue, initWorker } from './scheduler';
import { setup } from './setup';

function main() {
  initQueue();
  initWorker();
  initDbListener();
}

setup().then(main);
