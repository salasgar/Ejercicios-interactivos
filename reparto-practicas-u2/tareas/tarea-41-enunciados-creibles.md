# Tarea 41 · Enunciados creíbles en «¿m.c.d. o m.c.m.?» y «Detector de imposibles»: contextos, unidades y cotas de los números

Actualizado: 2026-10-16
Precondición: ninguna (la 10 y la 11 están LISTAS; para este cambio la dueña de `practicas/clasificador/textos.js` y `practicas/imposibles/textos.js` es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 40, 42
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/41-enunciados-creibles/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/clasificador/textos.js`, `practicas/imposibles/textos.js`, `tests/practicas-clasificador.test.js`, `tests/practicas-imposibles.test.js`

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
   printf 'sesión: %s\ntarea: 41\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/41--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/41--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 41 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/41--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, revisando la app el 2026-10-16, encontró en «¿m.c.d. o m.c.m.?» enunciados
correctos en lo matemático e imposibles en el mundo físico: pulseras hechas con «72 canicas
y 29 cuentas»; dos cabinas de la misma noria que pasan a la vez por abajo; un metrónomo que
marca cada 16 segundos (van de 20 a 240 clics por minuto); corredores que dan la vuelta a la
pista cada 4 y cada 10 segundos (son 90-200 s). La causa es que todo el bloque periódico
comparte el rango 2..20 y las parejas de objetos se eligieron sin mirar el contexto. De ahí
salió la regla 9 de «Reglas de contenido comunes» de `proyecto.md` (repaso de realismo):
esta tarea la aplica a las dos prácticas con enunciados.

**El repaso de realismo ya está hecho** (coordinadora, 16-10, con los generadores delante) y
el resultado está abajo: lo que no aparece en «Qué hay que hacer» se ha revisado y es
creíble. No lo repitas; si al leer ves otro caso, arréglalo igual y anótalo en la terminada.

Todo lo que sigue está decidido con Juan Luis; los textos son suyos o aprobados por él.

## Siguiente paso

1. Lee `practicas/clasificador/textos.js` entero (unas 240 líneas: cabecera con el recuento
   de plantillas, `dosGrandes`, `dosPequenos`, `tresPequenos`, los cinco bloques y `BANCO`),
   `tests/practicas-clasificador.test.js` entero (mira qué recuentos y qué rangos afirma: el
   banco pasa de 36 a 37 plantillas), `practicas/imposibles/textos.js` (líneas 26-50,
   `enteros`, `enterosMcd` y `BANCO_NOMBRAR`) y `tests/practicas-imposibles.test.js`.
2. `git status -sb` y `git log --oneline -3 -- practicas/clasificador practicas/imposibles`:
   si hay cambios sin comitear de otra sesión en esos ficheros, no los pises.
3. Primero el clasificador (plantilla, entradas, generador), test en verde; después
   imposibles, test en verde; después la prueba en el navegador.

## Qué hay que hacer

### A. Clasificador: la plantilla del bloque periódico (`LIMPIOS_MCM`)

1. Un helper `dosDistintos(rng, min, max)` (dos enteros distintos en [min, max]) y
   `dosPequenos = rng => dosDistintos(rng, 2, 20)`, para que `dosPequenos` siga existiendo.
2. Cada entrada puede traer `numeros` propio: en el `.map`, `numeros: d.numeros ?? dosPequenos`.
3. Cada entrada puede traer `genero: 'f'` para la unidad: la pregunta pasa a
   `¿Dentro de ${d.genero === 'f' ? 'cuántas' : 'cuántos'} ${d.uEs} volverán a coincidir?`.
   El inglés no cambia. La `razon` tampoco.

### B. Clasificador: las entradas del bloque periódico

4. **Noria** (hoy «Una cabina de la noria pasa por abajo cada…»): se sustituye por
   ```js
   { sEs: 'Una noria da una vuelta cada', sEn: 'One big wheel goes round every',
     s2Es: 'otra noria da una vuelta cada', s2En: 'another big wheel goes round every',
     uEs: 'minutos', uEn: 'minutes',
     vEs: 'Ana va en una y Raúl en la otra, y los dos acaban de pasar por el punto más alto a la vez',
     vEn: 'Ana is on one and Raúl is on the other, and both of them have just passed the top at the same time' }
   ```
   Minutos y no segundos porque con 2..20 una noria no da una vuelta en 3 segundos. Frase
   resultante: «Una noria da una vuelta cada 2 minutos y otra noria da una vuelta cada
   5 minutos: Ana va en una y Raúl en la otra, y los dos acaban de pasar por el punto más
   alto a la vez. ¿Dentro de cuántos minutos volverán a coincidir? ¿Hace falta el m.c.d. o
   el m.c.m.?». Los nombres propios los aprobó Juan Luis para este contexto.
5. **Metrónomo**: se queda, en décimas de segundo y con cota propia (20-240 clics por
   minuto = 0,25-3 s = 3..30 décimas):
   ```js
   { sEs: 'Un metrónomo hace clic cada', sEn: 'One metronome clicks every',
     s2Es: 'otro hace clic cada', s2En: 'another one clicks every',
     uEs: 'décimas de segundo', uEn: 'tenths of a second', genero: 'f',
     vEs: 'los dos acaban de hacer clic a la vez', vEn: 'both of them have just clicked together',
     numeros: rng => dosDistintos(rng, 3, 30) }
   ```
   Frase: «Un metrónomo hace clic cada 16 décimas de segundo y otro hace clic cada 5 décimas
   de segundo: los dos acaban de hacer clic a la vez. ¿Dentro de cuántas décimas de segundo
   volverán a coincidir? …».
6. **Corredor** («Un corredor pasa por la meta cada…»): texto igual; cota propia
   `numeros: rng => dosDistintos(rng, 9, 20).map(x => 10 * x)` → 90..200 segundos en decenas.
7. **Semáforo** («Un semáforo cambia cada…»): texto igual; cota propia
   `numeros: rng => dosDistintos(rng, 3, 12).map(x => 10 * x)` → 30..120 segundos en decenas.
8. **Grifo que gotea**, entrada NUEVA (el bloque pasa de 10 a 11 entradas y el banco de 36 a
   37 plantillas; actualiza el comentario de cabecera de `textos.js` y los recuentos del test):
   ```js
   { sEs: 'De un grifo cae una gota cada', sEn: 'One tap drips every',
     s2Es: 'de otro cae una cada', s2En: 'another one drips every',
     uEs: 'segundos', uEn: 'seconds',
     vEs: 'las dos acaban de caer a la vez', vEn: 'both of them have just dripped together' }
   ```
   Frase: «De un grifo cae una gota cada 16 segundos y de otro cae una cada 2 segundos: las
   dos acaban de caer a la vez. ¿Dentro de cuántos segundos volverán a coincidir? …».
9. Revisados y creíbles con 2..20, se quedan como están: faro (s), luz que parpadea (s),
   rosal (días), campana, aspersor y alarma (min).

### C. Clasificador: los otros bloques

10. `LIMPIOS_MCD_PAQUETES`: la pareja `canicas / cuentas → pulseras` pasa a
    `{ oEs: 'cuentas rojas', oEn: 'red beads', pEs: 'cuentas azules', pEn: 'blue beads', gEs: 'pulseras', gEn: 'bracelets' }`.
    Las otras cinco parejas (lápices/gomas, manzanas/naranjas, pegatinas/cromos,
    bombones/caramelos, libros/cuadernos) son creíbles con 12..96.
11. `LIMPIOS_MCD_TROZOS`: la plantilla fija «cm» y una **manguera** de 12..96 cm no existe:
    pasa a `{ oEs: 'alambre', oEn: 'wire', tEs: 'trozos', tEn: 'pieces', tsEs: 'cada trozo', tsEn: 'each piece' }`.
    Cuerda, cinta, tabla de madera, tela y cable en cm son creíbles.
12. `dosGrandes` (lo usan `LIMPIOS_MCD_PAQUETES`, `LIMPIOS_MCD_TROZOS` y `TRAMPA_A`): fuerza
    `mcd(a, b) >= 2`, como hace `enterosMcd` en `practicas/imposibles/textos.js` (líneas
    116-120). Con 72 y 29 «el mayor número de pulseras» es 1 y el contexto se vuelve absurdo.
    Hay un `mcd` en `practicas/_comun/aritmetica.js`; impórtalo, no lo reescribas.
13. `TRAMPA_A` (12..96) y `TRAMPA_B` (`tresPequenos`, 3..9) revisados: creíbles.

### D. Detector de imposibles (`practicas/imposibles/textos.js`)

14. `BANCO_NOMBRAR`, última plantilla de m.c.d. («${a} canicas y ${b} cuentas se reparten en
    el mayor número posible de pulseras iguales»): canicas → cuentas rojas, cuentas →
    cuentas azules, en los dos idiomas (`red beads`, `blue beads`). La plantilla del
    ejercicio 1 «canicas y cuentas → bolsas» (línea 34) es creíble y se queda.
15. `BANCO_NOMBRAR`, plantilla del corredor («Un corredor pasa por la meta cada ${a} segundos
    y otro cada ${b}…», con `enteros(rng, 2, 9)`): aquí el m.c.m. es la respuesta que se
    nombra y no puede crecer, así que se cambia el contexto y no la cota: «Un coche de
    juguete da una vuelta al circuito cada ${a} segundos y otro cada ${b} segundos: pasan
    juntos por la salida cada ${r} segundos. El ${r} es…» / «One toy car goes round the track
    every ${a} seconds and another one every ${b} seconds: they pass the start together
    every ${r} seconds. ${r} is…» (mantén la forma exacta del final que usen las demás
    plantillas del banco). Autobuses, tren, luz, campana y alarma con 2..9 son creíbles;
    cintas, lápices/gomas, paneles, manzanas, bombones con `enterosMcd(12, 60)`, también.

### E. Tests

16. `tests/practicas-clasificador.test.js`: con semilla fija y al menos 300 ítems por
    plantilla, (a) el metrónomo nunca saca números fuera de 3..30 y su enunciado en español
    contiene «cuántas décimas de segundo»; (b) el corredor saca múltiplos de 10 en 90..200 y
    el semáforo en 30..120; (c) toda plantilla de dos números y `clase: 'mcd'` da
    `mcd(a, b) >= 2`; (d) ningún enunciado de `BANCO` contiene «canicas», «manguera»,
    «cabina» ni «cuántos décimas»; (e) los recuentos existentes del test, actualizados a 37
    plantillas (13 m.c.m. limpias). El `mcd` del test, por fuerza bruta propia, no el de
    `aritmetica.js` (regla de los tests de este reparto).
17. `tests/practicas-imposibles.test.js`: ningún texto de `BANCO_NOMBRAR` contiene
    «canicas» junto a «pulseras» ni «corredor»; lo demás, como estaba.

## Datos de entrada

Solo lectura: `src/ejercicios/contextos_mcd_mcm.js` (el banco de la app de ejercicios: modelo
de cómo se acota cada contexto con `max` propio; sus 44 contextos están revisados y son
creíbles), `practicas/_comun/aritmetica.js` (`mcd`), `practicas/imposibles/textos.js` líneas
105-120 (`enteros`, `enterosMcd`), las «Reglas de contenido comunes» de `proyecto.md` (en
especial la 3, inglés sencillo, y la 9, repaso de realismo).

## Cómo saber que ha terminado

- Los dos tests en verde y `npm test` sin fallos en tus ficheros.
- En el navegador (`npm run servir`, http://localhost:8080/practicas/clasificador/ y
  `/practicas/imposibles/`), en los dos idiomas: recorre ítems del ejercicio 1 del
  clasificador hasta ver la noria, el metrónomo, el grifo y las pulseras, y comprueba que
  las frases se leen bien (concordancias, «cuántas décimas», ningún «undefined»). En
  imposibles, el ejercicio «El r es…» con el coche de juguete y con las pulseras.
- `grep -n "canicas\|manguera\|cabina" practicas/clasificador/textos.js` no devuelve nada;
  en `practicas/imposibles/textos.js` solo queda la línea de «canicas y cuentas → bolsas».

## Trampas conocidas

- La plantilla del bloque periódico lleva «cuántos» fijo: sin el campo de género, «cuántos
  décimas de segundo» se cuela sin error. El test (d) lo detecta.
- Las plantillas se construyen con `.map` sobre la tabla: `numeros` y `genero` hay que leerlos
  de `d` dentro del `.map`, no fuera.
- `dosGrandes` con `mcd >= 2` sobre 12..96 converge rápido (más de la mitad de las parejas
  valen); no hace falta otro rango.

## Prohibido (propio de esta tarea)

- Tocar `practica.js`, `logica.js` o `estilos.css` de las dos prácticas, `src/ejercicios/*` o
  `practicas/_comun/*`.
- Cambiar las frases aprobadas de arriba más allá de lo que exija la plantilla (si algo no
  encaja, propónlo en la terminada y deja lo que se acerque más).
- Volver a segundos el metrónomo, o quitar la noria, el metrónomo o el corredor en vez de
  acotarlos: Juan Luis quiso conservarlos.

## Salida esperada

- Los cuatro ficheros de «Ficheros que toca» cambiados y comiteados; cabecera de
  `textos.js` del clasificador con el recuento nuevo (37 plantillas: 24 + 1 limpias…).
- `reparto-practicas-u2/salidas/41-enunciados-creibles/ENTREGA.md` (hash, ficheros, las
  frases finales de los cinco contextos cambiados en los dos idiomas, cómo probarlo en 1
  minuto) y su marcador `ENTREGA.md.ok-<sid>`.
- En la terminada: cualquier otro enunciado poco creíble que hayas visto al leer.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 41, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-41.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/41--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/41--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/41-enunciados-creibles/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/41--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/41--<sid>.md` con hasta dónde llegaste, la línea
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
