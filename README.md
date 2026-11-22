# Local Voices Tours

Sitio web estático en inglés para los tours a pie de Local Voices Tours en Ciudad de Panamá. El código fuente completo está en esta carpeta.

## Abrir el sitio

1. Extrae el ZIP conservando los archivos y la carpeta `assets`.
2. Abre `index.html` en un navegador actualizado. El sitio usa scripts clásicos y no requiere instalación.
3. Pulsa **Book now**, selecciona tour, fecha y hora, y usa **Fill sample details**. Acepta la política y pulsa **Confirm demo booking**.
4. Abre **View in calendar**. Selecciona un día para ver las reservas. Al cancelar una reserva se liberan sus plazas. Si el navegador restringe el almacenamiento de archivos locales, sirve la carpeta por HTTP con `python -m http.server 8080` y abre `http://localhost:8080`.

## Estructura

```text
local-voices-tours/
├── index.html       # Encabezado, navegación, pie y botón de WhatsApp
├── styles.css       # Diseño adaptable, tipografía, tarjetas y calendario
├── data.js          # Ocho itinerarios, lugares turísticos y preguntas frecuentes
├── booking.js       # Horarios, cupos, confirmación, cancelación y almacenamiento
├── app.js           # Páginas, formulario, calendario y mensajes de ejemplo
├── assets/
│   ├── casco.jpg
│   ├── church.jpg
│   ├── bay.jpg
│   └── coffee.jpg
└── README.md
```

## Cómo funciona

- El catálogo incluye los ocho tours de la guía y cada ficha muestra sus paradas, duración, incluidos y mapa. Solo los tres primeros se pueden reservar en la demo.
- El horario de prueba es martes, jueves y sábados, a las 9:00 a. m. y las 3:00 p. m. de Panamá, con un horizonte de 90 días. Se calcula un máximo de seis personas por tour, fecha y salida a USD 32 por persona.
- El calendario guarda referencia, tour, fecha, hora, cantidad, total y estado en el almacenamiento local del navegador. Los datos de contacto y las notas de ejemplo solo se usan en la vista de confirmación. Sin persistencia disponible, la reserva se conserva mientras la página siga cargada.
- La confirmación muestra la referencia y el punto de encuentro. También presenta vistas previas del aviso al operador, recordatorio y mensaje posterior. Los pagos y el envío de avisos son simulados. El enlace de WhatsApp abre un mensaje que el visitante puede editar y enviar al +507 6311-9179.
- La guía de lugares muestra las estimaciones provistas en el documento de trabajo. Los campos `price` y `hours` de `data.js` se pueden actualizar directamente.
- El sitio usa DM Sans y Playfair Display cuando se pueden cargar desde Google Fonts, con fuentes locales de respaldo.

## Antes de operar reservas reales

Confirma horarios, tarifas, políticas, permisos y credenciales. Sustituye las imágenes ilustrativas por fotografías propias de los recorridos. Agrega las biografías y las fotos de los guías, el correo del negocio y el enlace de reseñas cuando estén disponibles. Para vender al público se requiere almacenamiento compartido, control de cupo en servidor, acceso privado al calendario operativo e integraciones de pago y mensajería.

## Imágenes

Los cuatro JPG de `assets/` son recortes de una sola composición generada con la herramienta integrada de OpenAI. Son imágenes ilustrativas de la demo.

Prompt utilizado:

> Photorealistic travel editorial contact sheet for a boutique walking-tour website in Panama City. Exactly 2 by 2, four equally sized edge-to-edge photo panels, no gutters, no lettering, no watermarks. Top left: a beautiful sunlit cobblestone street in Casco Viejo, Panama City, coral and ochre colonial facades, iron balconies and palms, layered depth, no dominant people, hero composition. Top right: historical colonial church and square in Casco Viejo, soft daylight. Bottom left: Panama City coastal promenade and skyline across a blue bay, tropical clear daylight. Bottom right: Panamanian coffee and artisan chocolate on a warm café table. Authentic natural colors, magazine travel photography. Wide landscape canvas.
