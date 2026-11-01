import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta un pedido a la API y expone { datos, error, cargando, recargar }.
 *
 * `pedir` tiene que ser estable (una funcion del modulo o un useCallback):
 * cada vez que cambia se vuelve a pedir. Si el componente se desmonta o
 * llega un pedido nuevo, la respuesta vieja se descarta.
 */
export function usePedido(pedir) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let vigente = true;
    pedir().then(
      (datos) => vigente && setResultado({ pedir, intento, datos, error: null }),
      (error) => vigente && setResultado({ pedir, intento, datos: null, error })
    );
    return () => {
      vigente = false;
    };
  }, [pedir, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  // "Cargando" se deriva: el ultimo resultado no corresponde al pedido actual.
  const alDia = resultado?.pedir === pedir && resultado?.intento === intento;

  return {
    datos: alDia ? resultado.datos : null,
    error: alDia ? resultado.error : null,
    cargando: !alDia,
    recargar,
  };
}
