import mongoose from 'mongoose';
import {
  RecursoNoEncontradoError,
  ConflictoError,
  DatosInvalidosError,
  NoAutorizadoError,
} from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  // Errores de dominio
  if (err instanceof RecursoNoEncontradoError) {
    return res.status(404).json({ mensaje: err.message });
  }
  if (err instanceof ConflictoError) {
    return res.status(409).json({ mensaje: err.message });
  }
  if (err instanceof DatosInvalidosError) {
    return res.status(400).json({ mensaje: err.message });
  }
  if (err instanceof NoAutorizadoError) {
    return res.status(401).json({ mensaje: err.message });
  }

  // Errores de Mongoose
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ mensaje: 'Identificador inválido' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      mensaje: 'Datos inválidos',
      errores: Object.values(err.errors).map((e) => e.message),
    });
  }
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ mensaje: `Ya existe un registro con ese ${campo}` });
  }

  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};