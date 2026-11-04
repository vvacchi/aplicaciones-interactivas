import { post } from './cliente.js';

/**
 * POST /consultas. Publico: es el formulario de contacto.
 * Campos: nombre, email, telefono (opcional), asunto, mensaje y
 * publicacion (id, opcional). Devuelve la consulta creada.
 */
export const enviarConsulta = (datos) => post('/consultas', datos);
