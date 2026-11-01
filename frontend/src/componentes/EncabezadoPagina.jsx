import estilos from './EncabezadoPagina.module.css';

/**
 * Titulo de pagina. En el sitio publico va centrado y en mayuscula;
 * en el panel, alineado a la izquierda con las acciones al costado.
 */
export default function EncabezadoPagina({ titulo, bajada, acciones, publico = false }) {
  return (
    <header className={`${estilos.encabezado} ${publico ? estilos.publico : ''}`}>
      <div>
        <h1 className={estilos.titulo}>{titulo}</h1>
        {bajada && <p className={estilos.bajada}>{bajada}</p>}
      </div>
      {acciones && <div className={estilos.acciones}>{acciones}</div>}
    </header>
  );
}
