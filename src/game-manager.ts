import * as Log from './lib/log';
import Flag, { FlagState } from './lib/models/flag';
import { exec } from 'child_process';
import path from 'path';

const gameDir = path.resolve(path.join(__dirname, '../game/'));

class GameManager {
  private game: any;
  getClientConfig() {
    return {
      TEAMS: this.game.teams,
      FLAG_FORMAT: this.game.flagFormat,
      SUBMIT_PERIOD: this.game.submitInterval
    };
  }

  getFlagFormat() {
    return this.game.flagFormat;
  }

  install(): Promise<{ stdout: string; stderr: string; error: string }> {
    return new Promise((resolve, reject) => {
      exec(`npm i --production --prefix ${gameDir}`, { cwd: gameDir }, (error, stdout, stderr) => {
        resolve({ stdout, stderr, error: error ? error.toString() : undefined });
      });
    });
  }

  async init() {
    const { stdout, stderr, error } = await this.install();
    this.game = require(gameDir);

    if (error) throw error;

    this.submitLoop();
  }

  async submitLoop() {
    while (true) {
      try {
        const flagsResult = await Flag.findAll({
          attributes: ['flag'],
          where: { status: 'QUEUED' },
          raw: true,
          order: [['timestamp', 'ASC']]
        });

        if (flagsResult.length !== 0) {
          const flags = [];
          for (let f of flagsResult) flags.push(f.flag);

          Log.event(`Submitting ${flags.length} flags`);

          this.game.submitFlags(
            flags,
            async (submittedFlags: string | string[], status: FlagState, response: string) => {
              if (!Array.isArray(submittedFlags)) submittedFlags = [submittedFlags];
              
              // Also search status = QUEUED, because it may already have been submitted
              for (const flag of submittedFlags) {
                await Flag.update(
                  { status, checksystem_response: response },
                  { where: { flag, status: 'QUEUED' } }
                );
              }
            }
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        await new Promise(resolve => setTimeout(resolve, this.game.submitInterval * 1000));
      }
    }
  }
}

export default new GameManager();
