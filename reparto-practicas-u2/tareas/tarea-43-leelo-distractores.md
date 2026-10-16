# Tarea 43 · «Léelo en inglés»: distractores que no se resuelven comparando dígitos (inglés incorrecto, estructura cambiada, -teen/-ty)

Actualizado: 2026-10-16
Precondición: ninguna (la 15 está LISTA; para este cambio la dueña de `practicas/leelo/logica.js` y su test es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 42
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/43-leelo-distractores/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/leelo/logica.js`, `tests/practicas-leelo.test.js`. No toca `practica.js` (sigue recibiendo `{ correcta, pool }` y cogiendo tres del pool) ni `textos.js`.

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
   printf 'sesión: %s\ntarea: 43\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/43--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/43--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 43 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/43--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis, revisando la app el 2026-10-16, vio que el ejercicio 2 («¿Cómo se lee?») se
resuelve sin leer inglés: basta comparar dígitos. Dos ejemplos suyos:

- `GCD(41, 30) = 1` con las opciones «…of forty-one and thirty is equal to one» (correcta),
  «…forty-one and thirty-one…», «…is equal to two», «…forty-two and thirty… six».
- `84 = 2² · 3 · 7` con «two squared times three times seven» (correcta), «two times three
  times seven», «two squared times five times seven», «two squared times seven times
  thirteen».

La causa es `variantesDe` (`logica.js`, líneas 73-110): los distractores cambian un número
en ±1, un primo por otro o el valor en ±1/±2. Convertidos a palabras, la diferencia salta
a la vista sin saber inglés. Lo que el ejercicio quiere practicar es la lectura: «squared»,
«cubed», «times» / «multiplied by», «greatest common divisor», «is equal to», «thirteen» frente
a «thirty»… Los distractores tienen que fallar **ahí**, con los mismos números.

Decidido con Juan Luis: tres familias de distractores, todas con los mismos números que la
lectura correcta, y la lista cerrada de inglés incorrecto de abajo (son errores que cometen
de verdad los hispanohablantes: calcos de «multiplicado por», «elevado a», «máximo común
divisor», «número primo», «compuesto»). La regla de oro manda: **ningún distractor puede ser
una lectura válida** en ningún estilo ni en ninguna variante regional.

## Siguiente paso

1. Lee `practicas/leelo/logica.js` entero (265 líneas), `tests/practicas-leelo.test.js` entero
   (en especial el test «nunca se enfrentan GCD/greatest common divisor/HCF ni lowest/least»,
   línea 115: tiene que seguir en verde) y `practicas/leelo/practica.js` líneas 47-110
   (`cuatroOpciones` coge tres del pool al azar: por eso la composición del pool se decide en
   `logica.js`, al generar el ítem).
2. `git status -sb` y `git log --oneline -3 -- practicas/leelo`: si hay cambios sin comitear de
   otra sesión, no los pises.
3. Primero las familias y el test de la regla de oro (apartado E) en verde; después la
   prueba en el navegador.

## Qué hay que hacer

### A. Familia «inglés incorrecto» (solo ejercicio 2), lista CERRADA

Cada distractor sustituye **una** pieza de la lectura correcta, en el estilo del ítem, por
su forma incorrecta. Solo estas (pieza correcta → formas incorrectas admitidas):

| Pieza | Correcta (según estilo) | Incorrectas admitidas |
|---|---|---|
| producto | `times` | `multiplicated by`, `times by`, `multiplied for` |
| producto | `multiplied by` | `multiplicated by`, `multiplied for`, `multiplied` (sin «by») |
| cuadrado | `squared` | `square`, `elevated to two`, `to the two` |
| cubo | `cubed` | `cube`, `elevated to three`, `to the three` |
| potencia ≥ 4 | `to the power of N` | `elevated to N`, `powered to N` (NO «to the power N»: se dice en inglés británico) |
| igual | `equals` | `equals to`, `is equal`, `is the same that` |
| igual | `is equal to` | `is equal than`, `equals to`, `is the same that` |
| m.c.d. | `greatest common divisor` | `maximum common divisor`, `greatest common divider`, `greatest common division` |
| m.c.d. | `GCD` | `MCD`, `GDC` |
| m.c.m. | `lowest common multiple` / `least common multiple` | `minimum common multiple`, `lowest common multiply`, `least common multiplier` |
| m.c.m. | `LCM` | `MCM`, `LMC` |
| «de» | `of A and B` | `from A and B`, `of A with B` |
| primo | `is a prime number` | `is a cousin number`, `is a first number`, `is a prime numeral` |
| compuesto | `is a composite number` | `is a compound number`, `is a composed number`, `is a composite numeral` |

Quedan **fuera a propósito** porque alguien podría darlas por válidas: `by` como producto («two
by three» se usa en dimensiones), `to the power N` (británico), `between` para el m.c.d.,
`smallest common multiple`, `is a prime` (válido), `two to the second power` (americano,
válido), `raised to`. Si dudas de una forma, no la metas: propónla en la terminada.

### B. Familia «estructura cambiada, mismos dígitos» (ejercicios 1 y 2)

- Factorizaciones con dos exponentes distintos: intercambiarlos (2³·3² → «two squared times
  three cubed»). Con un solo exponente > 1: moverlo a otro primo (2²·3·7 → «two times three
  squared times seven»). Siempre comprobando que el valor resultante ≠ n (si coincidiera,
  descartar).
- m.c.d./m.c.m.: cambiar el nombre por el del otro concepto **en el mismo estilo** (GCD ↔
  LCM, «greatest common divisor» ↔ «lowest/least common multiple» del mismo estilo), mismos
  números y mismo valor. Es falso siempre que a ≠ b (garantizado por `generarPar`).

### C. Familia «palabra-número parecida» (ejercicios 1 y 2), solo para rellenar

- -teen/-ty: 13↔30, 14↔40, 15↔50, 16↔60, 17↔70, 18↔80, 19↔90, en a, en b o en el valor.
- Cifras invertidas en números de dos cifras distintas y no nulas: 41↔14, 23↔32, 36↔63.
- Para que la familia exista a menudo, `generarPar` elige al menos un 50 % de las veces un
  número de {13..19, 30, 40, 50, 60, 70, 80, 90} o uno con cifras invertibles.
- La mutación actual (±1, primo por otro, valor ±1/±2) desaparece del ejercicio 2; en el
  ejercicio 1 (escuchar) queda solo como último relleno si B y C no dan tres.

### D. Composición del pool

- Los distractores se generan **al crear el ítem** (`generarLeer`, `generarEscuchar`, con el
  `rng`) y se guardan en el ítem (`item.falsas`, exactamente tres); `opcionesLeer` y
  `opcionesEscuchar` devuelven `{ correcta, pool: item.falsas }` para que `practica.js` no
  cambie.
- Ejercicio 2: al menos uno de A y, si existe, uno de B; el tercero de A, B o C (barajado con
  `rng`). Todos en el estilo del ítem; nunca dos distractores iguales ni iguales a la correcta.
- Ejercicio 1 (opciones en notación): B y C primero; la mutación antigua solo de relleno.
  Las opciones de notación con nombre cambiado se escriben con la notación del otro
  concepto (`LCM(41, 30) = 1`).

### E. Tests (`tests/practicas-leelo.test.js`)

1. **Regla de oro**: para 2000 ítems del ejercicio 2 con semilla fija, ningún distractor
   coincide con `leer(item, estilo)` para **ninguno** de los tres `ESTILOS`, ni con la
   correcta; y ningún distractor contiene una forma de la lista de «fuera a propósito».
2. **Mismos dígitos**: en el ejercicio 2, al menos dos de los tres distractores de cada ítem
   usan exactamente las mismas palabras-número que la correcta (compara el multiconjunto de
   palabras de `numeroAIngles` presentes), salvo cuando la familia C entra como relleno.
3. **Familias presentes**: en 2000 ítems, al menos un 90 % tiene un distractor de A y, de los
   de factorización con exponentes distintos, al menos un 80 % tiene uno de B.
4. Los tests existentes siguen en verde (pool ≥ 3, sin repetidos, estilos no enfrentados,
   ninguna posición domina).
5. Ejercicio 1: ningún distractor de notación representa la misma expresión que la correcta
   (misma clase, mismos a y b en cualquier orden, mismo valor; o misma factorización).

## Datos de entrada

Solo lectura: `src/ejercicios/palabras.js` (`numeroAIngles`), `practicas/_comun/aritmetica.js`
(`mcd`, `mcm`, `factorizar`, `valorDe`), `practicas/leelo/practica.js` (`cuatroOpciones`), las
«Reglas de contenido comunes» de `proyecto.md` (regla 4, de oro; HCF y GCF se aceptan como
válidas: no pueden ser distractores) y `CLAUDE.md` del repositorio (variantes regionales).

## Cómo saber que ha terminado

- Tests en verde y `npm test` sin fallos en tus ficheros.
- En el navegador (`npm run servir`, http://localhost:8080/practicas/leelo/), ejercicio 2, diez
  ítems seguidos: en ninguno se puede acertar comparando dígitos; cada ítem tiene al menos un
  distractor de inglés incorrecto que un alumno de 1.º de ESO reconocería como error al leerlo
  en voz alta; el botón «▶ Oír la correcta» sigue leyendo la correcta. Ejercicio 1, cinco
  ítems: las notaciones falsas se parecen de verdad a la correcta (LCM por GCD, 13 por 30).
- Los dos ejemplos de Juan Luis quedarían, por ejemplo, así: `GCD(41, 30) = 1` → correcta «the
  greatest common divisor of forty-one and thirty is equal to one»; falsas «the lowest common
  multiple of forty-one and thirty is equal to one», «the maximum common divisor of forty-one
  and thirty is equal to one», «the greatest common divisor of fourteen and thirty is equal to
  one». `84 = 2² · 3 · 7` → falsas «two times three squared times seven», «two square times
  three times seven», «two squared multiplicated by three multiplicated by seven».

## Trampas conocidas

- `cuatroOpciones` en `practica.js` baraja el pool y coge tres: si el pool tiene más de tres,
  la composición (A + B + C) se pierde. Por eso el pool devuelto son exactamente las tres
  falsas guardadas en el ítem.
- El test de la línea 115 comprueba que en un ítem de m.c.d. no aparece ningún **otro nombre
  válido** del m.c.d. (ni del m.c.m. en uno de m.c.m.). Los nombres de la familia A
  («maximum common divisor») no están en `ESTILOS`, así que no lo rompen; el nombre del otro
  concepto (familia B) tampoco, porque el test solo mira los nombres de la misma clase.
- `leer` para `clase: 'primo' | 'compuesto'` existe pero `generarEscuchar` no genera esas
  clases: si las añades al ejercicio 2 para usar «cousin number», hazlo con poco peso y
  comprueba el test de equilibrio de clases (línea 90).

## Prohibido (propio de esta tarea)

- Formas incorrectas fuera de la lista A, o cualquiera de las «fuera a propósito».
- Enfrentar dos lecturas válidas (estilos distintos, HCF/GCF, «to the second power», «is a
  prime»): regla de oro.
- Tocar `practica.js`, `textos.js`, `src/ejercicios/palabras.js` o `practicas/_comun/`.
- Cambiar el orden de a y b en una lectura y darlo por falso (`of thirty and forty-one` para
  `GCD(41, 30)` no es inequívocamente falso).

## Salida esperada

- `practicas/leelo/logica.js` y `tests/practicas-leelo.test.js` cambiados y comiteados.
- `reparto-practicas-u2/salidas/43-leelo-distractores/ENTREGA.md` (hash, ficheros, diez
  ítems de ejemplo del ejercicio 2 con sus cuatro opciones, cómo probarlo en 1 minuto) y su
  marcador `ENTREGA.md.ok-<sid>`.
- En la terminada: formas incorrectas que se te hayan ocurrido y no estén en la lista
  (propuesta para Juan Luis), y si conviene añadir primo/compuesto al ejercicio 2.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 43, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-43.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/43--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/43--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/43-leelo-distractores/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/43--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/43--<sid>.md` con hasta dónde llegaste, la línea
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
