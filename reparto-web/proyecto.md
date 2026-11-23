# FICHA DEL PROYECTO — WEB (la web «1º ESO» de Google Sites y la recopilación de acertijos)

Este fichero **no se regenera nunca**. Se escribió al montar el reparto (2026-11-23) y solo cambia cuando cambia el reparto.

## Qué es

Juan Luis tiene un Google Sites antiguo, «1º ESO», y quiere (1) coordinarlo con los materiales del curso 2026-27,
con una página por unidad, y (2) reunir en él **todos sus acertijos**, clasificados por tipo y por nivel, en una
página con filtros. Punto de partida: [docs/web-google-sites-inventario.md](../docs/web-google-sites-inventario.md)
y [docs/acertijos-recopilacion.md](../docs/acertijos-recopilacion.md).

- Editor del sitio: `https://sites.google.com/d/12iuNEJIpi2yCnzs38jwzEYyOIIfeAeKD/p/1X7IQez5srxFCksCRN8f72W1G8wiJ9qq5/edit`
- Sitio publicado: `https://sites.google.com/a/murciaeduca.es/1eso/`
- Se edita **solo con Claude in Chrome**, con la sesión de Juan Luis: Google Sites no tiene API.

## Dónde está cada cosa

| Qué | Ruta (desde la raíz del repo `Ejercicios-interactivos`) | Notas |
|---|---|---|
| Tablón | `reparto-web/_ESTADO.md` | vista derivada |
| Hechos (la fuente de verdad) | `reparto-web/hechos/` | en git; **un solo sitio** |
| Fichas de tarea | `reparto-web/tareas/` | |
| Salidas | `reparto-web/salidas/` | **fuera de git** (`reparto-web/.gitignore`): lleva material ajeno y sin revisar |
| Ojo con las rutas | — | En las fichas, `salidas/NN-…` significa **`reparto-web/salidas/NN-…`**, nunca `salidas/` en la raíz del repositorio (que es público). En la raíz queda un enlace simbólico `salidas → reparto-web/salidas`, ignorado en local, solo para que no se rompa nada |
| Papelera | `reparto-web/_papelera/` | la vacía Juan Luis |
| Autorizaciones | `reparto-web/autorizaciones.md` | las firma él a mano |
| Entrada ya hecha | `reparto-web/salidas/00-classroom/` | 66 fichas de Classroom, hechas antes del reparto; solo lectura |
| Banco local de acertijos | `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/0_ACERTIJOS Y CURIOSIDADES/` | solo lectura; 512 de 537 archivos solo en iCloud hasta que cierre la tarea 01 |
| Apuntes del curso | `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/` | solo lectura |
| Página de acertijos | `acertijos/` (raíz del repo) | la crea la tarea 08; el catálogo lo pone la 09 |

`hechos/` está en el disco, dentro del repositorio, porque todas las sesiones son atendidas o del lanzador, en este
Mac. **No hay tareas programadas en la nube.** Renombrar y borrar ficheros aquí: sí (comprobado el 2026-11-23).
Sesiones en un solo dispositivo: la espera del reclamo es `sleep 30`.

Operaciones largas: en el shell de este Mac, en segundo plano, con latido cada 10-15 minutos.

**Candados de fichero del entorno: sí.** El hook `~/.claude/hooks/sesiones.sh` reserva cada fichero que una sesión
edita con las herramientas de edición. No contiende si cada sesión escribe solo lo suyo; el único fichero común es
`_ESTADO.md`: si está reservado al regenerar, no se espera (tu reclamo ya vale) y se regenera después.

**Repositorio git: sí, y público** (GitHub Pages sirve `main` entero). Rigen las reglas del `CLAUDE.md` de la raíz:
se escribe y se comitea **en este árbol**, sin worktrees; `git commit -m "…" -- rutas` y nunca `add .`, `-A`,
`commit -a`, `stash` ni `reset --hard`; `push` desde aquí. **Nunca nombres de alumnos** en nada versionado. Orden de
cierre de una tarea con código: pruebas en verde → commit del código → terminada con el hash, `CERRADA`, tablón y
ficha → un commit con rutas explícitas → `push`.

**Recurso compartido: `editor-sites`, tope 1.** Solo una sesión a la vez edita el borrador de Google Sites (tareas
10, 13, 14 y 15). Quien vaya a editar mira `hechos/recursos/` y, si nadie lo ocupa, añade a `hechos/recursos/<sid>.md`
la línea `ocupo editor-sites desde <hora> (tarea NN)`; al acabar o soltar, `libero editor-sites <hora>`. Leer el
sitio publicado o la vista previa no ocupa el recurso.

**Publicar el sitio no lo hace ninguna sesión.** Todo queda en el borrador; publica Juan Luis con el botón azul.

Vigía: ninguno. Duración real observada: sin medir aún.

## Bandas de modelo

| Banda | Modelo | Esfuerzo | Para qué, en este reparto |
|---|---|---|---|
| ALTO | Opus 5.5 | Alto | Fusionar y clasificar (06), soluciones (07), plantilla y portada (10), borrador de familias (16), verificación (18) |
| MEDIO | Sonnet 5.5 | Medio | Fichas (02, 04), adjuntos (03), la página (08), publicar el catálogo (09), Drive (12), páginas de unidad (13, 14, 15), cantera (17) |
| BAJO | Haiku 5.5 | Medio | Descargar y convertir (01), enlaces (05), manifiesto (11) |

Reserva dentro de ALTO: «ALTO (Fable 5.2, esfuerzo Alto)», solo para recortar el reparto.
Escrito el 2026-11-23 con los nombres de la gama que el entorno da como vigente; **pendiente de que Juan Luis confirme que
su menú los muestra así** (el otro reparto del repo aún dice Opus 5 / Sonnet 5 / Haiku 4.5). Si no coinciden, manda
la posición: ALTO el más capaz de la gama normal, BAJO el más rápido, MEDIO el de en medio; y se corrige aquí.

## Automatismos activos

Ninguno.

## Frase de arranque para una sesión nueva

> `WEB T<NN> (<BANDA>)` — Trabaja en el reparto de `reparto-web/` del repositorio `Ejercicios-interactivos`. He abierto
> esta sesión con un modelo de banda <BANDA> (<modelo>, esfuerzo <esfuerzo>), y el nombre de esta sesión es el que
> encabeza este mensaje. Lee `reparto-web/proyecto.md` y `reparto-web/_ESTADO.md`, lista `reparto-web/hechos/`, reclama
> la tarea <NN> siguiendo el protocolo del tablón <y, al cerrarla, encadena la MM>, dime en tu primer mensaje qué tarea
> has reclamado —o por qué no has podido— y con qué identificador de sesión, y sigue con ella hasta cerrarla o soltarla
> sin esperar confirmación.

La banda va en la frase porque una sesión no puede saber en qué modelo corre. Una frase por sesión, cada una con su
tarea o su cadena; quien cierra una tarea da las frases de las que queden LIBRES.

## Nombres de sesión

Abreviatura: **`WEB`**. Una tarea: `WEB T08 (MEDIO)` · una cadena: `WEB T01+T05 (BAJO)` · quien monta o coordina:
`WEB Coordinadora T01-T18 (ALTO)`.

## Decisiones de reparto que conviene no rediscutir

- **Aprobado por Juan Luis el 2026-11-23**: retirar `z_Backup`, `WWW.MATEMATICO.ES` y «Actividades extraescolares» (hecho en
  el borrador); renombrar los temas a las unidades de este curso (hecho: T7→Unidad 6, T6→Unidad 7, T8→«Estadística y
  probabilidad», nueva «Unidad 8. Geometría»); y que el catálogo de acertijos sea una página con filtros incrustada
  en Sites, no cien acertijos escritos a mano en el editor.
- **Clasificación de los acertijos**: ocho tipos (L, N, G, P, J, S, T, C), tres niveles y, además, la unidad con la que
  encaja. Decidido; la tarea 06 lo aplica.
- **`salidas/` fuera de git**: el material bruto lleva capturas de redes, PDF de otros centros y libros ajenos. Solo
  llega al repo lo que la tarea 06 marca publicable y la 09 copia, con firma.
- **Canguro y demás concursos se enlazan, no se copian** (tarea 05).
- **Las fuentes se fichan por separado (02, 04) y se juntan después (06)**, para que puedan ir en paralelo sin
  compartir fichero.
- **Decidir la plantilla (10) y aplicarla (13) son tareas distintas**: la 10 entrega una propuesta con un piloto y
  Juan Luis la aprueba antes de que la 13 toque siete páginas.
- **El editor de Sites es de una sesión cada vez** (recurso `editor-sites`): el arrastre y los menús dependen del
  estado de la pantalla, y dos sesiones en el mismo perfil de Chrome se pisan.
- Pendiente menor para Juan Luis, a mano: arrastrar «Unidad 6. Álgebra» por delante de «Unidad 7» en el panel
  «Páginas» (el ratón sintético no puede).
