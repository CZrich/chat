// src/schema/typeDefs.ts
import gql from 'graphql-tag';

export const typeDefs = gql`
 type Author {
  id: ID!
  name: String!
  email: String!
  friends: [Author]
}

type Message {
  id: ID!
  message: String!
  author: Author!
  recipient: ID!
  date: String!
}

type Query {
  me: Author
  users: [Author]
  messages(friendId: ID!): [Message]
}

type Mutation {
  sendMessage(to: ID!, message: String!): Message
  addFriend(friendId: ID!): Author
}

type Subscription {
  messageSent(to: ID!): Message
}

`;
