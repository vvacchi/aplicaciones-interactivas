import { Link } from 'react-router';
import Logo from './Logo.jsx';
import estilos from './Pie.module.css';

const ANIO = new Date().getFullYear();

export default function Pie() {
  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.columnas}`}>
        <Logo claro />
        <nav aria-label="Catálogo">
          <h2 className={estilos.titulo}>Catálogo</h2>
          <ul>
            <li><Link to="/catalogo?tipo=experiencia">Experiencias guiadas</Link></li>
            <li><Link to="/catalogo?tipo=curso">Escuela de montaña</Link></li>
            <li><Link to="/catalogo?tipo=alquiler">Alquiler de equipo</Link></li>
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <h2 className={estilos.titulo}>Ayuda</h2>
          <ul>
            <li><Link to="/contacto">Hacer una consulta</Link></li>
            <li><Link to="/admin/login">Acceso administradores</Link></li>
          </ul>
        </nav>
      </div>
      <p className={`contenedor ${estilos.legal}`}>
        © {ANIO} Andes Vertical · San Carlos de Bariloche
      </p>
    </footer>
  );
}
