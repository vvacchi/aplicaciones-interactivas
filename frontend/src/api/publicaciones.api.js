import { get } from './cliente.js';

/**
 * GET /publicaciones. Devuelve { datos, paginacion }.
 * Filtros: q, tipo, categoria, disponible, destacada, precioMin, precioMax,
 * orden, pagina, limite (maximo 50).
 */
export const listarPublicaciones = (filtros) => get('/publicaciones', filtros);

export const obtenerPublicacion = (id) => get(`/publicaciones/${id}`);
