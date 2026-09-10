import { Router } from 'express';
import * as authController from '../../controllers/auth.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { autenticar } from '../../middlewares/auth.middleware.js';
import {
  registroSchema,
  loginSchema,
  actualizarPerfilSchema,
  recuperarPasswordSchema,
  resetearPasswordSchema,
} from '../../validaciones/auth.validacion.js';

const router = Router();

router.post(
  '/registro',
  validar({ body: registroSchema }),
  authController.registrar
);

router.post('/login', validar({ body: loginSchema }), authController.login);

router.post(
  '/recuperar-password',
  validar({ body: recuperarPasswordSchema }),
  authController.recuperarPassword
);

router.post(
  '/resetear-password',
  validar({ body: resetearPasswordSchema }),
  authController.resetearPassword
);

router.get('/perfil', autenticar, authController.perfil);

router.put(
  '/perfil',
  autenticar,
  validar({ body: actualizarPerfilSchema }),
  authController.actualizarPerfil
);

export default router;