import { useParams } from 'react-router';

// Placeholder: el contenido llega en su propio bloque.
export default function DetallePublicacion() {
  const { id } = useParams();

  return (
    <section>
      <h1>Publicación</h1>
      <p>
        Pendiente. Ruta: <code>/publicaciones/{id}</code>
      </p>
    </section>
  );
}
