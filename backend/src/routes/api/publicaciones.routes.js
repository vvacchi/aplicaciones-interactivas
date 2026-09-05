import { Router } from 'express';
import * as publicacionesController from '../../controllers/publicaciones.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { idParamSchema } from '../../validaciones/comun.validacion.js';
import {
  crearPublicacionSchema,
  actualizarPublicacionSchema,
  listarPublicacionesSchema,
} from '../../validaciones/publicaciones.validacion.js';

const router = Router();

router.get(
  '/',
  validar({ query: listarPublicacionesSchema }),
  publicacionesController.listar
);

router.get(
  '/:id',
  validar({ params: idParamSchema }),
  publicacionesController.obtener
);

router.post(
  '/',
  validar({ body: crearPublicacionSchema }),
  publicacionesController.crear
);

router.put(
  '/:id',
  validar({ params: idParamSchema, body: actualizarPublicacionSchema }),
  publicacionesController.actualizar
);

router.delete(
  '/:id',
  validar({ params: idParamSchema }),
  publicacionesController.eliminar
);

export default router;