import mongoose from 'mongoose'

const PedidoSchema = mongoose.Schema({
    pedido: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente',
    },

    estado: {
        type: String,
        default: 'PENDIENTE',
    },

    creado: {
        type: Date,
        default: Date.now(),
    },
})

export default mongoose.model('Pedido', PedidoSchema)
