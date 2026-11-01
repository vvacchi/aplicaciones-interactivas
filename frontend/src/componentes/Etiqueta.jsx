import estilos from './Etiqueta.module.css';

/**
 * Etiqueta corta sobre fotos o en tablas.
 * variante: primario | neutra | exito | aviso | error
 */
export default function Etiqueta({ variante = 'primario', className = '', children }) {
  return <span className={`${estilos.etiqueta} ${estilos[variante]} ${className}`}>{children}</span>;
}
