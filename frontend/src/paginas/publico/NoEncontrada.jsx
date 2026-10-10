import { Link } from 'react-router';

export default function NoEncontrada() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe o cambió.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
