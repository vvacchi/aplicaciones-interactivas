import { useState } from 'react';
import { IconoMontana } from './Iconos.jsx';
import estilos from './Carrusel.module.css';

/**
 * Muestra una imagen a la vez con flechas y puntos. Si una imagen no
 * carga, queda un fondo neutro con un icono en lugar del icono roto.
 */
export default function Carrusel({ imagenes = [], alt, className = '' }) {
  const [indice, setIndice] = useState(0);
  const [fallidas, setFallidas] = useState(() => new Set());
  const total = imagenes.length;
  const actual = imagenes[indice];

  const mover = (paso) => (evento) => {
    // En la tarjeta, las flechas quedan sobre el link que la cubre entera:
    // el click no tiene que llegar a navegar.
    evento.preventDefault();
    evento.stopPropagation();
    setIndice((i) => (i + paso + total) % total);
  };

  const marcarFallida = () => setFallidas((previas) => new Set(previas).add(actual));

  return (
    <div className={`${estilos.carrusel} ${className}`}>
      {actual && !fallidas.has(actual) ? (
        <img
          src={actual}
          alt={total > 1 ? `${alt} (imagen ${indice + 1} de ${total})` : alt}
          loading="lazy"
          onError={marcarFallida}
        />
      ) : (
        <div className={estilos.sinImagen} role="img" aria-label={`${alt} (sin imagen)`}>
          <IconoMontana />
        </div>
      )}

      {total > 1 && (
        <>
          <button type="button" className={`${estilos.flecha} ${estilos.anterior}`} onClick={mover(-1)} aria-label="Imagen anterior">
            ‹
          </button>
          <button type="button" className={`${estilos.flecha} ${estilos.siguiente}`} onClick={mover(1)} aria-label="Imagen siguiente">
            ›
          </button>
          <div className={estilos.puntos} aria-hidden="true">
            {imagenes.map((url, i) => (
              <i key={url + i} className={i === indice ? estilos.activo : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
