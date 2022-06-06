import { Sequelize } from 'sequelize-typescript';
import dbHealthcheck from './db-healthcheck';
import * as Log from '../lib/log';

const waitForDb = async () => {
  for (let i = 0; i < 5; i++) {
    try {
      Log.wait('Checking DB');

      await dbHealthcheck();

      Log.ready('DB Online');
      break;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export const initDb = async () => {
  await waitForDb();

  const sequelize = new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    models: [__dirname + '/models/*'],
    logging: false,
    define: {
      timestamps: false
    }
  });

  await sequelize.sync({
    force: false
  }); // Await for sequelize init

  return sequelize;
};
