import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useAuth } from '../../contexto/AuthContext.jsx';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import PantallaAcceso from '../../componentes/PantallaAcceso.jsx';
import { errorDeEmail, soloErrores } from '../../utils/validaciones.js';
import estilos from '../../componentes/PantallaAcceso.module.css';

const validar = ({ email, password }) =>
  soloErrores({
    email: errorDeEmail(email),
    password: password ? null : 'Escribí tu contraseña',
  });

export default function Login() {
  const { usuario, login } = useAuth();
  const ubicacion = useLocation();
  const [verPassword, setVerPassword] = useState(false);

  // Vuelve a la ruta que pidio antes de que lo mandaran al login.
  const desde = ubicacion.state?.desde;
  const destino = desde ? `${desde.pathname}${desde.search ?? ''}` : '/admin';

  const form = useFormulario({
    inicial: { email: '', password: '' },
    validar,
    alEnviar: async ({ email, password }) => {
      try {
        await login({ email: email.trim(), password });
        // Con el usuario cargado, el <Navigate> de abajo hace la redireccion.
      } catch (error) {
        // El back usa el mismo 401 para mail inexistente y contraseña mal.
        if (error.estado === 401) error.message = 'El mail o la contraseña no son correctos.';
        throw error;
      }
    },
  });

  if (usuario) return <Navigate to={destino} replace />;

  return (
    <PantallaAcceso
      titulo="Ingresar al panel"
      bajada="Administrá publicaciones, categorías y consultas."
      pie={
        <>
          ¿Todavía no tenés cuenta? <Link to="/admin/registro">Creá una</Link>
        </>
      }
    >
      {desde && !form.errorGeneral && (
        <Aviso variante="advertencia">Ingresá para continuar. Si tu sesión venció, volvé a entrar.</Aviso>
      )}
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}

      <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
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
          etiqueta="Contraseña"
          name="password"
          type={verPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={form.valores.password}
          onChange={form.cambiar}
          error={form.errores.password}
          required
        />
        <Link to="/recuperar-password" className={estilos.olvido}>
          ¿Olvidaste tu contraseña?
        </Link>
        <label className={estilos.mostrar}>
          <input type="checkbox" checked={verPassword} onChange={(e) => setVerPassword(e.target.checked)} />
          Mostrar contraseña
        </label>
        <Boton type="submit" disabled={form.enviando}>
          {form.enviando ? 'Ingresando…' : 'Ingresar'}
        </Boton>
      </form>
    </PantallaAcceso>
  );
}
