import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { createWithApollo } from './createWithApollo';

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      cookie:
        (typeof window === 'undefined'
          ? ctx?.req?.headers.cookie
          : undefined) || '',
    },
    cache: new InMemoryCache({
      typePolicies: {
        Issue: {
          fields: {
            assignedUsers: {
              merge: false,
            },
          },
        },
        Project: {
          fields: {
            users: {
              merge: false,
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
