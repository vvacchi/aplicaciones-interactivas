import { useParams } from 'react-router';

// Placeholder: alta y edicion comparten formulario; con `id` es edicion.
export default function PublicacionForm() {
  const { id } = useParams();

  return (
    <section>
      <h1>{id ? 'Editar publicación' : 'Nueva publicación'}</h1>
      <p>
        Pendiente. Ruta:{' '}
        <code>{id ? `/admin/publicaciones/${id}/editar` : '/admin/publicaciones/nueva'}</code>
      </p>
    </section>
  );
}
