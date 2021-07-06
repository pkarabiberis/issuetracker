import { Request, Response } from 'express';

export type Context = {
  req: Request & { session: { userId?: number } };
  res: Response;
};
