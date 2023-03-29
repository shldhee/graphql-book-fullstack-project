import { execute, GraphQLSchema, subscribe } from 'graphql';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { verifyAccessToken, JwtVerifiedUser } from '../utils/jwt-auth';

export interface MySubscriptionContext {
  verifiedUser: JwtVerifiedUser;
}

export const createSubscriptionServer = async (
  schema: GraphQLSchema,
  server: http.Server,
): Promise<SubscriptionServer> => {
  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams: any) => {
        console.log({ connectionParams });
        const accessToken = connectionParams.Authorization.split(' ')[1];
        verifyAccessToken(accessToken);
        return { verifiedUser: verifyAccessToken(accessToken) };
      },
      onDisconnect: () => {
        console.log('disconnected');
      },
    },
    { server, path: '/graphql' },
  );
};
