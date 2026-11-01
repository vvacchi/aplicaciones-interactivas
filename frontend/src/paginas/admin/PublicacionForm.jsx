import { useParams } from 'react-router';
import EnPreparacion from '../../componentes/EnPreparacion.jsx';

// Alta y edicion comparten formulario; con `id` es edicion.
export default function PublicacionForm() {
  const { id } = useParams();
  return <EnPreparacion titulo={id ? 'Editar publicación' : 'Nueva publicación'} />;
}
