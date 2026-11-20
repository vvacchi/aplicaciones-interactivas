# Guion de la demo

Recorrido paso a paso para presentar Andes Vertical. Toma unos 15 a 20 minutos. La lista completa de pruebas, con sus resultados, está en la [guía de pruebas](guia-de-pruebas.md). Cada paso dice **qué hacer** y **qué mostrar o decir**. Los datos que se crean durante la demo llevan la palabra «Demo» y se borran en la misma demo, así la base queda como estaba.

## 0. Antes de empezar

1. Cerrar cualquier backend o frontend que haya quedado abierto (si el puerto 4000 o 5173 está ocupado, el nuevo no arranca o arranca en otro puerto).
2. Levantar el backend: `cd backend` → `npm run dev`. Esperar `MongoDB conectado` y `Servidor escuchando en http://localhost:4000`.
3. Levantar el frontend: `cd frontend` → `npm run dev`. Tiene que quedar en **http://localhost:5173** (es el único origen que el backend acepta por CORS).
4. Abrir dos pestañas: el sitio (http://localhost:5173) y el panel (http://localhost:5173/admin/login), y tener a mano el mail y la contraseña del administrador.
5. Si se va a mostrar la API con Postman, tener abierta la colección.

## 1. Sitio público (lo que ve un visitante)

| # | Hacer | Mostrar / decir |
|---|---|---|
| 1.1 | Abrir la portada | Hero, «¿Qué querés hacer?» por tipo o por categoría, propuestas destacadas, «Nosotros», horarios y contacto. Todo sale de la API. |
| 1.2 | Escribir «frey» en el buscador de la cabecera | La búsqueda exige todas las palabras y busca en nombre, descripción y categoría, sin importar tildes ni mayúsculas. |
| 1.3 | Probar «trekking» y después «campamento y vivac» | Encuentra por categoría y no se confunde con palabras como «y» o «de». |
| 1.4 | Ir a **Experiencias** | Aparecen los filtros de **Dificultad** y **Temporada** (buscador avanzado). Marcar «Alta» y «Media», y después «Verano»: 6 resultados. Mirar la dirección: los filtros quedan en la URL, se puede copiar y compartir. |
| 1.5 | Ir a **Cursos** y marcar **Inicial** | El filtro cambia según el tipo: los cursos se filtran por nivel. |
| 1.6 | Ir a **Alquiler** y elegir retiro y devolución (por ejemplo 6 días) | Cada equipo muestra el **total estimado**. Aclarar que las fechas no reservan: son información para la consulta. |
| 1.7 | Abrir un equipo (por ejemplo, crampones) | Galería, datos según el tipo, precio por día, fechas y total. |
| 1.8 | Tocar **Consultar** | El formulario llega con la publicación asociada (se manda su id), el asunto y el mensaje precargados con las fechas. |
| 1.9 | Enviar vacío | Errores por campo y el foco va al primero. |
| 1.10 | Completar con nombre «Demo Profesora», un mail cualquiera, y enviar | Confirmación «¡Gracias, …!». Esta consulta se usa en el panel. Mostrar en la casilla del comercio el mail «Consulta nueva: …» con el botón para abrirla en el panel. |
| 1.11 | Achicar la ventana a celular (o abrir las herramientas de desarrollo en 360 px) | Diseño pensado primero para celular: menú, filtros plegables, tarjetas. |

## 2. Panel de administración

| # | Hacer | Mostrar / decir |
|---|---|---|
| 2.1 | Abrir http://localhost:5173/admin sin sesión | Lleva al ingreso: las rutas del panel están protegidas. |
| 2.2 | Ingresar | **Resumen**: consultas sin leer (sumó la de recién), totales por tipo, últimas consultas. |
| 2.3 | Tocar la consulta «Demo Profesora» | Bandeja de consultas: datos de quien escribió, sobre qué publicación consulta, mensaje. |
| 2.4 | Escribir una respuesta y tocar **Enviar respuesta** | El mail sale desde la cuenta de Andes Vertical al mail de quien consultó (usar uno propio para mostrarlo llegar). La consulta pasa sola a **Respondida** y la respuesta queda guardada debajo. |
| 2.5 | **Categorías** → «Nueva categoría»: «Demo categoría» | Alta en una ventana, con validación. Muestra cuántas publicaciones tiene cada categoría. |
| 2.6 | **Publicaciones** → «Nueva publicación» → Alquiler | El formulario cambia según el tipo. Completar «Demo equipo», categoría «Demo categoría», una descripción de 20 caracteres o más, precio por día «1.500» (se escribe como en Argentina), 2 unidades totales y 1 disponible. Agregar una imagen pegando una URL (por ejemplo la de cualquier foto de Commons). Guardar. |
| 2.7 | Pestaña del sitio → Catálogo → Alquiler | «Demo equipo» aparece en el sitio. |
| 2.8 | Panel → editarla: precio 2000 y desmarcar **Visible en el sitio** | Volver al sitio y recargar: ya no aparece. Explicar la diferencia entre *visible* (lo decide el admin) y *disponible* (lo ve el visitante). |
| 2.9 | **Categorías** → Eliminar «Demo categoría» | No se puede: tiene una publicación. El panel lo explica y ofrece ver sus publicaciones (el backend responde 409). |
| 2.10 | **Publicaciones** → Eliminar «Demo equipo» | Confirmación antes de borrar. |
| 2.11 | **Categorías** → Eliminar «Demo categoría» | Ahora sí se puede, con confirmación. |
| 2.12 | **Consultas** → eliminar «Demo Profesora» | Confirmación y aviso. La base queda como al empezar. |
| 2.13 | **Comercio** | Datos que muestra la portada: presentación, contacto, redes y horarios de los 7 días, con validación (por ejemplo, cierre antes que apertura). |
| 2.14 | **Perfil** | Datos personales y cambio de contraseña (pide la actual). |

## 3. Seguridad

| # | Hacer | Mostrar / decir |
|---|---|---|
| 3.1 | **Administradores** | Las cuentas del panel solo las crea un administrador con sesión: el registro dejó de ser público. Quien crea la cuenta sigue con su propia sesión. |
| 3.2 | Cerrar sesión y abrir http://localhost:5173/admin/registro | Redirige al ingreso: no hay forma de crearse una cuenta desde afuera. |
| 3.3 | (Postman) `POST /api/auth/registro` sin token | Responde **401**. Lo mismo con `POST/PUT/DELETE` de publicaciones, categorías, consultas y comercio: la protección está en el backend, no solo en el frontend. |
| 3.4 | (Postman) `GET /api/consultas` sin token | **401**: las consultas tienen datos personales y solo las ve el admin. El visitante tampoco recibe publicaciones ni categorías ocultas. |
| 3.5 | Explicar CORS | El backend solo acepta pedidos de navegador que vengan del frontend (`CORS_ORIGENES`). Un sitio ajeno no puede usar la API desde el navegador de otra persona. |
| 3.6 | **Al final de la demo:** en el ingreso, poner 5 veces una contraseña incorrecta | Al sexto intento responde «Demasiados intentos fallidos. Probá de nuevo en 15 minutos.» (código 429). Frena a quien prueba contraseñas. **Ojo:** bloquea el ingreso desde esa computadora por 15 minutos; para destrabarlo antes, reiniciar el backend. |
| 3.7 | Mencionar el resto | Contraseñas guardadas con hash (bcrypt), nunca salen en las respuestas; el login no revela qué mails existen; el enlace de recuperación vence a los 60 minutos y se usa una sola vez; la sesión vence a los 7 días. |

## 4. Si algo falla

| Síntoma | Qué hacer |
|---|---|
| «No se pudo conectar con el servidor» | El backend no está levantado o se cayó: revisar la terminal del backend. |
| El backend se corta al iniciar | En Atlas, la IP de la red actual no está habilitada: agregarla en *Network Access*. |
| El frontend abrió en 5174 y la API no responde | Había otro frontend en 5173: cerrarlo y volver a levantar (CORS solo acepta 5173). |
| El login dice «Demasiados intentos fallidos» | Esperar o reiniciar el backend (el contador está en memoria). |
| Alguna imagen no carga | Son URLs de Wikimedia Commons: depende de la conexión a internet. |
| Al responder una consulta aparece «No se pudo enviar el mail» | Faltan o están mal las variables `SMTP_*` en `backend/.env` de esa máquina, o no hay internet. Mostrar el resto del flujo cambiando el estado a mano (Leída / Respondida) y explicar que la respuesta no se guarda si el mail no sale. |

## 5. Preguntas probables

- **¿Por qué no hay carrito ni pagos?** El negocio vende por consulta: cada salida o curso se arma con la persona (nivel, fechas, grupo). La conversión es la consulta.
- **¿Por qué las fechas no reservan?** No hay disponibilidad por día en el modelo; las fechas viajan en la consulta para quien responde.
- **¿Cómo se protege el panel?** JWT en cada pedido, rol `admin` verificado en el backend, registro solo para administradores, límite de intentos y CORS.
- **¿Cómo se valida?** Dos veces: en el front para dar respuesta inmediata y en el back con Zod, que es la que manda. Los errores del back se muestran debajo de cada campo.
- **¿El token guardado en el navegador (localStorage) no es riesgoso?** Si el sitio tuviera una falla de XSS, un script podría leerlo. Por eso React escapa todo el texto que se muestra (no se usa `dangerouslySetInnerHTML`), la API valida cada dato con Zod y la sesión vence a los 7 días. Una cookie `httpOnly` sería más robusta, pero suma CSRF y la configuración de cookies entre dos puertos: para el alcance del TP se priorizó la simplicidad, y queda como mejora.
- **¿Por qué el límite de intentos está en memoria y no en la base?** Hay un solo servidor, así que alcanza: es rápido y no agrega dependencias. Si se reinicia, el contador vuelve a cero, lo que en el peor caso da 5 intentos más. Con varios servidores haría falta un almacén compartido (por ejemplo, Redis).
- **¿De dónde salen las imágenes?** De Wikimedia Commons, con licencias libres; los créditos están en `docs/creditos-imagenes.md`.
