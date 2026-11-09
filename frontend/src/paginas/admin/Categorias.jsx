import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias } from '../../api/categorias.api.js';
import { listarPublicaciones } from '../../api/publicaciones.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import Etiqueta from '../../componentes/Etiqueta.jsx';
import Modal from '../../componentes/Modal.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { errorDeLargo, soloErrores } from '../../utils/validaciones.js';
import estilos from './Categorias.module.css';

/**
 * Categorias con la cantidad de publicaciones de cada una (incluidas las
 * ocultas, porque con la sesion del panel el back las cuenta todas). La
 * cantidad decide si se puede eliminar.
 */
async function pedirCategorias() {
  const categorias = await listarCategorias();
  const totales = await Promise.all(
    categorias.map((c) => listarPublicaciones({ categoria: c._id, limite: 1 }).then((r) => r.paginacion.total))
  );
  return categorias.map((c, i) => ({ ...c, publicaciones: totales[i] }));
}

// Mismos limites que categorias.validacion.js en el back.
const validar = (v) =>
  soloErrores({
    nombre: errorDeLargo(v.nombre, [2, 60], {
      vacio: 'Escribí el nombre',
      corto: 'El nombre tiene que tener al menos 2 caracteres',
      largo: 'El nombre no puede superar los 60 caracteres',
    }),
    descripcion: v.descripcion.trim().length > 300 ? 'La descripción no puede superar los 300 caracteres' : null,
  });

/** Alta y edicion en la misma ventana; con `categoria` es edicion. */
function FormularioCategoria({ categoria, alGuardar, alCancelar }) {
  const esEdicion = Boolean(categoria);
  const [activa, setActiva] = useState(categoria?.activa ?? true);

  const form = useFormulario({
    inicial: { nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' },
    validar,
    alEnviar: async ({ nombre, descripcion }) => {
      const datos = { nombre: nombre.trim(), activa };
      // Al editar se manda vacia para poder borrarla; al crear se omite.
      if (esEdicion || descripcion.trim()) datos.descripcion = descripcion.trim();
      try {
        if (esEdicion) await actualizarCategoria(categoria._id, datos);
        else await crearCategoria(datos);
      } catch (error) {
        if (error.estado === 409) {
          form.marcarErrores({ nombre: 'Ya hay una categoría con ese nombre' });
          return;
        }
        throw error;
      }
      alGuardar(`${esEdicion ? 'Guardaste los cambios de' : 'Creaste la categoría'} «${datos.nombre}».`);
    },
  });

  return (
    <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}
      <Campo
        etiqueta="Nombre"
        name="nombre"
        value={form.valores.nombre}
        onChange={form.cambiar}
        error={form.errores.nombre}
        maxLength={60}
        autoFocus
        required
      />
      <Campo
        etiqueta="Descripción"
        como="textarea"
        name="descripcion"
        rows={3}
        value={form.valores.descripcion}
        onChange={form.cambiar}
        error={form.errores.descripcion}
        maxLength={300}
        ayuda={`${form.valores.descripcion.length} de 300 caracteres. Uso interno: no se muestra en el sitio.`}
        opcional
      />
      <label className={estilos.interruptor}>
        <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
        <span>
          <strong>Visible en el sitio</strong>
          <span className={estilos.ayuda}>
            Si la ocultás, deja de aparecer en los filtros del catálogo y en la portada. Sus publicaciones siguen
            en el catálogo.
          </span>
        </span>
      </label>
      <div className={estilos.acciones}>
        <Boton variante="borde" onClick={alCancelar} disabled={form.enviando}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={form.enviando}>
          {form.enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear categoría'}
        </Boton>
      </div>
    </form>
  );
}

function textoCantidad(n) {
  if (n === 0) return 'Sin publicaciones';
  return `${n} ${n === 1 ? 'publicación' : 'publicaciones'}`;
}

export default function Categorias() {
  const { datos, error, cargando, recargar } = usePedido(pedirCategorias);
  const [aviso, setAviso] = useState(null);
  // null: cerrada · { categoria: null }: alta · { categoria }: edicion
  const [edicion, setEdicion] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

  const guardado = useCallback(
    (mensaje) => {
      setEdicion(null);
      setAviso(mensaje);
      recargar();
    },
    [recargar]
  );

  const cerrarEliminar = () => {
    if (eliminando) return;
    setAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await eliminarCategoria(aEliminar._id);
      setAviso(`Eliminaste la categoría «${aEliminar.nombre}».`);
      setAEliminar(null);
      recargar();
    } catch (err) {
      setErrorEliminar(err.message);
    } finally {
      setEliminando(false);
    }
  };

  let contenido;
  if (cargando) {
    contenido = <Cargando />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error.message} alReintentar={recargar} />;
  } else if (datos.length === 0) {
    contenido = (
      <Vacio
        titulo="Todavía no hay categorías"
        accion={<Boton onClick={() => setEdicion({ categoria: null })}>Crear la primera</Boton>}
      >
        Las categorías agrupan las publicaciones y aparecen como filtros en el catálogo.
      </Vacio>
    );
  } else {
    contenido = (
      <div className={estilos.tablaCaja}>
        <table className={estilos.tabla}>
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Publicaciones</th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="solo-lector">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {datos.map((c) => (
              <tr key={c._id}>
                <td>
                  <span className={estilos.nombre}>{c.nombre}</span>
                  {c.descripcion && <span className={estilos.descripcion}>{c.descripcion}</span>}
                </td>
                <td data-titulo="Publicaciones" className={estilos.cantidad}>
                  {c.publicaciones > 0 ? (
                    <Link to={`/admin/publicaciones?categoria=${c._id}`}>{textoCantidad(c.publicaciones)}</Link>
                  ) : (
                    <span className={estilos.suave}>{textoCantidad(0)}</span>
                  )}
                </td>
                <td data-titulo="Estado">
                  {c.activa ? <Etiqueta variante="exito">Visible</Etiqueta> : <Etiqueta variante="aviso">Oculta</Etiqueta>}
                </td>
                <td className={estilos.celdaAcciones}>
                  <button type="button" className={estilos.accion} onClick={() => setEdicion({ categoria: c })}>
                    Editar<span className="solo-lector"> {c.nombre}</span>
                  </button>
                  <button
                    type="button"
                    className={`${estilos.accion} ${estilos.eliminar}`}
                    onClick={() => setAEliminar(c)}
                  >
                    Eliminar<span className="solo-lector"> {c.nombre}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Con publicaciones el back no deja borrarla: se explica en vez de ofrecer el boton.
  const conPublicaciones = aEliminar?.publicaciones > 0;

  return (
    <>
      <title>Categorías · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Categorías"
        bajada="Agrupan las publicaciones y aparecen como filtros en el catálogo."
        acciones={<Boton onClick={() => setEdicion({ categoria: null })}>Nueva categoría</Boton>}
      />

      {aviso && (
        <Aviso variante="exito" className={estilos.aviso}>
          {aviso}
        </Aviso>
      )}

      {contenido}

      <Modal
        abierto={Boolean(edicion)}
        titulo={edicion?.categoria ? 'Editar categoría' : 'Nueva categoría'}
        alCerrar={() => setEdicion(null)}
      >
        {edicion && (
          <FormularioCategoria
            key={edicion.categoria?._id ?? 'nueva'}
            categoria={edicion.categoria}
            alGuardar={guardado}
            alCancelar={() => setEdicion(null)}
          />
        )}
      </Modal>

      <Modal
        abierto={Boolean(aEliminar)}
        titulo={conPublicaciones ? 'Esta categoría no se puede eliminar' : '¿Eliminar esta categoría?'}
        alCerrar={cerrarEliminar}
        acciones={
          conPublicaciones ? (
            <>
              <Boton variante="borde" onClick={cerrarEliminar}>
                Cerrar
              </Boton>
              <Boton a={`/admin/publicaciones?categoria=${aEliminar?._id}`}>Ver sus publicaciones</Boton>
            </>
          ) : (
            <>
              <Boton variante="borde" onClick={cerrarEliminar} disabled={eliminando}>
                Cancelar
              </Boton>
              <Boton variante="peligro" onClick={confirmarEliminacion} disabled={eliminando}>
                {eliminando ? 'Eliminando…' : 'Eliminar'}
              </Boton>
            </>
          )
        }
      >
        {conPublicaciones ? (
          <>
            <p>
              <strong>{aEliminar.nombre}</strong> tiene {textoCantidad(aEliminar.publicaciones).toLowerCase()}. Para
              eliminarla, primero pasalas a otra categoría o eliminalas.
            </p>
            <p>Si solo querés sacarla de los filtros del sitio, editala y desmarcá «Visible en el sitio».</p>
          </>
        ) : (
          <p>
            Vas a eliminar <strong>{aEliminar?.nombre}</strong>. No tiene publicaciones y no se puede deshacer.
          </p>
        )}
        {errorEliminar && <Aviso>{errorEliminar}</Aviso>}
      </Modal>
    </>
  );
}
