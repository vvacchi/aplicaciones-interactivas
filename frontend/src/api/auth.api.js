import { get, post } from './cliente.js';

export const login = (credenciales) => post('/auth/login', credenciales);
export const registrar = (datos) => post('/auth/registro', datos);
export const obtenerPerfil = () => get('/auth/perfil');
