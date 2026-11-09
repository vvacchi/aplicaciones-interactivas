import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { recuperarPassword } from '../../api/auth.api.js';
import { useAuth } from '../../contexto/AuthContext.jsx';
import { useFormulario } from '../../hooks/useFormulario.js';
import Aviso from '../../componentes/Aviso.jsx';
import Boton from '../../componentes/Boton.jsx';
import Campo from '../../componentes/Campo.jsx';
import PantallaAcceso from '../../componentes/PantallaAcceso.jsx';
import { REGLA_PASSWORD, errorDeEmail, errorDePassword, soloErrores } from '../../utils/validaciones.js';
import estilos from '../../componentes/PantallaAcceso.module.css';

const PIE = (
  <>
    ¿Te acordaste? <Link to="/admin/login">Volver a ingresar</Link>
  </>
);

/** Sin token: se pide el mail y el back manda el enlace. */
function PedirEnlace() {
  const [enviadoA, setEnviadoA] = useState(null);
  const enfocar = useCallback((titulo) => titulo?.focus(), []);

  const form = useFormulario({
    inicial: { email: '' },
    validar: ({ email }) => soloErrores({ email: errorDeEmail(email) }),
    alEnviar: async ({ email }) => {
      await recuperarPassword(email.trim());
      setEnviadoA(email.trim());
    },
  });

  if (enviadoA) {
    return (
      <PantallaAcceso titulo="Revisá tu mail" pie={PIE}>
        {/* El back responde lo mismo exista o no la cuenta, y el texto tambien. */}
        <p ref={enfocar} tabIndex={-1}>
          Si <strong>{enviadoA}</strong> tiene una cuenta, te mandamos un enlace para elegir una contraseña
          nueva. Vence en 60 minutos.
        </p>
        <p className={estilos.nota}>¿No llegó? Fijate en la carpeta de spam o pedí otro enlace.</p>
        <Boton variante="borde" onClick={() => setEnviadoA(null)}>
          Pedir otro enlace
        </Boton>
      </PantallaAcceso>
    );
  }

  return (
    <PantallaAcceso
      titulo="Recuperar contraseña"
      bajada="Escribí el mail de tu cuenta y te mandamos un enlace para elegir una contraseña nueva."
      pie={PIE}
    >
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
        <Boton type="submit" disabled={form.enviando}>
          {form.enviando ? 'Enviando…' : 'Enviar enlace'}
        </Boton>
      </form>
    </PantallaAcceso>
  );
}

/** Con token (el enlace del mail): se elige la contraseña nueva. */
function ElegirPassword({ token }) {
  const { restablecerPassword } = useAuth();
  const navegar = useNavigate();
  const [verPassword, setVerPassword] = useState(false);
  const [enlaceVencido, setEnlaceVencido] = useState(false);

  const form = useFormulario({
    inicial: { password: '', repetir: '' },
    validar: ({ password, repetir }) =>
      soloErrores({
        password: errorDePassword(password),
        repetir: repetir === password ? null : 'Las contraseñas no coinciden',
      }),
    alEnviar: async ({ password }) => {
      try {
        await restablecerPassword({ token, password });
        navegar('/admin', { replace: true });
      } catch (error) {
        // 401: el token no existe, ya se uso o paso la hora de vigencia.
        if (error.estado === 401) {
          setEnlaceVencido(true);
          return;
        }
        throw error;
      }
    },
  });

  if (enlaceVencido) {
    return (
      <PantallaAcceso titulo="El enlace ya no sirve" pie={PIE}>
        <p>
          Los enlaces para cambiar la contraseña duran 60 minutos y se pueden usar una sola vez. Pedí uno
          nuevo y usalo apenas te llegue.
        </p>
        <Boton a="/recuperar-password">Pedir un enlace nuevo</Boton>
      </PantallaAcceso>
    );
  }

  const tipoPassword = verPassword ? 'text' : 'password';

  return (
    <PantallaAcceso titulo="Elegí una contraseña nueva" bajada="Después de guardarla vas a entrar directo al panel." pie={PIE}>
      {form.errorGeneral && <Aviso>{form.errorGeneral}</Aviso>}
      <form className={estilos.formulario} onSubmit={form.enviar} noValidate>
        <Campo
          etiqueta="Contraseña nueva"
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
          {form.enviando ? 'Guardando…' : 'Guardar contraseña'}
        </Boton>
      </form>
    </PantallaAcceso>
  );
}

/** El mail de recuperacion apunta aca: resuelve los dos pasos segun haya token o no. */
export default function RecuperarPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  return token ? <ElegirPassword key={token} token={token} /> : <PedirEnlace />;
}
