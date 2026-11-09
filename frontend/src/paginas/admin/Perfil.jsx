import { useState } from 'react';
import { useAuth } from '../../contexto/AuthContext.jsx';
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

const CAMPOS_DATOS = ['nombre', 'apellido', 'email', 'telefono'];

const validarDatos = (v) =>
  soloErrores({
    nombre: errorDeLargo(v.nombre, [2, 60], {
      vacio: 'El nombre no puede quedar vacío',
      corto: 'El nombre tiene que tener al menos 2 letras',
      largo: 'El nombre no puede superar los 60 caracteres',
    }),
    apellido: errorDeLargo(v.apellido, [2, 60], {
      vacio: 'El apellido no puede quedar vacío',
      corto: 'El apellido tiene que tener al menos 2 letras',
      largo: 'El apellido no puede superar los 60 caracteres',
    }),
    email: errorDeEmail(v.email),
    telefono: errorDeLargo(v.telefono, [6, 30], {
      vacio: 'El teléfono no puede quedar vacío',
      corto: 'El teléfono tiene que tener al menos 6 caracteres',
      largo: 'El teléfono no puede superar los 30 caracteres',
    }),
  });

function DatosPersonales({ usuario }) {
  const { actualizarPerfil } = useAuth();
  const [confirmacion, setConfirmacion] = useState(null);

  const form = useFormulario({
    inicial: Object.fromEntries(CAMPOS_DATOS.map((campo) => [campo, usuario[campo] ?? ''])),
    validar: validarDatos,
    alEnviar: async (valores) => {
      // Solo viaja lo que cambio: el back pide al menos un campo.
      const cambios = Object.fromEntries(
        CAMPOS_DATOS.map((campo) => [campo, valores[campo].trim()]).filter(
          ([campo, valor]) => valor !== (usuario[campo] ?? '')
        )
      );
      if (Object.keys(cambios).length === 0) {
        setConfirmacion('No había cambios para guardar.');
        return;
      }
      try {
        await actualizarPerfil(cambios);
        setConfirmacion('Tus datos quedaron guardados.');
      } catch (error) {
        if (error.estado === 409) {
          form.marcarErrores({ email: 'Ya hay otra cuenta con este mail' });
          return;
        }
        throw error;
      }
    },
  });

  const cambiar = (evento) => {
    setConfirmacion(null);
    form.cambiar(evento);
  };

  return (
    <section className={estilos.tarjeta} aria-labelledby="titulo-datos">
      <h2 id="titulo-datos" className={estilos.titulo}>
        Datos personales
      </h2>
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}
      {confirmacion && <Aviso variante="exito">{confirmacion}</Aviso>}

      <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
        <div className={estilos.fila}>
          <Campo
            etiqueta="Nombre"
            name="nombre"
            autoComplete="given-name"
            value={form.valores.nombre}
            onChange={cambiar}
            error={form.errores.nombre}
            required
          />
          <Campo
            etiqueta="Apellido"
            name="apellido"
            autoComplete="family-name"
            value={form.valores.apellido}
            onChange={cambiar}
            error={form.errores.apellido}
            required
          />
        </div>
        <div className={estilos.fila}>
          <Campo
            etiqueta="Mail"
            name="email"
            type="email"
            autoComplete="email"
            value={form.valores.email}
            onChange={cambiar}
            error={form.errores.email}
            ayuda="Es el que usás para ingresar."
            required
          />
          <Campo
            etiqueta="Teléfono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={form.valores.telefono}
            onChange={cambiar}
            error={form.errores.telefono}
            required
          />
        </div>
        <div className={estilos.acciones}>
          <Boton type="submit" disabled={form.enviando}>
            {form.enviando ? 'Guardando…' : 'Guardar cambios'}
          </Boton>
        </div>
      </form>
    </section>
  );
}

const VACIO_PASSWORD = { passwordActual: '', password: '', repetir: '' };

function CambiarPassword() {
  const { actualizarPerfil } = useAuth();
  const [guardado, setGuardado] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const form = useFormulario({
    inicial: VACIO_PASSWORD,
    validar: (v) =>
      soloErrores({
        passwordActual: v.passwordActual ? null : 'Escribí tu contraseña actual',
        password: errorDePassword(v.password),
        repetir: v.repetir === v.password ? null : 'Las contraseñas no coinciden',
      }),
    alEnviar: async ({ passwordActual, password }) => {
      try {
        await actualizarPerfil({ passwordActual, password });
        form.setValores(VACIO_PASSWORD);
        setGuardado(true);
      } catch (error) {
        // El back responde 400 sin detalle por campo cuando la actual no coincide.
        if (error.estado === 400 && !error.errores?.length) {
          form.marcarErrores({ passwordActual: 'La contraseña actual no es correcta' });
          return;
        }
        throw error;
      }
    },
  });

  const cambiar = (evento) => {
    setGuardado(false);
    form.cambiar(evento);
  };

  const tipoPassword = verPassword ? 'text' : 'password';

  return (
    <section className={estilos.tarjeta} aria-labelledby="titulo-password">
      <h2 id="titulo-password" className={estilos.titulo}>
        Cambiar contraseña
      </h2>
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}
      {guardado && <Aviso variante="exito">Listo, tu contraseña cambió. La próxima vez ingresá con la nueva.</Aviso>}

      <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
        <Campo
          etiqueta="Contraseña actual"
          name="passwordActual"
          type={tipoPassword}
          autoComplete="current-password"
          value={form.valores.passwordActual}
          onChange={cambiar}
          error={form.errores.passwordActual}
          className={estilos.medio}
          required
        />
        <div className={estilos.fila}>
          <Campo
            etiqueta="Contraseña nueva"
            name="password"
            type={tipoPassword}
            autoComplete="new-password"
            value={form.valores.password}
            onChange={cambiar}
            error={form.errores.password}
            ayuda={REGLA_PASSWORD}
            required
          />
          <Campo
            etiqueta="Repetí la contraseña nueva"
            name="repetir"
            type={tipoPassword}
            autoComplete="new-password"
            value={form.valores.repetir}
            onChange={cambiar}
            error={form.errores.repetir}
            required
          />
        </div>
        <label className={estilos.mostrar}>
          <input type="checkbox" checked={verPassword} onChange={(e) => setVerPassword(e.target.checked)} />
          Mostrar contraseñas
        </label>
        <div className={estilos.acciones}>
          <Boton type="submit" disabled={form.enviando}>
            {form.enviando ? 'Guardando…' : 'Cambiar contraseña'}
          </Boton>
        </div>
      </form>
    </section>
  );
}

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <>
      <title>Mi perfil · Andes Vertical</title>
      <EncabezadoPagina titulo="Mi perfil" bajada="Tus datos de acceso al panel." />
      <div className={estilos.secciones}>
        <DatosPersonales usuario={usuario} />
        <CambiarPassword />
      </div>
    </>
  );
}
