import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { createCutVoteLoader } from '../dataloaders/cutVoteLoader';
import redis from '../redis/redis-client';
import { JwtVerifiedUser, verifyAccessTokenFromReqHeaders } from '../utils/jwt-auth';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
  redis: typeof redis;
  cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}

const createApolloServer = async (schema: GraphQLSchema): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: ({ req, res }) => {
      const verified = verifyAccessTokenFromReqHeaders(req.headers);
      return { req, res, verifiedUser: verified, redis, cutVoteLoader: createCutVoteLoader() };
    },
  });
};

export default createApolloServer;
