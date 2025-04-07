
import Author from '../models/Atuthor';
import Message from '../models/Message';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) return null;
      return await Author.findOne({ email: user.email });
    },
    users: async () => await Author.find(),
    messages: async (_: any, { friendId }: any, { user }: any) => {
      const currentUser = await Author.findOne({ email: user.email });
      return await Message.find({
        author: { $in: [currentUser?._id, friendId] },
      }).populate('author');
    },
  },
  Mutation: {
    sendMessage: async (_: any, { to, message }: any, { user, pubsub }: any) => {
      const fromUser = await Author.findOne({ email: user.email });
      const newMsg = new Message({
        message,
        author: fromUser?._id,
        date: new Date().toISOString(),
      });
      await newMsg.save();
      pubsub.publish('MESSAGE_SENT', { messageSent: newMsg });
      return newMsg.populate('author');
    },
    addFriend: async (_: any, { friendId }: any, { user }: any) => {
      const currentUser = await Author.findOne({ email: user.email });
      if (!currentUser?.friends.includes(friendId)) {
        currentUser?.friends.push(friendId);
        await currentUser?.save();
      }
      return currentUser?.populate('friends');
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_: any, { to }: any, { pubsub }: any) =>
        pubsub.asyncIterator(['MESSAGE_SENT']),
    },
  },
};
