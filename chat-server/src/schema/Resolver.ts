// src/schema/Resolver.ts
import Author from '../models/Atuthor.js'; // Asegúrate que el path y nombre sean correctos
import Message, { IMessage } from '../models/Message.js'; // Importa la interfaz si la exportaste
import { PubSub, withFilter,PubSubEngine } from 'graphql-subscriptions';
import { pubsub } from '../utils/pubsub.js'; // Importa la instancia de PubSub

const MESSAGE_SENT = 'MESSAGE_SENT'; // Define la constante para el evento

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      // Verifica que user exista y tenga la propiedad email
      if (!user?.email) {
         console.log('Resolver:me - Usuario no autenticado o email no encontrado en contexto');
         return null;
      }
      try {
         return await Author.findOne({ email: user.email });
      } catch (error) {
         console.error('Error en resolver me:', error);
         return null; // O lanzar un error GraphQL
      }
    },
    users: async () => await Author.find(), // Considera añadir manejo de errores
    messages: async (_: any, { friendId }: any, { user }: any) => {
       if (!user?.email) {
          console.log('Resolver:messages - Usuario no autenticado');
          throw new Error('Autenticación requerida'); // Mejor lanzar error
        }
       try {
           const currentUser = await Author.findOne({ email: user.email });
           if (!currentUser) {
               throw new Error('Usuario actual no encontrado');
           }
           // Lógica para obtener mensajes entre currentUser y friendId
           // Necesitarás mensajes donde (author=currentUser y recipient=friendId) O (author=friendId y recipient=currentUser)
           return await Message.find({
               $or: [
                   { author: currentUser._id, recipient: friendId },
                   { author: friendId, recipient: currentUser._id }
               ]
           }).populate('author').sort({ date: 1 }); // Ordenar por fecha es útil
       } catch (error) {
           console.error('Error en resolver messages:', error);
           throw new Error('Error al buscar mensajes');
       }
    },
  },
  Mutation: {
    sendMessage: async (_: any, { to, message }: any, { user /* pubsub ya no viene del context aquí, lo importamos */ }: any): Promise<IMessage | null> => {
      if (!user?.email) {
         console.log('Resolver:sendMessage - Usuario no autenticado');
         throw new Error('Autenticación requerida');
      }
      try {
          const fromUser = await Author.findOne({ email: user.email });
          if (!fromUser) {
             throw new Error('Usuario remitente no encontrado');
          }
          // Verificar si el destinatario existe (opcional pero recomendado)
          const toUserExists = await Author.findById(to);
          if (!toUserExists) {
             throw new Error('Usuario destinatario no encontrado');
          }

          const newMsg = new Message({
            message,
            author: fromUser._id,
            recipient: to, // <-- Guarda el ID del destinatario
            date: new Date().toISOString(),
          });
          await newMsg.save();

          // Poblar el autor antes de publicar para que la suscripción reciba los datos completos
          const populatedMsg = await newMsg.populate('author');

          // Publica el evento con el mensaje completo (incluyendo el autor poblado)
          pubsub.publish(MESSAGE_SENT, { messageSent: populatedMsg }); // messageSent coincide con el nombre del campo en la suscripción

          console.log(`Mensaje publicado a MESSAGE_SENT para destinatario ${to}`);
          return populatedMsg; // Devuelve el mensaje con el autor poblado
      } catch (error) {
          console.error('Error en sendMessage:', error);
          throw new Error('Error al enviar el mensaje');
      }
    },
    addFriend: async (_: any, { friendId }: any, { user }: any) => {
      // ... (tu lógica actual, asegúrate de manejar errores y verificar si user existe)
      if (!user?.email) throw new Error('Autenticación requerida');
      try {
         const currentUser = await Author.findOne({ email: user.email });
         if (!currentUser) throw new Error('Usuario no encontrado');

         // Verifica si el amigo existe
         const friendExists = await Author.findById(friendId);
         if (!friendExists) throw new Error('El usuario que intentas agregar no existe');

         // Evita agregarse a sí mismo
         if (currentUser._id.equals(friendId)) throw new Error('No puedes agregarte a ti mismo como amigo');

         // Verifica si ya es amigo (usando toString para comparar ObjectIds si es necesario)
         const isAlreadyFriend = currentUser.friends.some(id => id.equals(friendId));

         if (!isAlreadyFriend) {
             currentUser.friends.push(friendId);
             // También podrías agregar al currentUser a la lista de amigos del friendId si la amistad es bidireccional
             await currentUser.save();
         }
         return await currentUser.populate('friends');
      } catch (error) {
          console.error('Error en addFriend:', error);
          throw new Error('Error al agregar amigo');
      }
    },
  },
  Subscription: {
    messageSent: {
      
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator([MESSAGE_SENT]), // Escucha el evento
        (payload, variables /*, context */) => {
          const recipientId = payload.messageSent.recipient?.toString();
          const targetId = variables.to?.toString();
          const shouldSend = recipientId === targetId;
          // console.log(`Filtrando mensaje: recipient=<span class="math-inline">\{recipientId\}, target\=</span>{targetId}, shouldSend=${shouldSend}`);
          return shouldSend;
        }
      ),
      
    },
  },
};