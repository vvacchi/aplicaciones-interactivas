import { get } from './cliente.js';

/**
 * GET /categorias. Devuelve un array sin paginar. El visitante solo ve las
 * activas; con sesion de admin vienen todas (y se puede filtrar por `activa`).
 */
export const listarCategorias = (filtros) => get('/categorias', filtros);

/** Las del sitio publico: con la sesion del panel abierta, igual solo las activas. */
export const listarCategoriasVisibles = () => listarCategorias({ activa: true });
