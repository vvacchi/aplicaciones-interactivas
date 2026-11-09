import { useRef, useState } from 'react';

/**
 * Estado de un formulario con validacion en el front y errores del back.
 *
 * - `validar(valores)` devuelve los errores por campo (vacio si esta bien).
 * - `alEnviar(valores)` hace el pedido; si tira un ErrorApi, sus errores por
 *   campo se muestran debajo de cada input y el mensaje, arriba.
 * - Al fallar, el foco va al primer campo con error. Los inputs necesitan
 *   `name` igual a la clave en `valores`; el <form> se toma del submit.
 */
export function useFormulario({ inicial, validar, alEnviar }) {
  // El <form> del ultimo envio, para poder enfocar el campo con error.
  const formulario = useRef(null);
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const campos = Object.keys(inicial);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErrores((e) => ({ ...e, [name]: undefined }));
  };

  const enfocarPrimerError = (encontrados) => {
    const primero = campos.find((campo) => encontrados[campo]);
    if (primero) formulario.current?.elements[primero]?.focus();
  };

  /** Para mostrar un error que no vino de la validacion (por ejemplo, un 409). */
  const marcarErrores = (encontrados, general = null) => {
    setErrores(encontrados);
    setErrorGeneral(general);
    enfocarPrimerError(encontrados);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    formulario.current = evento.currentTarget;
    setErrorGeneral(null);

    const encontrados = validar(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      enfocarPrimerError(encontrados);
      return;
    }

    setEnviando(true);
    try {
      await alEnviar(valores);
    } catch (error) {
      const delBack = Object.fromEntries(
        Object.entries(error.porCampo ?? {}).filter(([campo]) => campos.includes(campo))
      );
      marcarErrores(delBack, error.message);
    } finally {
      setEnviando(false);
    }
  };

  return { valores, setValores, errores, errorGeneral, enviando, cambiar, enviar, marcarErrores };
}
