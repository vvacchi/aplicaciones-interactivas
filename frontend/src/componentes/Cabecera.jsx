import { useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Boton from './Boton.jsx';
import Logo from './Logo.jsx';
import { IconoBuscar, IconoCerrar, IconoMenu } from './Iconos.jsx';
import estilos from './Cabecera.module.css';

const ENLACES = [
  { texto: 'Inicio', a: '/' },
  { texto: 'Experiencias', a: '/catalogo?tipo=experiencia', tipo: 'experiencia' },
  { texto: 'Cursos', a: '/catalogo?tipo=curso', tipo: 'curso' },
  { texto: 'Alquiler', a: '/catalogo?tipo=alquiler', tipo: 'alquiler' },
  { texto: 'Catálogo completo', a: '/catalogo', tipo: null },
  { texto: 'Contacto', a: '/contacto' },
];

/** Los links del catalogo comparten ruta: se distinguen por el `tipo` de la URL. */
const esActivo = (enlace, { pathname, search }) => {
  if (enlace.tipo !== undefined) {
    const tipo = new URLSearchParams(search).get('tipo');
    return pathname === '/catalogo' && tipo === enlace.tipo;
  }
  return pathname === enlace.a;
};

function Buscador({ alBuscar }) {
  const id = useId();
  const navegar = useNavigate();
  const [texto, setTexto] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    const q = texto.trim();
    // El back pide al menos 2 caracteres para buscar.
    if (q.length < 2) return;
    navegar(`/catalogo?q=${encodeURIComponent(q)}`);
    setTexto('');
    alBuscar?.();
  };

  return (
    <form className={estilos.buscador} role="search" onSubmit={enviar}>
      <label htmlFor={id} className="solo-lector">
        Buscar en el catálogo
      </label>
      <IconoBuscar className={estilos.iconoBuscar} />
      <input
        id={id}
        type="search"
        placeholder="Buscar salidas, cursos o equipo"
        minLength={2}
        required
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
    </form>
  );
}

export default function Cabecera() {
  const ubicacion = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className={estilos.cabecera}>
      <div className={`contenedor ${estilos.superior}`}>
        <Logo />
        <div className={estilos.acciones}>
          <div className={estilos.soloEscritorio}>
            <Buscador />
          </div>
          <div className={estilos.soloEscritorio}>
            <Boton a="/contacto">Consultar</Boton>
          </div>
          <button
            type="button"
            className={estilos.botonMenu}
            aria-expanded={menuAbierto}
            aria-controls="navegacion-principal"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>
      </div>

      <nav
        id="navegacion-principal"
        className={`${estilos.nav} ${menuAbierto ? estilos.abierto : ''}`}
        aria-label="Principal"
      >
        <div className={estilos.soloMovil}>
          <Buscador alBuscar={cerrarMenu} />
        </div>
        <ul>
          {ENLACES.map((enlace) => (
            <li key={enlace.a}>
              <Link
                to={enlace.a}
                aria-current={esActivo(enlace, ubicacion) ? 'page' : undefined}
                onClick={cerrarMenu}
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
