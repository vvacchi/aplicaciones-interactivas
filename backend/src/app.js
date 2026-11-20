import express from 'express';
import { z } from 'zod';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Mensajes de error de Zod en español.
z.config(z.locales.es());

const app = express();

/**
 * Solo el frontend del proyecto puede llamar a la API desde un navegador.
 * CORS_ORIGENES admite varias direcciones separadas por coma (por ejemplo,
 * el sitio publicado y el de desarrollo). Postman o curl no pasan por CORS:
 * lo que protege los datos es la autenticacion de cada ruta.
 */
const origenes = (process.env.CORS_ORIGENES || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors({ origin: origenes }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Bariloche - v1', estado: 'ok' });
});

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;