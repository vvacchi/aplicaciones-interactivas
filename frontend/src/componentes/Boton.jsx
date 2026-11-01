import { Link } from 'react-router';
import estilos from './Boton.module.css';

/**
 * Boton del sistema. Con `a` se renderiza como Link interno, con `href`
 * como enlace externo y si no, como <button>.
 *
 * variante: primario | borde | blanco | peligro
 * tamano:   normal | chico
 */
export default function Boton({
  variante = 'primario',
  tamano = 'normal',
  a,
  href,
  className = '',
  children,
  ...resto
}) {
  const clases = [estilos.boton, estilos[variante], estilos[tamano], className]
    .filter(Boolean)
    .join(' ');

  if (a) {
    return (
      <Link to={a} className={clases} {...resto}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={clases} {...resto}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={clases} {...resto}>
      {children}
    </button>
  );
}
