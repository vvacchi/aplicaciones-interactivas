import { z } from 'zod';
import { objectId, booleanoDeQuery } from './comun.validacion.js';

export const TIPOS = ['experiencia', 'curso', 'alquiler'];

/* ------------------------------------------------------------------ */
/* Atributos propios de cada tipo                                      */
/* ------------------------------------------------------------------ */

const atributosExperiencia = z.strictObject({
  dificultad: z.enum(['baja', 'media', 'alta']),
  duracionHoras: z.number().positive({ error: 'La duración debe ser mayor a cero' }),
  temporada: z
    .array(z.enum(['verano', 'otoño', 'invierno', 'primavera']))
    .min(1, { error: 'Indicá al menos una temporada' }),
  cupoMaximo: z.number().int().positive(),
  puntoEncuentro: z.string().trim().min(3),
  incluye: z.array(z.string().trim().min(1)).default([]),
});

const atributosCurso = z.strictObject({
  duracionHoras: z.number().positive(),
  nivel: z.enum(['inicial', 'intermedio', 'avanzado']),
  certificacion: z.string().trim().max(120).optional(),
  cupo: z.number().int().positive(),
  requisitosPrevios: z.array(z.string().trim().min(1)).default([]),
});

const atributosAlquiler = z
  .strictObject({
    precioPorDia: z.number().nonnegative(),
    talles: z.array(z.string().trim().min(1)).default([]),
    unidadesTotales: z.number().int().nonnegative(),
    unidadesDisponibles: z.number().int().nonnegative(),
    deposito: z.number().nonnegative().optional(),
  })
  .refine((a) => a.unidadesDisponibles <= a.unidadesTotales, {
    error: 'Las unidades disponibles no pueden superar las totales',
    path: ['unidadesDisponibles'],
  });

const ATRIBUTOS_POR_TIPO = {
  experiencia: atributosExperiencia,
  curso: atributosCurso,
  alquiler: atributosAlquiler,
};

/* ------------------------------------------------------------------ */
/* Campos comunes a las tres formas                                    */
/* ------------------------------------------------------------------ */

const nombre = z
  .string()
  .trim()
  .min(3, { error: 'El nombre debe tener al menos 3 caracteres' })
  .max(120, { error: 'El nombre no puede superar los 120 caracteres' });

const descripcion = z
  .string()
  .trim()
  .min(20, { error: 'La descripción debe tener al menos 20 caracteres' })
  .max(2000, { error: 'La descripción no puede superar los 2000 caracteres' });

const imagenes = z
  .array(z.url({ error: 'Cada imagen debe ser una URL válida' }))
  .min(1, { error: 'Subí al menos una imagen' })
  .max(8, { error: 'No se permiten más de 8 imágenes' });

const precio = z.number().nonnegative({ error: 'El precio no puede ser negativo' });

/* ------------------------------------------------------------------ */
/* POST /api/publicaciones                                             */
/* ------------------------------------------------------------------ */

/**
 * Se usa una unión discriminada por `tipo`: Zod elige el schema de
 * `atributos` que corresponde y, si el tipo no es válido, informa
 * un solo error claro en vez de los errores de las tres variantes.
 */
const baseCrear = {
  nombre,
  descripcion,
  categoria: objectId,
  imagenes,
  precio: precio.optional(),
  disponible: z.boolean().default(true),
  activa: z.boolean().default(true),
  destacada: z.boolean().default(false),
};

export const crearPublicacionSchema = z.discriminatedUnion(
  'tipo',
  TIPOS.map((tipo) =>
    z.strictObject({
      ...baseCrear,
      tipo: z.literal(tipo),
      atributos: ATRIBUTOS_POR_TIPO[tipo],
    })
  ),
  { error: `El tipo debe ser uno de: ${TIPOS.join(', ')}` }
);

/* ------------------------------------------------------------------ */
/* PUT /api/publicaciones/:id                                          */
/* ------------------------------------------------------------------ */

/**
 * En una actualización todos los campos son opcionales, así que no se
 * puede discriminar por `tipo`: puede no venir. La regla es que
 * `atributos` y `tipo` viajan juntos, porque sin saber el tipo no hay
 * forma de saber qué forma tiene que tener `atributos`.
 *
 * Además `atributos` se reemplaza entero y nunca por partes: Mongoose
 * no detecta mutaciones internas de un campo Mixed.
 */
export const actualizarPublicacionSchema = z
  .strictObject({
    nombre: nombre.optional(),
    descripcion: descripcion.optional(),
    categoria: objectId.optional(),
    imagenes: imagenes.optional(),
    precio: precio.optional(),
    disponible: z.boolean().optional(),
    activa: z.boolean().optional(),
    destacada: z.boolean().optional(),
    tipo: z.enum(TIPOS).optional(),
    atributos: z.record(z.string(), z.unknown()).optional(),
  })
  .check((ctx) => {
    const datos = ctx.value;

    if (Object.keys(datos).length === 0) {
      ctx.issues.push({
        code: 'custom',
        input: datos,
        message: 'Hay que enviar al menos un campo para actualizar',
      });
      return;
    }

    if (datos.atributos === undefined) return;

    if (datos.tipo === undefined) {
      ctx.issues.push({
        code: 'custom',
        input: datos.atributos,
        path: ['atributos'],
        message: 'Para modificar los atributos también hay que enviar el tipo',
      });
      return;
    }

    const resultado = ATRIBUTOS_POR_TIPO[datos.tipo].safeParse(datos.atributos);
    if (resultado.success) {
      datos.atributos = resultado.data;
      return;
    }
    for (const issue of resultado.error.issues) {
      ctx.issues.push({
        code: 'custom',
        input: datos.atributos,
        path: ['atributos', ...issue.path],
        message: issue.message,
      });
    }
  });

/* ------------------------------------------------------------------ */
/* GET /api/publicaciones                                              */
/* ------------------------------------------------------------------ */

const enteroDeQuery = (opciones = {}) =>
  z.coerce.number().int().min(opciones.min ?? 1);

export const listarPublicacionesSchema = z
  .strictObject({
    q: z.string().trim().min(2, { error: 'La búsqueda necesita al menos 2 caracteres' }).optional(),
    tipo: z.enum(TIPOS).optional(),
    categoria: objectId.optional(),
    disponible: booleanoDeQuery.optional(),
    activa: booleanoDeQuery.optional(),
    destacada: booleanoDeQuery.optional(),
    precioMin: z.coerce.number().nonnegative().optional(),
    precioMax: z.coerce.number().nonnegative().optional(),
    orden: z.enum(['recientes', 'precio-asc', 'precio-desc', 'nombre']).default('recientes'),
    pagina: enteroDeQuery().default(1),
    limite: enteroDeQuery().max(50, { error: 'El límite máximo es 50' }).default(12),
  })
  .refine(
    (q) => q.precioMin === undefined || q.precioMax === undefined || q.precioMin <= q.precioMax,
    { error: 'El precio mínimo no puede ser mayor al máximo', path: ['precioMin'] }
  );