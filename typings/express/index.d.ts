
declare namespace Express {
  export interface Request {
    locals: {
      context: {
        url?: string;
        status?: number;
      };
    };
  }
}
