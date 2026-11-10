import { del, get, post, put } from './cliente.js';

/**
 * POST /consultas. Publico: es el formulario de contacto.
 * Campos: nombre, email, telefono (opcional), asunto, mensaje y
 * publicacion (id, opcional). Devuelve la consulta creada.
 */
export const enviarConsulta = (datos) => post('/consultas', datos);

/**
 * Panel. GET /consultas devuelve { datos, pendientes, paginacion }.
 * Filtros: estado (pendiente | leida | respondida), publicacion,
 * orden (recientes | antiguas), pagina, limite (maximo 50).
 */
export const listarConsultas = (filtros) => get('/consultas', filtros);
export const obtenerConsulta = (id) => get(`/consultas/${id}`);

/** Lo unico editable de una consulta es su estado: el resto lo escribio el visitante. */
export const cambiarEstadoConsulta = (id, estado) => put(`/consultas/${id}/estado`, { estado });
export const eliminarConsulta = (id) => del(`/consultas/${id}`);
