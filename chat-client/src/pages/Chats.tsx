import { FC, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE, MESSAGE_SUBSCRIPTION } from '../graphql/chat';
import { useUser } from '../context/UserContext';

export const Chat: FC = () => {
  const { name } = useUser();
  const { data, loading, subscribeToMore } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;
        return {
          messages: [...prev.messages, newMessage],
        };
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      console.log('ENVIANDO:', { sender: name, content: message }); // <-- log
  
      await sendMessage({ variables: { sender: name, content: message } });
  
      setMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error); // <-- log de error
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading messages...</p>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white to-rose-100 p-4">
      <h2 className="text-2xl font-bold text-rose-600 mb-4 text-center">Chat Room</h2>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-inner p-4 border border-gray-200">
        {data?.messages?.map((msg: any) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold text-rose-600">{msg.sender}</span>:{" "}
            <span className="text-gray-800">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button
          onClick={handleSend}
          className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-r-lg transition-colors duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};
