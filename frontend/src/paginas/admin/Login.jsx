import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useAuth } from '../../contexto/AuthContext.jsx';

// Version minima para probar la sesion; el diseño llega en el bloque de auth.
export default function Login() {
  const { usuario, login } = useAuth();
  const ubicacion = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Vuelve a la ruta que pidio antes de que lo mandaran al login.
  const destino = ubicacion.state?.desde?.pathname ?? '/admin';

  if (usuario) return <Navigate to={destino} replace />;

  const enviar = async (evento) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login({ email, password });
      // Con el usuario cargado, el <Navigate> de arriba hace la redireccion.
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  };

  return (
    <section>
      <h1>Ingresar al panel</h1>
      <form onSubmit={enviar} noValidate>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error?.porCampo?.email && <p>{error.porCampo.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error?.porCampo?.password && <p>{error.porCampo.password}</p>}
        </div>
        {error && <p role="alert">{error.message}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p>
        <Link to="/admin/registro">Crear cuenta</Link> ·{' '}
        <Link to="/recuperar-password">Olvidé mi contraseña</Link>
      </p>
    </section>
  );
}
