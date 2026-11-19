# Andes Vertical · Frontend

Sitio público y panel de administración, en React 19 + React Router 7 + Vite 8, con CSS propio (CSS Modules y variables globales, sin librerías de componentes).

La descripción del proyecto y la documentación están en el [README de la raíz](../README.md) y en [`docs/`](../docs/).

## Comandos

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # versión de producción en dist/
npm run preview   # sirve la versión de producción
npm run lint      # Oxlint
```

La API se toma de `VITE_API_URL` (por defecto `http://localhost:4000/api`).

## Estructura

```
src/
├── api/          cliente.js (único punto de salida a la API) y un archivo por recurso
├── componentes/  piezas reutilizables: Boton, Campo, Modal, TarjetaPublicacion, layouts…
├── contexto/     AuthContext: sesión del panel (JWT en localStorage)
├── hooks/        usePedido (lecturas) y useFormulario (formularios con validación)
├── paginas/
│   ├── publico/  portada, catálogo, detalle, contacto, recuperar contraseña
│   └── admin/    ingreso, registro, resumen, publicaciones, categorías, consultas, comercio, perfil
├── estilos/      tokens.css (colores, tipografía, espacios) y global.css
├── utils/        formato de precios y fechas, textos de los enums, validaciones
└── rutas.jsx     mapa de rutas
```
