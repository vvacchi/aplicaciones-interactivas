import { Link, useLocation } from 'react-router';
import { IconoMensaje } from './Iconos.jsx';
import estilos from './BotonAyuda.module.css';

/** Acceso flotante a contacto. En la propia pagina de contacto sobra. */
export default function BotonAyuda() {
  const { pathname } = useLocation();
  if (pathname === '/contacto') return null;

  return (
    <Link to="/contacto" className={estilos.ayuda}>
      <IconoMensaje className={estilos.icono} />
      <span className={estilos.texto}>Consultanos</span>
    </Link>
  );
}
