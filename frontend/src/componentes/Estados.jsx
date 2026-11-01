import Boton from './Boton.jsx';
import estilos from './Estados.module.css';

/** Mientras se espera una respuesta de la API. */
export function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className={estilos.estado} role="status">
      <span className={estilos.indicador} aria-hidden="true" />
      <p>{texto}</p>
    </div>
  );
}

/** La respuesta llego bien pero no hay nada para mostrar. */
export function Vacio({ titulo, children, accion }) {
  return (
    <div className={estilos.estado}>
      <p className={estilos.titulo}>{titulo}</p>
      {children && <p>{children}</p>}
      {accion}
    </div>
  );
}

/** La API fallo. Si hay `alReintentar`, ofrece volver a intentar. */
export function ErrorCarga({ mensaje, alReintentar }) {
  return (
    <div className={`${estilos.estado} ${estilos.error}`} role="alert">
      <p className={estilos.titulo}>No pudimos cargar esta información</p>
      <p>{mensaje}</p>
      {alReintentar && (
        <Boton variante="borde" tamano="chico" onClick={alReintentar}>
          Reintentar
        </Boton>
      )}
    </div>
  );
}
