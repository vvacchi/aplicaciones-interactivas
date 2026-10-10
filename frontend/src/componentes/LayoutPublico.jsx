import { Link, Outlet } from 'react-router';

// Navegacion provisoria para recorrer las rutas hasta que exista el diseño.
export default function LayoutPublico() {
  return (
    <>
      <header>
        <nav aria-label="Principal">
          <Link to="/">Inicio</Link> · <Link to="/catalogo">Catálogo</Link> ·{' '}
          <Link to="/publicaciones/demo">Publicación (demo)</Link> ·{' '}
          <Link to="/contacto">Contacto</Link> ·{' '}
          <Link to="/recuperar-password">Recuperar contraseña</Link> ·{' '}
          <Link to="/admin">Panel</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
