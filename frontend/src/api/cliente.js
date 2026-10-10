/**
 * Unico punto de salida hacia la API. Ningun componente llama a `fetch`
 * directo: todo pasa por aca para que el token, los errores y el cierre
 * de sesion por 401 se resuelvan en un solo lugar.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

const CLAVE_TOKEN = 'token';

export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN);

/**
 * Error que entiende el resto del front. `errores` es la lista
 * `{ campo, mensaje }` que manda el back en los 400 de validacion;
 * `porCampo` la deja indexada para mostrarla debajo de cada input.
 */
export class ErrorApi extends Error {
  constructor({ estado, mensaje, errores = [] }) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
    this.errores = errores;
    this.porCampo = Object.fromEntries(
      errores
        .filter((e) => typeof e === 'object' && e.campo)
        .map((e) => [e.campo, e.mensaje])
    );
  }
}

// El AuthContext registra aca que hacer cuando el back rechaza la sesion.
let alExpirarSesion = () => {};
export const registrarExpiracionSesion = (callback) => {
  alExpirarSesion = callback;
};

/** Arma el query string salteando los valores vacios. */
const armarQuery = (params) => {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      query.append(clave, valor);
    }
  });
  const texto = query.toString();
  return texto ? `?${texto}` : '';
};

const leerCuerpo = async (respuesta) => {
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
};

export const peticion = async (ruta, { metodo = 'GET', cuerpo, params } = {}) => {
  const token = leerToken();
  const headers = {};
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}${armarQuery(params)}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi({
      estado: 0,
      mensaje: 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.',
    });
  }

  const datos = await leerCuerpo(respuesta);

  if (!respuesta.ok) {
    // Solo un 401 con token enviado significa sesion vencida. Un 401 sin
    // token (por ejemplo, credenciales incorrectas en el login) es un
    // error comun que tiene que mostrar el formulario.
    if (respuesta.status === 401 && token) {
      borrarToken();
      alExpirarSesion();
    }
    throw new ErrorApi({
      estado: respuesta.status,
      mensaje: datos?.mensaje ?? 'Ocurrió un error inesperado. Intentá de nuevo.',
      errores: datos?.errores,
    });
  }

  return datos;
};

export const get = (ruta, params) => peticion(ruta, { params });
export const post = (ruta, cuerpo) => peticion(ruta, { metodo: 'POST', cuerpo });
export const put = (ruta, cuerpo) => peticion(ruta, { metodo: 'PUT', cuerpo });
export const del = (ruta) => peticion(ruta, { metodo: 'DELETE' });
