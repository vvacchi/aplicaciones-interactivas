import { Link } from 'react-router';
import { IconoMontana } from './Iconos.jsx';
import estilos from './Logo.module.css';

export default function Logo({ a = '/', subtitulo = 'Bariloche · Patagonia', claro = false }) {
  return (
    <Link to={a} className={`${estilos.logo} ${claro ? estilos.claro : ''}`}>
      <span className={estilos.marca} aria-hidden="true">
        <IconoMontana />
      </span>
      <span>
        Andes Vertical
        {subtitulo && <small className={estilos.subtitulo}>{subtitulo}</small>}
      </span>
    </Link>
  );
}
