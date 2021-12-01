import Usuario from "../domain/models/Usuario.js";
import Producto from "../domain/models/Producto.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const crearToken = (user, secret, expiresIn) => {
  console.log(user);
  const { id, email } = user;
  const token = jwt.sign({ id }, secret, { expiresIn });
  console.log("Token generado: ", token);
  return token;
};
// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }, ctx) => {
      console.log("token: ", token);
      const { id } = await jwt.verify(token, process.env.SECRET);
      if (id) {
        console.log("usuario ID: ", id);
        const user = await Usuario.findOne({ _id: id });
        return user;
      } else {
        throw new Error("Token invalido");
      }
    },
  },

  Mutation: {
    usuario: async (_, { input }, ctx) => {
      //validar si el usuario esta registrado
      const { email, password } = input;

      const existeUsuario = await Usuario.findOne({ email: email });
      if (existeUsuario) {
        console.log("existe usuario:", existeUsuario);
        return existeUsuario;
      }
      if (!existeUsuario) console.log("Creando el nuevo usuario:", input);
      //hash del password
      const salt = await bcryptjs.genSalt(2);
      input.password = await bcryptjs.hash(password, salt);

      //guardar en base de datos
      try {
        const _user = new Usuario(input);
        await _user.save();
        return _user;
      } catch (error) {
        console.error("error al guardar: ", error.message);
        throw new Error("Error al guardar usuario")
      }
    },

    autenticacion: async (_, { input }, ctx) => {
      const { email, password } = input;

      const existeUsuario = await Usuario.findOne({ email: email });
      if (!existeUsuario) {
        console.log("No existe usuario:", existeUsuario);
        throw new Error("El usuario No esta registrado");
      }

      //verificar los password
      const passwordValidado = await bcryptjs.compare(
        password,
        existeUsuario.password
      );

      if (!passwordValidado) throw new Error("Datos de entrada incorrectos");

      //crear el token
      return {
        token: crearToken(existeUsuario, process.env.SECRET, "12h"),
      };
    },

    producto: async(_, { input }, ctx )=> {
      console.log('Input producto: ', input)

      //guardar en base de datos
      try {
        const _producto = new Producto(input);
        await _producto.save();
        return _producto;
      } catch (error) {
        console.error("error al guardar: ", error.message);
        throw new Error("Error al guardar usuario")
      }

    }

  },
  
};
