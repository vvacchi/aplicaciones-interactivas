import { z } from 'zod';
import { objectId } from './comun.validacion.js';

export const ESTADOS = ['pendiente', 'leida', 'respondida'];

/** POST /api/consultas — lo usa cualquier visitante del sitio. */
export const crearConsultaSchema = z.strictObject({
  nombre: z
    .string()
    .trim()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(80, { error: 'El nombre no puede superar los 80 caracteres' }),
  email: z.email({ error: 'El correo electronico no es valido' }),
  telefono: z
    .string()
    .trim()
    .min(6, { error: 'El telefono debe tener al menos 6 caracteres' })
    .max(30, { error: 'El telefono no puede superar los 30 caracteres' })
    .optional(),
  asunto: z
    .string()
    .trim()
    .min(3, { error: 'El asunto debe tener al menos 3 caracteres' })
    .max(120, { error: 'El asunto no puede superar los 120 caracteres' }),
  mensaje: z
    .string()
    .trim()
    .min(10, { error: 'El mensaje debe tener al menos 10 caracteres' })
    .max(2000, { error: 'El mensaje no puede superar los 2000 caracteres' }),
  // Se completa cuando la consulta sale del boton de una publicacion.
  publicacion: objectId.optional(),
});

/** PUT /api/consultas/:id/estado */
export const cambiarEstadoSchema = z.strictObject({
  estado: z.enum(ESTADOS, {
    error: `El estado debe ser uno de: ${ESTADOS.join(', ')}`,
  }),
});

/** GET /api/consultas */
export const listarConsultasSchema = z.strictObject({
  estado: z
    .enum(ESTADOS, { error: `El estado debe ser uno de: ${ESTADOS.join(', ')}` })
    .optional(),
  publicacion: objectId.optional(),
  orden: z.enum(['recientes', 'antiguas']).default('recientes'),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1)
    .max(50, { error: 'El limite maximo es 50' })
    .default(20),
});