# Guía de pruebas

Recorrido completo para comprobar que **cada funcionalidad y cada control de seguridad** de Andes Vertical funciona. Es distinto del [guion de la demo](guion-de-demo.md): el guion es una presentación corta pensada para mostrar; esta guía es la lista de verificación completa, con el resultado esperado de cada prueba y lo que dio la última vez que se corrió.

**Última corrida: 19/11/2026**, contra la API real (puerto 4000), el frontend (puerto 5173) y la base de Atlas.

| Recorrido | Pruebas | Resultado |
|---|---|---|
| API: funcionalidad, filtros, validaciones y seguridad | 111 | 111 bien (después de corregir el orden alfabético, ver [Hallazgos](#hallazgos)) |
| Interfaz: sitio público y panel, en un navegador real | 51 | 51 bien |
| Aviso por mail de consulta nueva: envío real y sin correo configurado | 2 | 2 bien |
| Límite de intentos de ingreso (copia del backend en el puerto 4100) | 5 | 5 bien |
| Pantallas sin desborde en 360 px y 320 px | 15 pantallas × 2 anchos | todas bien |

Todo lo que se creó para probar (una categoría, publicaciones, consultas y un administrador, con el nombre «PRUEBA E2E») se borró al terminar. La base quedó como estaba: 27 publicaciones, 5 categorías, las consultas que ya había y los mismos usuarios.

---

## 0. Preparación

1. Cerrar backends o frontends viejos. Si el puerto 4000 o 5173 está ocupado, el nuevo no arranca o arranca en otro puerto.
2. `cd backend` → `npm run dev`. Esperar `MongoDB conectado` y `Servidor escuchando en http://localhost:4000`.
3. `cd frontend` → `npm run dev`. Tiene que quedar en **http://localhost:5173**, el único origen que la API acepta (CORS).
4. Tener a mano el mail y la contraseña del administrador. No se guardan en el repositorio.
5. Para las pruebas de la API alcanza con una terminal y `curl` (o Postman). En los ejemplos, `API=http://localhost:4000/api`.

> **Ojo con el límite de intentos.** Cinco ingresos fallidos seguidos bloquean el login 15 minutos para esa computadora (incluido el navegador). Hacer esa prueba **al final**, o en una copia del backend, dentro de `backend/`:
>
> - PowerShell: `$env:PORT=4100; node server.js`
> - cmd: `set PORT=4100 && node server.js`
> - Git Bash, macOS o Linux: `PORT=4100 node server.js`
>
> Reiniciar el backend limpia el bloqueo.

---

## 1. Sitio público

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 1.1 | Abrir la portada | Imagen principal con un único botón al catálogo, exploración por tipo y por categoría, tarjetas de propuestas, «Nosotros», horarios y contacto (todo sale de la API), botón flotante «Consultanos» y pie. | ✔ |
| 1.2 | Escribir «frey» en el buscador de la cabecera y Enter | Lleva a `/catalogo?q=frey` con 5 resultados. | ✔ |
| 1.3 | Abrir una publicación (experiencia) | Nombre, galería con miniaturas, dificultad, duración, temporadas, punto de encuentro, precio y botón **Consultar** (que lleva el id de la publicación). | ✔ |
| 1.4 | Abrir `/publicaciones/000000000000000000000000` | «No encontramos esta publicación», sin pantalla en blanco. | ✔ |
| 1.5 | Abrir una dirección que no existe (`/cualquier-cosa`) | «Página no encontrada» con enlace a la portada. | ✔ |

## 2. Catálogo, búsqueda y filtros

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 2.1 | Abrir **Catálogo completo** | 27 resultados, 12 por página; pasar a la página 2 cambia la URL (`?pagina=2`). | ✔ |
| 2.2 | Elegir **Experiencias** y marcar **Alta** | Aparecen los chips de Dificultad y Temporada; quedan 4 resultados y la URL es `?tipo=experiencia&dificultad=alta`. | ✔ |
| 2.3 | Recargar la página (F5) | Los filtros siguen marcados: viven en la URL y se pueden compartir. | ✔ |
| 2.4 | Elegir **Cursos** | Aparece el filtro de **Nivel** (Inicial, Intermedio, Avanzado) y desaparecen los de experiencias. | ✔ |
| 2.5 | Buscar «zzzxxyy» | «No encontramos resultados para «zzzxxyy»» con el botón **Limpiar filtros**. | ✔ |
| 2.6 | Buscar «MONTAÑA», «escala» y «escalada en la» | Encuentra igual: no distingue mayúsculas ni tildes, acepta palabras incompletas e ignora «en», «la», «y», «de». | ✔ (API) |
| 2.7 | Elegir **Alquiler** y un rango de fechas (5 dic – 10 dic) | Arriba queda «5 dic – 10 dic · 6 días» y cada equipo muestra el total estimado. | ✔ |
| 2.8 | Ordenar por precio (menor a mayor y mayor a menor) | Ordena bien. | ✔ (API) |
| 2.9 | Ordenar por nombre | Ordena A→Z con las reglas del castellano: «Travesía de los 4 Refugios» antes que «Travesía Frey - Jakob». | ✔ (corregido, ver H1) |
| 2.10 | Con la API apagada (o sin conexión), abrir el catálogo | «No pudimos cargar esta información» con botón **Reintentar**. | ✔ |

## 3. Flujo de consulta (la conversión del sitio)

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 3.1 | En un equipo de alquiler con fechas elegidas, tocar **Consultar** | Lleva a `/contacto?publicacion=<id>&desde=…&hasta=…`. | ✔ |
| 3.2 | Mirar el formulario | Arriba, «Tu consulta es sobre…» con la foto, el tipo y las fechas («No es una reserva»); asunto y mensaje precargados y editables, con las fechas en el texto. | ✔ |
| 3.3 | Enviar el formulario vacío | Un error debajo de cada campo obligatorio (4) y el foco en «Nombre». | ✔ |
| 3.4 | Poner un mail mal escrito | «Revisá el mail: tiene que ser como nombre@ejemplo.com», con el foco en el mail. | ✔ |
| 3.5 | Completar bien y enviar | «¡Gracias, …!» con el mail al que se va a responder. La consulta llega al panel como **Pendiente**. | ✔ |
| 3.6 | Revisar la casilla del comercio (la de `MAIL_FROM`) | Llega «Consulta nueva: …» con nombre, mail, teléfono, publicación y mensaje (el HTML que escriba el visitante se ve como texto), y el botón **Ver la consulta en el panel**. Al responder ese mail, la respuesta va al visitante (Reply-To). El visitante no espera al mail: el envío responde en menos de 0,2 s. | ✔ |
| 3.7 | Enviar una consulta con el correo sin configurar (backend con `SMTP_HOST` vacío) | La consulta se guarda igual (**201**) y en la consola del backend queda «No se pudo avisar la consulta nueva: Falta configurar el correo saliente». | ✔ |

## 4. Acceso y seguridad

### En el navegador

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 4.1 | Sin sesión, abrir `/admin/publicaciones` | Redirige a `/admin/login`. | ✔ |
| 4.2 | Abrir `/admin/registro` | No hay registro público: redirige al ingreso (con sesión, a «Agregar administrador»). | ✔ |
| 4.3 | Ingresar con una contraseña incorrecta | «El mail o la contraseña no son correctos.» (el mismo mensaje si el mail no existe, para no revelar qué cuentas hay). | ✔ |
| 4.4 | Ingresar bien | Vuelve a la pantalla que se había pedido (`/admin/publicaciones`). | ✔ |
| 4.5 | Abrir `/recuperar-password` | Pide el mail. Con un mail no registrado responde lo mismo que con uno registrado. | ✔ |
| 4.6 | Abrir `/recuperar-password?token=<cualquier cosa>` y guardar una contraseña | Pantalla «El enlace ya no sirve» con el botón «Pedir un enlace nuevo». | ✔ |
| 4.7 | **Cerrar sesión** y volver a `/admin/consultas` | Vuelve al ingreso; la sesión (token) se borró. | ✔ |

### Contra la API (se puede mostrar con `curl` o Postman)

| # | Prueba | Resultado esperado | 19/11 |
|---|---|---|---|
| 4.8 | Cualquier escritura sin sesión: `POST/PUT/DELETE` de publicaciones y categorías, `PUT /comercio`, `POST /auth/registro` | **401** en las 15 rutas protegidas que se probaron (incluye las de 4.9). | ✔ |
| 4.9 | Leer consultas sin sesión (`GET /consultas`, `GET /consultas/:id`) | **401**: tienen datos personales. | ✔ |
| 4.10 | Token inventado o con la firma alterada | **401**. | ✔ |
| 4.11 | Inyección NoSQL en el login: `{"email":{"$ne":null},"password":{"$ne":null}}` | **400**: la validación exige texto. | ✔ |
| 4.12 | Un visitante intenta crear su consulta ya «respondida» (`"estado":"respondida"`) | **400**: campo no permitido. | ✔ |
| 4.13 | Cambiarse el rol desde el perfil (`"rol":"superadmin"`) | **400**: campo no permitido. | ✔ |
| 4.14 | Publicación oculta, pedida por un visitante | **404** en el detalle y no aparece en el listado; el admin sí la ve. | ✔ |
| 4.15 | Respuestas de login, perfil y registro | Nunca incluyen la contraseña (ni el hash) ni el token de recuperación. | ✔ |
| 4.16 | CORS: pedido desde `http://localhost:5173` y desde otro sitio | El front recibe permiso; otro sitio no. | ✔ |
| 4.17 | **Límite de intentos:** 5 logins fallidos y un sexto | Los 5 primeros dan 401; el sexto da **429** «Demasiados intentos fallidos. Probá de nuevo en 15 minutos.» con `Retry-After: 900`. Mientras dura, ni la contraseña correcta entra. Recuperar contraseña tiene su propio contador. | ✔ |

Ejemplos con `curl`:

```bash
# Escribir sin sesión → 401
curl -i -X DELETE $API/publicaciones/000000000000000000000000

# Inyección NoSQL en el login → 400
curl -i -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'

# Un visitante no puede fijar el estado de su consulta → 400
curl -i -X POST $API/consultas -H "Content-Type: application/json" \
  -d '{"nombre":"Prueba","email":"a@b.com","asunto":"Hola","mensaje":"Mensaje de prueba","estado":"respondida"}'

# Límite de intentos (correr 6 veces) → el sexto da 429
curl -i -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"Incorrecta123"}'
```

## 5. Panel de administración

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 5.1 | **Resumen** | Consultas sin leer, publicaciones por tipo (y cuántas ocultas o no disponibles), categorías y últimas consultas pendientes. | ✔ |
| 5.2 | Entrar a cada sección del menú | Publicaciones, Categorías, Consultas, Comercio, Administradores y Perfil cargan sin errores. | ✔ |
| 5.3 | **Categorías → Nueva categoría**, guardar vacía y después con nombre | Error en el nombre; después aparece en la tabla. Un nombre repetido da «ya existe» (409). | ✔ |
| 5.4 | **Publicaciones → Nueva**, tipo Experiencia, guardar vacía | 8 errores por campo (nombre, categoría, descripción, **imágenes**, dificultad…). No se puede crear sin imagen. | ✔ |
| 5.5 | Completarla con una imagen por URL (botón **Agregar**, se ve la vista previa) y precio «45.000» | Vuelve a la lista con aviso; el precio se guarda como 45000. | ✔ |
| 5.6 | Editarla: precio 50000 y desmarcar «Visible en el sitio» | Se guarda; el visitante recibe 404 y deja de verla en el catálogo. El tipo no se puede cambiar al editar. | ✔ |
| 5.7 | Marcar una publicación como **no disponible** | Sigue en el sitio, como «No disponible» (no es lo mismo que ocultarla). | ✔ (API) |
| 5.8 | Intentar borrar la categoría que tiene esa publicación | La ventana explica que tiene publicaciones y no ofrece borrar (la API responde 409). | ✔ |
| 5.9 | Eliminar la publicación | Pide confirmación en una ventana; después ya no existe. | ✔ |
| 5.10 | Eliminar la categoría, ya vacía | Pide confirmación y se borra. | ✔ |
| 5.11 | **Consultas**: abrir la consulta enviada en 3.5 | Remitente, mail, mensaje, «Consulta por» con la publicación, y el formulario para responder. | ✔ |
| 5.12 | Tocar **Enviar respuesta** sin escribir | «Escribí la respuesta antes de enviarla.» | ✔ |
| 5.13 | Escribir una respuesta y enviarla | El mail sale desde la cuenta de Andes Vertical a quien consultó, con su consulta citada; la consulta pasa sola a **Respondida** y la respuesta queda guardada. Usar un mail propio para verlo llegar. | ✔ (probado manualmente) |
| 5.14 | Cambiar el estado a mano: Leída → Respondida | Se guarda en la base. | ✔ |
| 5.15 | **Eliminar consulta** | Pide confirmación; después la consulta ya no existe (404). | ✔ |
| 5.16 | **Comercio**: poner un horario que cierra antes de abrir y guardar | «El cierre tiene que ser después de la apertura», en ese día; no se guarda. Un día repetido también se rechaza. | ✔ |
| 5.17 | **Administradores**: guardar vacío y después con un mail ya registrado | Errores por campo; «Ya hay una cuenta con este mail». | ✔ |
| 5.18 | **Administradores**: crear uno nuevo | Se crea y puede ingresar; quien lo creó sigue con su sesión. Contraseña débil → error. | ✔ (API) |
| 5.19 | **Perfil**: cambiar la contraseña con la actual incorrecta | «La contraseña actual no es correcta»; no se cambia. Sin la actual, tampoco. | ✔ |

## 6. Responsive y accesibilidad

| # | Qué hacer | Resultado esperado | 19/11 |
|---|---|---|---|
| 6.1 | Herramientas de desarrollo (F12 → Ctrl+Shift+M) en **360 px** y **320 px**, recorrer las 15 pantallas (sitio y panel) | Nada se sale de la pantalla hacia el costado. | ✔ |
| 6.2 | En 360 px, tocar el botón del menú | Se abre la navegación (`aria-expanded="true"`). | ✔ |
| 6.3 | En el panel en 360 px | El menú lateral pasa a una barra arriba; en Consultas se ve una por vez. | ✔ |
| 6.4 | Recorrer con **Tab** | El foco siempre se ve (contorno azul). | ✔ |
| 6.5 | Revisión automática de las 15 pantallas | Todas las imágenes tienen `alt`, todos los campos tienen `label`, un solo `h1` y título de pestaña en cada pantalla. | ✔ |
| 6.6 | Mirar los chips y las tarjetas con dificultad o nivel | Siempre punto de color **y** texto (no depende solo del color). | ✔ |

---

## Hallazgos

| # | Qué pasa | Gravedad | Estado |
|---|---|---|---|
| H1 | **Orden por nombre:** «Travesía Frey - Jakob» aparecía antes que «Travesía de los 4 Refugios», porque MongoDB ordenaba por código de carácter (las mayúsculas antes que las minúsculas). | Baja: solo se notaba en nombres que empiezan igual. | **Corregido** (19/11): el listado ordena con `collation({ locale: 'es' })`. Requiere reiniciar el backend. |
| H2 | **Textos de ejemplo sin tildes ni eñes:** los nombres y descripciones del seed se veían sin acentos («Arnes», «Montanismo y alta montana», «Esqui de travesia», «Rio Negro»). | Baja en funcionalidad; visible en el diseño. | **Corregido** (19/11) en `seed/datos.js` y en la base: categorías, publicaciones y comercio. Solo cambiaron los textos visibles; las claves y los valores internos (`montanismo`, `otonio`) siguen igual. |
| H3 | Cuando el backend corre con `npm run dev` y se cambian archivos, a veces nodemon no reinicia y queda el proceso viejo ocupando el puerto 4000. | Solo afecta al desarrollo. | Explicado en el manual de instalación: cerrar el proceso y volver a levantar. |
