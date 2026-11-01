import { DIAS, TEMPORADAS } from './textos.js';

const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/** 145000 -> "$ 145.000" */
export const formatearPrecio = (valor) => pesos.format(valor);

/** ["a", "b", "c"] -> "a, b y c" */
export const unirLista = (items) => new Intl.ListFormat('es', { type: 'conjunction' }).format(items);

export const formatearDuracion = (horas) => `${horas} ${horas === 1 ? 'hora' : 'horas'}`;

/** ["primavera", "verano", "otonio"] -> "Primavera, verano y otoño", en orden del año. */
export const formatearTemporadas = (temporadas = []) => {
  const orden = Object.keys(TEMPORADAS);
  const textos = [...temporadas]
    .sort((a, b) => orden.indexOf(a) - orden.indexOf(b))
    .map((t, i) => (i === 0 ? TEMPORADAS[t] : TEMPORADAS[t].toLowerCase()));
  return textos.length ? unirLista(textos) : '';
};

/**
 * Precio que corresponde mostrar segun el tipo: el alquiler se cobra por
 * dia (atributos.precioPorDia) y el resto usa `precio`, que es opcional.
 */
export const precioDePublicacion = (publicacion) =>
  publicacion.tipo === 'alquiler' ? publicacion.atributos?.precioPorDia : publicacion.precio;

/**
 * Junta los dias consecutivos con el mismo horario:
 * [{dia:'lunes',...},...] -> [{ dias: 'Lunes a jueves', horario: '09:00 – 18:00' }, ...]
 */
export const agruparHorarios = (horarios = []) => {
  const orden = Object.keys(DIAS);
  const ordenados = [...horarios].sort((a, b) => orden.indexOf(a.dia) - orden.indexOf(b.dia));
  const textoHorario = (h) => (h.cerrado ? 'Cerrado' : `${h.desde} – ${h.hasta}`);

  const grupos = [];
  for (const h of ordenados) {
    const ultimo = grupos.at(-1);
    const consecutivo = ultimo && orden.indexOf(h.dia) === orden.indexOf(ultimo.hasta) + 1;
    if (consecutivo && ultimo.horario === textoHorario(h)) {
      ultimo.hasta = h.dia;
    } else {
      grupos.push({ desde: h.dia, hasta: h.dia, horario: textoHorario(h) });
    }
  }

  return grupos.map((g) => ({
    dias: g.desde === g.hasta ? DIAS[g.desde] : `${DIAS[g.desde]} a ${DIAS[g.hasta].toLowerCase()}`,
    horario: g.horario,
  }));
};

/**
 * Las redes se cargan como texto libre ("@usuario", "usuario", una URL o
 * un telefono). Se arma el enlace que corresponde a cada una.
 */
export const enlacesDeRedes = (redes = {}) => {
  const esUrl = (valor) => /^https?:\/\//i.test(valor);
  const usuario = (valor) => valor.replace(/^@/, '').trim();
  const enlaces = [];

  if (redes.instagram) {
    enlaces.push({
      red: 'Instagram',
      url: esUrl(redes.instagram) ? redes.instagram : `https://instagram.com/${usuario(redes.instagram)}`,
    });
  }
  if (redes.facebook) {
    enlaces.push({
      red: 'Facebook',
      url: esUrl(redes.facebook) ? redes.facebook : `https://facebook.com/${usuario(redes.facebook)}`,
    });
  }
  if (redes.whatsapp) {
    const digitos = redes.whatsapp.replace(/\D/g, '');
    enlaces.push({
      red: 'WhatsApp',
      url: esUrl(redes.whatsapp) ? redes.whatsapp : `https://wa.me/${digitos}`,
    });
  }

  return enlaces;
};
