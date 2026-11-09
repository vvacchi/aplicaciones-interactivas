// Chequeos que se repiten en varias pantallas. Replican las reglas del back
// para dar feedback inmediato; el back vuelve a validar igual.

/** Id de Mongo: 24 caracteres hexadecimales. */
export const esId = (texto) => /^[a-f\d]{24}$/i.test(texto ?? '');

/** Mail con forma razonable (algo@algo.algo). */
export const esEmail = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto ?? '');

export const REGLA_PASSWORD = 'Mínimo 8 caracteres, con al menos una letra y un número.';

/** Misma regla que el back. Devuelve el error o null. */
export const errorDePassword = (password) => {
  if (!password) return 'Escribí una contraseña';
  if (password.length < 8) return 'La contraseña tiene que tener al menos 8 caracteres';
  if (password.length > 72) return 'La contraseña no puede superar los 72 caracteres';
  if (!/[A-Za-z]/.test(password)) return 'La contraseña tiene que incluir al menos una letra';
  if (!/\d/.test(password)) return 'La contraseña tiene que incluir al menos un número';
  return null;
};

/** Error del mail (vacio o mal escrito) o null. */
export const errorDeEmail = (email) => {
  if (!email.trim()) return 'Escribí tu mail';
  if (!esEmail(email.trim())) return 'Revisá el mail: tiene que ser como nombre@ejemplo.com';
  return null;
};

/** Error de un texto con largo minimo y maximo, o null. */
export const errorDeLargo = (texto, [minimo, maximo], { vacio, corto, largo }) => {
  const n = texto.trim().length;
  if (n === 0 && vacio) return vacio;
  if (n < minimo) return corto;
  if (n > maximo) return largo;
  return null;
};

/** Saca las claves sin error: { a: null, b: 'x' } -> { b: 'x' } */
export const soloErrores = (errores) => Object.fromEntries(Object.entries(errores).filter(([, v]) => v));
