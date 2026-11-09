import { Link } from 'react-router';
import Logo from './Logo.jsx';
import estilos from './PantallaAcceso.module.css';

/**
 * Marco de las pantallas de acceso al panel (ingresar, crear cuenta,
 * recuperar la contraseña): sin la navegacion del sitio, una sola tarjeta.
 */
export default function PantallaAcceso({ titulo, bajada, pie, children }) {
  return (
    <div className={estilos.pantalla}>
      <title>{`${titulo} · Andes Vertical`}</title>
      <Logo subtitulo="Panel de administración" />
      <main className={estilos.tarjeta}>
        <header className={estilos.encabezado}>
          <h1>{titulo}</h1>
          {bajada && <p>{bajada}</p>}
        </header>
        {children}
      </main>
      {pie && <div className={estilos.pie}>{pie}</div>}
      <Link to="/" className={estilos.volver}>
        ← Volver al sitio
      </Link>
    </div>
  );
}
