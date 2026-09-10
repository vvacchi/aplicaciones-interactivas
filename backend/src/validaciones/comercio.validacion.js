import { z } from 'zod';

export const DIAS = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];

/** Hora en formato de 24 horas, HH:MM. */
const hora = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: 'La hora debe tener el formato HH:MM' });

/**
 * Un dia cerrado no lleva horario. Un dia abierto necesita las dos puntas
 * y la apertura tiene que ser anterior al cierre.
 */
const horario = z
  .strictObject({
    dia: z.enum(DIAS, { error: `El dia debe ser uno de: ${DIAS.join(', ')}` }),
    desde: hora.optional(),
    hasta: hora.optional(),
    cerrado: z.boolean().default(false),
  })
  .check((ctx) => {
    const { desde, hasta, cerrado } = ctx.value;

    if (cerrado) {
      if (desde !== undefined || hasta !== undefined) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: 'Un dia cerrado no lleva horario de apertura ni de cierre',
        });
      }
      return;
    }

    if (desde === undefined || hasta === undefined) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message: 'Un dia abierto necesita hora de apertura y de cierre',
      });
      return;
    }

    if (desde >= hasta) {
      ctx.issues.push({
        code: 'custom',
        input: hasta,
        path: ['hasta'],
        message: 'La hora de cierre tiene que ser posterior a la de apertura',
      });
    }
  });

const redes = z.strictObject({
  instagram: z.string().trim().max(120).optional(),
  facebook: z.string().trim().max(120).optional(),
  whatsapp: z.string().trim().max(40).optional(),
});

/**
 * PUT /api/comercio
 *
 * El comercio es un unico documento, asi que el panel manda la ficha
 * institucional completa en cada guardado. Por eso los campos centrales
 * son obligatorios: el mismo endpoint sirve para crearla la primera vez
 * y para actualizarla despues.
 */
export const guardarComercioSchema = z
  .strictObject({
    nombre: z
      .string()
      .trim()
      .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
      .max(120, { error: 'El nombre no puede superar los 120 caracteres' }),
    descripcion: z
      .string()
      .trim()
      .min(20, { error: 'La descripcion debe tener al menos 20 caracteres' })
      .max(2000, { error: 'La descripcion no puede superar los 2000 caracteres' }),
    direccion: z
      .string()
      .trim()
      .min(5, { error: 'La direccion debe tener al menos 5 caracteres' })
      .max(200, { error: 'La direccion no puede superar los 200 caracteres' }),
    telefono: z
      .string()
      .trim()
      .min(6, { error: 'El telefono debe tener al menos 6 caracteres' })
      .max(30, { error: 'El telefono no puede superar los 30 caracteres' }),
    email: z.email({ error: 'El correo electronico no es valido' }).optional(),
    redes: redes.optional(),
    horarios: z.array(horario).max(7, { error: 'No puede haber mas de siete dias' }).default([]),
  })
  .refine(
    (datos) => {
      const dias = datos.horarios.map((h) => h.dia);
      return new Set(dias).size === dias.length;
    },
    { error: 'Hay dias repetidos en los horarios', path: ['horarios'] }
  );