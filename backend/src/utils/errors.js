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
  constructor(mensaje = 'Datos inválidos') {
    super(mensaje);
    this.name = 'DatosInvalidosError';
  }
}

export class NoAutorizadoError extends Error {
  constructor(mensaje = 'No autorizado') {
    super(mensaje);
    this.name = 'NoAutorizadoError';
  }
}