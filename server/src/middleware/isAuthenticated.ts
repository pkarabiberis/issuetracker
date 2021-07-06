import { MiddlewareFn } from 'type-graphql';
import { Context } from 'vm';

export const isAuthenticated: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('not authenticated');
  }

  return next();
};
