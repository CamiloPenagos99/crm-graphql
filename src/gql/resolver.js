import Usuario from '../domain/models/Usuario.js'
import Cliente from '../domain/models/Cliente.js'
import Producto from '../domain/models/Producto.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Pedido from '../domain/models/Pedido.js'

const crearToken = (user, secret, expiresIn) => {
    console.log(user)
    const { id, email } = user
    const token = jwt.sign({ id }, secret, { expiresIn })
    console.log('Token generado: ', token)
    return token
}
// Provide resolver functions for your schema fields
export const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }, ctx) => {
            console.log('token: ', token)
            const { id } = await jwt.verify(token, process.env.SECRET)
            if (id) {
                console.log('usuario ID: ', id)
                const user = await Usuario.findOne({ _id: id })
                return user
            } else {
                throw new Error('Token invalido')
            }
        },

        //Productos
        obtenerProductos: async () => {
            try {
                const filter = {}
                const all = await Producto.find(filter)
                return all
            } catch {
                throw new Error('Error en base de datos')
            }
        },

        obtenerProducto: async (_, { id }) => {
            try {
                const producto = await Producto.findById(id)

                if (!producto) throw new Error('No existe el producto')

                return producto
            } catch (e) {
                throw new Error('Error en base de datos' + e.message)
            }
        },

        obtenerClientes: async () => {
            try {
                const filter = {}
                const clientes = await Cliente.find(filter)
                return clientes
            } catch (error) {
                console.log('error al consultar clientes')
                throw new Error('Error en base de datos' + e.message)
            }
        },

        obtenerClientesVendedor: async (_, {}, { id }) => {
            try {
                const filter = { vendedor: id }
                const clientes = await Cliente.find(filter)
                return clientes
            } catch (error) {
                console.log('error al consultar clientes')
                throw new Error('Error en base de datos' + e.message)
            }
        },

        obtenerCliente: async (_, { idCliente }, { id }) => {
            try {
                if (!id) throw new Error('El Vendedor No se ha logueado')
                //validar si cliente existe
                const cliente = await Cliente.findById(idCliente)
                if (!cliente) throw new Error('Cliente no existe')

                //solo el vendedor que lo creo, puede ver
                if (cliente.vendedor.toString() != id)
                    throw new Error(
                        'El Vendedor no tiene permiso para el Cliente'
                    )

                return cliente
            } catch (error) {
                throw new Error('Error en la operacion: ' + error.message)
            }
        },

        obtenerPedidos: async () => {
            try {
                const filter = {}
                const pedidos = await Pedido.find(filter)
                return pedidos
            } catch (error) {
                console.log('error al consultar pedidos')
                throw new Error('Error en base de datos' + e.message)
            }
        },

        obtenerPedidosVendedor: async (_, { input }, ctx) => {
            try {
                const pedidos = Pedido.find({ vendedor: ctx.id })
                // if (pedidos.vendedor.toString() != ctx.id) throw new Error('El Vendedor no tiene permiso para el Cliente')
                return pedidos
            } catch (e) {
                throw new Error(
                    'Error en la operación, en base de datos:' + e.message
                )
            }
        },

        obtenerPedido: async (_, { id }, ctx) => {
            //solo el vendedor que lo creo, puede ver

            try {
                console.log('Consultando pedido...', id)
                const pedido = await Pedido.findById(id)
                if (!pedido) {
                    throw new Error('El pedido buscado no existe')
                } else if (pedido) {
                    console.log('El pedido es:', pedido)
                    if (pedido.vendedor.toString() != ctx.id) {
                        throw new Error(
                            'El Vendedor no tiene permiso para el Pedido'
                        )
                    }
                }

                return pedido
            } catch (e) {
                console.error('Error en resolver: ', e)
                throw new Error(
                    'Error en la operación, en base de datos:' + e.message
                )
            }
        },

        obtenerPedidoEstado: async (_, { estado }, ctx) => {
            try {
                if (estado != ('PENDIENTE' || 'COMPLETADO' || 'CANCELADO'))
                    throw new Error('Estado solicitado, No valido')
                const filter = { estado, vendedor: ctx.id }
                const before = await Pedido.find(filter)

                if (!before || before.length == 0)
                    throw new Error(
                        'No tiene pedidos registrados, con el estado solicitado'
                    )

                return before
            } catch (e) {
                throw new Error('Error en base de datos: ' + e.message)
            }
        },

        mejoresClientes: async (_, { estado }, ctx) => {
            const clientes = await Pedido.aggregate([
                { $match: { estado: 'COMPLETADO' } },
                {
                    $group: {
                        _id: '$cliente',
                        total: { $sum: '$total' },
                    },
                },
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'cliente',
                    },
                },

                {
                    $sort: { total: -1 },
                },
            ])

            return clientes
        },
    },

    Mutation: {
        usuario: async (_, { input }, ctx) => {
            //validar si el usuario esta registrado
            try {
                const { email, password } = input

                const existeUsuario = await Usuario.findOne({ email: email })
                if (existeUsuario) {
                    console.log('existe usuario:', existeUsuario)
                    return existeUsuario
                }
                if (!existeUsuario)
                    console.log('Creando el nuevo usuario:', input)
                //hash del password
                console.log('input password ingresado: ', password)
                const salt = await bcryptjs.genSalt(2)
                input.password = await bcryptjs.hash(password, salt)

                //guardar en base de datos

                const _user = new Usuario(input)
                await _user.save()
                console.log('Vendedor creado: ', _user.id)
                return _user
            } catch (error) {
                console.error('error al registrar vendedor: ', error)
                throw new Error('Error al registrar vendedor')
            }
        },

        autenticacion: async (_, { input }, ctx) => {
            const { email, password } = input

            const existeUsuario = await Usuario.findOne({ email: email })
            if (!existeUsuario) {
                console.log('No existe usuario:', existeUsuario)
                throw new Error('El usuario No esta registrado')
            }

            //verificar los password
            const passwordValidado = await bcryptjs.compare(
                password,
                existeUsuario.password
            )

            if (!passwordValidado)
                throw new Error('Datos de entrada incorrectos')

            //crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRET, '12h'),
            }
        },

        producto: async (_, { input }, ctx) => {
            console.log('Input producto: ', input)

            //guardar en base de datos
            try {
                const _producto = new Producto(input)
                await _producto.save()
                return _producto
            } catch (error) {
                console.error('error al guardar: ', error.message)
                throw new Error('Error al guardar usuario')
            }
        },

        actualizarProducto: async (_, { id, producto }) => {
            try {
                const before = await Producto.findById(id)

                if (!before) throw new Error('No existe el producto')

                const update = await Producto.findByIdAndUpdate(id, producto, {
                    new: true,
                })

                console.log('before: ', before)
                console.log('update: ', update)

                return update
            } catch (e) {
                throw new Error('Error en base de datos' + e.message)
            }
        },

        eliminarProducto: async (_, { id }) => {
            try {
                const before = await Producto.findById(id)

                if (!before) throw new Error('No existe el producto')

                const remove = await Producto.findByIdAndDelete(id)

                console.log('remove: ', remove)

                return remove
            } catch (e) {
                throw new Error('Error en base de datos: ' + e.message)
            }
        },

        //cliente

        nuevoCliente: async (_, { input }, ctx) => {
            const existeCliente = await Cliente.findOne({ email: input.email })

            if (existeCliente) {
                console.log('existe cliente:', existeCliente)
                throw new Error('Ya existe un cliente con el Email, indicado')
            }
            if (!existeCliente) console.log('Creando el nuevo cliente:', input)
            const _cliente = new Cliente(input)
            //asignar un vendedor
            _cliente.vendedor = ctx.id
            console.log('vendedor contexto: ', _cliente.vendedor)
            //guardar en base de datos
            try {
                const cliente = await _cliente.save()
                return cliente
            } catch (error) {
                console.error('error al guardar: ', error.message)
                throw new Error('Error al guardar cliente:' + error.message)
            }
        },

        editarCliente: async (_, { id, cliente }, ctx) => {
            try {
                const before = await Cliente.findById(id)

                if (!before) throw new Error('No existe el Cliente')
                if (before.vendedor.toString() != ctx.id)
                    throw new Error(
                        'El Vendedor no tiene permiso para el Cliente'
                    )

                const update = await Cliente.findByIdAndUpdate(id, cliente, {
                    new: true,
                })

                console.log('before: ', before)
                console.log('update: ', update)

                return update
            } catch (e) {
                throw new Error('Error en base de datos: ' + e.message)
            }
        },

        eliminarCliente: async (_, { id }, ctx) => {
            try {
                const before = await Cliente.findById(id)

                if (!before) throw new Error('No existe el Cliente')
                if (before.vendedor.toString() != ctx.id)
                    throw new Error(
                        'El Vendedor no tiene permiso para el Cliente'
                    )

                const del = await Cliente.findByIdAndDelete(id)
                console.log('Eliminado: ', del)
                return id
            } catch (e) {
                throw new Error('Error en base de datos: ' + e.message)
            }
        },

        //pedidos

        nuevoPedido: async (_, { input }, ctx) => {
            const existeCliente = await Cliente.findOne({ email: input.email })
            //verificar existencia cliente
            if (existeCliente) {
                console.log('existe cliente:', existeCliente)
                throw new Error('Ya existe un cliente con el Email, indicado')
            }

            //verificar el vendedor, del cliente

            const before = await Cliente.findById(input.cliente)

            if (!before) throw new Error('No existe el Cliente')
            if (before.vendedor.toString() != ctx.id)
                throw new Error('El Vendedor no tiene permiso para el Cliente')

            //verificar stock

            let total = 0
            for (let i = 0; i < input.pedido.length; i++) {
                //console.log('iterando')
                const item = input.pedido[i]
                const before = await Producto.findById(item.id)

                if (!before)
                    throw new Error('No existe el producto: ' + before.nombre)
                if (item.cantidad > before.stock)
                    throw new Error(
                        'No se tiene Stock disponible: ' + before.nombre
                    )

                //sumar precio
                total += item.cantidad * before.precio
                //restar existencia
                before.stock = before.stock - item.cantidad
                await before.save()
            }

            //console.log('despues del for')

            //generar total

            const _pedido = new Pedido(input)
            //asignar un vendedor
            _pedido.vendedor = ctx.id
            _pedido.total = total
            console.log('vendedor asignado: ', _pedido.vendedor)

            //guardar en base de datos
            try {
                const pedido = await _pedido.save()
                return pedido
            } catch (error) {
                console.error('error al guardar: ', error.message)
                throw new Error('Error al guardar Pedido:' + error.message)
            }
        },

        actualizarPedido: async (_, { pedidoInput, id }, ctx) => {
            if (!ctx.id)
                throw new Error(
                    'Error de autenticación, intente loguearse de nuevo'
                )
            try {
                console.log('Consultando pedido...', id)
                const pedido = await Pedido.findById(id)
                if (!pedido) {
                    throw new Error('El pedido buscado no existe')
                } else if (pedido) {
                    console.log('El pedido es:', pedido)
                    if (pedido.vendedor.toString() != ctx.id) {
                        throw new Error(
                            'El Vendedor no tiene permiso para el Pedido'
                        )
                    } else {
                        const cliente = await Cliente.findById(
                            pedidoInput.cliente
                        )
                        if (!cliente)
                            throw new Error('El Cliente no esta registrado')
                        if (cliente.vendedor.toString() != ctx.id)
                            throw new Error(
                                'El Vendedor no tiene permiso para el Cliente'
                            )

                        //revisar stock

                        //verificar stock

                        let total = 0
                        for (let i = 0; i < pedidoInput.pedido.length; i++) {
                            //console.log('iterando')
                            const item = pedidoInput.pedido[i]
                            const before = await Producto.findById(item.id)

                            if (!before)
                                throw new Error(
                                    'No existe el producto: ' + before.nombre
                                )
                            if (item.cantidad > before.stock)
                                throw new Error(
                                    'No se tiene Stock disponible: ' +
                                        before.nombre
                                )

                            //sumar precio
                            total += item.cantidad * before.precio
                            //restar existencia
                            //before.stock = before.stock - item.cantidad
                            const previousQuantity = pedido.pedido.find(
                                (bef) => bef.id === item.id
                            ).cantidad
                            before.stock =
                                before.stock + previousQuantity - item.cantidad
                            await before.save()
                        }

                        //actualizar el pedido
                        const _pedido = pedidoInput
                        //asignar un vendedor
                        _pedido.vendedor = ctx.id
                        _pedido.total = total
                        console.log('vendedor asignado: ', _pedido.vendedor)

                        //guardar en base de datos

                        const pedidoNuevo = Pedido.findOneAndUpdate(
                            { _id: id },
                            _pedido,
                            { new: true }
                        )
                        return pedidoNuevo
                    }
                }
            } catch (e) {
                console.error('Error en resolver: ', e)
                throw new Error(
                    'Error en la operación, en base de datos:' + e.message
                )
            }
        },

        eliminarPedido: async (_, { id }, ctx) => {
            try {
                const before = await Pedido.findById(id)

                if (!before) throw new Error('No existe el Pedido')
                if (before.vendedor.toString() != ctx.id)
                    throw new Error(
                        'El Vendedor no tiene permiso para borrar el Pedido'
                    )

                const del = await Pedido.findByIdAndDelete(id)
                console.log('Eliminado: ', del)
                return id
            } catch (e) {
                throw new Error('Error en base de datos: ' + e.message)
            }
        },
    },
}
