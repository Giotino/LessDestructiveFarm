const { Socket } = require('net');

const SYSTEM_IP = 'TCP_FLAG_SUBMISSION_IP';
const SYSTEM_PORT = 31337;
const TIMEOUT_MS = 5000;
const teams = require('./teams.json');
// Teams format:
/*
{
  "name1": "IP1",
  "name2": "IP2"
}
*/

//status: 'QUEUED' | 'SKIPPED' | 'ACCEPTED' | 'REJECTED'
const responseToStatus = response => {
  response = response.toLowerCase();
  if (response.startsWith('[ok]')) return 'ACCEPTED';
  if (response.startsWith('[err]')) return 'REJECTED';
  return 'QUEUED';
};

module.exports = {
  flagFormat: '/^w{31}=$/',
  submitInterval: 120,
  teams,
  submitFlags: (flags, onSubmit) =>
    new Promise(async (resolve, reject) => {
      const socket = new Socket();

      socket.setTimeout(TIMEOUT_MS);

      let buffer = '';
      const untilNewline = chunk => {
        buffer += chunk;
        if (buffer.includes('\n')) {
          const rows = buffer.split(/\n/g);
          buffer = rows.pop();

          return rows;
        }
        return null;
      };

      let submitted = 0;

      socket.on('connect', () => {
        // Send all flag
        (async () => {
          for (const flag of flags) if (!socket.destroyed) socket.write(flag + '\n');
        })();
      });

      // Work on responses
      socket.on('data', async chunk => {
        const rows = untilNewline(chunk);
        if (rows) {
          for (const row of rows) {
            const response = row.trim();

            if (response.toLowerCase().includes('unavailable')) {
              socket.end();
              break;
            }

            console.log(response);
            const status = responseToStatus(response);
            console.log(status);
            await onSubmit(flags[submitted++], status, response); // await or the DB is going to explode
            if (submitted == flags.length) socket.end();
          }
        }
      });

      socket.on('timeout', () => {
        console.log('Socket timeout');
        socket.end();
      });

      socket.on('error', e => {
        console.log('Socket error', e);
        socket.end();
        reject();
      });

      socket.on('close', () => {
        resolve();
      });

      socket.connect(SYSTEM_PORT, SYSTEM_IP, () => {});
    })
};
