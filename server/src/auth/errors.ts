import { ApolloError } from 'apollo-server-express';

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');

    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}
