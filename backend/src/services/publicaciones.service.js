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

// Palabras que no aportan a la busqueda: "carpa de montana" busca carpa y montana.
const PALABRAS_VACIAS = new Set([
  'a', 'al', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo', 'los',
  'o', 'para', 'por', 'u', 'un', 'una', 'unos', 'unas', 'y',
]);

// Cada letra encuentra su version con y sin tilde: "travesia" encuentra
// "travesía" y "montaña" encuentra "montana".
const VARIANTES = { a: '[aá]', e: '[eé]', i: '[ií]', o: '[oó]', u: '[uúü]', n: '[nñ]' };

const sinTildes = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '');

const aRegex = (palabra) =>
  new RegExp(
    sinTildes(palabra)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/[aeioun]/g, (letra) => VARIANTES[letra]),
    'i'
  );

/**
 * Busqueda por palabras: tienen que aparecer todas, cada una en el nombre,
 * en la descripcion o en el nombre de la categoria. No distingue mayusculas
 * ni tildes y encuentra palabras incompletas ("escala" -> "escalada").
 */
const filtroDeBusqueda = async (q) => {
  const todas = sinTildes(q.toLowerCase()).split(/\s+/).filter(Boolean);
  const utiles = todas.filter((palabra) => !PALABRAS_VACIAS.has(palabra));
  // Si solo se escribieron palabras vacias ("de la"), se buscan igual.
  const palabras = utiles.length > 0 ? utiles : todas;

  const condiciones = await Promise.all(
    palabras.map(async (palabra) => {
      const regex = aRegex(palabra);
      const categorias = await Categoria.find({ nombre: regex }).distinct('_id');
      return {
        $or: [{ nombre: regex }, { descripcion: regex }, { categoria: { $in: categorias } }],
      };
    })
  );

  return { $and: condiciones };
};

/** Traduce los filtros ya validados a un filtro de Mongo. */
const armarFiltro = async ({ q, tipo, categoria, disponible, activa, destacada, precioMin, precioMax }) => {
  const filtro = q ? await filtroDeBusqueda(q) : {};

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

export const listar = async (
  { pagina, limite, orden, ...filtros } = {},
  { esAdmin = false } = {}
) => {
  // Las publicaciones desactivadas son borradores: solo las ve el panel.
  const filtro = await armarFiltro(esAdmin ? filtros : { ...filtros, activa: true });
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

export const obtenerPorId = async (id, { esAdmin = false } = {}) => {
  const publicacion = await Publicacion.findById(id).populate('categoria', 'nombre');

  // Para el visitante, una publicacion desactivada no existe.
  if (!publicacion || (!esAdmin && !publicacion.activa)) {
    throw new RecursoNoEncontradoError('Publicación no encontrada');
  }
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