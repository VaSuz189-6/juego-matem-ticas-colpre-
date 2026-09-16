# Desafío Matemático

Juego educativo de operaciones con números enteros para estudiantes de 6°.

## Aplicación Windows y actualizaciones

El proyecto puede ejecutarse como una aplicación de escritorio para Windows mediante Electron. La ventana carga [html/menu.html](html/menu.html) y comprueba automáticamente si existe una versión nueva en GitHub Releases.

### Configuración inicial

1. Instala Node.js LTS desde https://nodejs.org.
2. Crea un repositorio en GitHub llamado `desafio-matematico`.
3. En [package.json](package.json), reemplaza `CAMBIA_ESTE_USUARIO` por tu usuario de GitHub.
4. Desde la carpeta del proyecto ejecuta:

```bash
npm install
npm start
```

### Crear el instalador Windows

```bash
npm run dist
```

El instalador se generará en `dist/Desafio-Matematico-Setup-1.0.0.exe`.

### Publicar actualizaciones

Para publicar una versión nueva, cambia la versión en [package.json](package.json), crea una etiqueta y súbela a GitHub:

```bash
git tag v1.0.1
git push origin v1.0.1
```

El workflow [release-windows.yml](.github/workflows/release-windows.yml) construirá automáticamente el `.exe` y lo publicará en GitHub Releases. Las aplicaciones instaladas comprobarán GitHub al abrirse, mostrarán `Actualizar ahora`, descargarán la nueva versión y permitirán reiniciar para instalarla.

Las actualizaciones no se prueban correctamente con `npm start`; deben probarse instalando el `.exe` generado.

## Punto de entrada

Abre [html/menu.html](html/menu.html). La navegación queda dividida en tres pantallas HTML.

[html/mision-entera.html](html/mision-entera.html) se conserva como acceso compatible y redirige al menú inicial.

## Estructura

```text
juego/
├── electron/
│   ├── main.js                 # Ventana y actualizaciones
│   └── preload.js              # Puente seguro con el HTML
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

## Abrir localmente

Puedes abrir `html/menu.html` directamente en el navegador para probar la interfaz. Para probar las actualizaciones debes usar el instalador de Windows.
