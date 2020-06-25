import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-link';
import config from './config';

// const reportErrors = (errorCallback: any) =>
//   new ApolloLink((operation, forward) => {
//     const observer = forward(operation);
//     // errors will be sent to the errorCallback
//     observer.subscribe({ error: errorCallback });
//     return observer;
//   });

// const errorLink = reportErrors(console.error);

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        token: token,
      },
    });
  }
  return forward(operation);
});

const uploadLink = createUploadLink({
  uri: config.API_URL + '/graphql',
});

const link = ApolloLink.from([authLink, uploadLink]);

//Accessing the address for graphql queries
export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
