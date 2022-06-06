import bodyParser from 'body-parser';
import { Router } from 'express';
import gameManager from '../game-manager';
import Flag from '../lib/models/flag';

const makeClientApiRouter = async () => {
  const clientApi = Router();

  clientApi.get('/get_config', (req, res) => {
    res.json(gameManager.getClientConfig()).end();
  });

  clientApi.post('/post_flags', bodyParser.json({ limit: '10mb' }), async (req, res, next) => {
    const flags = req.body;

    const flagsForInserion: any = [];

    for (const flag of flags) {
      flagsForInserion.push({
        flag: flag.flag,
        sploit: flag.sploit,
        team: flag.team,
        timestamp: new Date()
      });
    }

    try {
      await Flag.bulkCreate(flagsForInserion, { ignoreDuplicates: true });
    } catch (e) {
      console.error(e);
    }

    res.status(200).end();
  });

  return clientApi;
};

export { makeClientApiRouter };
