import { Link } from 'react-router';
import Carrusel from './Carrusel.jsx';
import Etiqueta from './Etiqueta.jsx';
import Nivel from './Nivel.jsx';
import { TIPOS } from '../utils/textos.js';
import {
  formatearDuracion,
  formatearPrecio,
  formatearTemporadas,
  precioDePublicacion,
  unirLista,
} from '../utils/formato.js';
import estilos from './TarjetaPublicacion.module.css';

/** Las lineas "Etiqueta: valor" cambian segun el tipo de publicacion. */
function datosPorTipo({ tipo, atributos = {} }) {
  if (tipo === 'experiencia') {
    return [
      ['Dificultad', <Nivel key="nivel" valor={atributos.dificultad} />],
      ['Duración', formatearDuracion(atributos.duracionHoras)],
      ['Temporada', formatearTemporadas(atributos.temporada)],
    ];
  }
  if (tipo === 'curso') {
    return [
      ['Nivel', <Nivel key="nivel" valor={atributos.nivel} />],
      ['Duración', `${formatearDuracion(atributos.duracionHoras)} · cupo ${atributos.cupo}`],
    ];
  }
  return [
    ['Talles', atributos.talles?.length ? unirLista(atributos.talles) : null],
    ['Disponibles', `${atributos.unidadesDisponibles} de ${atributos.unidadesTotales}`],
  ];
}

function textoPrecio(publicacion) {
  const precio = precioDePublicacion(publicacion);
  if (precio === undefined || precio === null) return null;
  if (publicacion.tipo === 'alquiler') {
    return { previo: null, monto: formatearPrecio(precio), posterior: 'por día' };
  }
  if (publicacion.tipo === 'experiencia') {
    return { previo: 'Desde', monto: formatearPrecio(precio), posterior: null };
  }
  return { previo: null, monto: formatearPrecio(precio), posterior: null };
}

/**
 * Tarjeta del catalogo. Toda la tarjeta lleva al detalle (link estirado
 * desde el titulo); las flechas del carrusel quedan por encima.
 * Con `conTipo` muestra el tipo junto a la categoria.
 */
export default function TarjetaPublicacion({ publicacion, conTipo = false }) {
  const { _id, nombre, categoria, imagenes, disponible, destacada, tipo } = publicacion;
  const precio = textoPrecio(publicacion);
  const datos = datosPorTipo(publicacion).filter(([, valor]) => valor);

  return (
    <article className={`${estilos.tarjeta} ${disponible ? '' : estilos.noDisponible}`}>
      <div className={estilos.media}>
        <Carrusel imagenes={imagenes} alt={nombre} className={estilos.carrusel} />
        {!disponible ? (
          <Etiqueta variante="neutra" className={estilos.etiqueta}>
            No disponible
          </Etiqueta>
        ) : (
          destacada && <Etiqueta className={estilos.etiqueta}>Destacada</Etiqueta>
        )}
      </div>

      <div className={estilos.cuerpo}>
        <p className={estilos.categoria}>
          {categoria?.nombre}
          {conTipo && ` · ${TIPOS[tipo]}`}
        </p>
        <h3 className={estilos.nombre}>
          <Link to={`/publicaciones/${_id}`}>{nombre}</Link>
        </h3>
        <dl className={estilos.datos}>
          {datos.map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt>{etiqueta}:</dt> <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={estilos.pie}>
        {precio ? (
          <p className={estilos.precio}>
            {precio.previo && <small>{precio.previo} </small>}
            {precio.monto}
            {precio.posterior && <small> {precio.posterior}</small>}
          </p>
        ) : (
          <p className={estilos.consultar}>Precio a consultar</p>
        )}
        <span className={estilos.mas} aria-hidden="true">
          Más info
        </span>
      </div>
    </article>
  );
}
