import 'dotenv/config';
import app from './src/app.js';
import { conectarDB } from './src/config/db.js';

const PORT = process.env.PORT || 4000;

await conectarDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});