require('dotenv').config();

import gameManager from './game-manager';
import { initDb } from './lib/db';
import * as Log from './lib/log';
import { initWebServer } from './web-server';

const start = async () => {
  try {
    Log.wait('Loading DB');
    await initDb(); // Await for db init
    Log.ready('DB Ready');

    Log.wait('Loading Game Manager');
    await gameManager.init();
    Log.ready('Game Manager Ready');
  } catch (e) {
    Log.error(e);
    await initWebServer(e);
    return;
  }

  Log.wait('Loading WebServer');
  await initWebServer();
  Log.ready('WebServer Ready');
};

start();

export default null;
