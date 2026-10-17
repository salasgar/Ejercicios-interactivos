# Tarea 58 · «Comprobar» se oculta al responder en las cinco prácticas donde hoy se queda a la vista

Actualizado: 2026-10-17
Precondición: ninguna (las 40, 42 y 56 están LISTAS; para este cambio la dueña de los ficheros de abajo es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/58-ocultar-comprobar/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/semaforo/practica.js`, `practicas/criba/practica.js`, `practicas/exponente/practica.js`, `practicas/recta/practica.js` (con la condición de «Trampas»), `practicas/rectangulos/practica.js`, `tests/practicas-comprobar.test.js` (nuevo)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5, esfuerzo Alto; MEDIO = Sonnet 5, esfuerzo Medio).

## Antes de empezar

Todas las rutas son relativas a la raíz del repositorio
(`/Users/salasgar/Documents/git/Ejercicios-interactivos`). `R=reparto-practicas-u2`.

1. Lee `$R/proyecto.md` y `$R/_ESTADO.md` enteros, y **lista `$R/hechos/`**
   (`ls $R/hechos/*/`): la carpeta manda sobre la tabla. Resuelve lo que no cuadre antes de
   coger nada (tabla de rastros contradictorios en el tablón, «Antes de hacer nada»).
2. `date -u` para saber la hora de verdad. `git fetch origin && git status -sb` para saber
   si hay commits que traer (`git pull --rebase origin main` si los hay; los ficheros de
   otras sesiones a medias no estorban porque tocan rutas distintas).
3. Abre tu reclamo generando el sid **en el mismo comando** (probado en este Mac):
   ```bash
   R=reparto-practicas-u2; sid="s-$(date -u +%Y%m%dT%H%M%S)-$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
   caduca=$(date -u -d '+MINUTOS minutes' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+MINUTOSM +%Y-%m-%dT%H:%M:%SZ)
   printf 'sesión: %s\ntarea: 58\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/58--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/58--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 58 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/58--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

El 2026-10-17, mirando el semáforo en GitHub Pages, se vio que tras pulsar «Comprobar» el botón se queda a la vista, azul y con aspecto de poder pulsarse, encima del feedback y con «Siguiente» debajo: dos botones azules grandes, y el segundo «Comprobar» no hace nada. En casi todas las prácticas el botón desaparece al responder (`hidden = true`, `style.display = 'none'` o `remove()`; el común trae `.comprobar[hidden] { display: none; }`). Juan Luis, ese día: *«Es mejor que "comprobar" se oculte.»*

Sitios donde hoy se queda a la vista (comprobado el 17-10 con `grep`; números de línea de ese día):

| Práctica | Ejercicio | Manejador |
|---|---|---|
| `semaforo/practica.js` | 1 y 2 (`montarSemaforo`) | línea 59, `comprobar.addEventListener('click', …)` |
| `criba/practica.js` | el de la rejilla | línea 130, `#comprobar` |
| `exponente/practica.js` | los dos con `#comprobar` | líneas 100 y 129 |
| `recta/practica.js` | 1 y 2 | línea 47, `#comprobar` |
| `rectangulos/practica.js` | ej. 1, botón «Ya están todas» (`#todas`, clase `comprobar`): hoy se deshabilita (gris) | línea 94 |
| `rectangulos/practica.js` | ej. 2, banco | línea 143, `#comprobar` |

Fuera: `arbol` ya lo quita (`comprobar.remove()`) y el botón «terminado» desaparece con su panel; el resto ya lo oculta.

## Siguiente paso

1. `git status -sb` y `git log --oneline -3 -- practicas/recta`: ver «Trampas» antes de tocar la recta.
2. Lee cada manejador de la tabla (diez líneas alrededor) y uno de referencia que ya lo hace bien: `practicas/baldosas/practica.js` (`botonEsta.hidden = true`).
3. Cambia los seis sitios; después el test; después el navegador.

## Qué hay que hacer

1. En cada manejador de la tabla, **justo después** de la comprobación `if (api.respondido()) return;` (y de la de `disabled` en el semáforo) y **antes** de `api.responder(…)`, ocultar el botón con el atributo: `boton.hidden = true` (usa la variable que ya exista; si no hay, `ev.currentTarget.hidden = true` o `contenedor.querySelector('#comprobar').hidden = true`). No uses `style.display`: el común ya respeta `[hidden]`.
2. En rectángulos ej. 1, sustituye `botonTodas.disabled = true` por `botonTodas.hidden = true` (o deja las dos).
3. Nada más cambia: ni la corrección, ni los colores, ni las esperas, ni los textos. Si un ejercicio vuelve a montar el ítem al «Practicar otra vez» o al cambiar de idioma, el botón nace visible de nuevo con el ítem nuevo (compruébalo en el navegador; es lo esperado).
4. **Test nuevo** `tests/practicas-comprobar.test.js`: para cada `practicas/*/practica.js` (salvo `plantilla`) que pinte un botón con `class="comprobar` y lo escuche con `addEventListener('click'`, el fichero contiene al menos una de `.hidden = true`, `style.display = 'none'` o `.remove()`. Es una red gruesa contra la próxima práctica que se olvide; dilo así en el comentario del test. Si alguna práctica correcta no pasa la red por cómo está escrita, añádela a una lista de excepciones con su motivo en una línea.

## Datos de entrada

Comunes (solo lectura): `practicas/_comun/estilos.css` (`.comprobar`, `.comprobar[hidden]`), `practicas/baldosas/practica.js` y `practicas/constructor/practica.js` como referencia de cómo se oculta.

## Cómo saber que ha terminado

En local (`npm run servir`, http://localhost:8080/practicas/<slug>/), con el código de prueba 60 (`7NPD`; nunca el de un alumno), en el semáforo, la criba, el exponente, la recta y los dos ejercicios de rectángulos: responde un ítem acertando y otro fallando; tras pulsar, «Comprobar» (o «Ya están todas») desaparece y solo queda «Siguiente» bajo el feedback. En el siguiente ítem vuelve a aparecer. Pruébalo a 375 px y en ancho, en español y en inglés (el botón «See in English» no debe hacerlo reaparecer). `npm test` sin fallos en tus ficheros.

## Trampas conocidas

- **`practicas/recta/` tiene cambios de otra sesión sin commit** (17-10: `logica.js` y `tests/practicas-recta.test.js`; es el paso del recuento de aciertos de `practica.js` a `logica.js`, fuera del reparto, y probablemente acabe tocando también `practica.js`). Si al empezar `git status` sigue mostrando cambios en `practicas/recta/` o en su test, **deja la recta para el final**; si al final siguen ahí, no la toques: ciérrala sin ella y escríbelo en la terminada («recta pendiente: cambios ajenos sin commit»), para que la coordinadora la reabra o la añada a esa otra sesión. Nunca hagas commit de esos ficheros ajenos.
- El semáforo deshabilita «Comprobar» mientras no haya nada pulsado (tarea 40): no lo rompas. Ocultar va después de esa comprobación.
- Los cambios de CSS o JS tardan hasta 10 minutos en verse en GitHub Pages (caché); en la entrega, recuerda la recarga forzada.

## Prohibido (propio de esta tarea)

- Tocar `practicas/_comun/` o cualquier práctica fuera de la tabla.
- Cambiar la corrección, la puntuación, los colores o las esperas.
- Hacer commit de cambios de `practicas/recta/` que no sean tuyos.

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados (la recta, solo si se pudo).
- `tests/practicas-comprobar.test.js` nuevo.
- `reparto-practicas-u2/salidas/58-ocultar-comprobar/ENTREGA.md` (hash, ficheros, enlaces de GitHub Pages de las cinco prácticas para que Juan Luis lo mire, recordatorio de la recarga forzada) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 58, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-58.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/58--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/58--<sid>.md` con `parada por: mal cortada`
y la ruta de la incidencia, `ABANDONADA` en tu reclamo, y díselo al usuario. Si un paso te
pide **decidir** algo que va a durar (un cambio del contrato de la base, otro número de
ejercicios que el del catálogo, una colección nueva en Firestore) y esta tarea no es de
banda ALTA con el usuario delante, no lo decidas: entrégalo como propuesta en tu terminada
y sigue con lo que no dependa de ello.

## Al terminar

Por este orden (el del repositorio git):

1. `node --test tests/practicas-comun.test.js tests/practicas-<tu slug>.test.js` en verde y
   `npm test` sin fallos en tus ficheros (un fallo en un fichero ajeno con reclamo vivo no
   es tuyo: anótalo en la terminada). Prueba la práctica en el navegador con
   `npm run servir` y http://localhost:8080/practicas/<slug>/ (los módulos ES no cargan
   abriendo el fichero), en una ventana estrecha (375 px) y en una ancha, en español y en
   inglés, y haz al menos un ítem de cada ejercicio acertando y fallando.
2. Commit **solo de los ficheros de «Ficheros que toca»**, con rutas explícitas:
   `git add <rutas> && git commit -m "Práctica <slug>: <qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/58-ocultar-comprobar/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/58--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` entero:
   todas las filas, el registro con una línea por fichero de `terminadas/`, banda y
   «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/58--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01), ni `css/estilos.css`, ni `README.md` (salvo
  01 y 18), ni `firestore.rules` ni `src/firebase.js` (salvo 01), ni fichas ajenas, ni
  nada de la carpeta de apuntes de iCloud. Si la base te falta algo, se propone en la
  terminada; no se parchea.
- `git add .`, `git add -A`, `git commit -a`, o un `add` separado del `commit`. El índice
  es compartido con otras sesiones del mismo árbol.
- Editar el código con `sed -i` o heredocs desde el shell: el candado de sesiones solo
  ve Edit/Write, y así otra sesión no sabe que el fichero está en uso. El código se edita
  con las herramientas de edición; `hechos/` sí se escribe desde el shell (un escritor).
- Reescribir un fichero de `hechos/` (solo `>>`), editar un reclamo ajeno, o regenerar el
  tablón de memoria sin relistar `hechos/`.
- Dependencias nuevas (npm, CDN): la app no tiene build y solo carga KaTeX y Firebase por
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`).
- Las reglas de contenido de `proyecto.md`: «factor» por «divisor», HCF en vez de GCD, `×`
  en vez de `·`, letras o ecuaciones, «primos entre sí», distractores que puedan ser
  verdad, excluir el 0 de los múltiplos, preguntar «múltiplo de 0».
