import { get } from './cliente.js';

/** GET /categorias. Devuelve un array sin paginar; el visitante solo ve las activas. */
export const listarCategorias = () => get('/categorias');
