import mongoose from 'mongoose';

const horarioSchema = new mongoose.Schema(
  {
    dia: {
      type: String,
      required: true,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
    },
    desde: { type: String, required: true },
    hasta: { type: String, required: true },
    cerrado: { type: Boolean, default: false },
  },
  { _id: false }
);

const comercioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    redes: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
    },
    horarios: [horarioSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Comercio', comercioSchema);