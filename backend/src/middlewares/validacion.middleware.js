import { DatosInvalidosError } from '../utils/errors.js';

const FUENTES = ['body', 'params', 'query'];

/**
 * Traduce un issue de Zod al formato que consume el cliente.
 * Los campos desconocidos no tienen path, así que el nombre del campo
 * se saca de la lista de llaves que Zod rechazó.
 */
const aDetalle = (issue, fuente) => {
  if (issue.code === 'unrecognized_keys') {
    return {
      campo: issue.keys.join(', '),
      mensaje: 'Campo no permitido',
    };
  }
  return {
    campo: issue.path.join('.') || fuente,
    mensaje: issue.message,
  };
};

/**
 * Valida el body, los params y la query de una request contra las
 * reglas de la entidad correspondiente.
 * 
 * Revisa todas las fuentes indicadas y junta los errores de todas ellas
 * antes de cortar, para que el cliente reciba la lista completa en una
 * sola respuesta y no de a un error por vez.
 *
 * Los datos ya parseados quedan en `req.validado`, con los defaults
 * aplicados y sin los campos que no pertenecen a la entidad.
 */
export const validar = (reglas) => (req, res, next) => {
  const validado = {};
  const detalles = [];

  for (const fuente of FUENTES) {
    const schema = reglas[fuente];
    if (!schema) continue;
    
    const valor = fuente === 'body' ? req.body ?? {} : req[fuente];
    const resultado = schema.safeParse(valor);

    if (resultado.success) {
      validado[fuente] = resultado.data;
      continue;
    }

    for (const issue of resultado.error.issues) {
      detalles.push(aDetalle(issue, fuente));
    }
  }

  if (detalles.length > 0) {
    return next(
      new DatosInvalidosError('Los datos enviados no son válidos', detalles)
    );
  }

  req.validado = validado;
  next();
};