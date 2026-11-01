import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { obtenerComercio } from '../../api/comercio.api.js';
import { listarPublicaciones } from '../../api/publicaciones.api.js';
import { listarCategorias } from '../../api/categorias.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Boton from '../../componentes/Boton.jsx';
import TarjetaPublicacion from '../../componentes/TarjetaPublicacion.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { agruparHorarios, enlacesDeRedes } from '../../utils/formato.js';
import estilos from './Inicio.module.css';

/* ------------------------------ Pedidos ------------------------------ */
// Funciones del modulo: son estables y usePedido no las vuelve a llamar.

/** Experiencias destacadas; si no hay ninguna marcada, las mas recientes. */
const pedirExperiencias = async () => {
  const destacadas = await listarPublicaciones({ tipo: 'experiencia', destacada: true, limite: 3 });
  if (destacadas.datos.length) return destacadas.datos;
  return (await listarPublicaciones({ tipo: 'experiencia', limite: 3 })).datos;
};

const pedirCursos = () => listarPublicaciones({ tipo: 'curso', limite: 3 }).then((r) => r.datos);

const pedirAlquileres = () =>
  listarPublicaciones({ tipo: 'alquiler', disponible: true, limite: 3 }).then((r) => r.datos);

const EJES_POR_TIPO = [
  { tipo: 'experiencia', titulo: 'Experiencias guiadas', texto: 'Trekking, escalada y ascensos con guía.', unidad: ['salida', 'salidas'] },
  { tipo: 'curso', titulo: 'Escuela de montaña', texto: 'Cursos de escalada, montañismo y esquí.', unidad: ['curso', 'cursos'] },
  { tipo: 'alquiler', titulo: 'Alquiler de equipo', texto: 'Equipo técnico para salir por tu cuenta.', unidad: ['equipo', 'equipos'] },
];

/** Por cada tipo: cuantas publicaciones hay y una foto para la tarjeta. */
const pedirTipos = () =>
  Promise.all(
    EJES_POR_TIPO.map(async (eje) => {
      const { datos, paginacion } = await listarPublicaciones({ tipo: eje.tipo, limite: 1 });
      return { ...eje, total: paginacion.total, imagen: datos[0]?.imagenes?.[0] };
    })
  );

/** Las categorias no tienen foto propia: se usa la de una de sus publicaciones. */
const pedirCategorias = async () => {
  const categorias = await listarCategorias();
  const conteos = await Promise.all(
    categorias.map((c) => listarPublicaciones({ categoria: c._id, limite: 1 }))
  );
  return categorias
    .map((c, i) => ({
      ...c,
      total: conteos[i].paginacion.total,
      imagen: conteos[i].datos[0]?.imagenes?.[0],
    }))
    .filter((c) => c.total > 0);
};

const ESCALA = [
  { clase: 'bajo', nombre: 'Baja', texto: 'Senderos marcados y poco desnivel. Para empezar.' },
  { clase: 'medio', nombre: 'Media', texto: 'Jornadas largas con tramos empinados.' },
  { clase: 'alto', nombre: 'Alta', texto: 'Terreno técnico o glaciar: se pide experiencia.' },
];

const plural = (n, [uno, varios]) => `${n} ${n === 1 ? uno : varios}`;

/* ----------------------------- Secciones ----------------------------- */

function Hero({ imagen }) {
  return (
    <section className={estilos.hero}>
      {imagen && <img src={imagen} alt="" className={estilos.heroImagen} />}
      <div className={`contenedor ${estilos.heroContenido}`}>
        <h1>Salidas guiadas, cursos y alquiler de equipo en Bariloche</h1>
        <p>Elegí tu próxima salida en el Parque Nacional Nahuel Huapi.</p>
        <Boton variante="blanco" a="/catalogo">
          Ver el catálogo
        </Boton>
      </div>
    </section>
  );
}

function Mosaicos({ pedido, render }) {
  if (pedido.cargando) return <Cargando />;
  if (pedido.error) return <ErrorCarga mensaje={pedido.error.message} alReintentar={pedido.recargar} />;
  if (!pedido.datos.length) return <Vacio titulo="Todavía no hay publicaciones cargadas" />;
  return <div className={estilos.ejes}>{pedido.datos.map(render)}</div>;
}

function Mosaico({ a, imagen, titulo, texto, pie }) {
  return (
    <Link to={a} className={estilos.eje}>
      <div className={estilos.ejeImagen}>{imagen && <img src={imagen} alt="" loading="lazy" />}</div>
      <h3>{titulo}</h3>
      {texto && <p>{texto}</p>}
      <span className={estilos.mas}>{pie}</span>
    </Link>
  );
}

function PorTipo() {
  const pedido = usePedido(pedirTipos);
  return (
    <Mosaicos
      pedido={pedido}
      render={(eje) => (
        <Mosaico
          key={eje.tipo}
          a={`/catalogo?tipo=${eje.tipo}`}
          imagen={eje.imagen}
          titulo={eje.titulo}
          texto={eje.texto}
          pie={plural(eje.total, eje.unidad)}
        />
      )}
    />
  );
}

function PorCategoria() {
  const pedido = usePedido(pedirCategorias);
  return (
    <Mosaicos
      pedido={pedido}
      render={(categoria) => (
        <Mosaico
          key={categoria._id}
          a={`/catalogo?categoria=${categoria._id}`}
          imagen={categoria.imagen}
          titulo={categoria.nombre}
          pie={plural(categoria.total, ['publicación', 'publicaciones'])}
        />
      )}
    />
  );
}

const PESTANIAS = [
  { id: 'tipo', texto: 'Por tipo', Panel: PorTipo },
  { id: 'categoria', texto: 'Por categoría', Panel: PorCategoria },
];

function Explorar() {
  const [activa, setActiva] = useState('tipo');
  const botones = useRef({});

  // Flechas izquierda/derecha para moverse entre pestañas, como pide ARIA.
  const alTeclear = (evento) => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    const siguiente = PESTANIAS.find((p) => p.id !== activa).id;
    setActiva(siguiente);
    botones.current[siguiente]?.focus();
  };

  const { Panel } = PESTANIAS.find((p) => p.id === activa);

  return (
    <section className={estilos.seccion}>
      <div className="contenedor">
        <h2 className={estilos.titulo}>¿Qué querés hacer?</h2>
        <div className={estilos.pestanias} role="tablist" aria-label="Explorar por">
          {PESTANIAS.map((p) => (
            <button
              key={p.id}
              ref={(el) => {
                botones.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`pestania-${p.id}`}
              aria-selected={activa === p.id}
              aria-controls={`panel-${p.id}`}
              tabIndex={activa === p.id ? 0 : -1}
              onClick={() => setActiva(p.id)}
              onKeyDown={alTeclear}
            >
              {p.texto}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${activa}`} aria-labelledby={`pestania-${activa}`}>
          <Panel />
        </div>
      </div>
    </section>
  );
}

function Escala() {
  return (
    <section className={`${estilos.seccion} ${estilos.gris}`}>
      <div className="contenedor">
        <h2 className={estilos.titulo}>Dificultad de las salidas</h2>
        <ul className={estilos.escala}>
          {ESCALA.map((nivel) => (
            <li key={nivel.clase}>
              <i className={`${estilos.punto} ${estilos[nivel.clase]}`} aria-hidden="true" />
              <strong>{nivel.nombre}</strong>
              <span>{nivel.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SeccionPublicaciones({ id, titulo, bajada, pedido, verTodo, gris = false }) {
  let contenido;
  if (pedido.cargando) contenido = <Cargando />;
  else if (pedido.error) contenido = <ErrorCarga mensaje={pedido.error.message} alReintentar={pedido.recargar} />;
  else if (!pedido.datos.length) contenido = <Vacio titulo="Todavía no hay publicaciones en esta sección" />;
  else
    contenido = (
      <div className={estilos.grilla}>
        {pedido.datos.map((p) => (
          <TarjetaPublicacion key={p._id} publicacion={p} />
        ))}
      </div>
    );

  return (
    <section id={id} className={`${estilos.seccion} ${gris ? estilos.gris : ''}`}>
      <div className="contenedor">
        <h2 className={estilos.titulo}>{titulo}</h2>
        <p className={estilos.bajada}>{bajada}</p>
        {contenido}
        <p className={estilos.centro}>
          <Boton a={verTodo.a}>{verTodo.texto}</Boton>
        </p>
      </div>
    </section>
  );
}

function Nosotros({ comercio, imagen }) {
  return (
    <section id="nosotros" className={`${estilos.seccion} ${estilos.gris}`}>
      <div className={`contenedor ${estilos.nosotros}`}>
        <div className={estilos.nosotrosImagen}>{imagen && <img src={imagen} alt="" loading="lazy" />}</div>
        <div>
          <h2>{comercio.nombre}</h2>
          <p>{comercio.descripcion}</p>
        </div>
      </div>
    </section>
  );
}

function Bloques({ comercio }) {
  const horarios = agruparHorarios(comercio?.horarios);
  const redes = enlacesDeRedes(comercio?.redes);

  return (
    <section className={estilos.bloques} aria-label="Contacto y horarios">
      <div className={`${estilos.bloque} ${estilos.azul}`}>
        <h2>¿Tenés dudas?</h2>
        <p>Contanos qué querés hacer y te respondemos con una recomendación.</p>
        <Boton variante="blanco" a="/contacto">
          Hacer una consulta
        </Boton>
      </div>

      {horarios.length > 0 && (
        <div className={`${estilos.bloque} ${estilos.oscuro}`}>
          <h2>Horarios de atención</h2>
          <dl className={estilos.horarios}>
            {horarios.map((h) => (
              <div key={h.dias}>
                <dt>{h.dias}</dt>
                <dd>{h.horario}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {comercio && (
        <div className={`${estilos.bloque} ${estilos.claro}`}>
          <h2>Dónde estamos</h2>
          <address>
            <p>{comercio.direccion}</p>
            <p>
              <a href={`tel:${comercio.telefono.replace(/[^\d+]/g, '')}`}>{comercio.telefono}</a>
              {comercio.email && (
                <>
                  <br />
                  <a href={`mailto:${comercio.email}`}>{comercio.email}</a>
                </>
              )}
            </p>
          </address>
          {redes.length > 0 && (
            <ul className={estilos.redes}>
              {redes.map((r) => (
                <li key={r.red}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.red}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------- Pagina ------------------------------- */

export default function Inicio() {
  const experiencias = usePedido(pedirExperiencias);
  const cursos = usePedido(pedirCursos);
  const alquileres = usePedido(pedirAlquileres);
  const comercio = usePedido(obtenerComercio);

  const imagenHero = experiencias.datos?.[0]?.imagenes?.[0];
  const imagenNosotros = experiencias.datos?.[1]?.imagenes?.[0] ?? imagenHero;

  return (
    <>
      <Hero imagen={imagenHero} />
      <Explorar />
      <Escala />
      <SeccionPublicaciones
        id="experiencias"
        titulo="Experiencias destacadas"
        bajada="Salidas con guías certificados y grupos chicos."
        pedido={experiencias}
        verTodo={{ a: '/catalogo?tipo=experiencia', texto: 'Ver todas las experiencias' }}
      />
      <SeccionPublicaciones
        id="cursos"
        titulo="Escuela de montaña"
        bajada="Cursos prácticos en terreno, con certificado de asistencia."
        pedido={cursos}
        verTodo={{ a: '/catalogo?tipo=curso', texto: 'Ver todos los cursos' }}
        gris
      />
      <SeccionPublicaciones
        id="alquiler"
        titulo="Alquiler de equipo"
        bajada="Equipo técnico revisado antes de cada salida. Elegí las fechas en el catálogo y consultanos."
        pedido={alquileres}
        verTodo={{ a: '/catalogo?tipo=alquiler', texto: 'Ver todo el equipo' }}
      />
      {comercio.datos && <Nosotros comercio={comercio.datos} imagen={imagenNosotros} />}
      {comercio.error && comercio.error.estado !== 404 && (
        <div className="contenedor">
          <ErrorCarga mensaje={comercio.error.message} alReintentar={comercio.recargar} />
        </div>
      )}
      <Bloques comercio={comercio.datos} />
    </>
  );
}
