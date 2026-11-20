import { Router } from 'express';
import * as authController from '../../controllers/auth.controller.js';
import { validar } from '../../middlewares/validacion.middleware.js';
import { autenticar, exigirRol } from '../../middlewares/auth.middleware.js';
import { limitarIntentos } from '../../middlewares/limite.middleware.js';
import {
  registroSchema,
  loginSchema,
  actualizarPerfilSchema,
  recuperarPasswordSchema,
  resetearPasswordSchema,
} from '../../validaciones/auth.validacion.js';

const router = Router();

// Cada ruta lleva su propio contador: equivocarse en el login no
// bloquea la recuperacion de la contraseña.
const intentosLogin = limitarIntentos({ maximo: 5, ventanaMinutos: 15 });
const intentosRecuperar = limitarIntentos({ maximo: 5, ventanaMinutos: 15 });
const intentosResetear = limitarIntentos({ maximo: 10, ventanaMinutos: 15 });

/**
 * Solo un administrador con sesion puede crear otro: si el registro
 * fuera publico, cualquiera podria darse acceso al panel. El primer
 * administrador lo crea el seed.
 */
router.post(
  '/registro',
  autenticar,
  exigirRol('admin'),
  validar({ body: registroSchema }),
  authController.registrar
);

router.post('/login', intentosLogin, validar({ body: loginSchema }), authController.login);

router.post(
  '/recuperar-password',
  intentosRecuperar,
  validar({ body: recuperarPasswordSchema }),
  authController.recuperarPassword
);

router.post(
  '/resetear-password',
  intentosResetear,
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