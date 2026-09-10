import { Router } from 'express';
import authRoutes from './api/auth.routes.js';
import categoriasRoutes from './api/categorias.routes.js';
import publicacionesRoutes from './api/publicaciones.routes.js';
import comercioRoutes from './api/comercio.routes.js';
import consultasRoutes from './api/consultas.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/publicaciones', publicacionesRoutes);
router.use('/comercio', comercioRoutes);
router.use('/consultas', consultasRoutes);

export default router;