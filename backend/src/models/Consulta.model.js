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
    // La respuesta que el administrador envio por mail desde el panel.
    respuesta: {
      type: new mongoose.Schema(
        {
          mensaje: { type: String, required: true, trim: true },
          fecha: { type: Date, required: true },
          autor: { type: String, trim: true },
        },
        { _id: false }
      ),
      default: undefined,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Consulta', consultaSchema);