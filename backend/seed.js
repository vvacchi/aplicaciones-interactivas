/**
 * Script de precarga de la base de datos.
 *
 *   npm run seed
 *
 * Vacia las colecciones y vuelve a cargarlas con los datos de
 * `src/seed/datos.js`. Se puede correr las veces que haga falta: el
 * resultado siempre es el mismo.
 *
 * Antes de insertar, cada publicacion se valida contra el mismo schema
 * de Zod que usa la API. Asi el seed no puede cargar nada que la API
 * hubiera rechazado.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { z } from 'zod';

import Usuario from './src/models/Usuario.model.js';
import Comercio from './src/models/Comercio.model.js';
import Categoria from './src/models/Categoria.model.js';
import Publicacion from './src/models/Publicacion.model.js';
import Consulta from './src/models/Consulta.model.js';

import { crearPublicacionSchema } from './src/validaciones/publicaciones.validacion.js';
import { CATEGORIAS, COMERCIO, ADMIN, PUBLICACIONES, CONSULTAS } from './src/seed/datos.js';

z.config(z.locales.es());

const paso = (texto) => console.log(`  ${texto}`);

const conectar = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta la variable de entorno MONGODB_URI');
  await mongoose.connect(uri);
  paso(`Conectado a ${mongoose.connection.name}`);
};

const vaciar = async () => {
  const [usuarios, comercios, categorias, publicaciones, consultas] = await Promise.all([
    Usuario.deleteMany({}),
    Comercio.deleteMany({}),
    Categoria.deleteMany({}),
    Publicacion.deleteMany({}),
    Consulta.deleteMany({}),
  ]);
  const total =
    usuarios.deletedCount +
    comercios.deletedCount +
    categorias.deletedCount +
    publicaciones.deletedCount +
    consultas.deletedCount;
  paso(`Colecciones vaciadas (${total} documentos eliminados)`);
};

const cargarCategorias = async () => {
  const creadas = await Categoria.insertMany(
    CATEGORIAS.map(({ clave, ...datos }) => datos)
  );

  // Indice por clave interna para poder enlazar las publicaciones.
  const porClave = new Map();
  CATEGORIAS.forEach(({ clave }, i) => porClave.set(clave, creadas[i]._id));

  paso(`${creadas.length} categorias`);
  return porClave;
};

const cargarAdmin = async () => {
  // `create` dispara el hook pre('save') que hashea la contrasena.
  // `insertMany` no lo haria y la password quedaria en texto plano.
  const usuario = await Usuario.create(ADMIN);
  paso(`Administrador: ${usuario.email}`);
};

const cargarComercio = async () => {
  await Comercio.create(COMERCIO);
  paso(`Ficha institucional: ${COMERCIO.nombre}`);
};

const cargarPublicaciones = async (categoriasPorClave) => {
  const aInsertar = PUBLICACIONES.map((publicacion, indice) => {
    const { categoria: clave, ...resto } = publicacion;

    const categoriaId = categoriasPorClave.get(clave);
    if (!categoriaId) {
      throw new Error(
        `La publicacion "${publicacion.nombre}" apunta a la categoria "${clave}", que no existe`
      );
    }

    const candidata = { ...resto, categoria: categoriaId.toString() };
    const resultado = crearPublicacionSchema.safeParse(candidata);

    if (!resultado.success) {
      const detalle = resultado.error.issues
        .map((i) => `${i.path.join('.') || '(raiz)'}: ${i.message}`)
        .join('\n      ');
      throw new Error(
        `La publicacion ${indice + 1} ("${publicacion.nombre}") no es valida:\n      ${detalle}`
      );
    }

    return resultado.data;
  });

  const creadas = await Publicacion.insertMany(aInsertar);

  const porTipo = creadas.reduce((acc, p) => {
    acc[p.tipo] = (acc[p.tipo] || 0) + 1;
    return acc;
  }, {});
  const resumen = Object.entries(porTipo)
    .map(([tipo, cantidad]) => `${cantidad} ${tipo}`)
    .join(', ');

  paso(`${creadas.length} publicaciones (${resumen})`);
  return creadas;
};

const cargarConsultas = async (publicaciones) => {
  const porNombre = new Map(publicaciones.map((p) => [p.nombre, p._id]));

  const aInsertar = CONSULTAS.map((consulta) => {
    const { publicacion: nombre, ...resto } = consulta;
    if (!nombre) return resto;

    const id = porNombre.get(nombre);
    if (!id) {
      throw new Error(
        `La consulta de ${consulta.nombre} apunta a "${nombre}", que no es ninguna publicacion`
      );
    }
    return { ...resto, publicacion: id };
  });

  const creadas = await Consulta.insertMany(aInsertar);
  paso(`${creadas.length} consultas`);
};

const sincronizarIndices = async () => {
  // Crea el indice de texto de publicaciones y el unique de email,
  // que son los que usan la busqueda y el registro.
  await Promise.all([
    Publicacion.syncIndexes(),
    Usuario.syncIndexes(),
    Categoria.syncIndexes(),
  ]);
  paso('Indices sincronizados');
};

const main = async () => {
  console.log('\nPrecarga de la base de datos\n');

  await conectar();
  await vaciar();

  const categorias = await cargarCategorias();
  await cargarAdmin();
  await cargarComercio();
  const publicaciones = await cargarPublicaciones(categorias);
  await cargarConsultas(publicaciones);
  await sincronizarIndices();

  console.log(`\nListo. Ingresar al panel con ${ADMIN.email} / ${ADMIN.password}\n`);
};

try {
  await main();
} catch (error) {
  console.error(`\nLa precarga fallo: ${error.message}\n`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}