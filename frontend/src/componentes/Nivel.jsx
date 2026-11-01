import { DIFICULTADES, ESCALA, NIVELES } from '../utils/textos.js';
import estilos from './Nivel.module.css';

const COLORES = { 1: estilos.bajo, 2: estilos.medio, 3: estilos.alto };

/**
 * Dificultad (experiencias) o nivel (cursos): punto de color y siempre el
 * texto al lado, para no depender solo del color.
 */
export default function Nivel({ valor }) {
  const texto = DIFICULTADES[valor] ?? NIVELES[valor];
  if (!texto) return null;

  return (
    <span className={estilos.nivel}>
      <i className={`${estilos.punto} ${COLORES[ESCALA[valor]]}`} aria-hidden="true" />
      {texto}
    </span>
  );
}
