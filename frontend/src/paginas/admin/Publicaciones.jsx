import { useCallback, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { eliminarPublicacion, listarPublicaciones } from '../../api/publicaciones.api.js';
import { listarCategorias } from '../../api/categorias.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import Chip from '../../componentes/Chip.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import Etiqueta from '../../componentes/Etiqueta.jsx';
import Modal from '../../componentes/Modal.jsx';
import Paginacion from '../../componentes/Paginacion.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { formatearPrecio, precioDePublicacion } from '../../utils/formato.js';
import { TIPOS } from '../../utils/textos.js';
import { esId } from '../../utils/validaciones.js';
import estilos from './Publicaciones.module.css';

const LIMITE = 20;

const CHIPS_TIPO = [
  { valor: '', texto: 'Todos' },
  { valor: 'experiencia', texto: 'Experiencias' },
  { valor: 'curso', texto: 'Cursos' },
  { valor: 'alquiler', texto: 'Alquiler' },
];

const CHIPS_VISIBILIDAD = [
  { valor: '', texto: 'Todas' },
  { valor: 'true', texto: 'Visibles' },
  { valor: 'false', texto: 'Ocultas' },
];

/** Filtros del panel en la URL, descartando lo que no sea valido. */
function filtrosDeUrl(params) {
  const tipo = params.get('tipo');
  const activa = params.get('activa');
  const pagina = Number(params.get('pagina'));
  const q = params.get('q')?.trim() ?? '';
  return {
    q: q.length >= 2 ? q : '',
    tipo: TIPOS[tipo] ? tipo : '',
    activa: activa === 'true' || activa === 'false' ? activa : '',
    categoria: esId(params.get('categoria')) ? params.get('categoria') : '',
    pagina: Number.isInteger(pagina) && pagina > 1 ? pagina : 1,
  };
}

function textoPrecio(publicacion) {
  const precio = precioDePublicacion(publicacion);
  if (precio == null) return 'A consultar';
  return publicacion.tipo === 'alquiler' ? `${formatearPrecio(precio)} / día` : formatearPrecio(precio);
}

function Buscador({ inicial, alBuscar }) {
  const [texto, setTexto] = useState(inicial);
  const [error, setError] = useState(null);

  const enviar = (evento) => {
    evento.preventDefault();
    const q = texto.trim();
    if (q.length === 1) {
      setError('Escribí al menos 2 caracteres');
      return;
    }
    alBuscar(q);
  };

  return (
    <form role="search" className={estilos.buscador} onSubmit={enviar} noValidate>
      <Campo
        etiqueta="Buscar"
        type="search"
        placeholder="Nombre, descripción o categoría"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setError(null);
        }}
        error={error}
      />
      <Boton type="submit" variante="borde">
        Buscar
      </Boton>
    </form>
  );
}

function Fila({ publicacion, alEliminar }) {
  const { _id, nombre, tipo, categoria, imagenes, activa, disponible, destacada } = publicacion;

  return (
    <tr>
      <td>
        <div className={estilos.celdaPublicacion}>
          {imagenes?.[0] ? (
            <img src={imagenes[0]} alt="" className={estilos.miniatura} loading="lazy" />
          ) : (
            <span className={estilos.miniatura} aria-hidden="true" />
          )}
          <span>
            <Link to={`/admin/publicaciones/${_id}/editar`} className={estilos.nombre}>
              {nombre}
            </Link>
            <span className={estilos.categoria}>{categoria?.nombre ?? 'Sin categoría'}</span>
          </span>
        </div>
      </td>
      <td data-titulo="Tipo">{TIPOS[tipo]}</td>
      <td data-titulo="Precio" className={estilos.precio}>{textoPrecio(publicacion)}</td>
      <td data-titulo="Estado">
        <span className={estilos.etiquetas}>
          {activa ? <Etiqueta variante="exito">Visible</Etiqueta> : <Etiqueta variante="aviso">Oculta</Etiqueta>}
          {!disponible && <Etiqueta variante="neutra">No disponible</Etiqueta>}
          {destacada && <Etiqueta>Destacada</Etiqueta>}
        </span>
      </td>
      <td className={estilos.celdaAcciones}>
        <Link to={`/publicaciones/${_id}`} target="_blank" rel="noreferrer" className={estilos.accion}>
          Ver<span className="solo-lector"> {nombre} en el sitio (abre otra pestaña)</span>
        </Link>
        <Link to={`/admin/publicaciones/${_id}/editar`} className={estilos.accion}>
          Editar<span className="solo-lector"> {nombre}</span>
        </Link>
        <button type="button" className={`${estilos.accion} ${estilos.eliminar}`} onClick={() => alEliminar(publicacion)}>
          Eliminar<span className="solo-lector"> {nombre}</span>
        </button>
      </td>
    </tr>
  );
}

export default function Publicaciones() {
  const [params, setParams] = useSearchParams();
  const ubicacion = useLocation();
  const filtros = filtrosDeUrl(params);
  const clave = JSON.stringify(filtros);

  const pedir = useCallback(() => {
    const f = JSON.parse(clave);
    return listarPublicaciones({ ...f, orden: 'recientes', limite: LIMITE });
  }, [clave]);
  const { datos, error, cargando, recargar } = usePedido(pedir);
  const categorias = usePedido(listarCategorias);

  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);
  // La confirmacion de alta o edicion llega desde el formulario en el state.
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? null);

  const cambiarFiltro = (cambios) => {
    const siguiente = { ...filtros, ...cambios, pagina: cambios.pagina ?? 1 };
    const limpios = Object.fromEntries(
      Object.entries(siguiente).filter(([clave, valor]) => valor && !(clave === 'pagina' && valor === 1))
    );
    setAviso(null);
    setParams(limpios, { preventScrollReset: !('pagina' in cambios) });
  };

  const cerrarModal = () => {
    if (eliminando) return;
    setAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await eliminarPublicacion(aEliminar._id);
      setAviso(`Eliminaste «${aEliminar.nombre}».`);
      setAEliminar(null);
      recargar();
    } catch (err) {
      setErrorEliminar(err.message);
    } finally {
      setEliminando(false);
    }
  };

  const hayFiltros = Boolean(filtros.q || filtros.tipo || filtros.activa || filtros.categoria);

  let contenido;
  if (cargando) {
    contenido = <Cargando />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error.message} alReintentar={recargar} />;
  } else if (datos.datos.length === 0) {
    contenido =
      filtros.pagina > 1 ? (
        <Vacio titulo="Esta página quedó vacía" accion={<Boton variante="borde" onClick={() => cambiarFiltro({ pagina: 1 })}>Ir a la primera página</Boton>} />
      ) : hayFiltros ? (
        <Vacio
          titulo="No hay publicaciones con estos filtros"
          accion={<Boton variante="borde" onClick={() => setParams({})}>Limpiar filtros</Boton>}
        />
      ) : (
        <Vacio titulo="Todavía no hay publicaciones" accion={<Boton a="/admin/publicaciones/nueva">Crear la primera</Boton>}>
          Cargá experiencias, cursos o equipo de alquiler para que aparezcan en el sitio.
        </Vacio>
      );
  } else {
    const { total, pagina, paginas } = datos.paginacion;
    contenido = (
      <>
        <p className={estilos.total} aria-live="polite">
          {total} {total === 1 ? 'publicación' : 'publicaciones'}
          {paginas > 1 && ` · página ${pagina} de ${paginas}`}
        </p>
        <div className={estilos.tablaCaja}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th scope="col">Publicación</th>
                <th scope="col">Tipo</th>
                <th scope="col">Precio</th>
                <th scope="col">Estado</th>
                <th scope="col">
                  <span className="solo-lector">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {datos.datos.map((p) => (
                <Fila key={p._id} publicacion={p} alEliminar={setAEliminar} />
              ))}
            </tbody>
          </table>
        </div>
        <Paginacion pagina={pagina} paginas={paginas} alCambiar={(p) => cambiarFiltro({ pagina: p })} />
      </>
    );
  }

  return (
    <>
      <title>Publicaciones · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Publicaciones"
        bajada="Experiencias, cursos y equipo de alquiler que se muestran en el sitio."
        acciones={<Boton a="/admin/publicaciones/nueva">Nueva publicación</Boton>}
      />

      {aviso && (
        <Aviso variante="exito" className={estilos.aviso}>
          {aviso}
        </Aviso>
      )}

      <section className={estilos.filtros} aria-label="Filtros">
        <Buscador key={filtros.q} inicial={filtros.q} alBuscar={(q) => cambiarFiltro({ q })} />
        <div className={estilos.grupo} role="group" aria-labelledby="filtro-tipo">
          <span id="filtro-tipo" className={estilos.etiquetaGrupo}>Tipo</span>
          <div className={estilos.chips}>
            {CHIPS_TIPO.map((c) => (
              <Chip key={c.valor} activo={filtros.tipo === c.valor} onClick={() => cambiarFiltro({ tipo: c.valor })}>
                {c.texto}
              </Chip>
            ))}
          </div>
        </div>
        <div className={estilos.grupo} role="group" aria-labelledby="filtro-visibilidad">
          <span id="filtro-visibilidad" className={estilos.etiquetaGrupo}>En el sitio</span>
          <div className={estilos.chips}>
            {CHIPS_VISIBILIDAD.map((c) => (
              <Chip key={c.valor} activo={filtros.activa === c.valor} onClick={() => cambiarFiltro({ activa: c.valor })}>
                {c.texto}
              </Chip>
            ))}
          </div>
        </div>
        <Campo
          etiqueta="Categoría"
          como="select"
          value={filtros.categoria}
          onChange={(e) => cambiarFiltro({ categoria: e.target.value })}
          className={estilos.categoriaFiltro}
        >
          <option value="">Todas</option>
          {categorias.datos?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nombre}
              {c.activa === false ? ' (oculta)' : ''}
            </option>
          ))}
        </Campo>
      </section>

      {contenido}

      <Modal
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar esta publicación?"
        alCerrar={cerrarModal}
        acciones={
          <>
            <Boton variante="borde" onClick={cerrarModal} disabled={eliminando}>
              Cancelar
            </Boton>
            <Boton variante="peligro" onClick={confirmarEliminacion} disabled={eliminando}>
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </Boton>
          </>
        }
      >
        <p>
          Vas a eliminar <strong>{aEliminar?.nombre}</strong>. No se puede deshacer.
        </p>
        <p>Si solo querés sacarla del sitio por un tiempo, editala y desmarcá «Visible en el sitio».</p>
        {errorEliminar && <Aviso>{errorEliminar}</Aviso>}
      </Modal>
    </>
  );
}
