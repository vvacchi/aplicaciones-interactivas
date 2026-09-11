import { Router } from 'express';
import * as categoriasController from '../../controllers/categorias.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import {
  autenticar,
  autenticacionOpcional,
  exigirRol,
} from '../../middlewares/auth.middleware.js';
import { idParamSchema } from '../../validaciones/comun.validacion.js';
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
  listarCategoriasSchema,
} from '../../validaciones/categorias.validacion.js';

const router = Router();
const soloAdmin = [autenticar, exigirRol('admin')];

/* Publico: el catalogo del sitio necesita las categorias para los filtros. */

router.get(
  '/',
  autenticacionOpcional,
  validar({ query: listarCategoriasSchema }),
  categoriasController.listar
);

router.get(
  '/:id',
  autenticacionOpcional,
  validar({ params: idParamSchema }),
  categoriasController.obtener
);

/* Panel de administracion */

router.post(
  '/',
  soloAdmin,
  validar({ body: crearCategoriaSchema }),
  categoriasController.crear
);

router.put(
  '/:id',
  soloAdmin,
  validar({ params: idParamSchema, body: actualizarCategoriaSchema }),
  categoriasController.actualizar
);

router.delete(
  '/:id',
  soloAdmin,
  validar({ params: idParamSchema }),
  categoriasController.eliminar
);

export default router;