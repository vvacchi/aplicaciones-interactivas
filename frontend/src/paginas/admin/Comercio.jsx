import { useState } from 'react';
import { Link } from 'react-router';
import { guardarComercio, obtenerComercio } from '../../api/comercio.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import { Cargando, ErrorCarga } from '../../componentes/Estados.jsx';
import { DIAS } from '../../utils/textos.js';
import { errorDeEmail, errorDeLargo, soloErrores } from '../../utils/validaciones.js';
import estilos from './Comercio.module.css';

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Los siete dias, en orden, con lo que haya cargado (o cerrados si no hay nada). */
function horariosIniciales(horarios = []) {
  return Object.keys(DIAS).map((dia) => {
    const h = horarios.find((x) => x.dia === dia);
    return { dia, cerrado: h ? h.cerrado : true, desde: h?.desde ?? '', hasta: h?.hasta ?? '' };
  });
}

function desdeComercio(c) {
  return {
    nombre: c?.nombre ?? '',
    descripcion: c?.descripcion ?? '',
    direccion: c?.direccion ?? '',
    telefono: c?.telefono ?? '',
    email: c?.email ?? '',
    instagram: c?.redes?.instagram ?? '',
    facebook: c?.redes?.facebook ?? '',
    whatsapp: c?.redes?.whatsapp ?? '',
    horarios: horariosIniciales(c?.horarios),
  };
}

/** Errores de cada dia, por indice. Mismas reglas que comercio.validacion.js. */
function erroresDeHorarios(horarios) {
  return horarios.map((h) => {
    if (h.cerrado) return null;
    if (!HORA.test(h.desde) || !HORA.test(h.hasta)) return 'Completá la hora de apertura y de cierre';
    if (h.desde >= h.hasta) return 'El cierre tiene que ser después de la apertura';
    return null;
  });
}

function validar(v, { emailOriginal }) {
  const horarios = erroresDeHorarios(v.horarios);
  return soloErrores({
    nombre: errorDeLargo(v.nombre, [2, 120], {
      vacio: 'Escribí el nombre del comercio',
      corto: 'El nombre tiene que tener al menos 2 caracteres',
      largo: 'El nombre no puede superar los 120 caracteres',
    }),
    descripcion: errorDeLargo(v.descripcion, [20, 2000], {
      vacio: 'Escribí una descripción',
      corto: 'La descripción tiene que tener al menos 20 caracteres',
      largo: 'La descripción no puede superar los 2000 caracteres',
    }),
    direccion: errorDeLargo(v.direccion, [5, 200], {
      vacio: 'Escribí la dirección',
      corto: 'La dirección tiene que tener al menos 5 caracteres',
      largo: 'La dirección no puede superar los 200 caracteres',
    }),
    telefono: errorDeLargo(v.telefono, [6, 30], {
      vacio: 'Escribí un teléfono',
      corto: 'El teléfono tiene que tener al menos 6 caracteres',
      largo: 'El teléfono no puede superar los 30 caracteres',
    }),
    // El PUT no permite borrar un mail ya cargado (el back lo valida como mail).
    email: v.email.trim()
      ? errorDeEmail(v.email)
      : emailOriginal
        ? 'El mail ya cargado no se puede borrar: escribí el actual o uno nuevo'
        : null,
    instagram: v.instagram.trim().length > 120 ? 'No puede superar los 120 caracteres' : null,
    facebook: v.facebook.trim().length > 120 ? 'No puede superar los 120 caracteres' : null,
    whatsapp: v.whatsapp.trim().length > 40 ? 'No puede superar los 40 caracteres' : null,
    horarios: horarios.some(Boolean) ? 'Revisá los horarios marcados' : null,
  });
}

function aDatos(v) {
  const datos = {
    nombre: v.nombre.trim(),
    descripcion: v.descripcion.trim(),
    direccion: v.direccion.trim(),
    telefono: v.telefono.trim(),
    // Vacias se mandan igual: es la forma de borrar una red que ya estaba.
    redes: { instagram: v.instagram.trim(), facebook: v.facebook.trim(), whatsapp: v.whatsapp.trim() },
    horarios: v.horarios.map(({ dia, cerrado, desde, hasta }) => (cerrado ? { dia, cerrado } : { dia, cerrado, desde, hasta })),
  };
  if (v.email.trim()) datos.email = v.email.trim();
  return datos;
}

/** "redes.instagram" -> "instagram"; "horarios.3.hasta" -> "horarios". */
function traducirErroresDelBack(error) {
  if (!error.porCampo) return;
  error.porCampo = Object.fromEntries(
    Object.entries(error.porCampo).map(([campo, mensaje]) => [
      campo.replace(/^redes\./, '').replace(/^horarios\..*/, 'horarios'),
      mensaje,
    ])
  );
}

function Horarios({ horarios, intentoEnvio, alCambiar, error }) {
  // Los errores por dia se muestran recien despues del primer intento de guardar.
  const errores = intentoEnvio ? erroresDeHorarios(horarios) : [];

  const cambiarDia = (i, cambios) => alCambiar(horarios.map((h, j) => (j === i ? { ...h, ...cambios } : h)));

  return (
    <div className={estilos.horarios}>
      {error && <p className={estilos.error}>{error}</p>}
      <ul>
        {horarios.map((h, i) => (
          <li key={h.dia} className={errores[i] ? estilos.diaConError : ''}>
            <span className={estilos.dia} id={`dia-${h.dia}`}>
              {DIAS[h.dia]}
            </span>
            <label className={estilos.abierto}>
              <input
                type="checkbox"
                name="horarios"
                checked={!h.cerrado}
                onChange={(e) => cambiarDia(i, { cerrado: !e.target.checked })}
                aria-describedby={`dia-${h.dia}`}
              />
              Abierto
            </label>
            {h.cerrado ? (
              <span className={estilos.cerrado}>Cerrado</span>
            ) : (
              <span className={estilos.horas}>
                <label>
                  <span className="solo-lector">{DIAS[h.dia]}: abre a las</span>
                  <input type="time" value={h.desde} onChange={(e) => cambiarDia(i, { desde: e.target.value })} />
                </label>
                <span aria-hidden="true">a</span>
                <label>
                  <span className="solo-lector">{DIAS[h.dia]}: cierra a las</span>
                  <input type="time" value={h.hasta} onChange={(e) => cambiarDia(i, { hasta: e.target.value })} />
                </label>
              </span>
            )}
            {errores[i] && <span className={estilos.errorDia}>{errores[i]}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Formulario({ comercio }) {
  const [guardado, setGuardado] = useState(false);
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [actual, setActual] = useState(comercio);

  const form = useFormulario({
    inicial: desdeComercio(comercio),
    validar: (v) => validar(v, { emailOriginal: actual?.email }),
    alEnviar: async (valores) => {
      try {
        setActual(await guardarComercio(aDatos(valores)));
        setGuardado(true);
      } catch (error) {
        traducirErroresDelBack(error);
        throw error;
      }
    },
  });

  const { valores, errores } = form;
  const campo = (nombre) => ({
    name: nombre,
    value: valores[nombre],
    error: errores[nombre],
    onChange: (e) => {
      setGuardado(false);
      form.cambiar(e);
    },
  });

  const enviar = (evento) => {
    setIntentoEnvio(true);
    setGuardado(false);
    form.enviar(evento);
  };

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate>
      {!comercio && (
        <Aviso variante="advertencia">
          Todavía no hay datos del comercio: hasta que los guardes, el sitio no muestra la sección «Nosotros» ni los
          horarios.
        </Aviso>
      )}
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}

      <fieldset className={estilos.seccion}>
        <legend className={estilos.tituloSeccion}>Presentación</legend>
        <Campo etiqueta="Nombre" {...campo('nombre')} maxLength={120} required />
        <Campo
          etiqueta="Descripción"
          como="textarea"
          rows={6}
          {...campo('descripcion')}
          maxLength={2000}
          ayuda={`${valores.descripcion.length} de 2000 caracteres. Es el texto de «Nosotros» en la portada.`}
          required
        />
      </fieldset>

      <fieldset className={estilos.seccion}>
        <legend className={estilos.tituloSeccion}>Contacto</legend>
        <Campo etiqueta="Dirección" {...campo('direccion')} maxLength={200} required />
        <div className={estilos.fila}>
          <Campo etiqueta="Teléfono" type="tel" {...campo('telefono')} required />
          <Campo etiqueta="Mail" type="email" {...campo('email')} opcional />
        </div>
      </fieldset>

      <fieldset className={estilos.seccion}>
        <legend className={estilos.tituloSeccion}>Redes</legend>
        <p className={estilos.bajada}>Usuario o dirección completa. Las que dejes vacías no se muestran en el sitio.</p>
        <div className={estilos.fila}>
          <Campo etiqueta="Instagram" {...campo('instagram')} placeholder="@andesvertical" opcional />
          <Campo etiqueta="Facebook" {...campo('facebook')} placeholder="andesvertical" opcional />
          <Campo etiqueta="WhatsApp" type="tel" {...campo('whatsapp')} placeholder="+54 9 294 …" opcional />
        </div>
      </fieldset>

      <fieldset className={estilos.seccion}>
        <legend className={estilos.tituloSeccion}>Horarios de atención</legend>
        <Horarios
          horarios={valores.horarios}
          intentoEnvio={intentoEnvio}
          error={errores.horarios}
          alCambiar={(horarios) => {
            setGuardado(false);
            form.setValores((v) => ({ ...v, horarios }));
            form.limpiarError('horarios');
          }}
        />
      </fieldset>

      {guardado && (
        <Aviso variante="exito">
          Guardado. Los cambios ya se ven en el sitio. <Link to="/">Ver la portada</Link>
        </Aviso>
      )}

      <div className={estilos.acciones}>
        <Boton type="submit" disabled={form.enviando}>
          {form.enviando ? 'Guardando…' : 'Guardar cambios'}
        </Boton>
      </div>
    </form>
  );
}

export default function Comercio() {
  const { datos, error, cargando, recargar } = usePedido(obtenerComercio);
  // 404: todavia no hay ficha; el formulario arranca vacio y el PUT la crea.
  const sinFicha = error?.estado === 404;

  let contenido;
  if (cargando) contenido = <Cargando />;
  else if (error && !sinFicha) contenido = <ErrorCarga mensaje={error.message} alReintentar={recargar} />;
  else contenido = <Formulario comercio={sinFicha ? null : datos} />;

  return (
    <>
      <title>Comercio · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Datos del comercio"
        bajada="Lo que el sitio muestra en la portada y en la página de contacto."
      />
      {contenido}
    </>
  );
}
