require('dotenv').config();

import { Sequelize } from 'sequelize';

export default async () => {
  const sequelize = new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  });

  await sequelize.authenticate();
  await sequelize.close();
};
