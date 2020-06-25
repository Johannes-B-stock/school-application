import { ConnectionContext } from 'subscriptions-transport-ws';
import { Request, Response } from 'express';
import * as WebSocket from 'ws';
import * as jsonwebtoken from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { jwtSecret } from './secrets';
import { convertRole } from 'src/graphql/schemaShards/users';
import { user } from '@prisma/client';

// our context interface
export interface IContext {
  token?: string;
}

// handle all of the token magic here
function createContext(token: string): Promise<IContext> | IContext {
  return {
    token,
  };
}

// create context for requests
export function handleGraphQLContext(ctx: {
  connection?: any;
  req?: Request;
  res?: Response;
}) {
  const { req, connection } = ctx;
  // we already connected with a subscription
  if (connection) {
    return connection.context;
  }
  // check the request for the token
  if (req) {
    const token = req.headers && req.headers.token;
    return createContext(token as string);
  }
}

// handle authentication for socket connections
export function handleGraphQLSubscriptionContext(connectionParams: {
  authToken: string;
}) {
  console.log('Subscription!');
  const token = connectionParams.authToken;
  return createContext(token);
}

// check if the user is logged in or whatever you want to do to authenticate the user
export async function authenticateContext(
  context: IContext
): Promise<GQL.User> {
  if (!context.token || context.token === undefined) {
    throw new AuthenticationError('user is not logged in');
  }
  try {
    const userFromToken = jsonwebtoken.verify(context.token, jwtSecret) as user;
    if (!userFromToken) {
      throw new AuthenticationError('invalid token');
    }
    return {
      ...userFromToken,
      role: convertRole(userFromToken.role),
    };
  } catch (err) {
    throw new AuthenticationError(
      'exception when authenticating user: ' + err.message
    );
  }
}
