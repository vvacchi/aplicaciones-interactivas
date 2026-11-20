import { Navigate, createBrowserRouter } from 'react-router';
import LayoutPublico from './componentes/LayoutPublico.jsx';
import LayoutAdmin from './componentes/LayoutAdmin.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';
import Raiz from './componentes/Raiz.jsx';

import Inicio from './paginas/publico/Inicio.jsx';
import Catalogo from './paginas/publico/Catalogo.jsx';
import DetallePublicacion from './paginas/publico/DetallePublicacion.jsx';
import Contacto from './paginas/publico/Contacto.jsx';
import RecuperarPassword from './paginas/publico/RecuperarPassword.jsx';
import NoEncontrada from './paginas/publico/NoEncontrada.jsx';

import Login from './paginas/admin/Login.jsx';
import Administradores from './paginas/admin/Administradores.jsx';
import Resumen from './paginas/admin/Resumen.jsx';
import Publicaciones from './paginas/admin/Publicaciones.jsx';
import PublicacionForm from './paginas/admin/PublicacionForm.jsx';
import Categorias from './paginas/admin/Categorias.jsx';
import Consultas from './paginas/admin/Consultas.jsx';
import Comercio from './paginas/admin/Comercio.jsx';
import Perfil from './paginas/admin/Perfil.jsx';

export const router = createBrowserRouter([
  {
    element: <Raiz />,
    children: [
      {
        element: <LayoutPublico />,
        children: [
          { path: '/', element: <Inicio /> },
          { path: '/catalogo', element: <Catalogo /> },
          { path: '/publicaciones/:id', element: <DetallePublicacion /> },
          { path: '/contacto', element: <Contacto /> },
          { path: '*', element: <NoEncontrada /> },
        ],
      },
      // Las pantallas de acceso van sin la navegacion del sitio y fuera de la ruta protegida.
      { path: '/recuperar-password', element: <RecuperarPassword /> },
      { path: '/admin/login', element: <Login /> },
      // El registro dejo de ser publico: ahora es una pantalla del panel.
      { path: '/admin/registro', element: <Navigate to="/admin/administradores" replace /> },
      {
        path: '/admin',
        element: <RutaProtegida />,
        children: [
          {
            element: <LayoutAdmin />,
            children: [
              { index: true, element: <Resumen /> },
              { path: 'publicaciones', element: <Publicaciones /> },
              { path: 'publicaciones/nueva', element: <PublicacionForm /> },
              { path: 'publicaciones/:id/editar', element: <PublicacionForm /> },
              { path: 'categorias', element: <Categorias /> },
              { path: 'consultas', element: <Consultas /> },
              { path: 'comercio', element: <Comercio /> },
              { path: 'administradores', element: <Administradores /> },
              { path: 'perfil', element: <Perfil /> },
            ],
          },
        ],
      },
    ],
  },
]);
