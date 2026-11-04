// Chequeos que se repiten en varias pantallas. Replican las reglas del back
// para dar feedback inmediato; el back vuelve a validar igual.

/** Id de Mongo: 24 caracteres hexadecimales. */
export const esId = (texto) => /^[a-f\d]{24}$/i.test(texto ?? '');

/** Mail con forma razonable (algo@algo.algo). */
export const esEmail = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto ?? '');
