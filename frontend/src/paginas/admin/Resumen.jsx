import { Link } from 'react-router';
import { listarPublicaciones } from '../../api/publicaciones.api.js';
import { listarCategorias } from '../../api/categorias.api.js';
import { listarConsultas } from '../../api/consultas.api.js';
import { obtenerComercio } from '../../api/comercio.api.js';
import { useAuth } from '../../contexto/AuthContext.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import { Cargando, ErrorCarga } from '../../componentes/Estados.jsx';
import { formatearFechaHora } from '../../utils/fechas.js';
import estilos from './Resumen.module.css';

// Solo hace falta el total de cada filtro: se pide una publicacion por consulta.
const contar = (filtros) => listarPublicaciones({ ...filtros, limite: 1 }).then((r) => r.paginacion.total);

async function pedirResumen() {
  const [total, experiencias, cursos, alquileres, ocultas, noDisponibles, categorias, consultas] = await Promise.all([
    contar({}),
    contar({ tipo: 'experiencia' }),
    contar({ tipo: 'curso' }),
    contar({ tipo: 'alquiler' }),
    contar({ activa: false }),
    contar({ disponible: false }),
    listarCategorias(),
    listarConsultas({ estado: 'pendiente', limite: 5 }),
  ]);
  return {
    publicaciones: { total, experiencias, cursos, alquileres, ocultas, noDisponibles },
    categorias: { total: categorias.length, ocultas: categorias.filter((c) => !c.activa).length },
    consultas: { pendientes: consultas.pendientes, ultimas: consultas.datos },
  };
}

const plural = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

function Tarjeta({ titulo, numero, detalle, enlace, destacada = false }) {
  return (
    <section className={`${estilos.tarjeta} ${destacada ? estilos.destacada : ''}`}>
      <h2 className={estilos.tituloTarjeta}>{titulo}</h2>
      <p className={estilos.numero}>{numero}</p>
      {detalle && <p className={estilos.detalle}>{detalle}</p>}
      <Link to={enlace.a} className={estilos.enlace}>
        {enlace.texto} →
      </Link>
    </section>
  );
}

export default function Resumen() {
  const { usuario } = useAuth();
  const resumen = usePedido(pedirResumen);
  const comercio = usePedido(obtenerComercio);

  let contenido;
  if (resumen.cargando) {
    contenido = <Cargando />;
  } else if (resumen.error) {
    contenido = <ErrorCarga mensaje={resumen.error.message} alReintentar={resumen.recargar} />;
  } else {
    const { publicaciones: p, categorias: c, consultas: q } = resumen.datos;
    const avisosPublicaciones = [
      p.ocultas > 0 && plural(p.ocultas, 'oculta', 'ocultas'),
      p.noDisponibles > 0 && plural(p.noDisponibles, 'no disponible', 'no disponibles'),
    ].filter(Boolean);

    contenido = (
      <>
        <div className={estilos.tarjetas}>
          <Tarjeta
            titulo="Consultas sin leer"
            numero={q.pendientes}
            detalle={q.pendientes === 0 ? 'Estás al día.' : 'Esperan respuesta.'}
            enlace={{ a: q.pendientes > 0 ? '/admin/consultas?estado=pendiente' : '/admin/consultas', texto: 'Ir a consultas' }}
            destacada={q.pendientes > 0}
          />
          <Tarjeta
            titulo="Publicaciones"
            numero={p.total}
            detalle={
              <>
                {plural(p.experiencias, 'experiencia', 'experiencias')} · {plural(p.cursos, 'curso', 'cursos')} ·{' '}
                {plural(p.alquileres, 'equipo', 'equipos')} de alquiler
                {avisosPublicaciones.length > 0 && <span className={estilos.secundario}>{avisosPublicaciones.join(' · ')}</span>}
              </>
            }
            enlace={{ a: '/admin/publicaciones', texto: 'Ir a publicaciones' }}
          />
          <Tarjeta
            titulo="Categorías"
            numero={c.total}
            detalle={c.ocultas > 0 ? plural(c.ocultas, 'oculta en el sitio', 'ocultas en el sitio') : 'Todas visibles en el sitio.'}
            enlace={{ a: '/admin/categorias', texto: 'Ir a categorías' }}
          />
        </div>

        <section className={estilos.panel} aria-labelledby="titulo-ultimas">
          <div className={estilos.cabeceraPanel}>
            <h2 id="titulo-ultimas" className={estilos.tituloPanel}>
              Últimas consultas sin leer
            </h2>
            {q.pendientes > q.ultimas.length && (
              <Link to="/admin/consultas?estado=pendiente" className={estilos.enlace}>
                Ver las {q.pendientes}
              </Link>
            )}
          </div>
          {q.ultimas.length === 0 ? (
            <p className={estilos.alDia}>No hay consultas pendientes. Las nuevas van a aparecer acá.</p>
          ) : (
            <ul className={estilos.consultas}>
              {q.ultimas.map((consulta) => (
                <li key={consulta._id}>
                  <Link to={`/admin/consultas?estado=pendiente&ver=${consulta._id}`} className={estilos.consulta}>
                    <span className={estilos.consultaNombre}>{consulta.nombre}</span>
                    <span className={estilos.consultaAsunto}>{consulta.asunto}</span>
                    <span className={estilos.consultaFecha}>{formatearFechaHora(consulta.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <title>Resumen · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo={usuario ? `Hola, ${usuario.nombre}` : 'Resumen'}
        bajada="Así está el sitio hoy."
        acciones={
          <>
            <Boton variante="borde" href="/" target="_blank" rel="noreferrer">
              Ver el sitio
            </Boton>
            <Boton a="/admin/publicaciones/nueva">Nueva publicación</Boton>
          </>
        }
      />

      {comercio.error?.estado === 404 && (
        <Aviso variante="advertencia" className={estilos.aviso}>
          Faltan los datos del comercio: el sitio no muestra «Nosotros» ni los horarios.{' '}
          <Link to="/admin/comercio">Cargarlos ahora</Link>
        </Aviso>
      )}

      {contenido}
    </>
  );
}
