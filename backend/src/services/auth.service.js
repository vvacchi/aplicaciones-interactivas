import crypto from 'node:crypto';
import Usuario from '../models/Usuario.model.js';
import { firmarToken } from '../utils/jwt.js';
import {
  ConflictoError,
  NoAutorizadoError,
  DatosInvalidosError,
} from '../utils/errors.js';

const VIGENCIA_RESET_MINUTOS = 60;

/** Nunca se devuelve el hash de la contrasena ni los datos de reseteo. */
const aRespuesta = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  email: usuario.email,
  telefono: usuario.telefono,
  rol: usuario.rol,
});

const emitirSesion = (usuario) => ({
  usuario: aRespuesta(usuario),
  token: firmarToken({ sub: usuario._id.toString(), rol: usuario.rol }),
});

/** El token viaja en claro al usuario; en la base solo queda su hash. */
const hashearToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const registrar = async (datos) => {
  const existe = await Usuario.exists({ email: datos.email });
  if (existe) {
    throw new ConflictoError('Ya existe un usuario con ese correo electronico');
  }

  const usuario = await Usuario.create(datos);
  return emitirSesion(usuario);
};

export const login = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ email }).select('+password');

  // El mismo mensaje para usuario inexistente y contrasena incorrecta:
  // distinguirlos permitiria averiguar que correos estan registrados.
  const credencialesInvalidas = new NoAutorizadoError(
    'Correo electronico o contrasena incorrectos'
  );

  if (!usuario) throw credencialesInvalidas;

  const coincide = await usuario.compararPassword(password);
  if (!coincide) throw credencialesInvalidas;

  return emitirSesion(usuario);
};

export const obtenerPerfil = async (usuario) => aRespuesta(usuario);

export const actualizarPerfil = async (usuarioActual, datos) => {
  const { passwordActual, password, ...resto } = datos;

  if (resto.email && resto.email !== usuarioActual.email) {
    const existe = await Usuario.exists({ email: resto.email });
    if (existe) {
      throw new ConflictoError('Ya existe un usuario con ese correo electronico');
    }
  }

  // Se recarga con la contrasena porque el documento del middleware
  // viene sin ella y `save()` la necesita para no borrarla.
  const usuario = await Usuario.findById(usuarioActual._id).select('+password');

  if (password) {
    const coincide = await usuario.compararPassword(passwordActual);
    if (!coincide) {
      throw new DatosInvalidosError('La contrasena actual no es correcta');
    }
    usuario.password = password;
  }

  Object.assign(usuario, resto);
  await usuario.save();

  return aRespuesta(usuario);
};

/**
 * Genera el token de recuperacion. Devuelve siempre lo mismo exista o no
 * el correo, para no confirmarle a nadie que direcciones estan registradas.
 */
export const solicitarRecuperacion = async ({ email }) => {
  const usuario = await Usuario.findOne({ email });
  if (!usuario) return { token: null };

  const token = crypto.randomBytes(32).toString('hex');

  usuario.resetToken = hashearToken(token);
  usuario.resetTokenExpira = new Date(
    Date.now() + VIGENCIA_RESET_MINUTOS * 60 * 1000
  );
  await usuario.save();

  return { token };
};

export const resetearPassword = async ({ token, password }) => {
  const usuario = await Usuario.findOne({
    resetToken: hashearToken(token),
    resetTokenExpira: { $gt: new Date() },
  }).select('+password +resetToken +resetTokenExpira');

  if (!usuario) {
    throw new NoAutorizadoError('El token de recuperacion es invalido o vencio');
  }

  usuario.password = password;
  usuario.resetToken = undefined;
  usuario.resetTokenExpira = undefined;
  await usuario.save();

  return emitirSesion(usuario);
};