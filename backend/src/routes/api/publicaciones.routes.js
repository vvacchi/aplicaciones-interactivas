import { Router } from 'express';
import * as publicacionesController from '../../controllers/publicaciones.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import {
  autenticar,
  autenticacionOpcional,
  exigirRol,
} from '../../middlewares/auth.middleware.js';
import { idParamSchema } from '../../validaciones/comun.validacion.js';
import {
  crearPublicacionSchema,
  actualizarPublicacionSchema,
  listarPublicacionesSchema,
} from '../../validaciones/publicaciones.validacion.js';

const router = Router();
const soloAdmin = [autenticar, exigirRol('admin')];

/* Publico: catalogo y detalle. Las publicaciones desactivadas solo las
   ve el administrador, por eso la autenticacion opcional. */

router.get(
  '/',
  autenticacionOpcional,
  validar({ query: listarPublicacionesSchema }),
  publicacionesController.listar
);

router.get(
  '/:id',
  autenticacionOpcional,
  validar({ params: idParamSchema }),
  publicacionesController.obtener
);

/* Panel de administracion */

router.post(
  '/',
  soloAdmin,
  validar({ body: crearPublicacionSchema }),
  publicacionesController.crear
);

router.put(
  '/:id',
  soloAdmin,
  validar({ params: idParamSchema, body: actualizarPublicacionSchema }),
  publicacionesController.actualizar
);

router.delete(
  '/:id',
  soloAdmin,
  validar({ params: idParamSchema }),
  publicacionesController.eliminar
);

export default router;