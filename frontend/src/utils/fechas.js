// Las fechas viajan como texto "AAAA-MM-DD" (el formato del <input type="date">)
// y se interpretan siempre en hora local, sin pasar por UTC.

const aFecha = (texto) => {
  const [anio, mes, dia] = texto.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};

const esFechaValida = (texto) => /^\d{4}-\d{2}-\d{2}$/.test(texto ?? '') && !Number.isNaN(aFecha(texto).getTime());

/** Hoy como "AAAA-MM-DD". */
export const hoy = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};

const corta = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' });

/** "2026-12-05" -> "5 dic" */
export const formatearFechaCorta = (texto) => corta.format(aFecha(texto)).replace('.', '');

/** Dias de alquiler contando el de retiro y el de devolucion: 5 al 10 = 6 dias. */
export const contarDias = (desde, hasta) =>
  Math.round((aFecha(hasta) - aFecha(desde)) / 86_400_000) + 1;

/** "5 dic – 10 dic · 6 días" */
export const resumirRango = ({ desde, hasta }) => {
  const dias = contarDias(desde, hasta);
  return `${formatearFechaCorta(desde)} – ${formatearFechaCorta(hasta)} · ${dias} ${dias === 1 ? 'día' : 'días'}`;
};

/**
 * Valida un rango elegido por el visitante. Devuelve los errores por campo
 * (vacio si esta todo bien).
 */
export const validarRango = (desde, hasta) => {
  const errores = {};
  if (!esFechaValida(desde)) errores.desde = 'Elegí la fecha de retiro';
  else if (desde < hoy()) errores.desde = 'La fecha de retiro no puede ser anterior a hoy';
  if (!esFechaValida(hasta)) errores.hasta = 'Elegí la fecha de devolución';
  else if (!errores.desde && hasta < desde) errores.hasta = 'La devolución tiene que ser igual o posterior al retiro';
  return errores;
};

/** Un rango que llega por la URL solo se usa si es valido. */
export const rangoDeUrl = (desde, hasta) =>
  desde && hasta && Object.keys(validarRango(desde, hasta)).length === 0 ? { desde, hasta } : null;
