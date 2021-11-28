
  // Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
    Mutation: {
      usuario: (_, { input }, ctx)=> {
        console.log('creando a: ', input)
        return "Creando: " + input.nombre
      }
    }
  };