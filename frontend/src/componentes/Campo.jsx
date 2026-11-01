import { useId } from 'react';
import estilos from './Campo.module.css';

/**
 * Campo de formulario con label real, ayuda y error por campo.
 * `como` elige el control: input (por defecto), textarea o select.
 * El resto de las props van directo al control.
 */
export default function Campo({
  etiqueta,
  como = 'input',
  error,
  ayuda,
  opcional = false,
  id,
  className = '',
  children,
  ...resto
}) {
  const idGenerado = useId();
  const idControl = id ?? idGenerado;
  const idAyuda = `${idControl}-ayuda`;
  const idError = `${idControl}-error`;

  const descripciones = [ayuda && idAyuda, error && idError].filter(Boolean).join(' ');
  const Control = como;

  return (
    <div className={`${estilos.campo} ${error ? estilos.conError : ''} ${className}`}>
      <label htmlFor={idControl} className={estilos.etiqueta}>
        {etiqueta}
        {opcional && <span className={estilos.opcional}> (opcional)</span>}
      </label>
      <Control
        id={idControl}
        className={estilos.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripciones || undefined}
        {...resto}
      >
        {children}
      </Control>
      {ayuda && (
        <p id={idAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className={estilos.error}>
          {error}
        </p>
      )}
    </div>
  );
}
