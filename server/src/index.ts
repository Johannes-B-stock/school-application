import './env';
import { ApolloServer, Config } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import {
  handleGraphQLContext,
  handleGraphQLSubscriptionContext,
} from './auth/index';
import { rawSchema } from './graphql';
import { prisma } from './db';
import express from 'express';
import path from 'path';
import { graphqlUploadExpress } from 'graphql-upload';

// handle graphql
const port = process.env.PORT || 3000;
// create our schema
const schema = makeExecutableSchema(rawSchema);
// configure the server here
const serverConfig: Config = {
  schema,
  formatError: (err: {
    originalError: { message: string };
    message: string;
  }) => {
    console.log(err.message);
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
  uploads: false,
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'dark', // change to light if you prefer
      'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
    },
  },
};

// create a new server
const server = new ApolloServer(serverConfig);

const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
server.applyMiddleware({ app });
app.use(express.static('images'));
app.use(express.static('react-app'));

app.get('*', (req, res) => {
  if (req.path.startsWith('/images/')) {
    res.sendFile(path.resolve(req.path.substr(1, req.path.length - 1)));
    return;
  }
  res.sendFile(path.resolve('react-app', 'index.html'));
});

// A `main` function so that we can use async/await
async function main() {
  app.listen(port, () =>
    console.log(
      `🚀 Server ready at http://localhost:${port + server.graphqlPath}`
    )
  );
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
