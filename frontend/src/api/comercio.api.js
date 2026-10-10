import { get, put } from './cliente.js';

export const obtenerComercio = () => get('/comercio');
export const guardarComercio = (datos) => put('/comercio', datos);
