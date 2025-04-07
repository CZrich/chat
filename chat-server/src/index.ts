// index.ts
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors  from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/Resolver';
import { verifyGoogleToken } from './auth/google';

dotenv.config();

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // Conexión a MongoDB Atlas
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('MongoDB conectado');

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({ schema });
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const user = await verifyGoogleToken(token);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/graphql`);
  });
};

startServer();
