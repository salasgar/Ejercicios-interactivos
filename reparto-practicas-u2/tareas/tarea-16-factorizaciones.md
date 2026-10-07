# Tarea 16 · Operar con factorizaciones: el producto sumando exponentes, ¿es múltiplo? construyendo el factor que falta, y el cociente restando exponentes

Actualizado: 2026-10-07
Precondición: 01 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 15
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/16-factorizaciones/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/factorizaciones/*` (nuevo), `tests/practicas-factorizaciones.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 16\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/16--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/16--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 16 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/16--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Idea de Juan Luis (2026-10-07): que el alumno vea que con las factorizaciones no hace
falta calcular nada. El producto de dos números factorizados se obtiene sumando
exponentes; saber si uno es múltiplo de otro es comparar exponentes, y el factor por el
que hay que multiplicar (o el cociente) se construye con los primos que faltan, restando
exponentes. Destrezas: U2-2C-14 (leer la factorización para decidir sin dividir si un
número es divisible entre otro), U2-2C-11 y U2-2C-12 (forma de potencias y comprobación),
y prepara U2-3C-03/04 (las reglas del m.c.d. y el m.c.m. por exponentes). Es también la
base algebraica de la práctica de Venn (tarea 09) sin usar letras.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/factorizaciones/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-factorizaciones.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

Tres ejercicios, los tres con steppers de exponentes (la misma pieza de interfaz: una
columna por primo con −/valor/+ y el valor numérico que se va formando debajo):

1. **El producto.** Lleva `introduccion` con un **ejemplo resuelto** en los dos idiomas:
   «12 = 2² · 3 y 18 = 2 · 3². Su producto es 12 · 18 = 216. ¿Cómo se factoriza 216? Basta
   sumar los exponentes de cada primo: 2^(2+1) · 3^(1+2) = 2³ · 3³. Compruébalo: 8 · 27 =
   216.» Después, ítems: a y b factorizados (`htmlFact`), primos entre 2, 3, 5, 7, 11, a lo
   sumo tres distintos entre los dos, exponentes ≤ 3; se muestra también «a · b = 1800»
   (el valor del producto). El alumno construye la factorización del producto. Acierto si
   los exponentes son la suma. Feedback por primo: «el 2: 2 + 1 = 3 → 2³; el 5 solo está
   en b: 5² pasa tal cual».
2. **¿Es múltiplo?** a y b factorizados; «¿Es a múltiplo de b?» Sí/No (mitad y mitad; los
   «no» se reparten entre «un primo de b no está en a» y «un primo está pero con exponente
   menor»). Si contesta **Sí y es verdad**, segunda parte: «¿Por qué número hay que
   multiplicar b para obtener a?» y construye la factorización de a/b con los steppers
   (primos de a; exponentes iniciales 0). El ítem es acierto si las dos partes lo son (una
   llamada a `responder`). Si contesta No y es verdad, acierto con el feedback que señala
   el primo que falla («b tiene 5 y a no», «b tiene 2³ y a solo 2²»). Si se equivoca en
   la primera parte, fallo con esa misma explicación. Dilo en la introducción corta del
   ejercicio: «no hace falta dividir: mira los exponentes».
3. **El cociente.** a múltiplo de b, los dos factorizados (y «a = 1800, b = 60» en números
   al lado); construye a : b restando exponentes. Incluye un 20 % de ítems donde algún
   exponente queda en 0 (el primo desaparece), un 10 % con a = b (el cociente es 1: todos a
   0) y un 20 % con un primo de a que no está en b (pasa entero). Acierto si coincide.
   Feedback por primo: «el 3: 2 − 1 = 1; el 5: 2 − 2 = 0, desaparece».

Ítem: `{ tipo: 'producto' | 'multiplo' | 'cociente', fa, fb, a, b, solucion: [[p, e]…], esMultiplo, primoQueFalla: { p, ea, eb } | null }`.
Funciones de `logica.js`: `generar`, `esCorrecta(item, exponentes)`, `explicar(item, exponentes, idioma)`; usa `multiplicarFact`, `dividirFact` y `esMultiploFact` de
`aritmetica.js` y compruébalas en tu test por fuerza bruta además.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- `aritmetica.js`: `factorizar`, `valorDe`, `multiplicarFact`, `dividirFact`, `esMultiploFact`, `htmlFact`.

## Cómo saber que ha terminado

- Test: en 3000 ítems, `valorDe(solucion)` = `a · b` (ej. 1) o `a / b` (ej. 3) y
  `esMultiplo === (a % b === 0)` (ej. 2) por fuerza bruta; las cuotas de casos especiales
  del ejercicio 3; en el 2, Sí y No entre el 40 % y el 60 %; `a · b ≤ 100 000` para que el
  valor se lea.
- Navegador: hasta cuatro columnas de steppers caben en 375 px; el valor numérico que se
  va formando se actualiza con cada toque.

## Trampas conocidas

- Mostrar el valor del producto (1800) invita a factorizarlo por divisiones sucesivas en
  vez de sumar exponentes: está bien que esté (lo pidió Juan Luis), pero el feedback
  siempre enseña la suma de exponentes, no la escalera.
- Los steppers con tope: en el ejercicio 1 el tope de cada primo es la suma; no pongas
  tope en el 2 y el 3 o delatas la respuesta.

## Prohibido (propio de esta tarea)

- Letras o fórmulas generales («a^m · a^n = a^(m+n)»): todo con números concretos.
- Pedir el m.c.d. o el m.c.m.: eso es la tarea 09.

## Salida esperada

- `practicas/factorizaciones/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-factorizaciones.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/16-factorizaciones/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `factorizaciones` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 16, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-16.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/16--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/16--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/16-factorizaciones/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/16--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/16--<sid>.md` con hasta dónde llegaste, la línea
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
