import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String,
  }

  type Mutation {
    usuario: String
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }
`;

