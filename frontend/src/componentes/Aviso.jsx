import estilos from './Aviso.module.css';

/**
 * Mensaje en linea dentro de una pantalla: el error general de un
 * formulario, la confirmacion de que se guardo o una advertencia.
 * variante: error | exito | advertencia
 */
export default function Aviso({ variante = 'error', children, className = '' }) {
  // El error y la confirmacion se anuncian solos al lector de pantalla.
  const rol = variante === 'error' ? 'alert' : variante === 'exito' ? 'status' : undefined;

  return (
    <p className={`${estilos.aviso} ${estilos[variante]} ${className}`} role={rol}>
      {children}
    </p>
  );
}
