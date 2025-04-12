


import Message from '../models/Message.js';
import { pubsub } from '../utils/pubsub.js';
const MESSAGE_SENT = 'MESSAGE_SENT'; // Define la constante para el evento

export const resolvers = {
  Query: {
    messages: async () => await Message.find().sort({ timestamp: 1 }),
  },
  Mutation: {
    sendMessage: async (_:any, args:{ sender:string, content:string }) => {
      const { sender, content } = args;
      console.log('MUTATION RECIBIDA:', { sender, content }); 
      const message = new Message({ sender, content, timestamp: new Date().toISOString() });
      await message.save();
      pubsub.publish(MESSAGE_SENT, { messageSent: message });
      return message;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
};