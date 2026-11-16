# Tarea 208 · «Árbol de factores» (`arbol`, id 5), ejercicio 2 «¿Está terminada?»: que se vea que, tras el «No», falta tocar el factor

Actualizado: 2026-11-16 (alta de la coordinadora, por encargo de Juan Luis del 16-11; ver `proyecto.md`, «Alta del 16-11: tarea 208»)
Precondición: ninguna · `git status --short practicas/arbol/ tests/practicas-arbol.test.js tests/practicas-ayuda-arbol.test.js` vacío · Disparo: MANUAL · Plazo: sin fecha (la práctica está publicada y en uso; cuanto antes, mejor)
Duración esperada: 45 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/208-arbol-paso-dos/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/arbol/practica.js`, `practicas/arbol/estilos.css`, `practicas/arbol/textos.js`, `tests/practicas-arbol.test.js`

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×). **Este fichero es la fuente de la banda**: el
tablón la copia de aquí cada vez que se regenera (MEDIO = Sonnet 5.5, esfuerzo Medio).

## Antes de empezar

Rutas relativas a la raíz del repositorio (`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`. Las
sesiones de este reparto trabajan en ese árbol, no en un worktree (regla de git del 16-11 en `CLAUDE.md`).

1. Lee `$R/proyecto.md` («Dónde está cada cosa», «Reglas de contenido comunes» y «Alta del 16-11: tarea 208»), `$R/_ESTADO.md`,
   `docs/no-lo-se.md` y lista `$R/hechos/` (`ls $R/hechos/*/`): la carpeta manda sobre la tabla.
2. `date -u`. `git fetch origin && git status -sb`; si hay commits que traer, `git pull --rebase origin main` (nunca `--autostash`).
   Comprueba que `git status --short` de los «Ficheros que toca» sale **vacío**; si no, es trabajo de otra sesión: no reclames.
3. Reclama, con el sid generado **en el mismo comando**:
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -v+90M +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 208\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/208--$sid.md && git commit -m "PU2 208: reclamo" -- $R/hechos/reclamos/208--$sid.md && echo $sid
   ```
4. `sleep 30 && ls $R/hechos/reclamos/ | grep '^208--'`. Si hay otro reclamo vivo de la 208 con `abierto:` más antiguo, añade
   `CEDIDA a <sid del otro>` al tuyo y para. Uno caducado se releva con `releva a: <sid>` en tu reclamo.
5. Si ganas, regenera `$R/_ESTADO.md` entero con el guion (`$R/hechos/notas/s-20261111T215225-39c1f4f5-regenerar-tablon.py`) y sigue
   hasta cerrar o soltar; no termines el turno para pedir confirmación.

Latidos con `printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/208--<sid>.md`. A tu reclamo solo se añade.

## El problema (no es un fallo de la lógica)

Una alumna de 1.º escribió tres veces el 14-11 que en este ejercicio «cuando le doy al No porque no está terminada la factorización
me lo pone como bien pero no se me pasa al siguiente», y que para pasar tenía que pulsar «No lo sé», que no le cuenta el acierto.
Juan Luis lo comprobó y le contestó que la página funciona: tras el «No» hay que **tocar, en la igualdad, el factor que no es primo**
(en `715 = 5 · 143`, el 143). La lógica (`montarTerminada`, `practica.js`) está bien: el «No» acertado no responde todavía; muestra
`.paso-dos` («No está terminada. Toca el factor que no es primo.») y habilita los factores (`igualdad--tocar`).

Lo que falla es **cómo se ve**: `botones.marcar(['no'], 'no')` pinta el «No» de verde, que el alumno lee como «hecho, siguiente», y el
aviso del paso dos es una línea más de texto bajo la igualdad (`.paso-dos`: color de texto y negrita, nada más), fácil de no ver,
sobre todo en el móvil. El alumno se queda esperando, y la salida que encuentra es «No lo sé».

## Qué hay que hacer

Que, tras un «No» acertado, sea **imposible no ver** que falta un paso, sin cambiar qué se puntúa ni cómo:

1. El aviso del paso dos, **destacado** y cerca de lo que hay que tocar: por ejemplo con el estilo de un aviso (fondo suave, borde de
   color de `--primario`, letra del tamaño de la orden) y **encima** de la igualdad o pegado a ella, no debajo de los botones Sí/No.
2. Los factores tocables, que **llamen**: la clase `igualdad--tocar` ya les pone borde; añade algo que se note sin depender del color
   (un subrayado o un realce leve que se repita dos o tres veces y pare; respeta `prefers-reduced-motion`).
3. El «No» acertado, marcado como **paso dado, no como respuesta terminada**: que no tenga el mismo verde de «acierto» del final del
   ítem (por ejemplo, seleccionado y neutro). Ojo: `botones.marcar` es de `_comun/`; si para esto haría falta tocar `_comun/`, **no lo
   toques**: hazlo con una clase propia en `arbol/estilos.css` o déjalo como propuesta en la ENTREGA.
4. Texto del aviso, en `textos.js`, en los dos idiomas, sin alargarlo: puede quedarse como está o decir «Bien: no está terminada.
   Ahora toca el factor que no es primo.» / «Right: it is not finished. Now tap the factor that is not prime.».
5. Test en `tests/practicas-arbol.test.js` si hay algo comprobable sin navegador (que el texto existe en los dos idiomas, que la
   clase del aviso está en el HTML del ítem). Lo visual se prueba con clics.
6. **En el navegador**, con clics de ratón y también simulando toque, a 375 px y a 1200 px, en español y en inglés
   (`https://salasgar.github.io/Ejercicios-interactivos/practicas/arbol/?probar=1&ejercicio=2` en local con el servidor de siempre):
   un ítem terminado (Sí), uno no terminado con «No» + factor bueno, uno con «No» + factor malo, uno con «Sí» equivocado, y
   «No lo sé» antes y después del «No». Consola limpia. Captura del paso dos a 375 px en tu scratchpad, citada en la ENTREGA.

## Datos de entrada

`practicas/arbol/` (solo los ficheros de arriba), `practicas/_comun/` (solo lectura: `elecciones`, `marcar`, estilos comunes).

## Cómo saber que ha terminado

Los cambios comiteados y empujados con `npm test` en verde en tus ficheros; la práctica sigue publicada y funcionando en la URL de
GitHub Pages; la ENTREGA dice qué se cambió, cómo se probó y la captura.

## Trampas conocidas

- (de la coordinadora) En la tarea semanal de la U2 este ejercicio aparece como «ej. 4»: la alumna se refería a este.
- (de la coordinadora) Hay varias sesiones en este árbol y otras tienen cambios sin comitear en `practicas/_comun/` y `tests/`: no
  metas en tu commit nada que no sea tuyo, y nada de `git stash`.
- (de la 202) `npm test` tarda ~10 min con todo el repo: lánzalo en segundo plano. Un Chrome headless propio, `kill` por pid al acabar.

## Prohibido (propio de esta tarea)

- Cambiar qué cuenta como acierto, el «No lo sé» o la puntuación. Tocar `practicas/_comun/`, `catalogo.js` u otras prácticas.

## Si la sesión se alarga

Comitea lo que esté con tests en verde, `$R/hechos/fallos/208--<sid>.md` con lo que queda y `parada por: sesión agotada`, y
`ABANDONADA` en tu reclamo.

## Al terminar

1. `node --test tests/practicas-arbol.test.js tests/practicas-ayuda-arbol.test.js tests/practicas-no-lo-se.test.js` en verde y
   `npm test` sin fallos en tus ficheros.
2. Commit **solo de los «Ficheros que toca»**: `git add <rutas> && git commit -m "Árbol de factores: paso dos visible (tarea 208)" -- <rutas>`.
3. `$R/salidas/208-arbol-paso-dos/ENTREGA.md` + marcador vacío `ENTREGA.md.ok-<sid>`: lo hecho, hash, cómo se probó, captura, y
   **hallazgos fuera de criterio** (otras prácticas con un paso dos igual de escondido, si las ves).
4. `$R/hechos/terminadas/208--<sid>.md` (hash, `git show --stat`, tests, hora y **duración real**); `CERRADA` en tu reclamo.
5. `git fetch origin`, relista `$R/hechos/` y regenera `$R/_ESTADO.md` con el guion; trampas nuevas aquí arriba.
6. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/`, tu carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y
   `git push origin main` desde este árbol. Si se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez y repite.
7. Dile a Juan Luis la foto del momento y, solo para las LIBRES, las frases de arranque de `proyecto.md`.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca». `git add .`, `-A`, `commit -a`, un `add` separado del `commit`, `git stash`,
  `--autostash`, `git checkout -- .`, `git reset --hard`.
- Editar el código con `sed -i` o heredocs desde el shell (el candado de sesiones solo ve Edit/Write); `hechos/` sí, desde el shell.
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno o regenerar el tablón de memoria.
- Nombres de alumnos reales en ningún fichero (el repo es público).
