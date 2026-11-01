import EncabezadoPagina from './EncabezadoPagina.jsx';
import { Vacio } from './Estados.jsx';

// Ocupa el lugar de una pagina hasta que llega su bloque.
export default function EnPreparacion({ titulo, publico = false }) {
  const contenido = (
    <>
      <EncabezadoPagina titulo={titulo} publico={publico} />
      <Vacio titulo="Sección en preparación">Esta pantalla todavía se está construyendo.</Vacio>
    </>
  );

  return publico ? <div className="contenedor">{contenido}</div> : contenido;
}
