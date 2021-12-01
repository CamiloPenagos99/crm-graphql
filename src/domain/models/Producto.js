import mongoose from 'mongoose';

const ProductoSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
    },
    creado:{
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Producto', ProductoSchema);