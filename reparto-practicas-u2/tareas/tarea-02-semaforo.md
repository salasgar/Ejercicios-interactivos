# Tarea 02 · Semáforo de divisibilidad: criterios del 2, 3, 5, 9, 10 y 11, compuestos y cifra que falta

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 04
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/02-semaforo/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/semaforo/*` (nuevo), `tests/practicas-semaforo.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 02\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/02--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/02--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 02 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/02--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Que el alumno aplique los criterios de divisibilidad de un golpe de vista y con
corrección inmediata. Destrezas: U2-1C-05 (2, 5, 10: última cifra), U2-1C-06 (3: suma de
las cifras, no la última), U2-1C-07 (9 y distinguirlo del 3), U2-1C-08 (11), U2-1C-09
(compuestos 6, 15, 22, 30, 33 y cuándo no se pueden combinar), U2-1C-10 (cifra que falta).
Errores que ataca: el criterio del 3 por la última cifra; «múltiplo de 3, luego de 9»;
«suma de cifras» para el 5.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/semaforo/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-semaforo.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Cuatro ejercicios (el catálogo dice `nEjercicios: 4`):

1. **Semáforo básico.** Aparece un número de 2 a 4 cifras y cinco botones: 2, 3, 5, 9, 10,
   apagados. El alumno enciende (toggle) los que dividen al número y pulsa «Comprobar».
   Acierto solo si el conjunto encendido coincide exactamente con el verdadero. Feedback de
   fallo: cada botón se pinta verde/rojo según estuviera bien o mal, y debajo la razón de
   cada equivocación con los números del ítem («el 3 sí: 7 + 3 + 8 = 18, y 18 es múltiplo
   de 3»; «el 9 no: 18 no es múltiplo de 9… ¡sí lo es! → 738 sí es divisible entre 9»). Usa
   `criterio(n, d).razon` de `aritmetica.js`. El generador fuerza variedad: al menos un
   30 % de números divisibles entre 3 y no entre 9, al menos un 15 % de números que acaban
   en 0, y nunca más de la mitad con el conjunto vacío.
2. **Con el 11.** Igual, con seis botones (añade el 11). Feedback del 11 con la suma
   alterna escrita: «(8 + 9) − (2 + 4) = 11». Al menos un 25 % de los números son
   divisibles entre 11 (constrúyelos multiplicando).
3. **Criterios compuestos.** «¿Es 1452 divisible entre 22?» con botones Sí / No. `d` ∈
   {6, 15, 22, 30, 33} y, un 20 % de las veces, la trampa de U2-1C-09: «divisible entre 4
   y entre 6, ¿es divisible entre 24?» como ítem aparte de tipo `trampa` con un número
   concreto (12, 36, 60…) donde la respuesta es No y el feedback muestra 12 : 24 no exacta.
   Feedback normal: «22 = 2 · 11: entre 2 sí (acaba en 2), entre 11 sí ((1+5)−(4+2) = 0)».
4. **La cifra que falta.** «4□7 es divisible entre 9. ¿Qué cifra falta?» con diez botones
   0-9. El generador elige número y divisor (3, 9, 11, o «entre 2 y entre 9», «entre 5 y
   entre 3») y **garantiza que la cifra es única** probando las diez; si no es única,
   vuelve a generar (el test lo comprueba). La cifra 0 al principio no vale: el hueco no es
   la primera cifra salvo que la solución no sea 0.

Estructura del ítem: `{ tipo: 'semaforo' | 'sino' | 'trampa' | 'cifra', n, divisores: [2,3,5,9,10(,11)], correctos: [...], d, hueco, solucion }`.
Funciones de `logica.js`: `generar(ejercicio, rng)`, `esCorrecta(item, respuesta)`
(respuesta: array de divisores encendidos, 'si'/'no', o cifra), `explicar(item, respuesta, idioma)`
(devuelve el HTML del feedback, con los números).

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- Ninguno más: los números se generan.

## Cómo saber que ha terminado

- `node --test tests/practicas-semaforo.test.js` en verde con, como mínimo: para los
  ejercicios 1 y 2, `correctos` coincide con `n % d === 0` en 3000 ítems y se cumplen las
  cuotas de variedad; para el 3, la respuesta coincide con `n % d === 0` y los ítems
  `trampa` tienen siempre respuesta No; para el 4, la cifra solución es la única de 0-9 que
  cumple, y nunca es un 0 inicial.
- En el navegador, los cuatro ejercicios funcionan en 375 px: los seis botones del
  semáforo caben en una fila (o en dos filas de tres).

## Trampas conocidas

- La regla del 11 con suma alterna puede dar negativo o 0: 0 y cualquier múltiplo de 11
  (incluido −11) cuentan como divisible. Escribe la diferencia en el orden que dé
  positivo o cero.
- Un número que acaba en 0 es divisible entre 2, 5 y 10 a la vez: no lo trates como tres
  errores separados en el feedback; una línea por divisor basta.
- (02, al cerrar) `criterio(n, d)` de `aritmetica.js` ya da la razón lista en los dos
  idiomas para d ∈ {2, 3, 5, 9, 10, 11}: no hace falta reescribir el criterio del 11 ni
  el de la suma de cifras, ni para el ejercicio 3 (factoriza el divisor compuesto con
  `factorizar` y aplica `criterio` a cada primo).
- (02) Para la cifra única del ejercicio 4, generar las cifras al azar y probar las diez
  (0-9) descartando `x=0` solo cuando el hueco es la primera cifra basta: con 500
  reintentos (semilla fija) siempre encuentra una solución única; no hizo falta construir
  el número al revés a partir del divisor.

## Prohibido (propio de esta tarea)

- Criterios del 4 y del 25: son ampliación no evaluable (U2-1C-12); no aparecen aquí.
- Explicar «por qué funciona» el criterio (U2-1C-11): es de la hoja, no de esta práctica.

## Salida esperada

- `practicas/semaforo/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-semaforo.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/02-semaforo/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `semaforo` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 02, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-02.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/02--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/02--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/02-semaforo/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/02--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/02--<sid>.md` con hasta dónde llegaste, la línea
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
