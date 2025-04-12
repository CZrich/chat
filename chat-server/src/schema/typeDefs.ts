// src/schema/typeDefs.ts


import gql from 'graphql-tag';

const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    sender: String!
    timestamp: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    sendMessage(sender: String!, content: String!): Message!
  }

  type Subscription {
    messageSent: Message!
  }
`;

export default typeDefs;
