import { z } from 'zod';
import { booleanoDeQuery } from './comun.validacion.js';

const nombre = z
  .string()
  .trim()
  .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
  .max(60, { error: 'El nombre no puede superar los 60 caracteres' });

const descripcion = z
  .string()
  .trim()
  .max(300, { error: 'La descripción no puede superar los 300 caracteres' })
  .optional();

const activa = z.boolean();

/** POST /api/categorias */
export const crearCategoriaSchema = z.strictObject({
  nombre,
  descripcion,
  activa: activa.default(true),
});

/**
 * PUT /api/categorias/:id
 * Los campos son opcionales, pero el body no puede venir vacío:
 * un PUT sin cambios es un error del cliente, no una operación válida.
 */
export const actualizarCategoriaSchema = z
  .strictObject({
    nombre: nombre.optional(),
    descripcion,
    activa: activa.optional(),
  })
  .refine((datos) => Object.keys(datos).length > 0, {
    error: 'Hay que enviar al menos un campo para actualizar',
  });

/** GET /api/categorias?activa=true */
export const listarCategoriasSchema = z.strictObject({
  activa: booleanoDeQuery.optional(),
});