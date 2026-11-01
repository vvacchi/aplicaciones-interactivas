import estilos from './Chip.module.css';

/** Filtro de seleccion rapida. `activo` se expone como aria-pressed. */
export default function Chip({ activo = false, children, ...resto }) {
  return (
    <button type="button" className={estilos.chip} aria-pressed={activo} {...resto}>
      {children}
    </button>
  );
}
