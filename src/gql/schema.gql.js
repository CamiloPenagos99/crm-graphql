import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String,
  }

  type Mutation {
    usuario(input: UsuarioInput! ): Usuario
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }
`;

