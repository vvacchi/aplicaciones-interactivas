import { del, get, post, put } from './cliente.js';

/**
 * GET /categorias. Devuelve un array sin paginar. El visitante solo ve las
 * activas; con sesion de admin vienen todas (y se puede filtrar por `activa`).
 */
export const listarCategorias = (filtros) => get('/categorias', filtros);

/** Las del sitio publico: con la sesion del panel abierta, igual solo las activas. */
export const listarCategoriasVisibles = () => listarCategorias({ activa: true });

/** Panel. Campos: nombre, descripcion (opcional) y activa. */
export const crearCategoria = (datos) => post('/categorias', datos);
export const actualizarCategoria = (id, datos) => put(`/categorias/${id}`, datos);

/** 409 si la categoria todavia tiene publicaciones. */
export const eliminarCategoria = (id) => del(`/categorias/${id}`);
