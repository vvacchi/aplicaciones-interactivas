import { Outlet, ScrollRestoration } from 'react-router';

// Envuelve todas las rutas: al navegar a otra pagina vuelve arriba.
export default function Raiz() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
