import { get, put } from './cliente.js';

/** GET /comercio. 404 si todavia no se cargo la ficha. */
export const obtenerComercio = () => get('/comercio');

/**
 * PUT /comercio. Documento unico: se manda la ficha completa (nombre,
 * descripcion, direccion, telefono, email, redes y horarios) y el back
 * la crea si no existia.
 */
export const guardarComercio = (datos) => put('/comercio', datos);
