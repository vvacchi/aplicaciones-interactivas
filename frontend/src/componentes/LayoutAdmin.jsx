import { Link, Outlet } from 'react-router';
import { useAuth } from '../contexto/AuthContext.jsx';

// Navegacion provisoria para recorrer las rutas hasta que exista el diseño.
export default function LayoutAdmin() {
  const { usuario, logout } = useAuth();

  return (
    <>
      <header>
        <nav aria-label="Panel">
          <Link to="/admin">Resumen</Link> ·{' '}
          <Link to="/admin/publicaciones">Publicaciones</Link> ·{' '}
          <Link to="/admin/publicaciones/nueva">Nueva publicación</Link> ·{' '}
          <Link to="/admin/publicaciones/demo/editar">Editar (demo)</Link> ·{' '}
          <Link to="/admin/categorias">Categorías</Link> ·{' '}
          <Link to="/admin/consultas">Consultas</Link> ·{' '}
          <Link to="/admin/comercio">Comercio</Link> ·{' '}
          <Link to="/admin/perfil">Perfil</Link> · <Link to="/">Sitio</Link>
        </nav>
        {usuario && (
          <p>
            {usuario.nombre} {usuario.apellido} ({usuario.email}){' '}
            <button type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </p>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
