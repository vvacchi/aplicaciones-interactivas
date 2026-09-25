/**
 * Datos de precarga del sistema.
 *
 * Las publicaciones se apoyan en lugares y actividades reales del Parque
 * Nacional Nahuel Huapi (refugios Frey, Jakob, Laguna Negra y Lopez,
 * Cerro Tronador, Cerro Catedral, Cerro Ventana). Los precios son
 * estimados y estan expresados en pesos argentinos.
 */

/** Claves internas para enlazar publicaciones con categorias. */
export const CATEGORIAS = [
  {
    clave: 'trekking',
    nombre: 'Trekking y travesias',
    descripcion:
      'Caminatas de un dia y travesias de varias jornadas por los senderos y refugios del Parque Nacional Nahuel Huapi.',
  },
  {
    clave: 'escalada',
    nombre: 'Escalada en roca',
    descripcion:
      'Escalada deportiva y clasica en el granito de las agujas de Frey, Cerro Lopez y Cerro Ventana.',
  },
  {
    clave: 'montanismo',
    nombre: 'Montanismo y alta montana',
    descripcion:
      'Ascensos sobre glaciar y terreno mixto, con uso de piolet, crampones y cuerda.',
  },
  {
    clave: 'esqui',
    nombre: 'Esqui de travesia',
    descripcion:
      'Salidas y formacion para moverse en nieve fuera de pista durante el invierno patagonico.',
  },
  {
    clave: 'campamento',
    nombre: 'Campamento y vivac',
    descripcion:
      'Equipamiento para pernoctar en montana: carpas, bolsas de dormir y cocinas.',
  },
];

export const COMERCIO = {
  nombre: 'Andes Vertical',
  descripcion:
    'Operador de montana integral en San Carlos de Bariloche. Trabajamos con guias certificados por la AAGM en tres lineas: experiencias guiadas por el Parque Nacional Nahuel Huapi, escuela de montana con cursos de escalada, montanismo y esqui de travesia, y alquiler de equipamiento tecnico revisado antes de cada salida.',
  direccion: 'Mitre 500, San Carlos de Bariloche, Rio Negro',
  telefono: '+54 294 4123456',
  email: 'hola@andesvertical.com.ar',
  redes: {
    instagram: '@andesvertical',
    facebook: 'andesvertical',
    whatsapp: '+542944123456',
  },
  horarios: [
    { dia: 'lunes', desde: '09:00', hasta: '18:00' },
    { dia: 'martes', desde: '09:00', hasta: '18:00' },
    { dia: 'miercoles', desde: '09:00', hasta: '18:00' },
    { dia: 'jueves', desde: '09:00', hasta: '18:00' },
    { dia: 'viernes', desde: '09:00', hasta: '19:00' },
    { dia: 'sabado', desde: '09:00', hasta: '14:00' },
    { dia: 'domingo', cerrado: true },
  ],
};

export const ADMIN = {
  nombre: 'Carlos',
  apellido: 'Rossi',
  email: 'andesverticaltest@gmail.com',
  telefono: '+54 294 4123456',
  password: 'Bariloche2026',
  rol: 'admin',
};

const foto = (semilla) => `https://picsum.photos/seed/${semilla}/1200/800`;

export const PUBLICACIONES = [
  /* ---------------------------- EXPERIENCIAS --------------------------- */
  {
    nombre: 'Travesia de los 4 Refugios',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'La travesia mas reconocida de Bariloche: 46 kilometros que unen los refugios Frey, San Martin (Jakob), Manfredo Segre y Lopez. Se sale de Villa Catedral y se termina en Colonia Suiza, pernoctando en los refugios con media pension. El tramo Jakob - Laguna Negra es el mas exigente, con pedreros y filos sobre los 2000 metros.',
    imagenes: [foto('travesia-4-refugios'), foto('refugio-frey-laguna'), foto('filo-catedral')],
    precio: 890000,
    destacada: true,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 32,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 8,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guia de montana certificado AAGM',
        'Media pension en los cuatro refugios',
        'Permisos de Parques Nacionales',
        'Equipo de seguridad y comunicaciones',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Travesia Frey - Jakob',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Tres dias uniendo la laguna Toncek con la laguna Jakob. El segundo dia es el mas largo: se asciende a la laguna Schmoll, se cruza la Cancha de Futbol en el filo del Catedral y se baja al valle del arroyo Rucaco antes del ultimo ascenso al Refugio San Martin.',
    imagenes: [foto('frey-jakob'), foto('laguna-schmoll')],
    precio: 520000,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 17,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 8,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guia de montana certificado AAGM',
        'Media pension en refugios',
        'Permisos de Parques Nacionales',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Refugio Frey en el dia',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Ida y vuelta en la jornada al refugio mas visitado de Bariloche. El sendero tradicional sale de Villa Catedral y atraviesa bosque de lenga y cana colihue hasta el vivac Piedritas, desde donde resta la ultima hora de ascenso. El refugio esta a 1700 metros, a orillas de la laguna Toncek y al pie de las agujas de granito.',
    imagenes: [foto('refugio-frey-dia'), foto('laguna-toncek')],
    precio: 145000,
    destacada: true,
    atributos: {
      dificultad: 'media',
      duracionHoras: 8,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 12,
      puntoEncuentro: 'Playa de estacionamiento del Cerro Catedral',
      incluye: ['Guia de montana', 'Vianda de marcha', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Laguna Negra y Refugio Manfredo Segre',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Caminata de aproximacion suave desde Colonia Suiza que se empina en el ultimo tramo, el llamado Caracol, antes de llegar a la laguna de origen glaciar donde esta el refugio. Se puede hacer en el dia saliendo temprano.',
    imagenes: [foto('laguna-negra'), foto('refugio-segre')],
    precio: 155000,
    atributos: {
      dificultad: 'media',
      duracionHoras: 10,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 12,
      puntoEncuentro: 'Colonia Suiza, parada del arroyo Goye',
      incluye: ['Guia de montana', 'Vianda de marcha', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Refugio Lopez desde Colonia Suiza',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'La subida mas corta a un refugio de Bariloche: dos horas con pendiente firme al principio que se suaviza a medida que se gana altura. Vista abierta sobre el lago Nahuel Huapi y el Cerro Capilla. Ideal como primera salida de montana.',
    imagenes: [foto('refugio-lopez'), foto('vista-nahuel-huapi')],
    precio: 98000,
    atributos: {
      dificultad: 'baja',
      duracionHoras: 5,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 15,
      puntoEncuentro: 'Arroyo Lopez, Circuito Chico',
      incluye: ['Guia de montana', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Ascenso al Pico Argentino, Cerro Tronador',
    categoria: 'montanismo',
    tipo: 'experiencia',
    descripcion:
      'Ascenso de tres jornadas a una de las cumbres del Tronador. Se parte de Pampa Linda hacia el refugio Otto Meiling y desde alli se encara el glaciar. El tramo final incluye una pendiente de hielo de unos 50 grados y algo de trepada, asi que se pide experiencia previa en terreno glaciar.',
    imagenes: [foto('tronador-glaciar'), foto('refugio-otto-meiling'), foto('cumbre-pico-argentino')],
    precio: 1150000,
    destacada: true,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 26,
      temporada: ['verano'],
      cupoMaximo: 4,
      puntoEncuentro: 'Pampa Linda, Parque Nacional Nahuel Huapi',
      incluye: [
        'Guia de alta montana certificado',
        'Equipo tecnico de progresion y seguridad',
        'Alojamiento en refugio Otto Meiling',
        'Traslado desde Bariloche',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Escalada en las agujas de Frey',
    categoria: 'escalada',
    tipo: 'experiencia',
    descripcion:
      'Jornada completa de escalada clasica en el granito naranja del valle de Frey, uno de los mejores sectores de escalada de Sudamerica. Se eligen las vias segun el nivel del grupo y las condiciones del dia. Requiere experiencia previa en escalada de varios largos.',
    imagenes: [foto('agujas-frey'), foto('escalada-granito')],
    precio: 210000,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 10,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 4,
      puntoEncuentro: 'Refugio Frey, laguna Toncek',
      incluye: [
        'Guia de escalada certificado',
        'Cuerdas y material de seguro colectivo',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Escalada deportiva en Cerro Ventana',
    categoria: 'escalada',
    tipo: 'experiencia',
    descripcion:
      'Medio dia de escalada deportiva a pocos minutos del centro de Bariloche. Sector de facil acceso con vias equipadas de distintos grados, apto para quienes escalan por primera vez y tambien para quien quiere sumar largos.',
    imagenes: [foto('cerro-ventana'), foto('escalada-deportiva')],
    precio: 95000,
    atributos: {
      dificultad: 'baja',
      duracionHoras: 4,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 6,
      puntoEncuentro: 'Base del Cerro Ventana, Ruta 40',
      incluye: [
        'Guia de escalada certificado',
        'Arnes, casco y pies de gato',
        'Cuerdas y material de seguro',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Esqui de travesia en el filo del Catedral',
    categoria: 'esqui',
    tipo: 'experiencia',
    descripcion:
      'Salida de un dia fuera de pista con ascenso con pieles de foca y descenso por laderas abiertas. Se evalua el estado del manto nival antes de decidir el recorrido. Hace falta esquiar con solvencia en pista negra.',
    imagenes: [foto('esqui-travesia-catedral'), foto('nieve-patagonia')],
    precio: 235000,
    disponible: false,
    atributos: {
      dificultad: 'media',
      duracionHoras: 8,
      temporada: ['invierno'],
      cupoMaximo: 5,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guia de montana certificado',
        'DVA, pala y sonda',
        'Seguro de actividad',
      ],
    },
  },

  /* ------------------------------- CURSOS ------------------------------ */
  {
    nombre: 'Curso de iniciacion a la escalada deportiva',
    categoria: 'escalada',
    tipo: 'curso',
    descripcion:
      'Dos jornadas para empezar a escalar desde cero. Se trabajan nudos, encordamiento, asegurado con y sin freno asistido, comunicacion entre companeros y descenso en rappel. La practica es en sectores equipados cerca de Bariloche.',
    imagenes: [foto('curso-escalada-inicial'), foto('asegurando-escalada')],
    precio: 180000,
    atributos: {
      duracionHoras: 16,
      nivel: 'inicial',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 8,
      requisitosPrevios: ['Mayor de 14 anos', 'Sin experiencia previa requerida'],
    },
  },
  {
    nombre: 'Curso de escalada clasica en agujas de Frey',
    categoria: 'escalada',
    tipo: 'curso',
    descripcion:
      'Cuatro dias de escalada tradicional en el valle de Frey. Se aprende a colocar proteccion movil, armar reuniones, planificar una via de varios largos y gestionar el descenso. Se pernocta en el refugio.',
    imagenes: [foto('curso-escalada-clasica'), foto('proteccion-movil'), foto('frey-agujas-curso')],
    precio: 640000,
    destacada: true,
    atributos: {
      duracionHoras: 32,
      nivel: 'avanzado',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Escalar en segundo de forma autonoma',
        'Experiencia en escalada deportiva',
        'Buen estado fisico para la aproximacion al Frey',
      ],
    },
  },
  {
    nombre: 'Curso de montanismo invernal: piolet y crampones',
    categoria: 'montanismo',
    tipo: 'curso',
    descripcion:
      'Tres dias de tecnica de progresion en nieve y hielo. Uso de crampones y piolet, autodetencion, armado de anclajes en nieve, encordamiento en glaciar y lectura del terreno.',
    imagenes: [foto('curso-invernal'), foto('piolet-crampones')],
    precio: 460000,
    atributos: {
      duracionHoras: 24,
      nivel: 'intermedio',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Experiencia en trekking de montana',
        'Buen estado fisico',
      ],
    },
  },
  {
    nombre: 'Curso de esqui de travesia nivel 1',
    categoria: 'esqui',
    tipo: 'curso',
    descripcion:
      'Introduccion al esqui fuera de pista: ascenso con pieles, conversiones en pendiente, manejo de la fijacion de travesia y nociones de seguridad en nieve. Incluye una jornada completa de busqueda con DVA.',
    imagenes: [foto('curso-esqui-travesia'), foto('pieles-de-foca')],
    precio: 520000,
    disponible: false,
    atributos: {
      duracionHoras: 24,
      nivel: 'inicial',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: ['Esquiar con solvencia en pista roja'],
    },
  },
  {
    nombre: 'Curso de rescate en grietas y autorrescate',
    categoria: 'montanismo',
    tipo: 'curso',
    descripcion:
      'Dos jornadas intensivas sobre sistemas de polipastos, anclajes, remonte por cuerda y evacuacion de un companero. Destinado a quienes ya se mueven en terreno glaciar y quieren resolver una emergencia sin asistencia externa.',
    imagenes: [foto('rescate-grietas'), foto('polipasto-cuerda')],
    precio: 340000,
    atributos: {
      duracionHoras: 16,
      nivel: 'avanzado',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Curso de montanismo invernal o equivalente',
        'Experiencia en progresion encordada',
      ],
    },
  },
  {
    nombre: 'Curso de orientacion y navegacion en montana',
    categoria: 'trekking',
    tipo: 'curso',
    descripcion:
      'Una jornada de mapa, brujula y GPS aplicados al terreno del Nahuel Huapi. Se trabaja interpretacion de curvas de nivel, rumbos, triangulacion y planificacion de una travesia con horarios y puntos de escape.',
    imagenes: [foto('orientacion-montana'), foto('mapa-brujula')],
    precio: 120000,
    atributos: {
      duracionHoras: 8,
      nivel: 'inicial',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 12,
      requisitosPrevios: [],
    },
  },

  /* ----------------------------- ALQUILERES ---------------------------- */
  {
    nombre: 'Crampones tecnicos de 12 puntas',
    categoria: 'montanismo',
    tipo: 'alquiler',
    descripcion:
      'Crampones de acero aptos para hielo y terreno mixto, compatibles con botas rigidas y semirrigidas. Se entregan afilados y con las correas revisadas.',
    imagenes: [foto('crampones')],
    atributos: {
      precioPorDia: 14000,
      talles: ['Universal'],
      unidadesTotales: 8,
      unidadesDisponibles: 5,
      deposito: 60000,
    },
  },
  {
    nombre: 'Piolet tecnico de montana',
    categoria: 'montanismo',
    tipo: 'alquiler',
    descripcion:
      'Piolet clasico de progresion para pendientes de nieve y glaciar. Se entrega con dragonera regulable.',
    imagenes: [foto('piolet')],
    atributos: {
      precioPorDia: 11000,
      talles: ['50 cm', '60 cm', '70 cm'],
      unidadesTotales: 10,
      unidadesDisponibles: 7,
      deposito: 45000,
    },
  },
  {
    nombre: 'Arnes de escalada regulable',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Arnes con perneras regulables y cuatro portamateriales, apto para escalada deportiva, clasica y progresion en glaciar.',
    imagenes: [foto('arnes-escalada')],
    atributos: {
      precioPorDia: 8000,
      talles: ['S', 'M', 'L', 'XL'],
      unidadesTotales: 14,
      unidadesDisponibles: 11,
      deposito: 30000,
    },
  },
  {
    nombre: 'Pies de gato',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Calzado de escalada de horma neutra, comodo para jornadas largas y para quien escala por primera vez. Se desinfectan despues de cada uso.',
    imagenes: [foto('pies-de-gato')],
    atributos: {
      precioPorDia: 9000,
      talles: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
      unidadesTotales: 18,
      unidadesDisponibles: 12,
      deposito: 30000,
    },
  },
  {
    nombre: 'Casco de escalada',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Casco liviano con regulacion de talle y soporte para frontal. Obligatorio en las salidas de escalada clasica y alta montana.',
    imagenes: [foto('casco-escalada')],
    atributos: {
      precioPorDia: 6000,
      talles: ['Unico regulable'],
      unidadesTotales: 20,
      unidadesDisponibles: 16,
      deposito: 20000,
    },
  },
  {
    nombre: 'Cuerda dinamica 60 metros',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Cuerda simple de 9,8 mm y 60 metros con tratamiento hidrofugo. Se lleva registro de caidas y horas de uso de cada unidad.',
    imagenes: [foto('cuerda-dinamica')],
    atributos: {
      precioPorDia: 22000,
      talles: ['60 m'],
      unidadesTotales: 6,
      unidadesDisponibles: 3,
      deposito: 120000,
    },
  },
  {
    nombre: 'Equipo completo de esqui de travesia',
    categoria: 'esqui',
    tipo: 'alquiler',
    descripcion:
      'Esquis con fijacion de travesia, botas y pieles de foca cortadas a medida del esqui. El ajuste de fijacion se hace en el local antes de la salida.',
    imagenes: [foto('esqui-travesia-equipo'), foto('botas-travesia')],
    atributos: {
      precioPorDia: 48000,
      talles: ['160 cm', '170 cm', '180 cm'],
      unidadesTotales: 6,
      unidadesDisponibles: 4,
      deposito: 250000,
    },
  },
  {
    nombre: 'Kit de seguridad en nieve: DVA, pala y sonda',
    categoria: 'esqui',
    tipo: 'alquiler',
    descripcion:
      'Detector de victimas de avalancha digital de tres antenas, pala de aluminio y sonda de 240 cm. Se entrega con las pilas cargadas y una explicacion de uso.',
    imagenes: [foto('dva-pala-sonda')],
    atributos: {
      precioPorDia: 26000,
      talles: ['Unico'],
      unidadesTotales: 8,
      unidadesDisponibles: 6,
      deposito: 150000,
    },
  },
  {
    nombre: 'Mochila de travesia 65 litros',
    categoria: 'trekking',
    tipo: 'alquiler',
    descripcion:
      'Mochila con espalda regulable, cinturon acolchado y funda de lluvia. Capacidad pensada para travesias de tres a cinco dias con pernocte en refugio.',
    imagenes: [foto('mochila-travesia')],
    atributos: {
      precioPorDia: 10000,
      talles: ['S/M', 'M/L'],
      unidadesTotales: 12,
      unidadesDisponibles: 9,
      deposito: 40000,
    },
  },
  {
    nombre: 'Raquetas de nieve',
    categoria: 'trekking',
    tipo: 'alquiler',
    descripcion:
      'Raquetas con alza de talon para caminar sobre nieve profunda. Se entregan con bastones telescopicos incluidos.',
    imagenes: [foto('raquetas-nieve')],
    atributos: {
      precioPorDia: 13000,
      talles: ['Unico regulable'],
      unidadesTotales: 10,
      unidadesDisponibles: 10,
      deposito: 50000,
    },
  },
  {
    nombre: 'Carpa de montana para dos personas',
    categoria: 'campamento',
    tipo: 'alquiler',
    descripcion:
      'Carpa de dos capas con varillas de aluminio, resistente a viento fuerte. Se entrega seca, con sobretecho, piqueteros y vientos completos.',
    imagenes: [foto('carpa-montana')],
    atributos: {
      precioPorDia: 19000,
      talles: ['2 personas'],
      unidadesTotales: 7,
      unidadesDisponibles: 4,
      deposito: 90000,
    },
  },
  {
    nombre: 'Bolsa de dormir para 10 grados bajo cero',
    categoria: 'campamento',
    tipo: 'alquiler',
    descripcion:
      'Bolsa de pluma con temperatura de confort de -10 grados, apta para las noches de refugio y vivac en verano patagonico. Se entrega lavada y con bolsa de compresion.',
    imagenes: [foto('bolsa-dormir')],
    atributos: {
      precioPorDia: 15000,
      talles: ['Regular', 'Large'],
      unidadesTotales: 10,
      unidadesDisponibles: 6,
      deposito: 70000,
    },
  },
];

/** Consultas de ejemplo para que el panel no arranque vacio. */
export const CONSULTAS = [
  {
    nombre: 'Martina Aguirre',
    email: 'martina.aguirre@mail.com',
    telefono: '+54 11 5566 7788',
    asunto: 'Cupos para la travesia de los 4 refugios en enero',
    mensaje:
      'Hola, somos tres y queriamos hacer la travesia de los 4 refugios la segunda semana de enero. Nunca dormimos en refugio, hay que llevar bolsa de dormir?',
    estado: 'pendiente',
    publicacion: 'Travesia de los 4 Refugios',
  },
  {
    nombre: 'Diego Ferreyra',
    email: 'diego.ferreyra@mail.com',
    asunto: 'Nivel necesario para el curso de escalada clasica',
    mensaje:
      'Buenas. Escalo deportiva hace dos anos en rocodromo y algo de roca, pero nunca puse proteccion movil. Me alcanza para el curso de cuatro dias en Frey?',
    estado: 'leida',
    publicacion: 'Curso de escalada clasica en agujas de Frey',
  },
  {
    nombre: 'Sofia Bianchi',
    email: 'sofia.bianchi@mail.com',
    telefono: '+54 294 4778899',
    asunto: 'Alquiler de crampones por tres dias',
    mensaje:
      'Hola, necesito crampones del 39 para una salida al Tronador del 12 al 15. Los tienen disponibles para esas fechas?',
    estado: 'respondida',
    publicacion: 'Crampones tecnicos de 12 puntas',
  },
  {
    nombre: 'Julian Medina',
    email: 'julian.medina@mail.com',
    asunto: 'Salidas para grupos de empresa',
    mensaje:
      'Buen dia. Trabajo en una empresa de Buenos Aires y estamos organizando un viaje de equipo a Bariloche para marzo. Hacen salidas para grupos de 20 personas?',
    estado: 'pendiente',
  },
];