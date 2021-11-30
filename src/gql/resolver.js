import Usuario from "../domain/models/Usuario.js";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
    usuario: async (_, { input }, ctx) => {
      //validar si el usuario esta registrado
      const { email, password } = input;

      const existeUsuario = await Usuario.findOne({ email: email });
      if (existeUsuario) {
        console.log("existe usuario:", existeUsuario);
        return existeUsuario
      }
      if (!existeUsuario) console.log("Creando el nuevo usuario:", input);
      //hash del password

      //guardar en base de datos
      try {
        const _user = new Usuario(input);
        await _user.save();
        return _user;
      } catch (error) {
        console.error("error al guardar: ", error.message);
      }
    },
  },
};
