export class RecursoNoEncontradoError extends Error {
  constructor(mensaje = 'Recurso no encontrado') {
    super(mensaje);
    this.name = 'RecursoNoEncontradoError';
  }
}

export class ConflictoError extends Error {
  constructor(mensaje = 'Conflicto con el estado actual del recurso') {
    super(mensaje);
    this.name = 'ConflictoError';
  }
}

export class DatosInvalidosError extends Error {
  constructor(mensaje = 'Datos inválidos', detalles = []) {
    super(mensaje);
    this.name = 'DatosInvalidosError';
    this.detalles = detalles;
  }
}

export class NoAutorizadoError extends Error {
  constructor(mensaje = 'No autorizado') {
    super(mensaje);
    this.name = 'NoAutorizadoError';
  }
}

/**
 * Distinto de NoAutorizadoError: aca el usuario si esta identificado,
 * pero su rol no alcanza para la operacion que pidio.
 */
export class ProhibidoError extends Error {
  constructor(mensaje = 'No tenes permisos para realizar esta accion') {
    super(mensaje);
    this.name = 'ProhibidoError';
  }
}