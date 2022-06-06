import cors from 'cors';
import express from 'express';
import next from 'next';
import { makeApiRouter } from './api';
import * as Log from './lib/log';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

export const initWebServer = async (error?: any) => {
  const server = express();

  if (error) {
    server.use((req, res) => {
      res.end(error.toString());
    });
  } else {
    Log.wait('Loading Next.JS');
    await app.prepare(); // Await for nextjs init
    Log.ready('Next.JS Ready');

    server.use(cors());
    server.use('/api', await makeApiRouter());
    server.use(async (err, req, res, next) => {
      if (err) {
        res.status(500).end(err);
      }
    });

    server.use('/public', express.static('./public'));

    //TODO check if this is safe for production
    server.get('*', (req, res) => {
      return handle(req, res);
    });
  }

  server.listen(3000);
  Log.ready('> Server ready on http://localhost:3000');
};
