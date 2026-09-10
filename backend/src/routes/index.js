import { Router } from 'express';
import categoriasRoutes from './api/categorias.routes.js';
import publicacionesRoutes from './api/publicaciones.routes.js';
import comercioRoutes from './api/comercio.routes.js';

const router = Router();

router.use('/categorias', categoriasRoutes);
router.use('/publicaciones', publicacionesRoutes);
router.use('/comercio', comercioRoutes);

export default router;