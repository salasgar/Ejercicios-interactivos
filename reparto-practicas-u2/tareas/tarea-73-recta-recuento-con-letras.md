# Tarea 73 · Recta: el recuento de los que sobran, con letras («Two numbers are wrong», «Sobran dos números»)

Actualizado: 2026-10-17
Precondición: ninguna (la 59 está LISTA; para este cambio la dueña de `recuento` es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/73-recta-recuento-con-letras/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/recta/logica.js` (solo la función `recuento` y, si hace falta, una función auxiliar nueva para el número con letras), `tests/practicas-recta.test.js` (solo los tests de `recuento`)

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
   printf 'sesión: %s\ntarea: 73\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/73--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/73--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 73 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/73--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La coordinadora vio el 2026-10-17, probando la recta tras la tarea 59, que el recuento dice «2 are wrong (in red).» justo cuando el 2 es uno de los números de la recta (y a veces uno de los marcados): se lee como «el número 2 está mal». En español pasa lo mismo con «Sobran 2 (en rojo).» y «Sobra 1 (en rojo).», que vienen justo después de «Te faltan 2, 3, 4, 6 y 12», una lista de números de la recta. Se le propuso a Juan Luis escribir la cantidad con letras y el sustantivo detrás, y el 2026-10-17 contestó: *«Acepto tu propuesta.»*

Regla: **en la frase de los que sobran, la cantidad va con letras y seguida de «número(s)» / «number(s)»**, para que no se confunda con un número de la recta:

| sobran | español | inglés |
|---|---|---|
| 1 | `Sobra un número (en rojo).` | `One number is wrong (in red).` |
| 2 | `Sobran dos números (en rojo).` | `Two numbers are wrong (in red).` |
| 3-20 | `Sobran tres números…` … `Sobran veinte números…` | `Three numbers are wrong…` … `Twenty numbers are wrong…` |
| más de 20 | `Sobran 23 números (en rojo).` | `23 numbers are wrong (in red).` |

Por encima de 20 basta la cifra: el sustantivo detrás ya evita la confusión y en la práctica casi no pasa (el ejercicio 1 tiene 61 casillas, del 0 al 60).

## Siguiente paso

1. Lee `recuento` en `practicas/recta/logica.js` (hacia las líneas 140-167) y sus tests en `tests/practicas-recta.test.js` (hacia las líneas 155-165).
2. `git status` y `git log --oneline -3 -- practicas/recta/ tests/practicas-recta.test.js`: si hay cambios sin commit en esos dos ficheros que no son tuyos, no los pises y avisa.

## Qué hay que hacer

1. Una función auxiliar (no exportada salvo para el test, si te hace falta) que dé la cantidad con letras de 1 a 20 en los dos idiomas: en español con el apócope delante del sustantivo (**«un número»**, no «uno número»; del 2 al 20 sin cambios: dos, tres… dieciséis, diecisiete, dieciocho, diecinueve, veinte, con tilde en **dieciséis**); en inglés en minúscula (one… twenty) y con mayúscula al principio de la frase (`One`, `Two`…). De 21 en adelante, la cifra.
2. En `recuento`, cambia solo la frase de los que sobran según la tabla del objetivo. La frase de lo encontrado («Has encontrado **6 de los 6**…», «You found **1 of the 6**…») y la de los que faltan («Te faltan 2, 3…», «Missing: 2, 3…») **no** se tocan: allí los números son de la recta o van en una construcción que no se confunde.
3. Tests: actualiza los tres de `recuento` (líneas 161-163) a las frases nuevas y añade casos para 1, 2, 16 (tilde), 20 y 21 sobrantes, en los dos idiomas.

## Datos de entrada

Ninguno aparte del código.

## Cómo saber que ha terminado

En local (`npm run servir`), con el código de prueba 60 (`7NPD`; nunca el de un alumno), en la recta, ejercicio 2 (divisores) y ejercicio 1 (múltiplos), en español y en inglés: marca un número de más y luego dos de más y comprueba que el feedback dice «Sobra un número (en rojo).» / «One number is wrong (in red).» y «Sobran dos números (en rojo).» / «Two numbers are wrong (in red).». `npm test` sin fallos en tus ficheros.

## Trampas conocidas

- La frase del recuento la antepone `explicar` cuando el ítem no está acertado (tarea 59): si un ítem acertado no la enseña, es lo esperado.
- El botón «See in English / Ver en español» traduce el feedback: comprueba también la frase traducida.
- Hay sesiones de Juan Luis fuera del reparto que tocan `practicas/` (por ejemplo, 2e96c8e, lo decisivo en `<strong>`), y la tarea 72 tiene cambios sin commit en `practicas/_comun/`: no metas en tu commit nada que no sea tuyo.

## Prohibido (propio de esta tarea)

- Tocar otra frase de la recta, otra práctica o `practicas/_comun/`.
- Cambiar la lógica de qué cuenta como sobrante (el 0 en el ejercicio 1, los divisores marcados como múltiplos…).

## Salida esperada

- `practicas/recta/logica.js` y `tests/practicas-recta.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/73-recta-recuento-con-letras/ENTREGA.md` (hash, ficheros, las frases nuevas tal como salen, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 73, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-73.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/73--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/73--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/73-recta-recuento-con-letras/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/73--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/73--<sid>.md` con hasta dónde llegaste, la línea
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
