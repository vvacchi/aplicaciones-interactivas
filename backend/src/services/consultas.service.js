
import Consulta from '../models/Consulta.model.js';
import Publicacion from '../models/Publicacion.model.js';
import { enviarMailRespuesta, enviarAvisoConsulta } from '../utils/mailer.js';
import {
  RecursoNoEncontradoError,
  DatosInvalidosError,
  ServicioNoDisponibleError,
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
  let publicacion = null;
  if (datos.publicacion) {
    publicacion = await Publicacion.findById(datos.publicacion, 'nombre');
    if (!publicacion) {
      throw new DatosInvalidosError('La publicacion indicada no existe');
    }
  }
  const consulta = await Consulta.create(datos);

  // El aviso al comercio no frena la respuesta al visitante: si el mail
  // falla, la consulta ya quedo guardada y se ve igual en el panel.
  enviarAvisoConsulta({ consulta, publicacion }).catch((error) => {
    console.error('[mailer] No se pudo avisar la consulta nueva:', error.message);
  });

  return consulta;
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

/**
 * Manda la respuesta por mail a quien hizo la consulta y la guarda.
 * Si el mail no sale, no se guarda nada: la consulta queda como estaba.
 */
export const responder = async (id, mensaje, usuario) => {
  const consulta = await obtenerPorId(id);

  try {
    await enviarMailRespuesta({ consulta, mensaje });
  } catch (error) {
    console.error('[mailer] No se pudo enviar la respuesta a la consulta:', error.message);
    throw new ServicioNoDisponibleError(
      'No se pudo enviar el mail. Revisá la configuración del correo e intentá de nuevo.'
    );
  }

  consulta.respuesta = {
    mensaje,
    fecha: new Date(),
    autor: usuario ? `${usuario.nombre} ${usuario.apellido}` : undefined,
  };
  consulta.estado = 'respondida';
  await consulta.save();
  return consulta;
};

export const eliminar = async (id) => {
  const consulta = await Consulta.findByIdAndDelete(id);
  if (!consulta) throw new RecursoNoEncontradoError('Consulta no encontrada');
};