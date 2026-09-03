import mongoose from 'mongoose';

const consultaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telefono: { type: String, trim: true },
    asunto: { type: String, required: true, trim: true },
    mensaje: { type: String, required: true, trim: true },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
      default: null,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'leida', 'respondida'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Consulta', consultaSchema);