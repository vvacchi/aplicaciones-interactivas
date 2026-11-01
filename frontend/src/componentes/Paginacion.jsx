import estilos from './Paginacion.module.css';

/** Paginas a mostrar: primera, ultima y las vecinas de la actual, con "…" en los saltos. */
const paginasVisibles = (actual, total) => {
  const set = new Set([1, total, actual - 1, actual, actual + 1].filter((p) => p >= 1 && p <= total));
  const ordenadas = [...set].sort((a, b) => a - b);
  return ordenadas.flatMap((p, i) => (i > 0 && p - ordenadas[i - 1] > 1 ? ['…', p] : [p]));
};

export default function Paginacion({ pagina, paginas, alCambiar }) {
  if (paginas <= 1) return null;

  return (
    <nav className={estilos.paginacion} aria-label="Paginación">
      <button type="button" onClick={() => alCambiar(pagina - 1)} disabled={pagina <= 1}>
        ‹ <span className={estilos.texto}>Anterior</span>
      </button>
      <ul>
        {paginasVisibles(pagina, paginas).map((p, i) =>
          p === '…' ? (
            <li key={`salto-${i}`} aria-hidden="true" className={estilos.salto}>
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => alCambiar(p)}
                aria-current={p === pagina ? 'page' : undefined}
                aria-label={`Página ${p}`}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>
      <button type="button" onClick={() => alCambiar(pagina + 1)} disabled={pagina >= paginas}>
        <span className={estilos.texto}>Siguiente</span> ›
      </button>
    </nav>
  );
}
