# Descripción funcional

## El negocio

Andes Vertical es un operador de montaña de San Carlos de Bariloche que trabaja en tres líneas:

- **Experiencias guiadas:** salidas con guía por el Parque Nacional Nahuel Huapi (trekking, ascensos, esquí de travesía).
- **Escuela de montaña:** cursos de escalada, montañismo, orientación y rescate.
- **Alquiler de equipo:** equipo técnico que se cobra por día (crampones, piolets, carpas, arneses, etc.).

El objetivo del sitio es que el visitante encuentre una propuesta y **haga una consulta**. No hay carrito, pagos ni reservas: la venta se cierra respondiendo la consulta. Por eso todo el recorrido del sitio termina en el botón **Consultar**.

## Usuarios

| Usuario | Qué hace | Necesita cuenta |
|---|---|---|
| Visitante | Recorre el catálogo, busca, filtra y envía consultas | No |
| Administrador | Gestiona publicaciones, categorías, consultas y datos del comercio | Sí (mail y contraseña) |

El visitante nunca necesita registrarse: todo el sitio público es de libre acceso. Lo que modifica datos (crear, editar o borrar) solo lo puede hacer un administrador con sesión iniciada; el backend lo verifica en cada pedido, no solo el frontend.

## Sitio público

### Portada (`/`)
- Imagen principal con un acceso directo al catálogo.
- Exploración por **tipo** (experiencias, cursos, alquiler) o por **categoría**, con la cantidad de propuestas de cada una.
- Escala de dificultad y nivel, para que el visitante sepa cómo leer las propuestas.
- Tres secciones con propuestas: experiencias destacadas, cursos y equipo disponible.
- Presentación del comercio («Nosotros»), horarios de atención, dirección, teléfono, mail y redes.

### Catálogo (`/catalogo`)
- **Búsqueda por texto:** tienen que aparecer todas las palabras escritas, en el nombre, la descripción o la categoría. No distingue mayúsculas ni tildes y encuentra palabras incompletas («escala» encuentra «escalada»). Ignora palabras como «y», «de» o «la».
- **Filtros:** tipo, categoría, solo disponibles y rango de precio (este último para experiencias y cursos; el alquiler se cobra por día).
- **Orden:** más recientes, precio (ascendente o descendente) y nombre.
- **Paginación** de 12 resultados.
- Todos los filtros quedan en la dirección de la página: se pueden compartir y se mantienen al recargar.
- **Alquiler con fechas:** al elegir retiro y devolución, cada equipo muestra el total estimado (precio por día × cantidad de días). Las fechas no reservan nada: viajan con la consulta.

### Detalle de una publicación (`/publicaciones/:id`)
- Galería con todas las imágenes y miniaturas.
- Datos según el tipo:
  - Experiencia: dificultad, duración, temporadas, cupo, punto de encuentro y qué incluye.
  - Curso: nivel, duración, cupo, certificación y requisitos previos.
  - Alquiler: talles, unidades disponibles y depósito.
- Precio, disponibilidad y, en alquiler y experiencias, elección de fechas tentativas.
- Botón **Consultar**, que lleva al formulario de contacto con la publicación ya asociada.
- Otras propuestas de la misma categoría.

### Contacto (`/contacto`)
- Formulario con nombre, mail, teléfono (opcional), asunto y mensaje.
- Si se llega desde una publicación, el formulario muestra cuál es, y el asunto y el mensaje vienen escritos (se pueden editar). Si se eligieron fechas, figuran en el mensaje.
- Validación campo por campo antes de enviar, y confirmación al enviar.
- Datos de contacto y horarios del comercio al costado.

## Panel de administración (`/admin`)

### Acceso
- **Ingresar** con mail y contraseña. Un mismo mensaje para mail inexistente y contraseña incorrecta, para no revelar qué cuentas existen.
- **Crear cuenta** de administrador.
- **Recuperar contraseña:** se pide el mail y llega un enlace que vence a los 60 minutos y se usa una sola vez. La respuesta es la misma exista o no la cuenta.
- **Perfil:** cambiar datos personales y contraseña (pide la contraseña actual).
- La sesión dura 7 días. Si vence, el panel vuelve a pedir el ingreso y después regresa a la pantalla donde se estaba.

### Resumen
Pantalla de inicio del panel: consultas sin leer, total de publicaciones por tipo (y cuántas están ocultas o no disponibles), categorías y las últimas consultas pendientes.

### Publicaciones
- Lista con búsqueda, filtros por tipo, visibilidad y categoría, y paginación.
- Alta y edición: primero se elige el tipo y el formulario muestra solo los campos de ese tipo. Imágenes por dirección web (hasta 8), con vista previa y elección de la principal.
- Borrado con confirmación.

### Categorías
- Lista con la cantidad de publicaciones de cada una.
- Alta y edición en una ventana sobre la misma pantalla.
- Una categoría con publicaciones **no se puede borrar**: el panel lo explica y ofrece ver sus publicaciones u ocultarla.

### Consultas
- Bandeja con las consultas sin leer en negrita, filtro por estado y orden por fecha.
- Al abrir una se ve quién escribió, sus datos de contacto, el mensaje y sobre qué publicación consulta.
- Estado: **pendiente → leída → respondida**, que el administrador cambia a mano.
- «Responder por mail» abre el correo con el asunto y un saludo ya escritos.
- Borrado con confirmación.

### Datos del comercio
Nombre, descripción, dirección, teléfono, mail, redes sociales y horarios de los siete días. Es lo que el sitio muestra en la portada y en la página de contacto.

## Reglas de negocio

- **Visible y disponible no son lo mismo.**
  - *Visible en el sitio* (`activa`): lo decide el administrador. Una publicación oculta queda guardada pero el visitante no la ve.
  - *Disponible* (`disponible`): lo que ve el visitante. Una publicación no disponible sigue en el sitio, marcada «No disponible», y se puede consultar igual.
- **Las fechas no son una reserva.** No hay disponibilidad por día ni bloqueo de cupos: las fechas son información para quien responde la consulta.
- **Una publicación pertenece a una sola categoría,** y una categoría con publicaciones no se puede borrar.
- **El tipo de una publicación no cambia** después de crearla, porque cada tipo tiene datos distintos.
- **Las categorías ocultas** dejan de aparecer en los filtros y en la portada; sus publicaciones siguen visibles en el catálogo.
- **Las consultas** solo las ve el administrador, porque tienen datos personales.

## Calidad y experiencia de uso

- Todas las pantallas tienen estados de carga, vacío y error; nunca queda una pantalla en blanco.
- Los formularios validan en el navegador (con las mismas reglas que el servidor) y muestran también los errores que devuelve el servidor, debajo de cada campo.
- Antes de borrar cualquier cosa se pide confirmación.
- Diseño pensado primero para el celular y probado en 360 px de ancho y en escritorio.
- Accesibilidad: etiquetas reales en todos los campos, foco visible, textos alternativos en imágenes, contraste suficiente, navegación con teclado y un enlace para saltar al contenido.
