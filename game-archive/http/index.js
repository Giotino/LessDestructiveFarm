const got = require('got');

const SYSTEM_IP = 'http://HTTP_FLAG_SUBMISSION_URL/flags';
const TEAM_TOKEN = '';
const TIMEOUT_MS = 5000;
const teams = require('./teams.json');
// Teams format:
/*
{
  "name1": "IP1",
  "name2": "IP2"
}
*/

module.exports = {
  flagFormat: '[A-Z0-9]{31}=',
  submitInterval: 120,
  flagLifetime: 5 * 120,
  teams,
  submitFlags: async (flags, onSubmit) => {
    const tot = flags.length;
    const chunkSize = Math.min(20, flags.length);
    for (let i = 0; i < tot; i += chunkSize) {
      try {
        const answer = await got
        .put(SYSTEM_IP, {
          headers: {
            'X-Team-Token': TEAM_TOKEN
          },
          timeout: TIMEOUT_MS,
          json: flags.slice(i, i + chunkSize)
        })
        .json();

        for (const a of answer) {
          await onSubmit(a.flag, a.status ? 'ACCEPTED' : 'REJECTED', a.msg.split(']')[1]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
