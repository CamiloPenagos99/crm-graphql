import { gql } from "apollo-server-express";

export const typeDefs = gql`

#Querys
  type Query {
    obtenerUsuario (token: String!): Usuario
    obtenerProducto: [Producto]
  }

#Objects types
  type Mutation {
    usuario(input: UsuarioInput! ): Usuario
    autenticacion(input: LoginUsuarioInput!): Token
    producto(input: ProductoInput!): Producto
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Producto {
    id: ID
    nombre: String
    stock: Int
    precio: Float
    creado: String
  }

  type Token {
    token: String
  }

#Input
  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    stock: Int!
    precio: Float!
  }

  input LoginUsuarioInput {
    email: String!
    password: String!
  }
`;

