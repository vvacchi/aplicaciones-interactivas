import { Router } from 'express';
import categoriasRoutes from './api/categorias.routes.js';

const router = Router();

router.use('/categorias', categoriasRoutes);

export default router;