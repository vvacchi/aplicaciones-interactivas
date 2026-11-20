/**
 * Limite de intentos fallidos por IP, para frenar a quien prueba
 * contraseñas o tokens de a miles (fuerza bruta).
 *
 * Solo cuentan las respuestas con error (4xx): un ingreso correcto no
 * consume intentos y ademas limpia el contador de esa IP. Al llegar al
 * maximo, la ruta responde 429 hasta que pasa la ventana.
 *
 * Se guarda en memoria: alcanza para un unico servidor como el de este
 * proyecto. Con varias instancias haria falta un almacen compartido.
 */
export const limitarIntentos = ({ maximo, ventanaMinutos }) => {
  const ventanaMs = ventanaMinutos * 60 * 1000;
  const intentos = new Map(); // ip -> { cantidad, desde }

  return (req, res, next) => {
    const clave = req.ip;
    const ahora = Date.now();
    let registro = intentos.get(clave);

    if (registro && ahora - registro.desde > ventanaMs) {
      intentos.delete(clave);
      registro = undefined;
    }

    if (registro && registro.cantidad >= maximo) {
      const minutos = Math.ceil((registro.desde + ventanaMs - ahora) / 60000);
      res.set('Retry-After', String(minutos * 60));
      return res.status(429).json({
        mensaje: `Demasiados intentos fallidos. Probá de nuevo en ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}.`,
      });
    }

    res.on('finish', () => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        const actual = intentos.get(clave) ?? { cantidad: 0, desde: Date.now() };
        actual.cantidad += 1;
        intentos.set(clave, actual);
      } else if (res.statusCode < 300) {
        intentos.delete(clave);
      }
    });

    next();
  };
};
