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

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Bariloche - v1', estado: 'ok' });
});

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;