import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefono: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    rol: { type: String, enum: ['admin'], default: 'admin' },
    resetToken: { type: String, select: false },
    resetTokenExpira: { type: Date, select: false },
  },
  { timestamps: true }
);

usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.compararPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);