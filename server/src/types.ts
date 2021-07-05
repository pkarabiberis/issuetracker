export type Context = {
  req: Express.Request & { session: { userId?: number } };
  res: Express.Response;
};
