
  // Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
    Mutation: {
      usuario: ()=> 'Creando nuevo usuario'
    }
  };