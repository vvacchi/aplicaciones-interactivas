import jwt from 'jsonwebtoken';

const SECRETO = process.env.JWT_SECRET;
const EXPIRACION = process.env.JWT_EXPIRA || '7d';

/**
 * Se corta al arrancar y no en la primera request: un servidor sin
 * secreto firmaria tokens que cualquiera puede falsificar.
 */
if (!SECRETO) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

/**
 * El algoritmo se fija de los dos lados y nunca se toma del header del
 * token: aceptar el que venga habilita el algorithm confusion attack,
 * donde el atacante firma con `none` y la firma se da por buena.
 */
const ALGORITMO = 'HS256';

export const firmarToken = (payload) =>
  jwt.sign(payload, SECRETO, { expiresIn: EXPIRACION, algorithm: ALGORITMO });

export const verificarToken = (token) =>
  jwt.verify(token, SECRETO, { algorithms: [ALGORITMO] });