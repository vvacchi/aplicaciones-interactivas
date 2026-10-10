import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexto/AuthContext.jsx';

/**
 * Envuelve las rutas del panel. No revisa el rol: en el back el unico
 * rol posible es `admin`, asi que tener sesion alcanza.
 */
export default function RutaProtegida() {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return <p role="status">Verificando sesión…</p>;
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace state={{ desde: ubicacion }} />;
  }

  return <Outlet />;
}
