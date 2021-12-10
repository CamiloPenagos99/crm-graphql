import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    #Querys
    type Query {
        obtenerUsuario(token: String!): Usuario
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(idCliente: ID!): Cliente
    }

    #Objects types
    type Mutation {
        usuario(input: UsuarioInput!): Usuario
        autenticacion(input: LoginUsuarioInput!): Token
        producto(input: ProductoInput!): Producto
        actualizarProducto(producto: ProductoUpdateInput!, id: ID!): Producto
        eliminarProducto(id: ID!): Producto
        nuevoCliente(input: InputCliente!): Cliente
        editarCliente(cliente: InputCliente!, id: ID!): Cliente
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

    type Cliente{
        id: String
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: String
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

    input ProductoUpdateInput {
        nombre: String!
        stock: Int
        precio: Float
    }

    input LoginUsuarioInput {
        email: String!
        password: String!
    }

    input InputCliente{
        nombre: String!
        apellido: String!
        empresa: String!
        email: String
        vendedor: String
    }
`
