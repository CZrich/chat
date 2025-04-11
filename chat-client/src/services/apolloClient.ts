


import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
//@ts-ignore
import { createClient } from 'graphql-ws';
import { authService } from '../services/authService';

// HTTP link para queries y mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Auth link para añadir el token a las peticiones HTTP
const authLink = setContext((_, { headers }) => {
  const token = authService.getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// WebSocket link para subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = authService.getToken();
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
  })
);

// Split de tráfico basado en la operación
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Cliente Apollo
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});