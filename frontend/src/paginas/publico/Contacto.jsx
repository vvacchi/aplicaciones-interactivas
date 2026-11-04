import { useCallback, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { enviarConsulta } from '../../api/consultas.api.js';
import { obtenerComercio } from '../../api/comercio.api.js';
import { obtenerPublicacion } from '../../api/publicaciones.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import { Cargando } from '../../componentes/Estados.jsx';
import { contarDias, formatearFechaNumerica, rangoDeUrl, resumirRango } from '../../utils/fechas.js';
import { agruparHorarios, enlacesDeRedes } from '../../utils/formato.js';
import { TIPOS } from '../../utils/textos.js';
import { esEmail, esId } from '../../utils/validaciones.js';
import estilos from './Contacto.module.css';

// Mismos limites que crearConsultaSchema en el back.
const LIMITES = {
  nombre: [2, 80],
  telefono: [6, 30],
  asunto: [3, 120],
  mensaje: [10, 2000],
};

const ORDEN_CAMPOS = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];

/** Asunto precargado cuando la consulta sale de una publicacion. */
function asuntoInicial(publicacion) {
  if (!publicacion) return '';
  return `Consulta: ${publicacion.nombre}`.slice(0, LIMITES.asunto[1]);
}

/**
 * Mensaje precargado y editable. Consulta todavia no guarda fechas, asi
 * que si el visitante eligio un rango viaja escrito en el texto.
 */
function mensajeInicial(publicacion, rango) {
  if (!publicacion) return '';
  const { nombre, tipo } = publicacion;
  const fechas = rango
    ? `del ${formatearFechaNumerica(rango.desde)} al ${formatearFechaNumerica(rango.hasta)}`
    : null;

  if (tipo === 'alquiler') {
    if (!fechas) return `Hola, quería consultar por ${nombre}. ¿Lo tienen disponible?`;
    const dias = contarDias(rango.desde, rango.hasta);
    return `Hola, quería consultar por ${nombre} ${fechas} (${dias} ${dias === 1 ? 'día' : 'días'}). ¿Lo tienen disponible para esas fechas?`;
  }
  if (tipo === 'experiencia') {
    return fechas
      ? `Hola, me interesa ${nombre} ${fechas}. ¿Hay salidas en esas fechas?`
      : `Hola, me interesa ${nombre}. ¿Cuándo son las próximas salidas?`;
  }
  return `Hola, quería consultar por ${nombre}. ¿Cuándo empieza el próximo y es para mi nivel?`;
}

/** Devuelve los errores por campo (vacio si esta todo bien). */
function validar(valores) {
  const errores = {};
  const largo = (campo) => valores[campo].trim().length;

  if (largo('nombre') < LIMITES.nombre[0]) errores.nombre = 'Escribí tu nombre (al menos 2 letras)';
  else if (largo('nombre') > LIMITES.nombre[1]) errores.nombre = 'El nombre no puede superar los 80 caracteres';

  if (!valores.email.trim()) errores.email = 'Escribí tu mail para poder responderte';
  else if (!esEmail(valores.email.trim())) errores.email = 'Revisá el mail: tiene que ser como nombre@ejemplo.com';

  const telefono = largo('telefono');
  if (telefono && (telefono < LIMITES.telefono[0] || telefono > LIMITES.telefono[1])) {
    errores.telefono = 'El teléfono tiene que tener entre 6 y 30 caracteres';
  }

  if (largo('asunto') < LIMITES.asunto[0]) errores.asunto = 'Contanos en pocas palabras sobre qué es la consulta';
  else if (largo('asunto') > LIMITES.asunto[1]) errores.asunto = 'El asunto no puede superar los 120 caracteres';

  if (largo('mensaje') < LIMITES.mensaje[0]) errores.mensaje = 'El mensaje tiene que tener al menos 10 caracteres';
  else if (largo('mensaje') > LIMITES.mensaje[1]) errores.mensaje = 'El mensaje no puede superar los 2000 caracteres';

  return errores;
}

/** La publicacion (y las fechas) por la que se consulta, arriba del formulario. */
function PublicacionConsultada({ publicacion, rango }) {
  const { _id, nombre, tipo, categoria, imagenes } = publicacion;
  const enlace = rango ? `/publicaciones/${_id}?desde=${rango.desde}&hasta=${rango.hasta}` : `/publicaciones/${_id}`;

  return (
    <div className={estilos.consultada}>
      {imagenes?.[0] && <img src={imagenes[0]} alt="" className={estilos.miniatura} />}
      <div>
        <p className={estilos.consultadaEtiqueta}>Tu consulta es sobre</p>
        <p className={estilos.consultadaNombre}>
          <Link to={enlace}>{nombre}</Link>
        </p>
        <p className={estilos.consultadaDato}>
          {TIPOS[tipo]} · {categoria?.nombre}
        </p>
        {rango && (
          <p className={estilos.consultadaFechas}>
            <strong>Fechas:</strong> {resumirRango(rango)}
            <span> No es una reserva: las usamos para responderte con la disponibilidad real.</span>
          </p>
        )}
      </div>
    </div>
  );
}

function Formulario({ publicacion, rango, alEnviar }) {
  const formulario = useRef(null);
  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: asuntoInicial(publicacion),
    mensaje: mensajeInicial(publicacion, rango),
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErrores((e) => ({ ...e, [name]: undefined }));
  };

  const enfocarPrimerError = (encontrados) => {
    const primero = ORDEN_CAMPOS.find((campo) => encontrados[campo]);
    if (primero) formulario.current.elements[primero].focus();
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral(null);

    const encontrados = validar(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      enfocarPrimerError(encontrados);
      return;
    }

    const datos = {
      nombre: valores.nombre.trim(),
      email: valores.email.trim(),
      asunto: valores.asunto.trim(),
      mensaje: valores.mensaje.trim(),
    };
    // El back rechaza el telefono vacio: si no se cargo, no se manda.
    if (valores.telefono.trim()) datos.telefono = valores.telefono.trim();
    if (publicacion) datos.publicacion = publicacion._id;

    setEnviando(true);
    try {
      await enviarConsulta(datos);
      alEnviar(datos);
    } catch (error) {
      const delBack = Object.fromEntries(
        Object.entries(error.porCampo ?? {}).filter(([campo]) => ORDEN_CAMPOS.includes(campo))
      );
      setErrores(delBack);
      setErrorGeneral(error.message);
      enfocarPrimerError(delBack);
      setEnviando(false);
    }
  };

  return (
    <form ref={formulario} className={estilos.formulario} onSubmit={enviar} noValidate>
      {publicacion && <PublicacionConsultada publicacion={publicacion} rango={rango} />}

      {errorGeneral && (
        <p className={estilos.errorGeneral} role="alert">
          {errorGeneral}
        </p>
      )}

      <div className={estilos.fila}>
        <Campo
          etiqueta="Nombre"
          name="nombre"
          autoComplete="name"
          value={valores.nombre}
          onChange={cambiar}
          error={errores.nombre}
          required
        />
        <Campo
          etiqueta="Mail"
          name="email"
          type="email"
          autoComplete="email"
          value={valores.email}
          onChange={cambiar}
          error={errores.email}
          ayuda="Te respondemos a esta dirección."
          required
        />
      </div>

      <div className={estilos.fila}>
        <Campo
          etiqueta="Teléfono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={valores.telefono}
          onChange={cambiar}
          error={errores.telefono}
          ayuda="Si preferís que te llamemos o te escribamos por WhatsApp."
          opcional
        />
        <Campo
          etiqueta="Asunto"
          name="asunto"
          value={valores.asunto}
          onChange={cambiar}
          error={errores.asunto}
          maxLength={LIMITES.asunto[1]}
          required
        />
      </div>

      <Campo
        etiqueta="Mensaje"
        como="textarea"
        name="mensaje"
        rows={7}
        value={valores.mensaje}
        onChange={cambiar}
        error={errores.mensaje}
        maxLength={LIMITES.mensaje[1]}
        ayuda={`${valores.mensaje.length} de ${LIMITES.mensaje[1]} caracteres. Contanos tu experiencia previa y cuántas personas son, así te respondemos mejor.`}
        required
      />

      <div className={estilos.acciones}>
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar consulta'}
        </Boton>
        <p className={estilos.nota}>Consultar no tiene costo ni compromiso.</p>
      </div>
    </form>
  );
}

function Enviada({ datos, alOtraConsulta }) {
  const enfocar = useCallback((titulo) => titulo?.focus(), []);

  return (
    <div className={estilos.enviada}>
      <h2 ref={enfocar} tabIndex={-1}>
        ¡Gracias, {datos.nombre.split(' ')[0]}!
      </h2>
      <p>
        Recibimos tu consulta. Te vamos a responder a <strong>{datos.email}</strong> lo antes posible.
      </p>
      <div className={estilos.enviadaAcciones}>
        <Boton a="/catalogo">Seguir viendo el catálogo</Boton>
        <Boton variante="borde" onClick={alOtraConsulta}>
          Hacer otra consulta
        </Boton>
      </div>
    </div>
  );
}

function DatosDeContacto({ comercio }) {
  if (!comercio) return null;
  const horarios = agruparHorarios(comercio.horarios);
  const redes = enlacesDeRedes(comercio.redes);

  return (
    <aside className={estilos.lateral} aria-labelledby="titulo-otras-formas">
      <h2 id="titulo-otras-formas" className={estilos.tituloLateral}>
        Otras formas de contactarnos
      </h2>
      <address className={estilos.direccion}>
        <p>{comercio.direccion}</p>
        <p>
          <a href={`tel:${comercio.telefono.replace(/[^\d+]/g, '')}`}>{comercio.telefono}</a>
        </p>
        {comercio.email && (
          <p>
            <a href={`mailto:${comercio.email}`}>{comercio.email}</a>
          </p>
        )}
      </address>

      {horarios.length > 0 && (
        <>
          <h3 className={estilos.subtituloLateral}>Horarios de atención</h3>
          <dl className={estilos.horarios}>
            {horarios.map((h) => (
              <div key={h.dias}>
                <dt>{h.dias}</dt>
                <dd>{h.horario}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

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
    </aside>
  );
}

export default function Contacto() {
  const [params, setParams] = useSearchParams();
  const [enviada, setEnviada] = useState(null);

  const idPublicacion = esId(params.get('publicacion')) ? params.get('publicacion') : null;
  const rango = rangoDeUrl(params.get('desde'), params.get('hasta'));

  const pedirPublicacion = useCallback(
    () => (idPublicacion ? obtenerPublicacion(idPublicacion) : Promise.resolve(null)),
    [idPublicacion]
  );
  const publicacion = usePedido(pedirPublicacion);
  const comercio = usePedido(obtenerComercio);

  const otraConsulta = () => {
    setEnviada(null);
    setParams({}, { replace: true });
  };

  // Si el enlace traia una publicacion que no existe, se consulta igual
  // pero sin asociarla, y se avisa.
  const sinPublicacion = Boolean(params.get('publicacion')) && (publicacion.error || !idPublicacion);

  let contenido;
  if (enviada) {
    contenido = <Enviada datos={enviada} alOtraConsulta={otraConsulta} />;
  } else if (publicacion.cargando) {
    contenido = <Cargando />;
  } else {
    contenido = (
      <>
        {sinPublicacion && (
          <p className={estilos.aviso}>
            No encontramos la publicación del enlace. Podés escribirnos igual y contarnos qué estabas buscando.
          </p>
        )}
        <Formulario
          key={publicacion.datos?._id ?? 'libre'}
          publicacion={publicacion.datos}
          rango={rango}
          alEnviar={(datos) => {
            setEnviada(datos);
            window.scrollTo({ top: 0 });
          }}
        />
      </>
    );
  }

  return (
    <div className="contenedor">
      <title>Contacto · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Contacto"
        bajada="Contanos qué te gustaría hacer y te respondemos con disponibilidad, precios y una recomendación."
        publico
      />

      <div className={estilos.disposicion}>
        <div className={estilos.principal}>{contenido}</div>
        <DatosDeContacto comercio={comercio.datos} />
      </div>
    </div>
  );
}
