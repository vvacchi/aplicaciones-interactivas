import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../../contexto/AuthContext.jsx';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import PantallaAcceso from '../../componentes/PantallaAcceso.jsx';
import {
  REGLA_PASSWORD,
  errorDeEmail,
  errorDeLargo,
  errorDePassword,
  soloErrores,
} from '../../utils/validaciones.js';
import estilos from '../../componentes/PantallaAcceso.module.css';

// Mismos limites que registroSchema en el back.
const validar = (v) =>
  soloErrores({
    nombre: errorDeLargo(v.nombre, [2, 60], {
      vacio: 'Escribí tu nombre',
      corto: 'El nombre tiene que tener al menos 2 letras',
      largo: 'El nombre no puede superar los 60 caracteres',
    }),
    apellido: errorDeLargo(v.apellido, [2, 60], {
      vacio: 'Escribí tu apellido',
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

export default function Registro() {
  const { usuario, registrar } = useAuth();
  const [verPassword, setVerPassword] = useState(false);

  const form = useFormulario({
    inicial: { nombre: '', apellido: '', email: '', telefono: '', password: '', repetir: '' },
    validar,
    alEnviar: async ({ repetir: _repetir, ...datos }) => {
      try {
        await registrar({
          nombre: datos.nombre.trim(),
          apellido: datos.apellido.trim(),
          email: datos.email.trim(),
          telefono: datos.telefono.trim(),
          password: datos.password,
        });
      } catch (error) {
        if (error.estado === 409) {
          form.marcarErrores({ email: 'Ya hay una cuenta con este mail. Probá ingresar o recuperar la contraseña.' });
          return;
        }
        throw error;
      }
    },
  });

  // Al registrarse queda con la sesion abierta.
  if (usuario) return <Navigate to="/admin" replace />;

  const tipoPassword = verPassword ? 'text' : 'password';

  return (
    <PantallaAcceso
      titulo="Crear cuenta"
      bajada="Cuenta para administrar el sitio de Andes Vertical."
      pie={
        <>
          ¿Ya tenés cuenta? <Link to="/admin/login">Ingresá</Link>
        </>
      }
    >
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}

      <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
        <Campo
          etiqueta="Nombre"
          name="nombre"
          autoComplete="given-name"
          value={form.valores.nombre}
          onChange={form.cambiar}
          error={form.errores.nombre}
          required
        />
        <Campo
          etiqueta="Apellido"
          name="apellido"
          autoComplete="family-name"
          value={form.valores.apellido}
          onChange={form.cambiar}
          error={form.errores.apellido}
          required
        />
        <Campo
          etiqueta="Mail"
          name="email"
          type="email"
          autoComplete="email"
          value={form.valores.email}
          onChange={form.cambiar}
          error={form.errores.email}
          required
        />
        <Campo
          etiqueta="Teléfono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={form.valores.telefono}
          onChange={form.cambiar}
          error={form.errores.telefono}
          required
        />
        <Campo
          etiqueta="Contraseña"
          name="password"
          type={tipoPassword}
          autoComplete="new-password"
          value={form.valores.password}
          onChange={form.cambiar}
          error={form.errores.password}
          ayuda={REGLA_PASSWORD}
          required
        />
        <Campo
          etiqueta="Repetí la contraseña"
          name="repetir"
          type={tipoPassword}
          autoComplete="new-password"
          value={form.valores.repetir}
          onChange={form.cambiar}
          error={form.errores.repetir}
          required
        />
        <label className={estilos.mostrar}>
          <input type="checkbox" checked={verPassword} onChange={(e) => setVerPassword(e.target.checked)} />
          Mostrar contraseñas
        </label>
        <Boton type="submit" disabled={form.enviando}>
          {form.enviando ? 'Creando la cuenta…' : 'Crear cuenta'}
        </Boton>
      </form>
    </PantallaAcceso>
  );
}
