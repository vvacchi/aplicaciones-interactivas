import { useEffect, useId, useRef } from 'react';
import estilos from './Modal.module.css';

/**
 * Ventana modal sobre <dialog>: el navegador ya encierra el foco, cierra
 * con Escape y devuelve el foco al elemento que la abrio.
 * Se muestra mientras `abierto` es true; `alCerrar` se llama con Escape,
 * con el boton de cerrar o al hacer clic fuera.
 */
export default function Modal({ abierto, titulo, alCerrar, acciones, children }) {
  const dialogo = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const el = dialogo.current;
    if (abierto && !el.open) el.showModal();
    if (!abierto && el.open) el.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      className={estilos.modal}
      aria-labelledby={idTitulo}
      onCancel={(evento) => {
        evento.preventDefault();
        alCerrar();
      }}
      onClick={(evento) => {
        // El clic en el fondo oscuro llega al propio <dialog>.
        if (evento.target === dialogo.current) alCerrar();
      }}
    >
      {abierto && (
        <div className={estilos.caja}>
          <h2 id={idTitulo} className={estilos.titulo}>
            {titulo}
          </h2>
          <div className={estilos.cuerpo}>{children}</div>
          {acciones && <div className={estilos.acciones}>{acciones}</div>}
        </div>
      )}
    </dialog>
  );
}
