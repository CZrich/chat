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
import typeDefs from './schema/typeDefs.js';
import { resolvers } from './schema/Resolver.js';


import { WebSocketServer } from 'ws';

//@ts-ignore
import { useServer } from 'graphql-ws/lib/use/ws';


dotenv.config();

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  
  // Conexión a MongoDB Atlas
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('MongoDB conectado');
  
  // Crea el esquema GraphQL ejecutable
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
 
  // Configura el servidor WebSocket para subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  
  // Configura useServer para GraphQL sobre WebSocket
  const serverCleanup = useServer({schema}, wsServer);
  // Crea el servidor Apollo
  const server = new ApolloServer({ 
    schema 
  });
  
  await server.start();
  
  
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server)
);
//  
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