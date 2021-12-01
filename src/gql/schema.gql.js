import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String,
  }

  type Mutation {
    usuario(input: UsuarioInput! ): Usuario
    autenticacion(input: LoginUsuarioInput!): Token
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input LoginUsuarioInput {
    email: String!
    password: String!
  }
`;

