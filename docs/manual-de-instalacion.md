# Manual de instalación

Cómo levantar Andes Vertical en una máquina nueva, en modo desarrollo.

## Requisitos

- **Node.js 22.14 o superior**, con npm. Se puede verificar con `node -v`.
- **Una base MongoDB**, que puede ser:
  - una instancia local (por ejemplo, MongoDB Community Server), o
  - un clúster de **MongoDB Atlas**. En ese caso, la IP de la máquina tiene que estar habilitada en *Network Access* del clúster.
- Una cuenta de correo con acceso SMTP, para enviar los mails del sistema: el aviso de cada consulta nueva, la recuperación de contraseña y las respuestas a las consultas desde el panel. Sin ella, todo lo demás funciona.

El proyecto tiene dos aplicaciones independientes, cada una con su propio `package.json`:

| Carpeta | Qué es | Puerto |
|---|---|---|
| `backend/` | API REST (Express + MongoDB) | 4000 |
| `frontend/` | Sitio público y panel (React + Vite) | 5173 |

## 1. Backend

```bash
cd backend
npm install
```

### Variables de entorno

Crear el archivo `backend/.env` (se puede partir de `backend/.env.example`):

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/andes-vertical
JWT_SECRET=una-clave-larga-y-secreta
JWT_EXPIRA=7d

# Direcciones del frontend que pueden llamar a la API (separadas por coma)
CORS_ORIGENES=http://localhost:5173

# Correo saliente (recuperar la contraseña y responder consultas)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cuenta@gmail.com
SMTP_PASS=clave-de-aplicacion
MAIL_FROM="Andes Vertical <cuenta@gmail.com>"
APP_URL=http://localhost:5173
```

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `PORT` | No (4000) | Puerto de la API |
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB (local o Atlas) |
| `JWT_SECRET` | Sí | Clave con la que se firman las sesiones |
| `JWT_EXPIRA` | No (`7d`) | Duración de la sesión del panel |
| `CORS_ORIGENES` | No (`http://localhost:5173`) | Direcciones del frontend que pueden usar la API desde el navegador, separadas por coma. Si el frontend corre en otra dirección o puerto, agregarla acá |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Para los mails | Servidor de correo saliente. Con el puerto 465 se usa TLS directo; con 587, STARTTLS |
| `MAIL_FROM` | No (`SMTP_USER`) | Remitente de los mails. A esa misma casilla llega el aviso de cada consulta nueva |
| `APP_URL` | No (`http://localhost:5173`) | Dirección del frontend, para armar los enlaces de los mails (recuperación y consulta en el panel) |

Sin las variables `SMTP_*`, todo el sistema funciona menos el envío de mails:
- **Aviso de consulta nueva:** la consulta se guarda igual y aparece en el panel; el error queda en la consola del backend.
- **Recuperar contraseña:** el pedido responde igual (para no revelar qué cuentas existen) y el error queda en la consola del backend.
- **Responder una consulta desde el panel:** el panel muestra «No se pudo enviar el mail» y la consulta queda como estaba, sin guardar la respuesta.

### Cargar los datos de ejemplo

```bash
npm run seed
```

> **Atención:** el seed **vacía** las colecciones (usuarios, comercio, categorías, publicaciones y consultas) antes de cargarlas. Correrlo sobre una base con datos reales los borra.

Carga el comercio, un administrador, 5 categorías, 27 publicaciones y 4 consultas. El mail y la contraseña del administrador están en `backend/src/seed/datos.js` (constante `ADMIN`). Las imágenes de ejemplo son URLs de Wikimedia Commons (créditos en [`creditos-imagenes.md`](creditos-imagenes.md)), así que necesitan conexión a internet para verse.

No hay registro público: ese administrador es el primero, y desde el panel (*Administradores*) puede crear otras cuentas.

### Levantar la API

```bash
npm run dev      # con recarga automática (nodemon)
# o
npm start        # sin recarga
```

Si todo está bien, la consola muestra `MongoDB conectado` y `Servidor escuchando en http://localhost:4000`. Se puede comprobar abriendo http://localhost:4000/api/comercio.

## 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El sitio queda en **http://localhost:5173** y el panel en **http://localhost:5173/admin**.

Por defecto, el frontend usa la API en `http://localhost:4000/api`. Si la API está en otra dirección, crear `frontend/.env` con:

```env
VITE_API_URL=http://otra-direccion:4000/api
```

### Versión de producción

```bash
npm run build     # genera frontend/dist
npm run preview   # sirve esa versión para probarla
```

## Comandos

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend/` | `npm run dev` | API con recarga automática |
| `backend/` | `npm start` | API sin recarga |
| `backend/` | `npm run seed` | Vacía la base y carga los datos de ejemplo |
| `frontend/` | `npm run dev` | Sitio en modo desarrollo |
| `frontend/` | `npm run build` | Versión de producción en `dist/` |
| `frontend/` | `npm run preview` | Sirve la versión de producción |
| `frontend/` | `npm run lint` | Revisa el código con Oxlint |

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El backend no conecta a MongoDB y se corta al iniciar | En Atlas, la IP de la máquina no está habilitada | Agregarla en *Network Access* del clúster |
| El sitio muestra «No se pudo conectar con el servidor» | La API no está levantada o `VITE_API_URL` apunta a otro lado | Levantar el backend y revisar la variable |
| `EADDRINUSE` al levantar el backend o el frontend | El puerto ya está en uso (otra instancia abierta) | Cerrar la otra instancia o cambiar `PORT` |
| No llega el mail de recuperación ni el aviso de consulta nueva, o al responder una consulta aparece «No se pudo enviar el mail» | Faltan las variables `SMTP_*` o son incorrectas | Revisar la consola del backend, que indica qué falta |
| La portada no muestra «Nosotros» ni los horarios | Todavía no se cargaron los datos del comercio | Correr el seed o cargarlos en *Panel → Comercio* |
| El sitio carga pero la API falla con un error de CORS en la consola del navegador | El frontend corre en una dirección que no está en `CORS_ORIGENES` (por ejemplo, Vite abrió en 5174 porque 5173 estaba ocupado) | Cerrar la otra instancia o agregar la dirección a `CORS_ORIGENES` y reiniciar el backend |
| El ingreso responde «Demasiados intentos fallidos» | Hubo 5 intentos fallidos seguidos desde esa computadora | Esperar 15 minutos o reiniciar el backend (el contador se guarda en memoria) |
| Los cambios del backend no se ven aunque se guardó el archivo | En Windows, `nodemon` a veces no cierra el proceso anterior y sigue respondiendo el código viejo | Cerrar la terminal del backend (o terminar el proceso `node` que usa el puerto 4000) y volver a levantarlo |
