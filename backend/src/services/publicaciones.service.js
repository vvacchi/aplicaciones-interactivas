import Publicacion from '../models/Publicacion.model.js';
import Categoria from '../models/Categoria.model.js';
import {
  RecursoNoEncontradoError,
  DatosInvalidosError,
} from '../utils/errors.js';

const ORDENES = {
  recientes: { createdAt: -1 },
  'precio-asc': { precio: 1 },
  'precio-desc': { precio: -1 },
  nombre: { nombre: 1 },
};

/** Traduce los filtros ya validados a un filtro de Mongo. */
const armarFiltro = ({ q, tipo, categoria, disponible, activa, destacada, precioMin, precioMax }) => {
  const filtro = {};

  if (q) filtro.$text = { $search: q };
  if (tipo) filtro.tipo = tipo;
  if (categoria) filtro.categoria = categoria;
  if (disponible !== undefined) filtro.disponible = disponible;
  if (activa !== undefined) filtro.activa = activa;
  if (destacada !== undefined) filtro.destacada = destacada;

  if (precioMin !== undefined || precioMax !== undefined) {
    filtro.precio = {};
    if (precioMin !== undefined) filtro.precio.$gte = precioMin;
    if (precioMax !== undefined) filtro.precio.$lte = precioMax;
  }

  return filtro;
};

/** Falla si la categoría referenciada no existe. */
const verificarCategoria = async (id) => {
  const existe = await Categoria.exists({ _id: id });
  if (!existe) {
    throw new DatosInvalidosError('La categoría indicada no existe');
  }
};

export const listar = async ({ pagina, limite, orden, ...filtros } = {}) => {
  const filtro = armarFiltro(filtros);
  const salteo = (pagina - 1) * limite;

  const [datos, total] = await Promise.all([
    Publicacion.find(filtro)
      .populate('categoria', 'nombre')
      .sort(ORDENES[orden])
      .skip(salteo)
      .limit(limite),
    Publicacion.countDocuments(filtro),
  ]);

  return {
    datos,
    paginacion: {
      total,
      pagina,
      limite,
      paginas: Math.ceil(total / limite) || 1,
    },
  };
};

export const obtenerPorId = async (id) => {
  const publicacion = await Publicacion.findById(id).populate('categoria', 'nombre');
  if (!publicacion) throw new RecursoNoEncontradoError('Publicación no encontrada');
  return publicacion;
};

export const crear = async (datos) => {
  await verificarCategoria(datos.categoria);
  return Publicacion.create(datos);
};

export const actualizar = async (id, datos) => {
  if (datos.categoria) await verificarCategoria(datos.categoria);

  const publicacion = await Publicacion.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  }).populate('categoria', 'nombre');

  if (!publicacion) throw new RecursoNoEncontradoError('Publicación no encontrada');
  return publicacion;
};

export const eliminar = async (id) => {
  const publicacion = await Publicacion.findByIdAndDelete(id);
  if (!publicacion) throw new RecursoNoEncontradoError('Publicación no encontrada');
};