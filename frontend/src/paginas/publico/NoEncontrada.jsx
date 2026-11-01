import Boton from '../../componentes/Boton.jsx';
import EncabezadoPagina from '../../componentes/EncabezadoPagina.jsx';
import { Vacio } from '../../componentes/Estados.jsx';

export default function NoEncontrada() {
  return (
    <div className="contenedor">
      <EncabezadoPagina titulo="Página no encontrada" publico />
      <Vacio
        titulo="Este sendero no lleva a ningún lado"
        accion={<Boton a="/">Volver al inicio</Boton>}
      >
        La dirección que buscás no existe o cambió.
      </Vacio>
    </div>
  );
}
