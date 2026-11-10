import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  cambiarEstadoConsulta,
  eliminarConsulta,
  listarConsultas,
  obtenerConsulta,
} from '../../api/consultas.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Chip from '../../componentes/Chip.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import Etiqueta from '../../componentes/Etiqueta.jsx';
import Modal from '../../componentes/Modal.jsx';
import Paginacion from '../../componentes/Paginacion.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { formatearFechaHora } from '../../utils/fechas.js';
import { ESTADOS_CONSULTA, TIPOS } from '../../utils/textos.js';
import { esId } from '../../utils/validaciones.js';
import estilos from './Consultas.module.css';

const LIMITE = 15;

const VARIANTE_ESTADO = { pendiente: 'aviso', leida: 'neutra', respondida: 'exito' };

/** Filtros y consulta abierta, leidos de la URL. */
function filtrosDeUrl(params) {
  const estado = params.get('estado');
  const pagina = Number(params.get('pagina'));
  return {
    estado: ESTADOS_CONSULTA[estado] ? estado : '',
    orden: params.get('orden') === 'antiguas' ? 'antiguas' : '',
    pagina: Number.isInteger(pagina) && pagina > 1 ? pagina : 1,
    ver: esId(params.get('ver')) ? params.get('ver') : '',
  };
}

/** Lo que define el pedido de la lista, como texto estable para useCallback. */
function claveDeLista(params) {
  const { estado, orden, pagina } = filtrosDeUrl(params);
  return new URLSearchParams(aParams({ estado, orden, pagina })).toString();
}

/** Query string a partir de los filtros, sin los valores por defecto. */
function aParams(filtros) {
  return Object.fromEntries(
    Object.entries(filtros).filter(([clave, valor]) => valor && !(clave === 'pagina' && valor === 1))
  );
}

function EstadoConsulta({ estado }) {
  return <Etiqueta variante={VARIANTE_ESTADO[estado]}>{ESTADOS_CONSULTA[estado]}</Etiqueta>;
}

/* ------------------------------- Detalle ------------------------------- */

/** mailto con el asunto y un saludo ya escritos, para responder desde el correo. */
function enlaceRespuesta({ email, nombre, asunto }) {
  const params = new URLSearchParams({
    subject: `Re: ${asunto}`,
    body: `Hola ${nombre.split(' ')[0]},\n\n`,
  });
  // URLSearchParams codifica los espacios como "+", que los clientes de correo no traducen.
  return `mailto:${email}?${params.toString().replace(/\+/g, '%20')}`;
}

function Detalle({ id, alCambiarEstado, alEliminar, enlaceVolver }) {
  const pedir = useCallback(() => obtenerConsulta(id), [id]);
  const { datos, error, cargando, recargar } = usePedido(pedir);
  // Estado elegido despues de cargar; pisa al que vino del back.
  const [estadoNuevo, setEstadoNuevo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorEstado, setErrorEstado] = useState(null);

  if (cargando) return <Cargando />;
  if (error) {
    return error.estado === 404 || error.estado === 400 ? (
      <Vacio titulo="Esta consulta ya no existe" accion={enlaceVolver}>
        Puede que la hayan eliminado.
      </Vacio>
    ) : (
      <ErrorCarga mensaje={error.message} alReintentar={recargar} />
    );
  }

  const consulta = { ...datos, estado: estadoNuevo ?? datos.estado };
  const { nombre, email, telefono, asunto, mensaje, publicacion, createdAt, estado } = consulta;

  const cambiarEstado = async (nuevo) => {
    if (nuevo === estado) return;
    setGuardando(true);
    setErrorEstado(null);
    try {
      await cambiarEstadoConsulta(id, nuevo);
      setEstadoNuevo(nuevo);
      alCambiarEstado();
    } catch (err) {
      setErrorEstado(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <article className={estilos.detalle} aria-labelledby="titulo-consulta">
      {enlaceVolver}
      <header className={estilos.cabeceraDetalle}>
        <h2 id="titulo-consulta">{asunto}</h2>
        <p className={estilos.fecha}>{formatearFechaHora(createdAt)}</p>
      </header>

      <dl className={estilos.remitente}>
        <div>
          <dt>De</dt>
          <dd>{nombre}</dd>
        </div>
        <div>
          <dt>Mail</dt>
          <dd>
            <a href={`mailto:${email}`}>{email}</a>
          </dd>
        </div>
        {telefono && (
          <div>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`}>{telefono}</a>
            </dd>
          </div>
        )}
      </dl>

      {publicacion && (
        <p className={estilos.sobre}>
          <span className={estilos.sobreEtiqueta}>Consulta por</span>
          <strong>{publicacion.nombre}</strong> · {TIPOS[publicacion.tipo]}
          <span className={estilos.sobreEnlaces}>
            <Link to={`/publicaciones/${publicacion._id}`} target="_blank" rel="noreferrer">
              Ver en el sitio<span className="solo-lector"> (abre otra pestaña)</span>
            </Link>
            <Link to={`/admin/publicaciones/${publicacion._id}/editar`}>Editar</Link>
          </span>
        </p>
      )}

      <p className={estilos.mensaje}>{mensaje}</p>

      <div className={estilos.estado} role="group" aria-labelledby="titulo-estado">
        <span id="titulo-estado" className={estilos.estadoTitulo}>
          Estado
        </span>
        <div className={estilos.chips}>
          {Object.entries(ESTADOS_CONSULTA).map(([valor, texto]) => (
            <Chip key={valor} activo={estado === valor} onClick={() => cambiarEstado(valor)} disabled={guardando}>
              {texto}
            </Chip>
          ))}
        </div>
        {errorEstado && <Aviso>{errorEstado}</Aviso>}
      </div>

      <div className={estilos.accionesDetalle}>
        <Boton href={enlaceRespuesta(consulta)}>Responder por mail</Boton>
        <button type="button" className={estilos.eliminar} onClick={() => alEliminar(consulta)}>
          Eliminar consulta
        </button>
      </div>
      {estado !== 'respondida' && (
        <p className={estilos.nota}>Cuando le respondas, marcala como «Respondida» para llevar el control.</p>
      )}
    </article>
  );
}

/* -------------------------------- Pagina -------------------------------- */

export default function Consultas() {
  const [params, setParams] = useSearchParams();
  const filtros = filtrosDeUrl(params);
  const { estado, orden, ver } = filtros;

  // La lista depende solo de estos tres: abrir una consulta (`ver`) no la vuelve a pedir.
  const claveLista = claveDeLista(params);
  const pedir = useCallback(() => {
    const f = Object.fromEntries(new URLSearchParams(claveLista));
    return listarConsultas({ ...f, limite: LIMITE });
  }, [claveLista]);
  const { datos, error, cargando, recargar } = usePedido(pedir);

  const [aviso, setAviso] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

  const cambiarFiltro = (cambios) => {
    setAviso(null);
    setParams(aParams({ ...filtros, ver: '', pagina: 1, ...cambios }), { preventScrollReset: true });
  };
  const enlaceA = (id) => `?${new URLSearchParams(aParams({ ...filtros, ver: id }))}`;
  const enlaceLista = `?${new URLSearchParams(aParams({ ...filtros, ver: '' }))}`;

  const cerrarEliminar = () => {
    if (eliminando) return;
    setAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await eliminarConsulta(aEliminar._id);
      setAviso(`Eliminaste la consulta de ${aEliminar.nombre}.`);
      setAEliminar(null);
      setParams(aParams({ ...filtros, ver: '' }), { replace: true });
      recargar();
    } catch (err) {
      setErrorEliminar(err.message);
    } finally {
      setEliminando(false);
    }
  };

  const pendientes = datos?.pendientes;

  let lista;
  if (cargando) {
    lista = <Cargando />;
  } else if (error) {
    lista = <ErrorCarga mensaje={error.message} alReintentar={recargar} />;
  } else if (datos.datos.length === 0) {
    lista = estado ? (
      <Vacio titulo={`No hay consultas en «${ESTADOS_CONSULTA[estado]}»`}>
        {estado === 'pendiente' ? 'Estás al día: leíste todo lo que llegó.' : null}
      </Vacio>
    ) : (
      <Vacio titulo="Todavía no llegaron consultas">
        Las que manden los visitantes desde el formulario de contacto van a aparecer acá.
      </Vacio>
    );
  } else {
    lista = (
      <>
        <ul className={estilos.lista}>
          {datos.datos.map((c) => (
            <li key={c._id}>
              <Link
                to={enlaceA(c._id)}
                preventScrollReset
                className={`${estilos.item} ${c.estado === 'pendiente' ? estilos.sinLeer : ''}`}
                aria-current={c._id === ver ? 'true' : undefined}
              >
                <span className={estilos.itemArriba}>
                  <span className={estilos.itemNombre}>
                    {c.estado === 'pendiente' && <span className="solo-lector">Sin leer: </span>}
                    {c.nombre}
                  </span>
                  <span className={estilos.itemFecha}>{formatearFechaHora(c.createdAt)}</span>
                </span>
                <span className={estilos.itemAsunto}>{c.asunto}</span>
                <span className={estilos.itemAbajo}>
                  <span className={estilos.itemMensaje}>{c.mensaje}</span>
                  <EstadoConsulta estado={c.estado} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Paginacion
          pagina={datos.paginacion.pagina}
          paginas={datos.paginacion.paginas}
          alCambiar={(p) => cambiarFiltro({ pagina: p })}
        />
      </>
    );
  }

  const enlaceVolver = (
    <Link to={enlaceLista} className={estilos.volver} preventScrollReset>
      ← Todas las consultas
    </Link>
  );

  return (
    <>
      <title>Consultas · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Consultas"
        bajada={
          pendientes === undefined
            ? 'Lo que mandan los visitantes desde el formulario de contacto.'
            : pendientes === 0
              ? 'No tenés consultas sin leer.'
              : `${pendientes} ${pendientes === 1 ? 'consulta sin leer' : 'consultas sin leer'}.`
        }
      />

      {aviso && (
        <Aviso variante="exito" className={estilos.aviso}>
          {aviso}
        </Aviso>
      )}

      <div className={`${estilos.disposicion} ${ver ? estilos.conDetalle : ''}`}>
        <section className={estilos.columnaLista} aria-label="Lista de consultas">
          <div className={estilos.filtros}>
            <div className={estilos.chips} role="group" aria-label="Estado">
              <Chip activo={!estado} onClick={() => cambiarFiltro({ estado: '' })}>
                Todas
              </Chip>
              {Object.entries(ESTADOS_CONSULTA).map(([valor, texto]) => (
                <Chip key={valor} activo={estado === valor} onClick={() => cambiarFiltro({ estado: valor })}>
                  {texto}
                  {valor === 'pendiente' && pendientes > 0 ? ` (${pendientes})` : ''}
                </Chip>
              ))}
            </div>
            <label className={estilos.orden}>
              <span>Orden</span>
              <select value={orden} onChange={(e) => cambiarFiltro({ orden: e.target.value })}>
                <option value="">Más recientes primero</option>
                <option value="antiguas">Más antiguas primero</option>
              </select>
            </label>
          </div>
          {lista}
        </section>

        <section className={estilos.columnaDetalle} aria-label="Consulta abierta">
          {ver ? (
            <Detalle
              key={ver}
              id={ver}
              enlaceVolver={enlaceVolver}
              alCambiarEstado={recargar}
              alEliminar={setAEliminar}
            />
          ) : (
            <p className={estilos.ninguna}>Elegí una consulta de la lista para leerla.</p>
          )}
        </section>
      </div>

      <Modal
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar esta consulta?"
        alCerrar={cerrarEliminar}
        acciones={
          <>
            <Boton variante="borde" onClick={cerrarEliminar} disabled={eliminando}>
              Cancelar
            </Boton>
            <Boton variante="peligro" onClick={confirmarEliminacion} disabled={eliminando}>
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </Boton>
          </>
        }
      >
        <p>
          Vas a eliminar la consulta de <strong>{aEliminar?.nombre}</strong> sobre «{aEliminar?.asunto}». No se puede
          deshacer.
        </p>
        {errorEliminar && <Aviso>{errorEliminar}</Aviso>}
      </Modal>
    </>
  );
}
