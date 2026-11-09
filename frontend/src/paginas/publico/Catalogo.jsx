import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { listarPublicacionesVisibles } from '../../api/publicaciones.api.js';
import { listarCategoriasVisibles } from '../../api/categorias.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import Chip from '../../componentes/Chip.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import Paginacion from '../../componentes/Paginacion.jsx';
import RangoFechas from '../../componentes/RangoFechas.jsx';
import TarjetaPublicacion from '../../componentes/TarjetaPublicacion.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { IconoBuscar } from '../../componentes/Iconos.jsx';
import { contarDias, rangoDeUrl } from '../../utils/fechas.js';
import { esId } from '../../utils/validaciones.js';
import estilos from './Catalogo.module.css';

const LIMITE = 12;

const SECCIONES = {
  '': { titulo: 'Catálogo', bajada: 'Experiencias guiadas, cursos y equipo de alquiler.' },
  experiencia: { titulo: 'Experiencias guiadas', bajada: 'Salidas con guías certificados por el Parque Nacional Nahuel Huapi.' },
  curso: { titulo: 'Escuela de montaña', bajada: 'Cursos prácticos en terreno, con certificado de asistencia.' },
  alquiler: { titulo: 'Alquiler de equipo', bajada: 'Equipo técnico revisado antes de cada salida.' },
};

const CHIPS_TIPO = [
  { valor: '', texto: 'Todo' },
  { valor: 'experiencia', texto: 'Experiencias' },
  { valor: 'curso', texto: 'Cursos' },
  { valor: 'alquiler', texto: 'Alquiler' },
];

const ORDENES = [
  { valor: 'recientes', texto: 'Más recientes' },
  { valor: 'nombre', texto: 'Nombre (A–Z)' },
  { valor: 'precio-asc', texto: 'Menor precio', conPrecio: true },
  { valor: 'precio-desc', texto: 'Mayor precio', conPrecio: true },
];

// El back filtra y ordena por `precio`, que el alquiler no tiene (usa
// precioPorDia): esos controles solo tienen sentido con experiencias o cursos.
const usaPrecio = (tipo) => tipo === 'experiencia' || tipo === 'curso';

const esNumero = (texto) => texto !== null && texto !== '' && !Number.isNaN(Number(texto)) && Number(texto) >= 0;

/** Lee los filtros de la URL descartando lo que no sea valido. */
function filtrosDeUrl(params) {
  const tipo = SECCIONES[params.get('tipo')] && params.get('tipo') ? params.get('tipo') : '';
  const conPrecio = usaPrecio(tipo);
  const orden = ORDENES.find((o) => o.valor === params.get('orden') && (conPrecio || !o.conPrecio))?.valor ?? 'recientes';
  const pagina = Math.max(1, Number.parseInt(params.get('pagina'), 10) || 1);
  // El back pide al menos 2 caracteres para buscar.
  const q = params.get('q')?.trim() ?? '';

  return {
    q: q.length >= 2 ? q : '',
    tipo,
    categoria: esId(params.get('categoria')) ? params.get('categoria') : '',
    disponible: params.get('disponible') === 'true',
    orden,
    pagina,
    precioMin: conPrecio && esNumero(params.get('precioMin')) ? params.get('precioMin') : '',
    precioMax: conPrecio && esNumero(params.get('precioMax')) ? params.get('precioMax') : '',
    rango: tipo === 'alquiler' ? rangoDeUrl(params.get('desde'), params.get('hasta')) : null,
  };
}

/** Solo lo que entiende el back: las fechas son del front y no viajan a la API. */
const paramsDeApi = (f) => ({
  q: f.q || undefined,
  tipo: f.tipo || undefined,
  categoria: f.categoria || undefined,
  disponible: f.disponible || undefined,
  orden: f.orden,
  pagina: f.pagina,
  limite: LIMITE,
  precioMin: f.precioMin || undefined,
  precioMax: f.precioMax || undefined,
});

/* ----------------------------- Controles ----------------------------- */

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
        etiqueta="Buscar en el catálogo"
        type="search"
        placeholder="Ej.: Frey, escalada, crampones"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setError(null);
        }}
        error={error}
      />
      <Boton type="submit" className={estilos.botonBuscar} aria-label="Buscar">
        <IconoBuscar className={estilos.icono} />
      </Boton>
    </form>
  );
}

function FiltroPrecio({ min, max, alAplicar }) {
  const [borrador, setBorrador] = useState({ min, max });
  const [errores, setErrores] = useState({});

  const aplicar = (evento) => {
    evento.preventDefault();
    const encontrados = {};
    if (borrador.min !== '' && !esNumero(borrador.min)) encontrados.min = 'Ingresá un monto válido';
    if (borrador.max !== '' && !esNumero(borrador.max)) encontrados.max = 'Ingresá un monto válido';
    if (!encontrados.min && !encontrados.max && borrador.min !== '' && borrador.max !== '' && Number(borrador.min) > Number(borrador.max)) {
      encontrados.min = 'El mínimo no puede ser mayor al máximo';
    }
    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) alAplicar(borrador);
  };

  const cambiar = (campo) => (e) => {
    setBorrador((b) => ({ ...b, [campo]: e.target.value }));
    setErrores((er) => ({ ...er, [campo]: undefined }));
  };

  return (
    <form className={estilos.precio} onSubmit={aplicar} noValidate>
      <fieldset>
        <legend className={estilos.rotulo}>Precio (ARS)</legend>
        <div className={estilos.precioCampos}>
          <Campo etiqueta="Desde" type="number" min="0" step="1000" inputMode="numeric" value={borrador.min} onChange={cambiar('min')} error={errores.min} />
          <Campo etiqueta="Hasta" type="number" min="0" step="1000" inputMode="numeric" value={borrador.max} onChange={cambiar('max')} error={errores.max} />
          <Boton type="submit" variante="borde" tamano="chico" className={estilos.aplicar}>
            Aplicar
          </Boton>
        </div>
      </fieldset>
    </form>
  );
}

/* ------------------------------- Pagina ------------------------------- */

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const textoParams = params.toString();
  const filtros = useMemo(() => filtrosDeUrl(new URLSearchParams(textoParams)), [textoParams]);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const pedir = useCallback(() => listarPublicacionesVisibles(paramsDeApi(filtros)), [filtros]);
  const publicaciones = usePedido(pedir);
  const categorias = usePedido(listarCategoriasVisibles);

  /**
   * Aplica cambios a la URL. Los filtros vuelven a la pagina 1 y no mueven
   * el scroll; cambiar de pagina si sube al principio.
   */
  const actualizar = (cambios, { esPaginacion = false } = {}) => {
    const nuevos = new URLSearchParams(params);
    Object.entries(cambios).forEach(([clave, valor]) => {
      if (valor === null || valor === undefined || valor === '' || valor === false) nuevos.delete(clave);
      else nuevos.set(clave, valor);
    });
    if (!esPaginacion) nuevos.delete('pagina');
    setParams(nuevos, { preventScrollReset: !esPaginacion });
  };

  const cambiarTipo = (tipo) => {
    const cambios = { tipo };
    if (!usaPrecio(tipo)) {
      Object.assign(cambios, { precioMin: null, precioMax: null });
      if (ORDENES.find((o) => o.valor === filtros.orden)?.conPrecio) cambios.orden = null;
    }
    if (tipo !== 'alquiler') Object.assign(cambios, { desde: null, hasta: null });
    actualizar(cambios);
  };

  const limpiar = () => setParams(filtros.tipo ? { tipo: filtros.tipo } : {}, { preventScrollReset: true });

  const hayFiltros = Boolean(filtros.q || filtros.categoria || filtros.disponible || filtros.precioMin || filtros.precioMax);
  const cantidadFiltros = [filtros.categoria, filtros.disponible, filtros.precioMin || filtros.precioMax].filter(Boolean).length;
  const conPrecio = usaPrecio(filtros.tipo);
  const seccion = SECCIONES[filtros.tipo];
  const dias = filtros.rango ? contarDias(filtros.rango.desde, filtros.rango.hasta) : undefined;
  const busquedaDetalle = filtros.rango ? `?desde=${filtros.rango.desde}&hasta=${filtros.rango.hasta}` : '';

  const datos = publicaciones.datos;
  let resultados;
  if (publicaciones.cargando) {
    resultados = <Cargando texto="Buscando…" />;
  } else if (publicaciones.error) {
    resultados = (
      <>
        <ErrorCarga mensaje={publicaciones.error.message} alReintentar={publicaciones.recargar} />
        {hayFiltros && (
          <p className={estilos.centro}>
            <Boton variante="borde" onClick={limpiar}>Limpiar filtros</Boton>
          </p>
        )}
      </>
    );
  } else if (!datos.datos.length) {
    resultados = (
      <Vacio
        titulo={filtros.q ? `No encontramos resultados para «${filtros.q}»` : 'No hay publicaciones con estos filtros'}
        accion={hayFiltros && <Boton variante="borde" onClick={limpiar}>Limpiar filtros</Boton>}
      >
        Probá con otra búsqueda o sacá algún filtro.
      </Vacio>
    );
  } else {
    resultados = (
      <>
        <div className={estilos.grilla}>
          {datos.datos.map((p) => (
            <TarjetaPublicacion key={p._id} publicacion={p} conTipo={!filtros.tipo} dias={dias} busqueda={busquedaDetalle} />
          ))}
        </div>
        <Paginacion
          pagina={datos.paginacion.pagina}
          paginas={datos.paginacion.paginas}
          alCambiar={(p) => actualizar({ pagina: p }, { esPaginacion: true })}
        />
      </>
    );
  }

  return (
    <div className="contenedor">
      <EncabezadoPagina
        titulo={filtros.q ? `Resultados para «${filtros.q}»` : seccion.titulo}
        bajada={filtros.q ? null : seccion.bajada}
        publico
      />

      <div className={estilos.tipos} role="group" aria-label="Tipo de publicación">
        {CHIPS_TIPO.map((c) => (
          <Chip key={c.valor} activo={filtros.tipo === c.valor} onClick={() => cambiarTipo(c.valor)}>
            {c.texto}
          </Chip>
        ))}
      </div>

      {filtros.tipo === 'alquiler' && (
        <div className={estilos.fechas}>
          <RangoFechas
            key={filtros.rango ? `${filtros.rango.desde}_${filtros.rango.hasta}` : 'sin-fechas'}
            rango={filtros.rango}
            alAplicar={(r) => actualizar({ desde: r.desde, hasta: r.hasta })}
            alQuitar={() => actualizar({ desde: null, hasta: null })}
          />
        </div>
      )}

      <div className={estilos.disposicion}>
        <aside className={estilos.lateral}>
          <Buscador key={filtros.q} inicial={filtros.q} alBuscar={(q) => actualizar({ q })} />

          <button
            type="button"
            className={estilos.abrirFiltros}
            aria-expanded={filtrosAbiertos}
            aria-controls="panel-filtros"
            onClick={() => setFiltrosAbiertos((a) => !a)}
          >
            {filtrosAbiertos ? 'Ocultar filtros' : 'Mostrar filtros'}
            {cantidadFiltros > 0 && ` (${cantidadFiltros})`}
          </button>

          <div id="panel-filtros" className={`${estilos.filtros} ${filtrosAbiertos ? estilos.abiertos : ''}`}>
            {categorias.datos?.length > 0 && (
              <div role="group" aria-labelledby="rotulo-categorias">
                <p id="rotulo-categorias" className={estilos.rotulo}>Categoría</p>
                <div className={estilos.chips}>
                  <Chip activo={!filtros.categoria} onClick={() => actualizar({ categoria: null })}>
                    Todas
                  </Chip>
                  {categorias.datos.map((c) => (
                    <Chip key={c._id} activo={filtros.categoria === c._id} onClick={() => actualizar({ categoria: c._id })}>
                      {c.nombre}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div role="group" aria-labelledby="rotulo-disponibilidad">
              <p id="rotulo-disponibilidad" className={estilos.rotulo}>Disponibilidad</p>
              <div className={estilos.chips}>
                <Chip activo={filtros.disponible} onClick={() => actualizar({ disponible: !filtros.disponible })}>
                  Solo disponibles
                </Chip>
              </div>
            </div>

            {conPrecio && (
              <FiltroPrecio
                key={`${filtros.precioMin}_${filtros.precioMax}`}
                min={filtros.precioMin}
                max={filtros.precioMax}
                alAplicar={({ min, max }) => actualizar({ precioMin: min, precioMax: max })}
              />
            )}

            {hayFiltros && (
              <button type="button" className={estilos.limpiar} onClick={limpiar}>
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <section className={estilos.resultados} aria-label="Resultados">
          <div className={estilos.barra}>
            <p aria-live="polite">
              {datos && !publicaciones.cargando
                ? `${datos.paginacion.total} ${datos.paginacion.total === 1 ? 'resultado' : 'resultados'}`
                : ' '}
            </p>
            <label className={estilos.orden}>
              Ordenar por
              <select value={filtros.orden} onChange={(e) => actualizar({ orden: e.target.value === 'recientes' ? null : e.target.value })}>
                {ORDENES.filter((o) => conPrecio || !o.conPrecio).map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.texto}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {resultados}
        </section>
      </div>
    </div>
  );
}
