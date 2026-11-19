# Andes Vertical

Plataforma web de **Andes Vertical**, un operador de montaña adaptado a la localidad de San Carlos de Bariloche con tres líneas de negocio: experiencias guiadas, escuela de montaña y alquiler de equipo técnico.

El sitio público muestra el catálogo y permite enviar consultas. No hay carrito ni pagos: la conversión es la consulta. El panel de administración permite gestionar todo lo que se ve en el sitio.

## Qué incluye

**Sitio público**
- Portada con propuestas destacadas, exploración por tipo y por categoría, información del comercio y horarios.
- Catálogo con búsqueda por texto, filtros (tipo, categoría, disponibilidad, precio), orden y paginación. Los filtros quedan en la dirección y se pueden compartir.
- Detalle de cada publicación con galería de imágenes, datos según el tipo y botón **Consultar**.
- Alquiler y experiencias permiten elegir fechas tentativas; en alquiler se muestra el total estimado.
- Formulario de contacto que llega precargado con la publicación y las fechas elegidas.

**Panel de administración**
- Resumen con consultas sin leer y totales del catálogo.
- Publicaciones: alta, edición, ocultar del sitio y borrado.
- Categorías: alta, edición, ocultar y borrado (solo si no tienen publicaciones).
- Consultas: bandeja con estados (pendiente, leída, respondida), respuesta por mail y borrado.
- Datos del comercio: presentación, contacto, redes y horarios.
- Ingreso, registro, recuperación de contraseña por mail y perfil.

## Tecnologías

| Parte | Stack |
|---|---|
| Backend (`backend/`) | Node.js 22, Express 5, MongoDB con Mongoose 9, validación con Zod 4, JWT, Nodemailer |
| Frontend (`frontend/`) | React 19, React Router 7, Vite 8, CSS propio con CSS Modules (sin librerías de componentes) |

## Documentación

| Documento | Contenido |
|---|---|
| [Descripción funcional](docs/descripcion-funcional.md) | Qué hace el sistema, quién lo usa y las reglas de negocio |
| [Modelo de datos](docs/modelo-de-datos.md) | Colecciones, campos y relaciones |
| [Diagrama de navegación](docs/diagrama-de-navegacion.md) | Pantallas y cómo se pasa de una a otra |
| [Manual de instalación](docs/manual-de-instalacion.md) | Cómo levantar el proyecto en una máquina nueva |

## Inicio rápido

Requiere Node.js 22.14 o superior y una base MongoDB (local o Atlas). El detalle está en el [manual de instalación](docs/manual-de-instalacion.md).

```bash
# Backend (puerto 4000)
cd backend
npm install
# crear backend/.env a partir de backend/.env.example
npm run seed     # carga los datos de ejemplo (vacía la base)
npm run dev

# Frontend (puerto 5173), en otra terminal
cd frontend
npm install
npm run dev
```

El sitio queda en http://localhost:5173 y el panel en http://localhost:5173/admin.

## Estructura del repositorio

```
aplicaciones-interactivas/
├── backend/     API REST (Express + MongoDB)
├── frontend/    Sitio público y panel (React + Vite)
└── docs/        Documentación del TPO
```
