# Diagrama de navegación

El sistema tiene dos partes: el **sitio público**, de libre acceso, y el **panel de administración**, que requiere iniciar sesión. Las pantallas de acceso (ingresar, crear cuenta y recuperar contraseña) quedan entre las dos.

## Sitio público

```mermaid
flowchart TD
    Inicio["Portada<br/>/"]
    Catalogo["Catálogo<br/>/catalogo"]
    Detalle["Detalle de publicación<br/>/publicaciones/:id"]
    Contacto["Contacto<br/>/contacto"]
    Enviada(["Consulta enviada"])

    Inicio -->|"Ver catálogo · explorar por tipo o categoría · buscar"| Catalogo
    Inicio -->|"Tarjeta de una propuesta"| Detalle
    Inicio -->|"Hacer una consulta"| Contacto
    Catalogo -->|"Tarjeta"| Detalle
    Detalle -->|"Consultar (con la publicación y las fechas)"| Contacto
    Detalle -->|"Categoría · migas de pan"| Catalogo
    Detalle -->|"También te puede interesar"| Detalle
    Contacto -->|"Enviar"| Enviada
    Enviada -->|"Seguir viendo el catálogo"| Catalogo
```

Desde cualquier pantalla pública se puede ir a la portada, al catálogo filtrado por tipo y a contacto con la barra de navegación; el buscador de la cabecera lleva al catálogo con la búsqueda aplicada; y el botón flotante de ayuda lleva a contacto.

## Acceso y panel de administración

```mermaid
flowchart TD
    Login["Ingresar<br/>/admin/login"]
    Registro["Crear cuenta<br/>/admin/registro"]
    Recuperar["Recuperar contraseña<br/>/recuperar-password"]
    Nueva["Elegir contraseña nueva<br/>/recuperar-password?token=…"]
    Mail(["Mail con el enlace"])

    Resumen["Resumen<br/>/admin"]
    Pubs["Publicaciones<br/>/admin/publicaciones"]
    PubNueva["Nueva publicación<br/>/admin/publicaciones/nueva"]
    PubEditar["Editar publicación<br/>/admin/publicaciones/:id/editar"]
    Cats["Categorías<br/>/admin/categorias"]
    Cons["Consultas<br/>/admin/consultas"]
    Com["Datos del comercio<br/>/admin/comercio"]
    Perfil["Mi perfil<br/>/admin/perfil"]

    Login <-->|"Crear cuenta / Ingresar"| Registro
    Login -->|"¿Olvidaste tu contraseña?"| Recuperar
    Recuperar -->|"Enviar enlace"| Mail
    Mail -->|"Abrir enlace"| Nueva
    Login -->|"Ingresar"| Resumen
    Registro -->|"Crear cuenta"| Resumen
    Nueva -->|"Guardar"| Resumen

    Resumen --> Pubs
    Resumen --> Cats
    Resumen --> Cons
    Resumen -->|"Nueva publicación"| PubNueva
    Pubs -->|"Nueva publicación"| PubNueva
    Pubs -->|"Editar"| PubEditar
    PubNueva -->|"Guardar · Cancelar"| Pubs
    PubEditar -->|"Guardar · Cancelar"| Pubs
    Cats -->|"Ver sus publicaciones"| Pubs
    Cons -->|"Editar la publicación consultada"| PubEditar
```

Dentro del panel, el menú lateral (o la barra superior en el celular) da acceso directo a Resumen, Publicaciones, Categorías, Consultas, Comercio y Perfil, y a «Ver el sitio». **Cerrar sesión** vuelve al ingreso.

Acciones que no cambian de pantalla:
- **Categorías:** el alta, la edición y la confirmación de borrado se abren en una ventana sobre la misma pantalla.
- **Consultas:** la consulta elegida se abre al lado de la lista (en el celular, en lugar de la lista) y queda en la dirección (`?ver=<id>`).
- **Publicaciones:** el borrado se confirma en una ventana sobre la lista.

## Protección de rutas

- Todas las rutas `/admin/*` salvo `/admin/login` y `/admin/registro` requieren sesión. Sin sesión, llevan al ingreso y, después de ingresar, vuelven a la pantalla pedida.
- Si la sesión vence mientras se usa el panel, el panel vuelve al ingreso.
- Una dirección que no existe muestra una página «No encontrada» con un botón para volver a la portada.
