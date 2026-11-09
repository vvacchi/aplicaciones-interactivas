import { del, get, post, put } from './cliente.js';

/**
 * GET /publicaciones. Devuelve { datos, paginacion }.
 * Filtros: q, tipo, categoria, disponible, activa, destacada, precioMin,
 * precioMax, orden, pagina, limite (maximo 50). Con sesion de admin
 * tambien vienen las desactivadas (y se puede filtrar por `activa`).
 */
export const listarPublicaciones = (filtros) => get('/publicaciones', filtros);

export const obtenerPublicacion = (id) => get(`/publicaciones/${id}`);

/** Panel. `atributos` cambia segun `tipo` y viaja siempre junto con el tipo. */
export const crearPublicacion = (datos) => post('/publicaciones', datos);
export const actualizarPublicacion = (id, datos) => put(`/publicaciones/${id}`, datos);
export const eliminarPublicacion = (id) => del(`/publicaciones/${id}`);

/**
 * Lo que ve el visitante. Con la sesion del panel abierta el back tambien
 * devuelve las desactivadas, asi que el sitio publico las excluye siempre.
 */
export const listarPublicacionesVisibles = (filtros) => listarPublicaciones({ ...filtros, activa: true });
