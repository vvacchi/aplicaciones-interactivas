// Los enums viajan sin acento desde el back; aca se traducen para mostrar.

export const TIPOS = {
  experiencia: 'Experiencia',
  curso: 'Curso',
  alquiler: 'Alquiler',
};

export const DIFICULTADES = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

export const NIVELES = {
  inicial: 'Inicial',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export const TEMPORADAS = {
  primavera: 'Primavera',
  verano: 'Verano',
  otonio: 'Otoño',
  invierno: 'Invierno',
};

export const DIAS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

/** Escala comun de dificultad y nivel: 1 baja, 2 media, 3 alta. */
export const ESCALA = {
  baja: 1,
  media: 2,
  alta: 3,
  inicial: 1,
  intermedio: 2,
  avanzado: 3,
};
