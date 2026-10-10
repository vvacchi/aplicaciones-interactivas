import { useEffect, useState } from 'react';
import { obtenerComercio } from '../../api/comercio.api.js';

// Por ahora solo prueba el cliente contra el back real.
export default function Inicio() {
  const [comercio, setComercio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let vigente = true;
    obtenerComercio()
      .then((datos) => {
        if (vigente) setComercio(datos);
      })
      .catch((err) => {
        if (vigente) setError(err.message);
      });
    return () => {
      vigente = false;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!comercio) return <p role="status">Cargando…</p>;

  return (
    <section>
      <h1>{comercio.nombre}</h1>
    </section>
  );
}
