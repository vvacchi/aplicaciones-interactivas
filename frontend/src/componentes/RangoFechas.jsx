import { useState } from 'react';
import Boton from './Boton.jsx';
import Campo from './Campo.jsx';
import { hoy, resumirRango, validarRango } from '../utils/fechas.js';
import estilos from './RangoFechas.module.css';

/**
 * Fechas de retiro y devolucion del alquiler. No reservan nada: sirven
 * para calcular el total estimado y viajan con la consulta.
 * Para que el borrador se reinicie cuando el rango cambia desde afuera,
 * el padre le pasa una `key` armada con las fechas.
 */
export default function RangoFechas({ rango, alAplicar, alQuitar }) {
  const [borrador, setBorrador] = useState(rango ?? { desde: '', hasta: '' });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (evento) => {
    setBorrador((b) => ({ ...b, [campo]: evento.target.value }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const aplicar = (evento) => {
    evento.preventDefault();
    const encontrados = validarRango(borrador.desde, borrador.hasta);
    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) alAplicar(borrador);
  };

  return (
    <form className={estilos.rango} onSubmit={aplicar} noValidate>
      <div className={estilos.resumen}>
        <p className={estilos.titulo}>{rango ? resumirRango(rango) : '¿Cuándo lo necesitás?'}</p>
        <p className={estilos.nota}>
          Elegí las fechas para ver el total de cada equipo. No es una reserva: las fechas viajan con tu consulta.
        </p>
      </div>
      <div className={estilos.campos}>
        <Campo
          etiqueta="Retiro"
          type="date"
          min={hoy()}
          value={borrador.desde}
          onChange={cambiar('desde')}
          error={errores.desde}
        />
        <Campo
          etiqueta="Devolución"
          type="date"
          min={borrador.desde || hoy()}
          value={borrador.hasta}
          onChange={cambiar('hasta')}
          error={errores.hasta}
        />
        <div className={estilos.acciones}>
          <Boton type="submit" tamano="chico">
            {rango ? 'Cambiar' : 'Aplicar'}
          </Boton>
          {rango && (
            <button type="button" className={estilos.quitar} onClick={alQuitar}>
              Quitar fechas
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
