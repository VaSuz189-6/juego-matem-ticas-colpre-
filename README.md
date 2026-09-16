# Misión Entera

Juego educativo de operaciones con números enteros para estudiantes de 6°.

## Aplicación de escritorio

El proyecto incluye una capa Electron para convertir la interfaz en una aplicación instalable. Electron carga [html/menu.html](html/menu.html), mientras `electron/main.js` gestiona la ventana, las actualizaciones y la conexión opcional con Supabase.

## Instalación local

Instala Node.js LTS desde https://nodejs.org y reinicia VS Code. Después, desde la carpeta del proyecto ejecuta:

```bash
npm install
npm start
```

## Actualizaciones automáticas

1. Crea un repositorio público o privado en GitHub llamado `mision-entera`.
2. Edita `package.json` y cambia `TU_USUARIO_GITHUB` por tu usuario real.
3. Cambia la versión en `package.json`, por ejemplo de `1.0.0` a `1.0.1`.
4. Genera los instaladores:

```bash
npm run dist:win
npm run dist:linux
```

5. Publica los instaladores y los archivos `.yml` generados dentro de un GitHub Release con la misma etiqueta de versión, por ejemplo `v1.0.1`.

También puedes automatizar los pasos 4 y 5 con [release.yml](.github/workflows/release.yml): después de configurar el repositorio, ejecuta `git tag v1.0.1` y `git push origin v1.0.1`. GitHub Actions construirá Windows y Linux y publicará los artefactos en Releases.

La aplicación instalada consulta GitHub al abrirse. Si encuentra una versión nueva, muestra la franja `Actualizar ahora`, descarga el instalador y permite reiniciar para instalarlo. Las actualizaciones no se prueban correctamente con `npm start`; deben probarse con una versión instalada.

## Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor y ejecuta [electron/supabase-schema.sql](electron/supabase-schema.sql).
3. Configura `SUPABASE_URL` y `SUPABASE_ANON_KEY` basándote en [.env.example](.env.example).

El cliente usa únicamente la clave anónima y las políticas RLS de Supabase. No coloques una `service_role key` dentro de esta aplicación. Si no hay conexión o Supabase no está configurado, el resultado continúa guardándose en el respaldo local.

## Punto de entrada

Abre [html/menu.html](html/menu.html). La navegación queda dividida en tres pantallas HTML.

[html/mision-entera.html](html/mision-entera.html) se conserva como acceso compatible y redirige al menú inicial.

## Estructura

```text
juego/
├── html/
│   ├── menu.html              # Bienvenida e inicio
│   ├── grados.html            # Selección de grados 6° a 11°
│   ├── juego.html             # Configuración, partida, resultado e historial
│   └── mision-entera.html     # Entrada compatible al menú
├── css/
│   └── mision-entera.css      # Tema, layout, componentes y responsive
├── js/
│   ├── starfield.js            # Fondo de estrellas
│   └── update-ui.js            # Aviso visual de actualizaciones
├── electron/
│   ├── main.js                 # Ventana y procesos principales
│   ├── preload.js              # Puente seguro hacia la interfaz
│   ├── cloud-sync.js           # Envío opcional a Supabase
│   └── supabase-schema.sql     # Tabla y políticas RLS
├── assets/
│   ├── icons/                 # SVG propios e iconos de la interfaz
│   └── audio/                 # Reservado; el sonido actual es generado por Web Audio
└── README.md
```

## Convenciones

- Los HTML contienen la estructura semántica y los identificadores de la interfaz.
- El CSS contiene todos los estilos; no se deben agregar estilos inline.
- La lógica nueva debe separarse por responsabilidad en `js/`: `app.js`, `game.js`, `questions.js`, `storage.js`, `audio.js` y `csv.js`.
- Los recursos propios van en `assets/`; no se guardan imágenes ni scripts sueltos en la raíz.
- Los nombres de archivos usan minúsculas y guiones para facilitar el empaquetado posterior.

- No se deben publicar claves secretas en el repositorio. `.env` está excluido por `.gitignore`.

## Abrir localmente

Para una prueba rápida puedes abrir `html/menu.html` directamente en el navegador. Para probar actualizaciones, sincronización y empaquetado debes usar Electron con `npm start` o una versión instalada.
