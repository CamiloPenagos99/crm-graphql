import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

const app = express();

const port = 4000;

const iniciarApi = async () => {
  app.listen(port, () => {
    console.log("servidor corriendo", `http://localhost:${port}`);
  });
};

iniciarApi();
