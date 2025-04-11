// index.ts
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/Resolver.js';

import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import router from './routes/auth.js';
//@ts-ignore
import { useServer } from 'graphql-ws/lib/use/ws';


// Define tu interfaz de contexto
interface MyContext {
  user?: { email: string } | null;
}

dotenv.config();

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  
  // Conexión a MongoDB Atlas
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('MongoDB conectado');
  
  // Crea el esquema GraphQL ejecutable
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  // Crea el servidor Apollo
  const server = new ApolloServer({ 
    schema 
  });
  
  await server.start();
  
  // Configura el servidor WebSocket para subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  
  // Configura useServer para GraphQL sobre WebSocket
  const serverCleanup = useServer({
    schema,
    context: async (ctx:any, msg:any, args:any) => {
      // Extraer token del header de conexión
      const authorization = ctx.connectionParams?.Authorization || 
                           ctx.connectionParams?.authorization || '';
      
      let currentUser = null;
      
      // Verifica el token JWT si existe
      if (typeof authorization === 'string' && authorization) {
        try {
          // Quitar 'Bearer ' si está presente
          const token = authorization.startsWith('Bearer ') 
                        ? authorization.substring(7) 
                        : authorization;
                        
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
          currentUser = decoded;
          console.log('Usuario autenticado en WebSocket:', currentUser.email);
        } catch (err) {
          console.log('Token WebSocket inválido:', err);
        }
      }
      
      // Devuelve el contexto para las suscripciones
      return {
        user: currentUser
      };
    },
    // Opcional: manejar eventos de conexión/desconexión
    onConnect: async (ctx:any) => {
      console.log('Cliente WebSocket conectado');
      return true;
    },
    onDisconnect: async (ctx:any, code:any, reason:any) => {
      console.log('Cliente WebSocket desconectado:', code, reason);
    },
  }, wsServer);
  
  // Middleware para HTTP
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> => {
        const authorizationHeader = req.headers.authorization || '';
        console.log('Auth header recibido:', authorizationHeader); // 👈 Log adicional

        let currentUser = null;
  
        if (authorizationHeader) {
          try {
            const token = authorizationHeader.startsWith('Bearer ') 
                        ? authorizationHeader.substring(7) 
                        : authorizationHeader;
                          console.log('Token a verificar:', token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
            currentUser = decoded;
          } catch (err) {
            console.log('Token HTTP inválido:', err);
          }
        }
  
        return {
          user: currentUser
        };
      },
    })
  );
  
  // Rutas REST
  app.use('/api/auth', router);
  
  // Iniciar servidor HTTP
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/graphql`);
  });
  
  // Manejar cierre del servidor
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log('Cerrando servidor WebSocket...');
      serverCleanup.dispose();
      process.exit(0);
    });
  });
};

startServer();