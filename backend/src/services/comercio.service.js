import Comercio from '../models/Comercio.model.js';
import { RecursoNoEncontradoError } from '../utils/errors.js';

/**
 * La informacion institucional es un unico documento. No hay listado ni
 * busqueda por id: siempre se trabaja sobre el mismo registro.
 */

export const obtener = async () => {
  const comercio = await Comercio.findOne();
  if (!comercio) {
    throw new RecursoNoEncontradoError(
      'Todavia no se cargo la informacion del comercio'
    );
  }
  return comercio;
};

/**
 * Crea la ficha si no existe y la reemplaza si ya estaba.
 * El upsert evita tener que distinguir entre alta y modificacion.
 */
export const guardar = async (datos) =>
  Comercio.findOneAndUpdate({}, datos, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });