import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api.js';
import {
  borrarToken,
  guardarToken,
  leerToken,
  registrarExpiracionSesion,
} from '../api/cliente.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Arranca en true solo si hay un token que validar: asi un refresh en
  // una ruta protegida no rebota al login antes de saber si la sesion sirve.
  const [cargando, setCargando] = useState(() => Boolean(leerToken()));

  const cerrarSesion = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  // Si el back rechaza el token en cualquier llamada, la sesion se cierra
  // y la ruta protegida se encarga de mandar al login.
  useEffect(() => {
    registrarExpiracionSesion(() => setUsuario(null));
    return () => registrarExpiracionSesion(() => {});
  }, []);

  useEffect(() => {
    if (!leerToken()) return;

    let vigente = true;
    authApi
      .obtenerPerfil()
      .then((perfil) => {
        if (vigente) setUsuario(perfil);
      })
      .catch(() => {
        // Token vencido o back caido: en los dos casos no hay sesion usable.
        if (vigente) setUsuario(null);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (sesion) => {
    guardarToken(sesion.token);
    setUsuario(sesion.usuario);
    return sesion.usuario;
  }, []);

  const login = useCallback(
    async (credenciales) => iniciarSesion(await authApi.login(credenciales)),
    [iniciarSesion]
  );

  const registrar = useCallback(
    async (datos) => iniciarSesion(await authApi.registrar(datos)),
    [iniciarSesion]
  );

  const valor = useMemo(
    () => ({ usuario, cargando, login, registrar, logout: cerrarSesion }),
    [usuario, cargando, login, registrar, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth tiene que usarse dentro de <AuthProvider>');
  }
  return contexto;
}
