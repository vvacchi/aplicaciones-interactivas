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
    nombre: 'Trekking y travesías',
    descripcion:
      'Caminatas de un día y travesías de varias jornadas por los senderos y refugios del Parque Nacional Nahuel Huapi.',
  },
  {
    clave: 'escalada',
    nombre: 'Escalada en roca',
    descripcion:
      'Escalada deportiva y clásica en el granito de las agujas de Frey, Cerro López y Cerro Ventana.',
  },
  {
    clave: 'montanismo',
    nombre: 'Montañismo y alta montaña',
    descripcion:
      'Ascensos sobre glaciar y terreno mixto, con uso de piolet, crampones y cuerda.',
  },
  {
    clave: 'esqui',
    nombre: 'Esquí de travesía',
    descripcion:
      'Salidas y formación para moverse en nieve fuera de pista durante el invierno patagónico.',
  },
  {
    clave: 'campamento',
    nombre: 'Campamento y vivac',
    descripcion:
      'Equipamiento para pernoctar en montaña: carpas, bolsas de dormir y cocinas.',
  },
];

export const COMERCIO = {
  nombre: 'Andes Vertical',
  descripcion:
    'Operador de montaña integral en San Carlos de Bariloche. Trabajamos con guías certificados por la AAGM en tres líneas: experiencias guiadas por el Parque Nacional Nahuel Huapi, escuela de montaña con cursos de escalada, montañismo y esquí de travesía, y alquiler de equipamiento técnico revisado antes de cada salida.',
  direccion: 'Mitre 500, San Carlos de Bariloche, Río Negro',
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

export const PUBLICACIONES = [
  /* ---------------------------- EXPERIENCIAS --------------------------- */
  {
    nombre: 'Travesía de los 4 Refugios',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'La travesía más reconocida de Bariloche: 46 kilómetros que unen los refugios Frey, San Martín (Jakob), Manfredo Segre y López. Se sale de Villa Catedral y se termina en Colonia Suiza, pernoctando en los refugios con media pensión. El tramo Jakob - Laguna Negra es el más exigente, con pedreros y filos sobre los 2000 metros.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Refugio_Frey_-_panoramio.jpg/1280px-Refugio_Frey_-_panoramio.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Argentina_-_Bariloche_trekking_115_-_colourful_Jakob_Lake_and_Refugio_%286798012395%29.jpg/1280px-Argentina_-_Bariloche_trekking_115_-_colourful_Jakob_Lake_and_Refugio_%286798012395%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Cerro_Catedral._Torre_Principal.jpg/1280px-Cerro_Catedral._Torre_Principal.jpg',
    ],
    precio: 890000,
    destacada: true,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 32,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 8,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guía de montaña certificado AAGM',
        'Media pensión en los cuatro refugios',
        'Permisos de Parques Nacionales',
        'Equipo de seguridad y comunicaciones',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Travesía Frey - Jakob',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Tres días uniendo la laguna Toncek con la laguna Jakob. El segundo día es el más largo: se asciende a la laguna Schmoll, se cruza la Cancha de Fútbol en el filo del Catedral y se baja al valle del arroyo Rucaco antes del último ascenso al Refugio San Martín.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Argentina_-_Bariloche_trekking_058_-_camping_at_Refugio_Frey_%286797859833%29.jpg/1280px-Argentina_-_Bariloche_trekking_058_-_camping_at_Refugio_Frey_%286797859833%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Refugio_Frey_-_panoramio_-_Estany3.jpg/1280px-Refugio_Frey_-_panoramio_-_Estany3.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Argentina_-_Bariloche_trekking_070_-_Refugio_Frey_%286834294166%29.jpg/1280px-Argentina_-_Bariloche_trekking_070_-_Refugio_Frey_%286834294166%29.jpg',
    ],
    precio: 520000,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 17,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 8,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guía de montaña certificado AAGM',
        'Media pensión en refugios',
        'Permisos de Parques Nacionales',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Refugio Frey en el día',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Ida y vuelta en la jornada al refugio más visitado de Bariloche. El sendero tradicional sale de Villa Catedral y atraviesa bosque de lenga y caña colihue hasta el vivac Piedritas, desde donde resta la última hora de ascenso. El refugio está a 1700 metros, a orillas de la laguna Toncek y al pie de las agujas de granito.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Refugio_Frey_Catedral.jpg/1280px-Refugio_Frey_Catedral.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Refugio_de_monta%C3%B1a_Frey%2C_San_Carlos_de_Bariloche_%28Argentina%29.JPG/1280px-Refugio_de_monta%C3%B1a_Frey%2C_San_Carlos_de_Bariloche_%28Argentina%29.JPG',
    ],
    precio: 145000,
    destacada: true,
    atributos: {
      dificultad: 'media',
      duracionHoras: 8,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 12,
      puntoEncuentro: 'Playa de estacionamiento del Cerro Catedral',
      incluye: ['Guía de montaña', 'Vianda de marcha', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Laguna Negra y Refugio Manfredo Segre',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'Caminata de aproximación suave desde Colonia Suiza que se empina en el último tramo, el llamado Caracol, antes de llegar a la laguna de origen glaciar donde está el refugio. Se puede hacer en el día saliendo temprano.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Refugio_Italia_-_Laguna_Negra.jpg/1280px-Refugio_Italia_-_Laguna_Negra.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Refugio_Italia_-_Laguna_Negra_-_panoramio.jpg/1280px-Refugio_Italia_-_Laguna_Negra_-_panoramio.jpg',
    ],
    precio: 155000,
    atributos: {
      dificultad: 'media',
      duracionHoras: 10,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 12,
      puntoEncuentro: 'Colonia Suiza, parada del arroyo Goye',
      incluye: ['Guía de montaña', 'Vianda de marcha', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Refugio López desde Colonia Suiza',
    categoria: 'trekking',
    tipo: 'experiencia',
    descripcion:
      'La subida más corta a un refugio de Bariloche: dos horas con pendiente firme al principio que se suaviza a medida que se gana altura. Vista abierta sobre el lago Nahuel Huapi y el Cerro Capilla. Ideal como primera salida de montaña.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Refugio_L%C3%B3pez.jpg/1280px-Refugio_L%C3%B3pez.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Refugio_del_Cerro_Lopez_1_-_panoramio.jpg/1280px-Refugio_del_Cerro_Lopez_1_-_panoramio.jpg',
    ],
    precio: 98000,
    atributos: {
      dificultad: 'baja',
      duracionHoras: 5,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 15,
      puntoEncuentro: 'Arroyo López, Circuito Chico',
      incluye: ['Guía de montaña', 'Seguro de actividad'],
    },
  },
  {
    nombre: 'Ascenso al Pico Argentino, Cerro Tronador',
    categoria: 'montanismo',
    tipo: 'experiencia',
    descripcion:
      'Ascenso de tres jornadas a una de las cumbres del Tronador. Se parte de Pampa Linda hacia el refugio Otto Meiling y desde allí se encara el glaciar. El tramo final incluye una pendiente de hielo de unos 50 grados y algo de trepada, así que se pide experiencia previa en terreno glaciar.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/8/82/Cerro_tronador_desde_lago_mascardi_01b.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Cerro_Tronador_-_cordillera_de_los_Andes.JPG/1280px-Cerro_Tronador_-_cordillera_de_los_Andes.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Argentina_-_Mt_Tronador_Ascent_-_01_%286962279303%29.jpg/1280px-Argentina_-_Mt_Tronador_Ascent_-_01_%286962279303%29.jpg',
    ],
    precio: 1150000,
    destacada: true,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 26,
      temporada: ['verano'],
      cupoMaximo: 4,
      puntoEncuentro: 'Pampa Linda, Parque Nacional Nahuel Huapi',
      incluye: [
        'Guía de alta montaña certificado',
        'Equipo técnico de progresión y seguridad',
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
      'Jornada completa de escalada clásica en el granito naranja del valle de Frey, uno de los mejores sectores de escalada de Sudamérica. Se eligen las vías según el nivel del grupo y las condiciones del día. Requiere experiencia previa en escalada de varios largos.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Argentina_-_Frey_climbing_33_-_looking_out_to_Cerro_Catedral_%286962264021%29.jpg/1280px-Argentina_-_Frey_climbing_33_-_looking_out_to_Cerro_Catedral_%286962264021%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Argentina_-_Frey_climbing_08_-_Frey_Lake_%286815885306%29.jpg/1280px-Argentina_-_Frey_climbing_08_-_Frey_Lake_%286815885306%29.jpg',
    ],
    precio: 210000,
    atributos: {
      dificultad: 'alta',
      duracionHoras: 10,
      temporada: ['verano', 'otonio'],
      cupoMaximo: 4,
      puntoEncuentro: 'Refugio Frey, laguna Toncek',
      incluye: [
        'Guía de escalada certificado',
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
      'Medio día de escalada deportiva a pocos minutos del centro de Bariloche. Sector de fácil acceso con vías equipadas de distintos grados, apto para quienes escalan por primera vez y también para quien quiere sumar largos.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/5/54/Fm_Ventana_Jurasico_Piltriquitron.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Man_rock_climbing_at_Homestead_Climbing_Area%2C_Tucson_AZ_Photo_courtesy_of_Joe_Sambataro_%2836882805856%29.jpg/1280px-Man_rock_climbing_at_Homestead_Climbing_Area%2C_Tucson_AZ_Photo_courtesy_of_Joe_Sambataro_%2836882805856%29.jpg',
    ],
    precio: 95000,
    atributos: {
      dificultad: 'baja',
      duracionHoras: 4,
      temporada: ['primavera', 'verano', 'otonio'],
      cupoMaximo: 6,
      puntoEncuentro: 'Base del Cerro Ventana, Ruta 40',
      incluye: [
        'Guía de escalada certificado',
        'Arnés, casco y pies de gato',
        'Cuerdas y material de seguro',
        'Seguro de actividad',
      ],
    },
  },
  {
    nombre: 'Esquí de travesía en el filo del Catedral',
    categoria: 'esqui',
    tipo: 'experiencia',
    descripcion:
      'Salida de un día fuera de pista con ascenso con pieles de foca y descenso por laderas abiertas. Se evalúa el estado del manto nival antes de decidir el recorrido. Hace falta esquiar con solvencia en pista negra.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Offpiste_skiers_getting_ready_for_descent_from_Storebj%C3%B8rn.jpg/1280px-Offpiste_skiers_getting_ready_for_descent_from_Storebj%C3%B8rn.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Skitouring_in_Krasnya_Polyana.JPG/1280px-Skitouring_in_Krasnya_Polyana.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ski_mountaineering_on_the_Gran_Paradiso.jpg/1280px-Ski_mountaineering_on_the_Gran_Paradiso.jpg',
    ],
    precio: 235000,
    disponible: false,
    atributos: {
      dificultad: 'media',
      duracionHoras: 8,
      temporada: ['invierno'],
      cupoMaximo: 5,
      puntoEncuentro: 'Base del Cerro Catedral, Villa Catedral',
      incluye: [
        'Guía de montaña certificado',
        'DVA, pala y sonda',
        'Seguro de actividad',
      ],
    },
  },

  /* ------------------------------- CURSOS ------------------------------ */
  {
    nombre: 'Curso de iniciación a la escalada deportiva',
    categoria: 'escalada',
    tipo: 'curso',
    descripcion:
      'Dos jornadas para empezar a escalar desde cero. Se trabajan nudos, encordamiento, asegurado con y sin freno asistido, comunicación entre compañeros y descenso en rappel. La práctica es en sectores equipados cerca de Bariloche.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/c/cf/Climbing_in_St._Lorenz_-_Wachau%2C_Austria.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/India_Sport_Climbing_2016.jpg/1280px-India_Sport_Climbing_2016.jpg',
    ],
    precio: 180000,
    atributos: {
      duracionHoras: 16,
      nivel: 'inicial',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 8,
      requisitosPrevios: ['Mayor de 14 años', 'Sin experiencia previa requerida'],
    },
  },
  {
    nombre: 'Curso de escalada clásica en agujas de Frey',
    categoria: 'escalada',
    tipo: 'curso',
    descripcion:
      'Cuatro días de escalada tradicional en el valle de Frey. Se aprende a colocar protección móvil, armar reuniones, planificar una vía de varios largos y gestionar el descenso. Se pernocta en el refugio.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Jumaring_Climbing.jpg/1280px-Jumaring_Climbing.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tuolumne_Meadows_-_Stately_Pleasure_Dome_-_West_Country_-_Pitch_3_-_1.JPG/1280px-Tuolumne_Meadows_-_Stately_Pleasure_Dome_-_West_Country_-_Pitch_3_-_1.JPG',
    ],
    precio: 640000,
    destacada: true,
    atributos: {
      duracionHoras: 32,
      nivel: 'avanzado',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Escalar en segundo de forma autónoma',
        'Experiencia en escalada deportiva',
        'Buen estado físico para la aproximación al Frey',
      ],
    },
  },
  {
    nombre: 'Curso de montañismo invernal: piolet y crampones',
    categoria: 'montanismo',
    tipo: 'curso',
    descripcion:
      'Tres días de técnica de progresión en nieve y hielo. Uso de crampones y piolet, autodetención, armado de anclajes en nieve, encordamiento en glaciar y lectura del terreno.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/U_S_Marine_Corps_Mountain_Warfare_Instructors_conduct_cold-weather_rescue_training_with_Argentine_marines_%288631010%29.jpg/1280px-U_S_Marine_Corps_Mountain_Warfare_Instructors_conduct_cold-weather_rescue_training_with_Argentine_marines_%288631010%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/U.S._Army_SSgt_Earl_-_lead_mountaineer_-_secures_anchor_preparing_to_rappel_into_crevasse_during_Operation_Colony_Glacier_-_June_2023.jpg/1280px-U.S._Army_SSgt_Earl_-_lead_mountaineer_-_secures_anchor_preparing_to_rappel_into_crevasse_during_Operation_Colony_Glacier_-_June_2023.jpg',
    ],
    precio: 460000,
    atributos: {
      duracionHoras: 24,
      nivel: 'intermedio',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Experiencia en trekking de montaña',
        'Buen estado físico',
      ],
    },
  },
  {
    nombre: 'Curso de esquí de travesía nivel 1',
    categoria: 'esqui',
    tipo: 'curso',
    descripcion:
      'Introducción al esquí fuera de pista: ascenso con pieles, conversiones en pendiente, manejo de la fijación de travesía y nociones de seguridad en nieve. Incluye una jornada completa de búsqueda con DVA.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ski_Mountaineering_on_the_Columbia_Icefield.jpg/1280px-Ski_Mountaineering_on_the_Columbia_Icefield.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Steve_Marolt_Skiing_Northeast_ridge_of_everest_in_2007.jpg/1280px-Steve_Marolt_Skiing_Northeast_ridge_of_everest_in_2007.jpg',
    ],
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
      'Dos jornadas intensivas sobre sistemas de polipastos, anclajes, remonte por cuerda y evacuación de un compañero. Destinado a quienes ya se mueven en terreno glaciar y quieren resolver una emergencia sin asistencia externa.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Crevasse_Self-Rescue.jpg/1280px-Crevasse_Self-Rescue.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Rope_Team_Glacier.jpg/1280px-Rope_Team_Glacier.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Crevasse_rescue_training_04.jpg/1280px-Crevasse_rescue_training_04.jpg',
    ],
    precio: 340000,
    atributos: {
      duracionHoras: 16,
      nivel: 'avanzado',
      certificacion: 'Certificado de asistencia Andes Vertical',
      cupo: 6,
      requisitosPrevios: [
        'Curso de montañismo invernal o equivalente',
        'Experiencia en progresión encordada',
      ],
    },
  },
  {
    nombre: 'Curso de orientación y navegación en montaña',
    categoria: 'trekking',
    tipo: 'curso',
    descripcion:
      'Una jornada de mapa, brújula y GPS aplicados al terreno del Nahuel Huapi. Se trabaja interpretación de curvas de nivel, rumbos, triangulación y planificación de una travesía con horarios y puntos de escape.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Het_duimkompas_met_kaart.jpg/1280px-Het_duimkompas_met_kaart.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Compasses_orienteering.jpg/1280px-Compasses_orienteering.jpg',
    ],
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
    nombre: 'Crampones técnicos de 12 puntas',
    categoria: 'montanismo',
    tipo: 'alquiler',
    descripcion:
      'Crampones de acero aptos para hielo y terreno mixto, compatibles con botas rígidas y semirrígidas. Se entregan afilados y con las correas revisadas.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Strap-on_crampon.JPG/1280px-Strap-on_crampon.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Gramp%C3%B5es.jpg/1280px-Gramp%C3%B5es.jpg',
    ],
    atributos: {
      precioPorDia: 14000,
      talles: ['Universal'],
      unidadesTotales: 8,
      unidadesDisponibles: 5,
      deposito: 60000,
    },
  },
  {
    nombre: 'Piolet técnico de montaña',
    categoria: 'montanismo',
    tipo: 'alquiler',
    descripcion:
      'Piolet clásico de progresión para pendientes de nieve y glaciar. Se entrega con dragonera regulable.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Ice_axe_pick_%26_adze_protector.JPG/1280px-Ice_axe_pick_%26_adze_protector.JPG',
    ],
    atributos: {
      precioPorDia: 11000,
      talles: ['50 cm', '60 cm', '70 cm'],
      unidadesTotales: 10,
      unidadesDisponibles: 7,
      deposito: 45000,
    },
  },
  {
    nombre: 'Arnés de escalada regulable',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Arnés con perneras regulables y cuatro portamateriales, apto para escalada deportiva, clásica y progresión en glaciar.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Petzl_Harness.jpg/1280px-Petzl_Harness.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Climbing_Chest_harnesses_DSCN1449.jpg/1280px-Climbing_Chest_harnesses_DSCN1449.jpg',
    ],
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
      'Calzado de escalada de horma neutra, cómodo para jornadas largas y para quien escala por primera vez. Se desinfectan después de cada uso.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Quechua_climbing_shoes.jpg/1280px-Quechua_climbing_shoes.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Climbing_Shoes_and_Chalk_Bag_-_02.jpg/1280px-Climbing_Shoes_and_Chalk_Bag_-_02.jpg',
    ],
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
      'Casco liviano con regulación de talle y soporte para frontal. Obligatorio en las salidas de escalada clásica y alta montaña.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Climbing_helmet.jpg/1280px-Climbing_helmet.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Wales_Rock_Climbing_Gogarth.jpg/1280px-Wales_Rock_Climbing_Gogarth.jpg',
    ],
    atributos: {
      precioPorDia: 6000,
      talles: ['Único regulable'],
      unidadesTotales: 20,
      unidadesDisponibles: 16,
      deposito: 20000,
    },
  },
  {
    nombre: 'Cuerda dinámica 60 metros',
    categoria: 'escalada',
    tipo: 'alquiler',
    descripcion:
      'Cuerda simple de 9,8 mm y 60 metros con tratamiento hidrófugo. Se lleva registro de caídas y horas de uso de cada unidad.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Knoten_002_2024_02_20.jpg/1280px-Knoten_002_2024_02_20.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Climbing_rope_Lanex_Rocky_9%2C8mm.jpg/1280px-Climbing_rope_Lanex_Rocky_9%2C8mm.jpg',
    ],
    atributos: {
      precioPorDia: 22000,
      talles: ['60 m'],
      unidadesTotales: 6,
      unidadesDisponibles: 3,
      deposito: 120000,
    },
  },
  {
    nombre: 'Equipo completo de esquí de travesía',
    categoria: 'esqui',
    tipo: 'alquiler',
    descripcion:
      'Esquís con fijación de travesía, botas y pieles de foca cortadas a medida del esquí. El ajuste de fijación se hace en el local antes de la salida.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Tourenski_Pin_Bindung_20250201a.jpg/1280px-Tourenski_Pin_Bindung_20250201a.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ski_touring_boots_and_bindings_using_NNN-BC.jpg/1280px-Ski_touring_boots_and_bindings_using_NNN-BC.jpg',
    ],
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
      'Detector de víctimas de avalancha digital de tres antenas, pala de aluminio y sonda de 240 cm. Se entrega con las pilas cargadas y una explicación de uso.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Avalanche-security_search_and_rescue_equipment.jpg/1280px-Avalanche-security_search_and_rescue_equipment.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Avalanche_Victim_Device.JPG/1280px-Avalanche_Victim_Device.JPG',
    ],
    atributos: {
      precioPorDia: 26000,
      talles: ['Único'],
      unidadesTotales: 8,
      unidadesDisponibles: 6,
      deposito: 150000,
    },
  },
  {
    nombre: 'Mochila de travesía 65 litros',
    categoria: 'trekking',
    tipo: 'alquiler',
    descripcion:
      'Mochila con espalda regulable, cinturón acolchado y funda de lluvia. Capacidad pensada para travesías de tres a cinco días con pernocte en refugio.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Hiker_in_the_Mountains_%2848920132448%29.jpg/1280px-Hiker_in_the_Mountains_%2848920132448%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Mountaineering_Man_Trail_Path_Mountains.jpg/1280px-Mountaineering_Man_Trail_Path_Mountains.jpg',
    ],
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
      'Raquetas con alza de talón para caminar sobre nieve profunda. Se entregan con bastones telescópicos incluidos.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/The_sun_barely_poking_through_the_winter_clouds_while_snowshoeing_on_Bentley_Lake._-_panoramio.jpg/1280px-The_sun_barely_poking_through_the_winter_clouds_while_snowshoeing_on_Bentley_Lake._-_panoramio.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Snowshoeing_in_Hokkaido.jpg/1280px-Snowshoeing_in_Hokkaido.jpg',
    ],
    atributos: {
      precioPorDia: 13000,
      talles: ['Único regulable'],
      unidadesTotales: 10,
      unidadesDisponibles: 10,
      deposito: 50000,
    },
  },
  {
    nombre: 'Carpa de montaña para dos personas',
    categoria: 'campamento',
    tipo: 'alquiler',
    descripcion:
      'Carpa de dos capas con varillas de aluminio, resistente a viento fuerte. Se entrega seca, con sobretecho, piqueteros y vientos completos.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Camping_in_Chugach_State_Park._Chugach_Mountains%2C_Alaska.jpg/1280px-Camping_in_Chugach_State_Park._Chugach_Mountains%2C_Alaska.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cedar_Lake_snow_tent_mountains_WIC_NPS_Photo_9.15.06_%2822306646353%29.jpg/1280px-Cedar_Lake_snow_tent_mountains_WIC_NPS_Photo_9.15.06_%2822306646353%29.jpg',
    ],
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
      'Bolsa de pluma con temperatura de confort de -10 grados, apta para las noches de refugio y vivac en verano patagónico. Se entrega lavada y con bolsa de compresión.',
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/OutDoor_2018%2C_Friedrichshafen_%281X7A0298%29.jpg/1280px-OutDoor_2018%2C_Friedrichshafen_%281X7A0298%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nomad%2C_OutDoor_2018%2C_Friedrichshafen_%281X7A0319%29.jpg/1280px-Nomad%2C_OutDoor_2018%2C_Friedrichshafen_%281X7A0319%29.jpg',
    ],
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
    asunto: 'Cupos para la travesía de los 4 refugios en enero',
    mensaje:
      'Hola, somos tres y queríamos hacer la travesía de los 4 refugios la segunda semana de enero. Nunca dormimos en refugio, ¿hay que llevar bolsa de dormir?',
    estado: 'pendiente',
    publicacion: 'Travesía de los 4 Refugios',
  },
  {
    nombre: 'Diego Ferreyra',
    email: 'diego.ferreyra@mail.com',
    asunto: 'Nivel necesario para el curso de escalada clásica',
    mensaje:
      'Buenas. Escalo deportiva hace dos años en rocódromo y algo de roca, pero nunca puse protección móvil. ¿Me alcanza para el curso de cuatro días en Frey?',
    estado: 'leida',
    publicacion: 'Curso de escalada clásica en agujas de Frey',
  },
  {
    nombre: 'Sofía Bianchi',
    email: 'sofia.bianchi@mail.com',
    telefono: '+54 294 4778899',
    asunto: 'Alquiler de crampones por tres días',
    mensaje:
      'Hola, necesito crampones del 39 para una salida al Tronador del 12 al 15. ¿Los tienen disponibles para esas fechas?',
    estado: 'respondida',
    publicacion: 'Crampones técnicos de 12 puntas',
  },
  {
    nombre: 'Julián Medina',
    email: 'julian.medina@mail.com',
    asunto: 'Salidas para grupos de empresa',
    mensaje:
      'Buen día. Trabajo en una empresa de Buenos Aires y estamos organizando un viaje de equipo a Bariloche para marzo. ¿Hacen salidas para grupos de 20 personas?',
    estado: 'pendiente',
  },
];