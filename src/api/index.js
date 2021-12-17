import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { resolvers } from '../gql/resolver.js'
import { typeDefs } from '../gql/schema.gql.js'
import { connec } from '../infra/db/database.js'
import jwt from 'jsonwebtoken'

const app = express()

const port = 4000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        //console.log('jwt: ', req.headers['authorization'])
        const token = req.headers['authorization']
        const value = token || 'no'
        try {
            console.log('intentado validar')
            const { id } = jwt.verify(value, process.env.SECRET)
            console.log('id logueado: ', id);
            return { id };
        } catch (e) {
            console.error('No fue posible autenticar, ' + e.message)
        }
        return value;
    },
})
await server.start()
server.applyMiddleware({ app })

/*
await connec();
app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
*/

const iniciarApi = async () => {
    const con = await connec()
    console.log('conexion a db terminada: ', con)
    app.listen(port, () => {
        console.log(
            `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
        )
    })
}

iniciarApi()
