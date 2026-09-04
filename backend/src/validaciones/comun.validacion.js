import { z } from 'zod';

/**
 * Piezas de validación compartidas por todas las entidades.
 * Vive acá lo que no pertenece a un recurso en particular.
 */

/**
 * Un ObjectId de MongoDB es una cadena hexadecimal de 24 caracteres.
 * Validarlo en esta capa evita que un id mal formado llegue a Mongoose
 * y termine convertido en un CastError por la capa de base de datos.
 */
export const objectId = z
  .string()
  .regex(/^[0-9a-f]{24}$/i, { error: 'Identificador inválido' });

/** Params de las rutas del estilo /recurso/:id */
export const idParamSchema = z.strictObject({ id: objectId });

/**
 * Los query params siempre llegan como texto, nunca como booleano,
 * así que se declaran como 'true' | 'false' y se convierten después.
 */
export const booleanoDeQuery = z
  .enum(['true', 'false'], { error: 'El valor debe ser true o false' })
  .transform((valor) => valor === 'true');