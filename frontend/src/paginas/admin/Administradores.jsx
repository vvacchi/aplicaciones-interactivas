import { useState } from 'react';
import { registrar } from '../../api/auth.api.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import {
  REGLA_PASSWORD,
  errorDeEmail,
  errorDeLargo,
  errorDePassword,
  soloErrores,
} from '../../utils/validaciones.js';
import estilos from './Perfil.module.css';

const VACIO = { nombre: '', apellido: '', email: '', telefono: '', password: '', repetir: '' };

// Mismos limites que registroSchema en el back.
const validar = (v) =>
  soloErrores({
    nombre: errorDeLargo(v.nombre, [2, 60], {
      vacio: 'Escribí el nombre',
      corto: 'El nombre tiene que tener al menos 2 letras',
      largo: 'El nombre no puede superar los 60 caracteres',
    }),
    apellido: errorDeLargo(v.apellido, [2, 60], {
      vacio: 'Escribí el apellido',
      corto: 'El apellido tiene que tener al menos 2 letras',
      largo: 'El apellido no puede superar los 60 caracteres',
    }),
    email: errorDeEmail(v.email),
    telefono: errorDeLargo(v.telefono, [6, 30], {
      vacio: 'Escribí un teléfono de contacto',
      corto: 'El teléfono tiene que tener al menos 6 caracteres',
      largo: 'El teléfono no puede superar los 30 caracteres',
    }),
    password: errorDePassword(v.password),
    repetir: v.repetir === v.password ? null : 'Las contraseñas no coinciden',
  });

/**
 * Alta de administradores. El registro no es publico: solo un admin con
 * sesion puede crear otro, y quien lo crea sigue con su propia sesion.
 */
export default function Administradores() {
  const [verPassword, setVerPassword] = useState(false);
  const [creado, setCreado] = useState(null);

  const form = useFormulario({
    inicial: VACIO,
    validar,
    alEnviar: async ({ repetir: _repetir, ...datos }) => {
      try {
        const usuario = await registrar({
          nombre: datos.nombre.trim(),
          apellido: datos.apellido.trim(),
          email: datos.email.trim(),
          telefono: datos.telefono.trim(),
          password: datos.password,
        });
        setCreado(usuario);
        form.setValores(VACIO);
      } catch (error) {
        if (error.estado === 409) {
          form.marcarErrores({ email: 'Ya hay una cuenta con este mail' });
          return;
        }
        throw error;
      }
    },
  });

  const cambiar = (evento) => {
    setCreado(null);
    form.cambiar(evento);
  };
  const campo = (nombre) => ({ name: nombre, value: form.valores[nombre], onChange: cambiar, error: form.errores[nombre] });
  const tipoPassword = verPassword ? 'text' : 'password';

  return (
    <>
      <title>Agregar administrador · Panel · Andes Vertical</title>
      <EncabezadoPagina
        titulo="Agregar administrador"
        bajada="Creá una cuenta para que otra persona del equipo pueda entrar al panel."
      />
      <div className={estilos.secciones}>
        <section className={estilos.tarjeta} aria-labelledby="titulo-alta">
          <h2 id="titulo-alta" className={estilos.titulo}>
            Datos de la nueva cuenta
          </h2>
          {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}
          {creado && (
            <Aviso variante="exito">
              Listo: {creado.nombre} {creado.apellido} ya puede ingresar con {creado.email} y la contraseña que
              elegiste. Pasásela por un medio seguro y pedile que la cambie desde «Perfil».
            </Aviso>
          )}

          <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
            <div className={estilos.fila}>
              <Campo etiqueta="Nombre" autoComplete="off" {...campo('nombre')} required />
              <Campo etiqueta="Apellido" autoComplete="off" {...campo('apellido')} required />
            </div>
            <div className={estilos.fila}>
              <Campo etiqueta="Mail" type="email" autoComplete="off" {...campo('email')} ayuda="Es el que va a usar para ingresar." required />
              <Campo etiqueta="Teléfono" type="tel" autoComplete="off" {...campo('telefono')} required />
            </div>
            <div className={estilos.fila}>
              <Campo
                etiqueta="Contraseña inicial"
                type={tipoPassword}
                autoComplete="new-password"
                {...campo('password')}
                ayuda={REGLA_PASSWORD}
                required
              />
              <Campo
                etiqueta="Repetí la contraseña"
                type={tipoPassword}
                autoComplete="new-password"
                {...campo('repetir')}
                required
              />
            </div>
            <label className={estilos.mostrar}>
              <input type="checkbox" checked={verPassword} onChange={(e) => setVerPassword(e.target.checked)} />
              Mostrar contraseñas
            </label>
            <div className={estilos.acciones}>
              <Boton type="submit" disabled={form.enviando}>
                {form.enviando ? 'Creando la cuenta…' : 'Crear cuenta'}
              </Boton>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
