import { Router } from 'express';
import * as categoriasController from '../../controllers/categorias.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { idParamSchema } from '../../validaciones/comun.validacion.js';
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
  listarCategoriasSchema,
} from '../../validaciones/categorias.validacion.js';

const router = Router();

router.get(
  '/',
  validar({ query: listarCategoriasSchema }),
  categoriasController.listar
);

router.get(
  '/:id',
  validar({ params: idParamSchema }),
  categoriasController.obtener
);

router.post(
  '/',
  validar({ body: crearCategoriaSchema }),
  categoriasController.crear
);

router.put(
  '/:id',
  validar({ params: idParamSchema, body: actualizarCategoriaSchema }),
  categoriasController.actualizar
);

router.delete(
  '/:id',
  validar({ params: idParamSchema }),
  categoriasController.eliminar
);

export default router;