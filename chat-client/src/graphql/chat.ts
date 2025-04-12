import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query {
    messages {
      id
      sender
      content
      timestamp
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($sender: String!, $content: String!) {
    sendMessage(sender: $sender, content: $content) {
      id
      sender
      content
      timestamp
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageSent {
      id
      sender
      content
      timestamp
    }
  }
`;
