import './env';
import { ApolloServer, Config } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import {
  handleGraphQLContext,
  handleGraphQLSubscriptionContext,
} from './auth/index';
import { rawSchema } from './graphql';
import { prisma } from './db';

// handle graphql
const port = process.env.PORT || 3000;
// create our schema
const schema = makeExecutableSchema(rawSchema);
// configure the server here
const serverConfig: Config = {
  schema,
  formatError: err => {
    console.log('source: ' + err.source.name);
    console.log('name:' + err.name);
    console.log('original: ' + err.originalError.message);
    console.error('hash:' + process.env.HASH_SALT);
    // Don't give the specific errors to the client.
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }

    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err;
  },
  context: handleGraphQLContext,
  subscriptions: {
    onConnect: handleGraphQLSubscriptionContext,
  },
  playground: {
    settings: {
      'editor.theme': 'dark', // change to light if you prefer
      'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
    },
  },
};

// create a new server
const server = new ApolloServer(serverConfig);

// A `main` function so that we can use async/await
async function main() {
  server.listen(port).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
