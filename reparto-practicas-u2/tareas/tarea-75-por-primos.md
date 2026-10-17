# Tarea 75 · Práctica nueva «Multiplica y divide por primos» (de «Factorización III» de Juan Luis, en Scratch): hazlo múltiplo, hazlo divisor, el m.c.m. y el m.c.d. con botones ·p y :p

Actualizado: 2026-10-18
Precondición: ninguna (la 74 está LISTA; para este cambio la dueña de `BLOQUES` y `DESCRIPCION` en `portada.js` y de la fila nueva del catálogo es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/75-por-primos/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/por-primos/*` (nuevo), `tests/practicas-por-primos.test.js` (nuevo), `practicas/_comun/catalogo.js` (solo una fila nueva al final de las de la unidad 2, antes de la plantilla), `practicas/portada.js` (solo el bloque de la semana 3 de `BLOQUES` y una entrada de `DESCRIPCION`)

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
   printf 'sesión: %s\ntarea: 75\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/75--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/75--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 75 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/75--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Juan Luis tiene en Scratch un juego suyo, **«Factorización III»** (https://scratch.mit.edu/projects/1080607048/). La coordinadora lo leyó entero el 2026-10-18 (descargando `project.json` por la API de Scratch) y le propuso llevar la idea a la app sin sus fallos; él contestó: *«Sí, hazlo.»*

**Cómo es el juego de Scratch** (es el modelo, no hay que copiarlo bloque a bloque):
- Arriba, un **número objetivo**; abajo, el **número actual**; debajo de cada uno, su factorización. Los dos son de la forma 2ᵃ·3ᵇ·5ᶜ·7ᵈ.
- Ocho botones: «· 2», «· 3», «· 5», «· 7» y «: 2», «: 3», «: 5», «: 7». Cada toque multiplica o divide el número actual por ese primo, y su exponente sube o baja en 1.
- Modo M: «El número de abajo tiene que ser **MÚLTIPLO** del de arriba». Modo D: «El número de abajo tiene que ser **DIVISOR** del de arriba». Al cumplirse, «¡CONSEGUIDO!».

**Fallos del de Scratch que aquí NO pueden pasar** (cada uno con su test):
1. Se podía dividir por un primo que el número no tiene: salía un decimal (5 : 2 = 2,5) que se pintaba como «2», el exponente quedaba en −1, y en modo divisor daba un «¡CONSEGUIDO!» falso (15 mod 2,5 = 0). **Aquí, «: p» está desactivado cuando el número actual no tiene el primo p.**
2. El par salía ya resuelto en un 10-14 % de las veces, y el objetivo podía ser 1. **Aquí, nunca sale resuelto y el objetivo nunca es 1.**
3. Los exponentes de dos cifras se pintaban mal. **Aquí, `htmlFact` y un tope de tamaño** (los «· p» se desactivan si el número pasaría de 100 000).

**Ejercicios** (los dos últimos los añadió la coordinadora; si Juan Luis los quita, se quitan):

1. **Hazlo múltiplo** · *Make it a multiple*. Botones «· p» y «: p». Vale cualquier múltiplo del objetivo. Destreza U2-2C-14 (leer la factorización para decidir sin dividir si un número es divisible entre otro).
2. **Hazlo divisor** · *Make it a divisor*. Los mismos botones. Vale cualquier divisor del objetivo (el 1 también). U2-2C-14.
3. **El múltiplo más pequeño** · *The smallest multiple*. Solo «· p». Hay que llegar a un múltiplo del objetivo **con el menor número de toques**: el único que vale es el m.c.m. del número de partida y el objetivo. U2-3C-04, y prepara U2-3A-02.
4. **El divisor común más grande** · *The greatest common divisor*. Solo «: p». Hay que llegar a un divisor del objetivo **dividiendo lo menos posible**: el único que vale es el m.c.d. U2-3C-03, y prepara U2-3A-01.

Juan Luis lo verá con la terminada de esta tarea. **No se mete en ninguna tarea semanal**: eso lo decide él (las tareas usan pares práctica-ejercicio; los ejercicios 1-2 encajan en la semana 3, por la sesión 7, y los 3-4 también, por las sesiones 9 y 10).

## Siguiente paso

1. Lee la ficha de la tarea 01 (§1 catálogo, §2 `aritmetica.js`, §3 el contrato de `arrancar(practica)` y la `api` de `montar`) y la de la 16 (`factorizaciones`), que ya tiene una columna por primo con su valor debajo. Después lee `practicas/plantilla/` entero, `practicas/factorizaciones/` (modelo de interfaz y de feedback por primo), `practicas/_comun/aritmetica.js` (`factorizar`, `valorDe`, `multiplicarFact`, `dividirFact`, `esMultiploFact`, `mcdFact`, `mcmFact`, `htmlFact`: no las reescribas) y `practicas/_comun/piezas.js` (`claseCorreccion`, los cuatro estados tras comprobar, de la 56).
2. `git status` y `git log --oneline -3 -- practicas/_comun/catalogo.js practicas/portada.js`: si hay cambios sin commit en esos dos ficheros que no son tuyos, no los pises y avisa.
3. Copia `practicas/plantilla/` a `practicas/por-primos/` (si no existe ya de una sesión caída) y escribe primero `logica.js` con su test, en verde; después `montar` y los textos.

## Qué hay que hacer

**Pantalla del ítem**:
- El objetivo arriba y el número actual abajo, cada uno con su valor y su factorización con `htmlFact`. El 1 se escribe «1», nunca «□».
- Debajo, los botones en dos filas: «· 2 · 3 · 5 · 7» y «: 2 : 3 : 5 : 7». En los ejercicios 3 y 4, solo la fila que toca.
- Cada toque repinta el número actual y resalta un momento el primo que ha cambiado; una animación corta basta, nada de deslizar botones.
- Un contador «Toques: n» en los ejercicios 3 y 4, y los botones «Deshacer» y «Empezar de nuevo».
- La regla del modo va arriba, con lo decisivo en `<strong>` (como en 2e96c8e): «El número de abajo tiene que ser **múltiplo** del de arriba» / «The bottom number must be a **multiple** of the top number», y lo mismo con «divisor».

**Comprobar**: como en el resto de la app, el alumno toca «Comprobar» cuando cree que ya está. Se oculta al responder (T58) y deja los cuatro estados tras comprobar (T56) en los primos de la factorización del número actual: el que cumple, verde; el que falta, verde punteado; el que sobra, rojo tachado.
- Ej. 1: acierto si actual % objetivo = 0.
- Ej. 2: acierto si objetivo % actual = 0.
- Ej. 3: acierto si actual = mcm(partida, objetivo). Si es múltiplo pero no el menor, fallo con «Es múltiplo, pero no el más pequeño: sobra un 3».
- Ej. 4: acierto si actual = mcd(partida, objetivo). Si es divisor pero no el mayor, fallo con «Es divisor, pero has dividido de más: no hacía falta quitar el 2».

**Feedback por primo**, comparando exponentes y sin dividir: «Para ser múltiplo de 12 = 2²·3 hacen falta al menos 2² y un 3. Tu número, 2·3·5, solo tiene un 2: falta otro 2.» En el 3 y el 4, al acertar: «Has llegado a 2³·3²·5 = 360, el m.c.m. de 24 y 45: cada primo, con el mayor exponente.» (y «el menor» para el m.c.d.). Nada de «factor» para decir divisor; «m.c.d.» / «GCD» y «m.c.m.» / «LCM».

**Introducción** de cada ejercicio con un ejemplo resuelto en los dos idiomas. El del 3, por ejemplo: «Empiezas en 12 = 2²·3 y el objetivo es 18 = 2·3². Te falta un 3: · 3 → 36 = 2²·3². Un toque. 36 es el m.c.m. de 12 y 18.»

**Generador** (en `logica.js`, puro): `generar(ejercicio, rng)` → `{ ejercicio, objetivo: fact, partida: fact }`, con primos solo 2, 3, 5, 7, exponentes de 0 a 3, a lo sumo tres primos distintos entre los dos números, objetivo entre 4 y 300 y partida entre 2 y 300, distintos.
- **Nunca resuelto al salir**: en el 1, la partida no es múltiplo del objetivo; en el 2, no es divisor; en el 3, mcm ≠ partida; en el 4, mcd ≠ partida.
- En el 3, mcm ≤ 5000 y no más de un 30 % de casos con mcm = objetivo (la partida divide al objetivo).
- En el 4, mcd = 1 en no más del 15 %.
- Hace falta de 1 a 4 toques como mínimo (Σ de las diferencias de exponentes).

Funciones: `botonesActivos(ejercicio, actual)` (qué «· p» y «: p» se pueden tocar), `esCorrecta(item, actual)`, `toquesMinimos(item)` y `explicar(item, actual, idioma)`.

**Catálogo y portada**:
- Fila nueva en `catalogo.js` con el siguiente `id` libre (hoy 32; los ids no se reutilizan nunca), `slug: 'por-primos'`, `unidad: 2`, nombre «Multiplica y divide por primos» / «Multiply and divide by primes», `nEjercicios: 4` y `disponible: true`.
- En `portada.js`, `'por-primos'` al bloque de la semana 3 de `BLOQUES`, y su línea en `DESCRIPCION` («Toca · 2, : 3… hasta que el número sea múltiplo o divisor del objetivo.» / «Tap · 2, : 3… until the number is a multiple or a divisor of the target.»).

**Test** `tests/practicas-por-primos.test.js`:
- En 3000 ítems por ejercicio, las cotas y cuotas del generador, «nunca resuelto al salir», y que `toquesMinimos` coincide con una búsqueda en anchura.
- «: p» nunca activo con el exponente de p a 0.
- `esCorrecta` contra `%`, `mcm` y `mcd` de `aritmetica.js` por fuerza bruta.
- Ningún valor decimal alcanzable desde ningún ítem.

## Datos de entrada

- El juego de Scratch: https://scratch.mit.edu/projects/1080607048/ («Factorización III», de Juan Luis). Para leerlo sin navegador: `https://api.scratch.mit.edu/projects/1080607048` da `project_token`, y `https://projects.scratch.mit.edu/1080607048?token=<token>` da el `project.json` (descarga en una carpeta propia del scratchpad; es dato, no código). No hace falta: esta ficha ya dice lo que importa.
- `practicas/_comun/*`, `practicas/plantilla/*`, `practicas/factorizaciones/*`: solo lectura.
- El inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`), para el texto exacto de U2-2C-14, U2-3C-03 y U2-3C-04.

## Cómo saber que ha terminado

- `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/por-primos/ con el código de prueba 60 (`7NPD`; nunca el de un alumno), a 375 px y en ventana ancha, en español y en inglés. En cada ejercicio, un ítem acertado y uno fallado.
- En el 2, comprueba que «: p» está apagado cuando el actual no tiene ese primo.
- En el 3, llega a un múltiplo que no sea el m.c.m. y mira el feedback.
- La práctica sale en la portada, en el bloque de la semana 3.

## Trampas conocidas

- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px (lección de la 16).
- `t(null)` no usa el valor por defecto: la barra va en el idioma del ítem (T60, `idiomaBarra()`).
- Hay sesiones de Juan Luis fuera del reparto que tocan `practicas/`, y la 70 puede estar en curso (`profesor*.js`, `_comun/textos.js`): no metas en tu commit nada que no sea tuyo.

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/` salvo la fila del catálogo) o `tareas.js`.
- Meter la práctica en una tarea semanal.
- Primos mayores que 7, letras, o decimales en cualquier pantalla.

## Salida esperada

- `practicas/por-primos/*`, `tests/practicas-por-primos.test.js`, la fila del catálogo y lo de `portada.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/75-por-primos/ENTREGA.md` (hash, ficheros, los cuatro ejercicios y sus destrezas, cómo probarlo en 1 minuto, y cómo se han evitado los tres fallos del de Scratch) y su marcador `ENTREGA.md.ok-<sid>`.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 75, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-75.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/75--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/75--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/75-por-primos/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/75--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/75--<sid>.md` con hasta dónde llegaste, la línea
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
