import 'dotenv/config';
import app from './src/app.js'; //Si uso ESM tengo que escribir la extension, ej: .js para el caso este de app; en CommmonJS no

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
