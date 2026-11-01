import { Outlet } from 'react-router';
import Cabecera from './Cabecera.jsx';
import Pie from './Pie.jsx';
import BotonAyuda from './BotonAyuda.jsx';
import estilos from './LayoutPublico.module.css';

export default function LayoutPublico() {
  return (
    <div className={estilos.pagina}>
      <a href="#contenido" className={estilos.saltar}>
        Saltar al contenido
      </a>
      <Cabecera />
      <main id="contenido" className={estilos.contenido} tabIndex={-1}>
        <Outlet />
      </main>
      <Pie />
      <BotonAyuda />
    </div>
  );
}
