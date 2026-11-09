import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { actualizarPublicacion, crearPublicacion, obtenerPublicacion } from '../../api/publicaciones.api.js';
import { listarCategorias } from '../../api/categorias.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { DIFICULTADES, NIVELES, TEMPORADAS, TIPOS } from '../../utils/textos.js';
import { errorDeLargo, soloErrores } from '../../utils/validaciones.js';
import estilos from './PublicacionForm.module.css';

const MAX_IMAGENES = 8;

// Todos los campos de las tres formas en un solo objeto plano: los de
// `atributos` se arman al enviar segun el tipo.
const VACIO = {
  tipo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  imagenes: [],
  activa: true,
  disponible: true,
  destacada: false,
  // experiencia
  dificultad: '',
  duracionHoras: '',
  temporada: [],
  cupoMaximo: '',
  puntoEncuentro: '',
  incluye: '',
  // curso
  nivel: '',
  certificacion: '',
  cupo: '',
  requisitosPrevios: '',
  // alquiler
  precioPorDia: '',
  talles: '',
  unidadesTotales: '',
  unidadesDisponibles: '',
  deposito: '',
};

const DESCRIPCION_TIPO = {
  experiencia: 'Salida guiada con fecha a coordinar.',
  curso: 'Formación con nivel, cupo y certificado.',
  alquiler: 'Equipo que se cobra por día.',
};

/* ------------------------- Conversion de datos ------------------------- */

const aTexto = (valor) => (valor === undefined || valor === null ? '' : String(valor));

/** Publicacion del back -> valores del formulario. */
function desdePublicacion(p) {
  const a = p.atributos ?? {};
  return {
    ...VACIO,
    tipo: p.tipo,
    nombre: p.nombre,
    descripcion: p.descripcion,
    categoria: p.categoria?._id ?? '',
    precio: aTexto(p.precio),
    imagenes: p.imagenes ?? [],
    activa: p.activa,
    disponible: p.disponible,
    destacada: p.destacada,
    dificultad: a.dificultad ?? '',
    duracionHoras: aTexto(a.duracionHoras),
    temporada: a.temporada ?? [],
    cupoMaximo: aTexto(a.cupoMaximo),
    puntoEncuentro: a.puntoEncuentro ?? '',
    incluye: (a.incluye ?? []).join('\n'),
    nivel: a.nivel ?? '',
    certificacion: a.certificacion ?? '',
    cupo: aTexto(a.cupo),
    requisitosPrevios: (a.requisitosPrevios ?? []).join('\n'),
    precioPorDia: aTexto(a.precioPorDia),
    talles: (a.talles ?? []).join(', '),
    unidadesTotales: aTexto(a.unidadesTotales),
    unidadesDisponibles: aTexto(a.unidadesDisponibles),
    deposito: aTexto(a.deposito),
  };
}

/**
 * Numero escrito como en Argentina: "45.000" -> 45000, "1.500,5" -> 1500.5,
 * "6,5" -> 6.5. Tambien acepta "6.5". Vacio -> null; lo que no sea numero -> NaN.
 */
function aNumero(texto) {
  const limpio = texto.trim().replace(/\s|\$/g, '');
  if (!limpio) return null;
  if (limpio.includes(',')) return Number(limpio.replace(/\./g, '').replace(',', '.'));
  // Puntos cada tres cifras son separador de miles, no decimales.
  if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) return Number(limpio.replace(/\./g, ''));
  return Number(limpio);
}

const lineas = (texto) =>
  texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

const porComas = (texto) =>
  texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

/** Valores del formulario -> body del POST / PUT. */
function aDatos(v) {
  const datos = {
    tipo: v.tipo,
    nombre: v.nombre.trim(),
    descripcion: v.descripcion.trim(),
    categoria: v.categoria,
    imagenes: v.imagenes,
    activa: v.activa,
    disponible: v.disponible,
    destacada: v.destacada,
  };

  if (v.tipo !== 'alquiler' && aNumero(v.precio) !== null) datos.precio = aNumero(v.precio);

  if (v.tipo === 'experiencia') {
    datos.atributos = {
      dificultad: v.dificultad,
      duracionHoras: aNumero(v.duracionHoras),
      temporada: v.temporada,
      cupoMaximo: aNumero(v.cupoMaximo),
      puntoEncuentro: v.puntoEncuentro.trim(),
      incluye: lineas(v.incluye),
    };
  } else if (v.tipo === 'curso') {
    datos.atributos = {
      duracionHoras: aNumero(v.duracionHoras),
      nivel: v.nivel,
      cupo: aNumero(v.cupo),
      requisitosPrevios: lineas(v.requisitosPrevios),
    };
    if (v.certificacion.trim()) datos.atributos.certificacion = v.certificacion.trim();
  } else {
    datos.atributos = {
      precioPorDia: aNumero(v.precioPorDia),
      talles: porComas(v.talles),
      unidadesTotales: aNumero(v.unidadesTotales),
      unidadesDisponibles: aNumero(v.unidadesDisponibles),
    };
    if (aNumero(v.deposito) !== null) datos.atributos.deposito = aNumero(v.deposito);
  }

  return datos;
}

/* ------------------------------ Validacion ------------------------------ */

// Mismas reglas que publicaciones.validacion.js en el back.
function errorDeNumero(texto, { obligatorio = true, entero = false, minimo = 0, mayorQueCero = false, nombre }) {
  const n = aNumero(texto);
  if (n === null) return obligatorio ? `Indicá ${nombre}` : null;
  if (Number.isNaN(n)) return 'Tiene que ser un número';
  if (entero && !Number.isInteger(n)) return 'Tiene que ser un número entero';
  if (mayorQueCero && n <= 0) return 'Tiene que ser mayor a cero';
  if (n < minimo) return 'No puede ser negativo';
  return null;
}

function validar(v, { precioOriginal }) {
  const comunes = {
    tipo: v.tipo ? null : 'Elegí qué tipo de publicación es',
    nombre: errorDeLargo(v.nombre, [3, 120], {
      vacio: 'Escribí el nombre',
      corto: 'El nombre tiene que tener al menos 3 caracteres',
      largo: 'El nombre no puede superar los 120 caracteres',
    }),
    descripcion: errorDeLargo(v.descripcion, [20, 2000], {
      vacio: 'Escribí una descripción',
      corto: 'La descripción tiene que tener al menos 20 caracteres',
      largo: 'La descripción no puede superar los 2000 caracteres',
    }),
    categoria: v.categoria ? null : 'Elegí una categoría',
    imagenes: v.imagenes.length ? null : 'Agregá al menos una imagen',
  };

  if (v.tipo !== 'alquiler') {
    comunes.precio = errorDeNumero(v.precio, { obligatorio: false, nombre: 'el precio' });
    // El PUT no permite borrar un precio ya cargado.
    if (!comunes.precio && precioOriginal != null && aNumero(v.precio) === null) {
      comunes.precio = 'Un precio ya cargado no se puede borrar: indicá el valor actual';
    }
  }

  if (v.tipo === 'experiencia') {
    return soloErrores({
      ...comunes,
      dificultad: v.dificultad ? null : 'Elegí la dificultad',
      duracionHoras: errorDeNumero(v.duracionHoras, { mayorQueCero: true, nombre: 'la duración' }),
      temporada: v.temporada.length ? null : 'Marcá al menos una temporada',
      cupoMaximo: errorDeNumero(v.cupoMaximo, { entero: true, mayorQueCero: true, nombre: 'el cupo máximo' }),
      puntoEncuentro: v.puntoEncuentro.trim().length >= 3 ? null : 'Indicá dónde se encuentra el grupo',
    });
  }

  if (v.tipo === 'curso') {
    return soloErrores({
      ...comunes,
      duracionHoras: errorDeNumero(v.duracionHoras, { mayorQueCero: true, nombre: 'la duración' }),
      nivel: v.nivel ? null : 'Elegí el nivel',
      cupo: errorDeNumero(v.cupo, { entero: true, mayorQueCero: true, nombre: 'el cupo' }),
      certificacion: v.certificacion.trim().length > 120 ? 'No puede superar los 120 caracteres' : null,
    });
  }

  if (v.tipo === 'alquiler') {
    const errores = {
      ...comunes,
      precioPorDia: errorDeNumero(v.precioPorDia, { nombre: 'el precio por día' }),
      unidadesTotales: errorDeNumero(v.unidadesTotales, { entero: true, nombre: 'cuántas unidades hay' }),
      unidadesDisponibles: errorDeNumero(v.unidadesDisponibles, { entero: true, nombre: 'cuántas están disponibles' }),
      deposito: errorDeNumero(v.deposito, { obligatorio: false, nombre: 'el depósito' }),
    };
    if (!errores.unidadesTotales && !errores.unidadesDisponibles && aNumero(v.unidadesDisponibles) > aNumero(v.unidadesTotales)) {
      errores.unidadesDisponibles = 'No puede haber más disponibles que unidades totales';
    }
    return soloErrores(errores);
  }

  return soloErrores(comunes);
}

/**
 * El back nombra los errores de atributos como "atributos.cupo" y los de
 * listas como "imagenes.2": se llevan al nombre del campo del formulario.
 */
function traducirErroresDelBack(error) {
  if (!error.porCampo) return;
  error.porCampo = Object.fromEntries(
    Object.entries(error.porCampo).map(([campo, mensaje]) => [
      campo.replace(/^atributos\./, '').replace(/\.\d+$/, ''),
      mensaje,
    ])
  );
}

/* ------------------------------ Piezas ------------------------------ */

function Seccion({ titulo, bajada, children }) {
  return (
    <fieldset className={estilos.seccion}>
      <legend className={estilos.tituloSeccion}>{titulo}</legend>
      {bajada && <p className={estilos.bajada}>{bajada}</p>}
      {children}
    </fieldset>
  );
}

/** Checkboxes o radios con un solo error para todo el grupo. */
function GrupoOpciones({ etiqueta, error, children }) {
  return (
    <fieldset className={`${estilos.grupo} ${error ? estilos.grupoConError : ''}`} aria-invalid={error ? true : undefined}>
      <legend className={estilos.etiquetaGrupo}>{etiqueta}</legend>
      <div className={estilos.opciones}>{children}</div>
      {error && <p className={estilos.error}>{error}</p>}
    </fieldset>
  );
}

function Interruptor({ name, checked, alCambiar, etiqueta, ayuda }) {
  return (
    <label className={estilos.interruptor}>
      <input type="checkbox" name={name} checked={checked} onChange={(e) => alCambiar(name, e.target.checked)} />
      <span>
        <strong>{etiqueta}</strong>
        <span className={estilos.ayuda}>{ayuda}</span>
      </span>
    </label>
  );
}

function EditorImagenes({ imagenes, alCambiar, error }) {
  const [url, setUrl] = useState('');
  const [errorUrl, setErrorUrl] = useState(null);

  const agregar = () => {
    const texto = url.trim();
    let valida = false;
    try {
      valida = ['http:', 'https:'].includes(new URL(texto).protocol);
    } catch {
      valida = false;
    }
    if (!valida) {
      setErrorUrl('Pegá la dirección completa de la imagen, empezando con https://');
      return;
    }
    if (imagenes.includes(texto)) {
      setErrorUrl('Esa imagen ya está en la lista');
      return;
    }
    alCambiar([...imagenes, texto]);
    setUrl('');
  };

  const quitar = (i) => alCambiar(imagenes.filter((_, j) => j !== i));
  const hacerPrincipal = (i) => alCambiar([imagenes[i], ...imagenes.filter((_, j) => j !== i)]);
  const lleno = imagenes.length >= MAX_IMAGENES;

  return (
    <div className={estilos.imagenes}>
      {imagenes.length > 0 && (
        <ul className={estilos.listaImagenes}>
          {imagenes.map((src, i) => (
            <li key={src}>
              <img src={src} alt={`Imagen ${i + 1}`} />
              <div className={estilos.accionesImagen}>
                {i === 0 ? (
                  <span className={estilos.principal}>Principal</span>
                ) : (
                  <button type="button" onClick={() => hacerPrincipal(i)}>
                    Hacer principal<span className="solo-lector"> la imagen {i + 1}</span>
                  </button>
                )}
                <button type="button" onClick={() => quitar(i)}>
                  Quitar<span className="solo-lector"> la imagen {i + 1}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!lleno && (
        <div className={estilos.agregarImagen}>
          <Campo
            etiqueta="Dirección (URL) de la imagen"
            name="imagenes"
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setErrorUrl(null);
            }}
            onKeyDown={(e) => {
              // Enter agrega la imagen en vez de enviar todo el formulario.
              if (e.key === 'Enter') {
                e.preventDefault();
                agregar();
              }
            }}
            error={errorUrl ?? error}
            ayuda={`Hasta ${MAX_IMAGENES} imágenes. La primera es la que se ve en el catálogo.`}
          />
          <Boton type="button" variante="borde" onClick={agregar}>
            Agregar
          </Boton>
        </div>
      )}
      {lleno && <p className={estilos.ayuda}>Llegaste al máximo de {MAX_IMAGENES} imágenes.</p>}
    </div>
  );
}

/* ----------------------------- Formulario ----------------------------- */

function Formulario({ publicacion, categorias }) {
  const navegar = useNavigate();
  const esEdicion = Boolean(publicacion);
  const precioOriginal = publicacion?.precio;

  const form = useFormulario({
    inicial: esEdicion ? desdePublicacion(publicacion) : VACIO,
    validar: (v) => validar(v, { precioOriginal }),
    alEnviar: async (valores) => {
      const datos = aDatos(valores);
      try {
        if (esEdicion) await actualizarPublicacion(publicacion._id, datos);
        else await crearPublicacion(datos);
      } catch (error) {
        traducirErroresDelBack(error);
        throw error;
      }
      const donde = datos.activa ? 'Ya se ve en el sitio.' : 'Quedó oculta: no se ve en el sitio.';
      navegar('/admin/publicaciones', {
        state: { aviso: `${esEdicion ? 'Guardaste los cambios de' : 'Creaste'} «${datos.nombre}». ${donde}` },
      });
    },
  });

  const { valores, errores, cambiar, setValores } = form;
  const poner = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    form.limpiarError(campo);
  };
  const alternarTemporada = (temporada) =>
    poner(
      'temporada',
      valores.temporada.includes(temporada)
        ? valores.temporada.filter((t) => t !== temporada)
        : [...valores.temporada, temporada]
    );

  // Props comunes de un campo de texto ligado a `valores`.
  const campo = (nombre) => ({ name: nombre, value: valores[nombre], onChange: cambiar, error: errores[nombre] });
  const tipo = valores.tipo;

  return (
    <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}

      <Seccion titulo="Tipo">
        {esEdicion ? (
          <p className={estilos.tipoFijo}>
            <strong>{TIPOS[tipo]}</strong> · {DESCRIPCION_TIPO[tipo]}
            <span className={estilos.ayuda}>
              El tipo no se cambia después de crear la publicación: cada tipo tiene datos distintos.
            </span>
          </p>
        ) : (
          <GrupoOpciones etiqueta="¿Qué vas a publicar?" error={errores.tipo}>
            {Object.entries(TIPOS).map(([valor, texto]) => (
              <label key={valor} className={`${estilos.opcionTipo} ${tipo === valor ? estilos.opcionElegida : ''}`}>
                <input type="radio" name="tipo" value={valor} checked={tipo === valor} onChange={() => poner('tipo', valor)} />
                <span>
                  <strong>{texto}</strong>
                  <span className={estilos.ayuda}>{DESCRIPCION_TIPO[valor]}</span>
                </span>
              </label>
            ))}
          </GrupoOpciones>
        )}
      </Seccion>

      {tipo && (
        <>
          <Seccion titulo="Datos principales">
            <Campo etiqueta="Nombre" {...campo('nombre')} maxLength={120} required />
            <Campo etiqueta="Categoría" como="select" {...campo('categoria')} required>
              <option value="">Elegí una categoría</option>
              {categorias.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre}
                  {c.activa === false ? ' (oculta en el sitio)' : ''}
                </option>
              ))}
            </Campo>
            <Campo
              etiqueta="Descripción"
              como="textarea"
              rows={6}
              {...campo('descripcion')}
              maxLength={2000}
              ayuda={`${valores.descripcion.length} de 2000 caracteres. Contá qué es, para quién es y qué hace distinta a esta propuesta.`}
              required
            />
            {tipo !== 'alquiler' && (
              <Campo
                etiqueta={tipo === 'curso' ? 'Precio del curso' : 'Precio desde'}
                inputMode="decimal"
                {...campo('precio')}
                ayuda="En pesos, sin el signo. Si lo dejás vacío, en el sitio dice «A consultar»."
                opcional
                className={estilos.corto}
              />
            )}
          </Seccion>

          <Seccion titulo="Imágenes">
            <EditorImagenes imagenes={valores.imagenes} alCambiar={(lista) => poner('imagenes', lista)} error={errores.imagenes} />
          </Seccion>

          {tipo === 'experiencia' && (
            <Seccion titulo="Datos de la experiencia">
              <div className={estilos.fila}>
                <Campo etiqueta="Dificultad" como="select" {...campo('dificultad')} required>
                  <option value="">Elegí</option>
                  {Object.entries(DIFICULTADES).map(([valor, texto]) => (
                    <option key={valor} value={valor}>
                      {texto}
                    </option>
                  ))}
                </Campo>
                <Campo etiqueta="Duración (horas)" inputMode="decimal" {...campo('duracionHoras')} required />
                <Campo etiqueta="Cupo máximo (personas)" inputMode="numeric" {...campo('cupoMaximo')} required />
              </div>
              <GrupoOpciones etiqueta="Temporada" error={errores.temporada}>
                {Object.entries(TEMPORADAS).map(([valor, texto]) => (
                  <label key={valor} className={estilos.opcion}>
                    <input
                      type="checkbox"
                      name="temporada"
                      checked={valores.temporada.includes(valor)}
                      onChange={() => alternarTemporada(valor)}
                    />
                    {texto}
                  </label>
                ))}
              </GrupoOpciones>
              <Campo etiqueta="Punto de encuentro" {...campo('puntoEncuentro')} placeholder="Ej.: Base del Cerro Catedral" required />
              <Campo
                etiqueta="Qué incluye"
                como="textarea"
                rows={4}
                {...campo('incluye')}
                ayuda="Una cosa por renglón."
                opcional
              />
            </Seccion>
          )}

          {tipo === 'curso' && (
            <Seccion titulo="Datos del curso">
              <div className={estilos.fila}>
                <Campo etiqueta="Nivel" como="select" {...campo('nivel')} required>
                  <option value="">Elegí</option>
                  {Object.entries(NIVELES).map(([valor, texto]) => (
                    <option key={valor} value={valor}>
                      {texto}
                    </option>
                  ))}
                </Campo>
                <Campo etiqueta="Duración (horas)" inputMode="decimal" {...campo('duracionHoras')} required />
                <Campo etiqueta="Cupo (personas)" inputMode="numeric" {...campo('cupo')} required />
              </div>
              <Campo
                etiqueta="Certificación"
                {...campo('certificacion')}
                maxLength={120}
                placeholder="Ej.: Certificado de asistencia"
                opcional
              />
              <Campo
                etiqueta="Requisitos previos"
                como="textarea"
                rows={4}
                {...campo('requisitosPrevios')}
                ayuda="Uno por renglón. Si no hace falta experiencia, dejalo vacío."
                opcional
              />
            </Seccion>
          )}

          {tipo === 'alquiler' && (
            <Seccion titulo="Datos del alquiler">
              <div className={estilos.fila}>
                <Campo etiqueta="Precio por día" inputMode="decimal" {...campo('precioPorDia')} ayuda="En pesos, sin el signo." required />
                <Campo etiqueta="Depósito" inputMode="decimal" {...campo('deposito')} ayuda="Lo que se deja en garantía." opcional />
              </div>
              <div className={estilos.fila}>
                <Campo etiqueta="Unidades totales" inputMode="numeric" {...campo('unidadesTotales')} required />
                <Campo etiqueta="Unidades disponibles" inputMode="numeric" {...campo('unidadesDisponibles')} required />
              </div>
              <Campo etiqueta="Talles" {...campo('talles')} ayuda="Separados por coma. Ej.: S, M, L" opcional />
            </Seccion>
          )}

          <Seccion titulo="Cómo se muestra">
            <Interruptor
              name="activa"
              checked={valores.activa}
              alCambiar={poner}
              etiqueta="Visible en el sitio"
              ayuda="Si la desmarcás, queda guardada en el panel pero nadie la ve en el sitio."
            />
            <Interruptor
              name="disponible"
              checked={valores.disponible}
              alCambiar={poner}
              etiqueta="Disponible"
              ayuda="Se puede consultar. Desmarcala si está agotada o fuera de temporada: sigue en el sitio como «No disponible»."
            />
            <Interruptor
              name="destacada"
              checked={valores.destacada}
              alCambiar={poner}
              etiqueta="Destacada"
              ayuda="Lleva la etiqueta «Destacada». Las experiencias destacadas son las que aparecen en la portada."
            />
          </Seccion>
        </>
      )}

      <div className={estilos.acciones}>
        <Link to="/admin/publicaciones" className={estilos.cancelar}>
          Cancelar
        </Link>
        <Boton type="submit" disabled={form.enviando || !tipo}>
          {form.enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear publicación'}
        </Boton>
      </div>
    </form>
  );
}

/* ------------------------------- Pagina ------------------------------- */

// Alta y edicion comparten formulario; con `id` es edicion.
export default function PublicacionForm() {
  const { id } = useParams();
  const pedirPublicacion = useCallback(() => (id ? obtenerPublicacion(id) : Promise.resolve(null)), [id]);
  const publicacion = usePedido(pedirPublicacion);
  const categorias = usePedido(listarCategorias);

  const titulo = id ? 'Editar publicación' : 'Nueva publicación';
  const volver = (
    <Link to="/admin/publicaciones" className={estilos.volver}>
      ← Publicaciones
    </Link>
  );

  let contenido;
  if (publicacion.cargando || categorias.cargando) {
    contenido = <Cargando />;
  } else if (publicacion.error) {
    const noExiste = publicacion.error.estado === 404 || publicacion.error.estado === 400;
    contenido = noExiste ? (
      <Vacio titulo="No encontramos esta publicación" accion={<Boton a="/admin/publicaciones">Volver a la lista</Boton>}>
        Puede que la hayan eliminado.
      </Vacio>
    ) : (
      <ErrorCarga mensaje={publicacion.error.message} alReintentar={publicacion.recargar} />
    );
  } else if (categorias.error) {
    contenido = <ErrorCarga mensaje={categorias.error.message} alReintentar={categorias.recargar} />;
  } else if (categorias.datos.length === 0) {
    contenido = (
      <Vacio titulo="Primero creá una categoría" accion={<Boton a="/admin/categorias">Ir a categorías</Boton>}>
        Cada publicación tiene que pertenecer a una categoría.
      </Vacio>
    );
  } else {
    contenido = (
      <Formulario key={id ?? 'nueva'} publicacion={publicacion.datos} categorias={categorias.datos} />
    );
  }

  return (
    <>
      <title>{`${titulo} · Panel · Andes Vertical`}</title>
      {volver}
      <EncabezadoPagina
        titulo={titulo}
        bajada={publicacion.datos ? publicacion.datos.nombre : 'Completá los datos y elegí cómo se muestra en el sitio.'}
      />
      {contenido}
    </>
  );
}
