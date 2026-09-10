import Usuario from '../models/Usuario.model.js';
import { verificarToken } from '../utils/jwt.js';
import { NoAutorizadoError, ProhibidoError } from '../utils/errors.js';

/** Extrae el token del header `Authorization: Bearer <token>`. */
const leerToken = (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
};

/**
 * Resuelve el usuario a partir del token. Devuelve null si no hay token
 * o si el token no sirve; quien llama decide si eso es un error.
 */
const resolverUsuario = async (token) => {
  if (!token) return null;

  try {
    const payload = verificarToken(token);
    return await Usuario.findById(payload.sub);
  } catch {
    // Token vencido, firma invalida o mal formado: los tres casos
    // significan lo mismo para el resto de la aplicacion.
    return null;
  }
};

/**
 * Corta la request si no hay un usuario valido detras del token.
 * Se usa en todo lo que sea del panel de administracion.
 */
export const autenticar = async (req, res, next) => {
  const usuario = await resolverUsuario(leerToken(req));

  if (!usuario) {
    return next(new NoAutorizadoError('Token invalido o vencido'));
  }

  req.usuario = usuario;
  next();
};

/**
 * No corta nunca: si hay token valido deja el usuario en `req.usuario`
 * y si no, sigue de largo. Lo usan los listados que son publicos pero
 * muestran mas informacion cuando quien mira es el administrador.
 */
export const autenticacionOpcional = async (req, res, next) => {
  req.usuario = await resolverUsuario(leerToken(req));
  next();
};

/**
 * Autorizacion por rol. Va siempre despues de `autenticar`.
 */
export const exigirRol =
  (...roles) =>
  (req, res, next) => {
    if (!req.usuario) {
      return next(new NoAutorizadoError('Token invalido o vencido'));
    }
    if (!roles.includes(req.usuario.rol)) {
      return next(new ProhibidoError());
    }
    next();
  };