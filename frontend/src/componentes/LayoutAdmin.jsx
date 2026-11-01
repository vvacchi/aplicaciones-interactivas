import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../contexto/AuthContext.jsx';
import Logo from './Logo.jsx';
import estilos from './LayoutAdmin.module.css';

const SECCIONES = [
  { texto: 'Resumen', a: '/admin', exacto: true },
  { texto: 'Publicaciones', a: '/admin/publicaciones' },
  { texto: 'Categorías', a: '/admin/categorias' },
  { texto: 'Consultas', a: '/admin/consultas' },
  { texto: 'Comercio', a: '/admin/comercio' },
  { texto: 'Perfil', a: '/admin/perfil' },
];

const iniciales = (usuario) =>
  `${usuario?.nombre?.[0] ?? ''}${usuario?.apellido?.[0] ?? ''}`.toUpperCase();

export default function LayoutAdmin() {
  const { usuario, logout } = useAuth();

  return (
    <div className={estilos.app}>
      <aside className={estilos.lateral}>
        <Logo a="/admin" subtitulo="Panel de administración" claro />
        <nav aria-label="Panel">
          <ul className={estilos.menu}>
            {SECCIONES.map((seccion) => (
              <li key={seccion.a}>
                <NavLink to={seccion.a} end={seccion.exacto}>
                  {seccion.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link to="/" className={estilos.verSitio}>
          Ver el sitio →
        </Link>
      </aside>

      <div className={estilos.principal}>
        <div className={estilos.barra}>
          {usuario && (
            <>
              <span className={estilos.nombre}>
                {usuario.nombre} {usuario.apellido}
              </span>
              <span className={estilos.avatar} aria-hidden="true">
                {iniciales(usuario)}
              </span>
            </>
          )}
          <button type="button" className={estilos.salir} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
        <main className={estilos.contenido}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
