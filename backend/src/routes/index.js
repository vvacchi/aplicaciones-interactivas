import { Router } from 'express';
import categoriasRoutes from './api/categorias.routes.js';
import publicacionesRoutes from './api/publicaciones.routes.js';

const router = Router();

router.use('/categorias', categoriasRoutes);
router.use('/publicaciones', publicacionesRoutes);

export default router;