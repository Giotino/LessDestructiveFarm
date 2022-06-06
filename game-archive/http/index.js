const got = require('got');

const SYSTEM_IP = 'http://HTTP_FLAG_SUBMISSION_URL/flags';
const TEAM_TOKEN = '';
const TIMEOUT_MS = 5000;
const teams = require('./teams.json');

module.exports = {
  flagFormat: '[A-Z0-9]{31}=',
  submitInterval: 120,
  teams,
  submitFlags: async (flags, onSubmit) => {
    const tot = flags.length;
    const chunkSize = 20;
    for (let i = 0; i<tot-chunkSize; i+=chunkSize) {
      const answer = await got.put(SYSTEM_IP, {
        headers: {
          'X-Team-Token': TEAM_TOKEN
        },
        timeout: TIMEOUT_MS,
        body: JSON.stringify(flags.slice(i, i+chunkSize))
      }).json();

      for (const a of answer) {
        await onSubmit(a.flag, a.status ? 'ACCEPTED' : 'REJECTED', a.msg.split(']')[1]);
      }
    }
  }
};