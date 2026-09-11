import { Router } from 'express';
import * as comercioController from '../../controllers/comercio.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { autenticar, exigirRol } from '../../middlewares/auth.middleware.js';
import { guardarComercioSchema } from '../../validaciones/comercio.validacion.js';

const router = Router();

/**
 * Sin `/:id` porque el comercio es un unico documento:
 * pedir "el comercio numero 3" no significa nada en este dominio.
 */

/** Publico: lo consumen el header, el footer y la pagina de contacto. */
router.get('/', comercioController.obtener);

router.put(
  '/',
  autenticar,
  exigirRol('admin'),
  validar({ body: guardarComercioSchema }),
  comercioController.guardar
);

export default router;