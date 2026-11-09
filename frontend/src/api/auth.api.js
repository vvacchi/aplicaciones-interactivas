import { get, post, put } from './cliente.js';

// login, registro y resetear devuelven { usuario, token }.
export const login = (credenciales) => post('/auth/login', credenciales);
export const registrar = (datos) => post('/auth/registro', datos);
export const obtenerPerfil = () => get('/auth/perfil');

/** Datos personales y/o { passwordActual, password }. Devuelve el usuario. */
export const actualizarPerfil = (datos) => put('/auth/perfil', datos);

/** Responde lo mismo exista o no el mail, para no revelar cuentas. */
export const recuperarPassword = (email) => post('/auth/recuperar-password', { email });

export const resetearPassword = (datos) => post('/auth/resetear-password', datos);
