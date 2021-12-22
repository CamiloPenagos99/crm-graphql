import mongoose from 'mongoose'

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    creado: {
        type: Date,
        default: Date.now(),
    },
})

ProductoSchema.index({ nombre: 'text' })

export default mongoose.model('Producto', ProductoSchema)
