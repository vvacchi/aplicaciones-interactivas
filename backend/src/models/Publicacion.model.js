import mongoose from 'mongoose';

const publicacionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      required: true,
      enum: ['experiencia', 'curso', 'alquiler'],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
    },
    imagenes: [{ type: String }],
    precio: { type: Number, min: 0 },
    disponible: { type: Boolean, default: true },
    activa: { type: Boolean, default: true },
    destacada: { type: Boolean, default: false },
    atributos: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

publicacionSchema.index({ nombre: 'text', descripcion: 'text' });

export default mongoose.model('Publicacion', publicacionSchema);