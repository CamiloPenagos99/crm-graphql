import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers } from "../gql/resolver.js";
import { typeDefs } from "../gql/schema.gql.js";

const app = express();

const port = 4000;

const server = new ApolloServer({ typeDefs, resolvers });
await server.start()
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
