export type SearchParams = {
  sploit: string;
  team: string;
  status: string;
  flag: string;
  since: string;
  until: string;
  checksystem_response: string;
};

export type SearchValues = { sploits: string[]; teams: string[]; statuses: string[] };

export type GameInfo = { flagFormat: string };
