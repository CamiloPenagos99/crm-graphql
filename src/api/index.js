import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers } from "../gql/resolver.js";
import { typeDefs } from "../gql/schema.gql.js";
import { connec } from "../infra/db/database.js";

const app = express();

const port = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    const val = "contexto de app";
    return val;
  },
});
await server.start();
server.applyMiddleware({ app });

await connec();
app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
