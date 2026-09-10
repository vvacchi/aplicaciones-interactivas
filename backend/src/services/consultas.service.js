
import Consulta from '../models/Consulta.model.js';
import Publicacion from '../models/Publicacion.model.js';
import {
  RecursoNoEncontradoError,
  DatosInvalidosError,
} from '../utils/errors.js';

const ORDENES = {
  recientes: { createdAt: -1 },
  antiguas: { createdAt: 1 },
};

export const listar = async ({ pagina, limite, orden, ...filtros } = {}) => {
  const filtro = {};
  if (filtros.estado) filtro.estado = filtros.estado;
  if (filtros.publicacion) filtro.publicacion = filtros.publicacion;

  const salteo = (pagina - 1) * limite;

  const [datos, total, pendientes] = await Promise.all([
    Consulta.find(filtro)
      .populate('publicacion', 'nombre tipo')
      .sort(ORDENES[orden])
      .skip(salteo)
      .limit(limite),
    Consulta.countDocuments(filtro),
    Consulta.countDocuments({ estado: 'pendiente' }),
  ]);

  return {
    datos,
    // Sirve para el badge de "consultas sin leer" del panel.
    pendientes,
    paginacion: {
      total,
      pagina,
      limite,
      paginas: Math.ceil(total / limite) || 1,
    },
  };
};

export const obtenerPorId = async (id) => {
  const consulta = await Consulta.findById(id).populate('publicacion', 'nombre tipo');
  if (!consulta) throw new RecursoNoEncontradoError('Consulta no encontrada');
  return consulta;
};

export const crear = async (datos) => {
  if (datos.publicacion) {
    const existe = await Publicacion.exists({ _id: datos.publicacion });
    if (!existe) {
      throw new DatosInvalidosError('La publicacion indicada no existe');
    }
  }
  return Consulta.create(datos);
};

export const cambiarEstado = async (id, estado) => {
  const consulta = await Consulta.findByIdAndUpdate(
    id,
    { estado },
    { new: true, runValidators: true }
  ).populate('publicacion', 'nombre tipo');

  if (!consulta) throw new RecursoNoEncontradoError('Consulta no encontrada');
  return consulta;
};

export const eliminar = async (id) => {
  const consulta = await Consulta.findByIdAndDelete(id);
  if (!consulta) throw new RecursoNoEncontradoError('Consulta no encontrada');
};