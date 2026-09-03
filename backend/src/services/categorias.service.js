import Categoria from '../models/Categoria.model.js';
import Publicacion from '../models/Publicacion.model.js';
import { RecursoNoEncontradoError, ConflictoError } from '../utils/errors.js';

export const listar = async ({ soloActivas = false } = {}) => {
  const filtro = soloActivas ? { activa: true } : {};
  return Categoria.find(filtro).sort({ nombre: 1 });
};

export const obtenerPorId = async (id) => {
  const categoria = await Categoria.findById(id);
  if (!categoria) throw new RecursoNoEncontradoError('Categoría no encontrada');
  return categoria;
};

export const crear = async (datos) => {
  return Categoria.create(datos);
};

export const actualizar = async (id, datos) => {
  const categoria = await Categoria.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
  if (!categoria) throw new RecursoNoEncontradoError('Categoría no encontrada');
  return categoria;
};

export const eliminar = async (id) => {
  const cantidad = await Publicacion.countDocuments({ categoria: id });
  if (cantidad > 0) {
    throw new ConflictoError(
      `No se puede eliminar la categoría: tiene ${cantidad} publicación/es asociada/s`
    );
  }
  const categoria = await Categoria.findByIdAndDelete(id);
  if (!categoria) throw new RecursoNoEncontradoError('Categoría no encontrada');
};