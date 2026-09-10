import { Router } from 'express';
import * as consultasController from '../../controllers/consultas.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { idParamSchema } from '../../validaciones/comun.validacion.js';
import {
  crearConsultaSchema,
  cambiarEstadoSchema,
  listarConsultasSchema,
} from '../../validaciones/consultas.validacion.js';

const router = Router();

/** Publico: es el formulario de contacto del sitio. */
router.post(
  '/',
  validar({ body: crearConsultaSchema }),
  consultasController.crear
);

router.get(
  '/',
  validar({ query: listarConsultasSchema }),
  consultasController.listar
);

router.get(
  '/:id',
  validar({ params: idParamSchema }),
  consultasController.obtener
);

/**
 * El estado tiene su propio endpoint porque es la unica parte editable
 * de una consulta: el resto lo escribio el visitante y no se toca.
 */
router.put(
  '/:id/estado',
  validar({ params: idParamSchema, body: cambiarEstadoSchema }),
  consultasController.cambiarEstado
);

router.delete(
  '/:id',
  validar({ params: idParamSchema }),
  consultasController.eliminar
);

export default router;