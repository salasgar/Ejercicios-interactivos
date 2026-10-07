# Tarea 20 · ¿Qué se hace primero? Ejecutar la jerarquía paso a paso tocando la operación que toca, y los agrupadores invisibles (repaso de la unidad 1)

Actualizado: 2026-10-07
Precondición: 34 LISTA · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: 21
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/20-jerarquia/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/jerarquia/*` (nuevo), `tests/practicas-jerarquia.test.js` (nuevo)

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
   printf 'sesión: %s\ntarea: 20\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/20--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/20--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 20 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/20--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

La hermana de «Coloca los paréntesis»: aquí el alumno no cambia la expresión, la ejecuta.
Toca la operación que se resuelve primero, la app la calcula y acorta la expresión, y así
hasta el final. Destrezas de la unidad 1: 1A-14, 1A-15, 2A-14, 2A-15, 3A-13, 3A-14, 4A-14,
4A-15 (qué se hace primero y en qué orden), 1A-03 y 1A-04 (misma prioridad: de izquierda
a derecha), 1A-09 (raíz y potencia en el mismo escalón), 3A-07 a 3A-10 y 4A-09 (la raya de
fracción y el radical agrupan), 4A-10 (paréntesis redundante). Errores que ataca: hacer la
suma antes que la resta «porque va antes en BIDMAS», hacer 12 : 6 : 2 de derecha a
izquierda, sumar lo que hay bajo la raíz después de la raíz.

## Siguiente paso

1. Lee la ficha de la tarea 01 (`reparto-practicas-u2/tareas/tarea-01-base-comun.md`),
   apartados §1 (catálogo), §2 (`aritmetica.js`: no reescribas lo que ya está ahí) y §3
   (el contrato de `arrancar(practica)` y la `api` de `montar`), y después
   `practicas/plantilla/practica.js` entero con sus comentarios, `practicas/_comun/aritmetica.js`
   (los exports reales mandan sobre esta ficha si difieren) y `practicas/_comun/estilos.css`.
   Si la terminada de la 01 (`reparto-practicas-u2/hechos/terminadas/01--*.md`) anuncia
   cambios del contrato, mandan sobre esta ficha.
2. Copia `practicas/plantilla/` a `practicas/jerarquia/` (si no existe ya de una sesión caída)
   y cambia el `<title>`, el `slug` y el icono.
3. Escribe primero `logica.js` (generadores y comprobaciones, puro) con su test
   `tests/practicas-jerarquia.test.js`, en verde, y solo después `montar` y los textos.

## Qué hay que hacer

La expresión se pinta como una fila de **operandos y operadores tocables**; cada operador
es un botón. Un paso = tocar un operador. Si es el que toca (el de mayor prioridad y, a
igualdad, el más a la izquierda, con los agrupadores de dentro hacia fuera), la app lo
resuelve: los dos operandos y el operador se funden en el resultado con una pequeña
animación y la línea anterior queda escrita arriba como historial («18 − 12 : 6 · 2 =
18 − 2 · 2 = 18 − 4 = 14»). Si no es, fallo del ítem con la razón («el · y el : van antes
que el −»; «: y · tienen la misma prioridad: se hace el de la izquierda») y la app resuelve
el paso correcto para seguir. El ítem termina al llegar a un número; es acierto si no hubo
ningún toque equivocado (una llamada a `responder`). Potencias y raíces son operadores
unarios tocables (el exponente y el signo radical). Reutiliza el evaluador paso a paso de
`practicas/parentesis/logica.js` si ya existe (tarea 19) **copiándolo**, no importándolo
(esa carpeta tiene otra dueña); si no existe aún, escríbelo aquí y dilo en la terminada
para que la 19 lo copie de ti.

Cuatro ejercicios:

1. **Dos y tres operaciones sin paréntesis** (+, −, ·, :), con al menos una pareja de la
   misma prioridad que obligue al orden izquierda-derecha en el 50 % de los ítems.
2. **Con potencias y raíces** (cuadrados, cubos, raíces exactas de cuadrados perfectos
   hasta 400), tres o cuatro operaciones: la potencia y la raíz antes que el producto, y en
   el mismo escalón entre sí.
3. **Paréntesis anidados**: dos niveles, de dentro hacia fuera, con una potencia dentro en
   el 40 % de los ítems (4A-01, 4A-02).
4. **Agrupadores invisibles.** Una expresión con raya de fracción (numerador o
   denominador con una suma o resta) o con radical sobre una suma, escrita en dos
   alturas; el alumno toca los huecos para poner los paréntesis implícitos y la app la
   reescribe en una línea y la resuelve paso a paso (3A-07 a 3A-10, 1A-13, 3C-24, 4A-09).
   La colocación de paréntesis reutiliza la mecánica de huecos de la tarea 19 (cópiala).
   Acierto si los paréntesis son exactamente los que agrupan lo que agrupa la raya o la
   raíz; los redundantes alrededor de un solo número no son error pero se avisan (4A-10).

Ítem: `{ tipo: 'pasos' | 'invisibles', expresion (árbol), pasos: [{ operador, resultado, linea }], agrupador: 'raya' | 'radical' }`.

## Datos de entrada

Comunes a todas las prácticas (solo lectura): `practicas/_comun/*` (la base), `practicas/plantilla/*`
(el ejemplo), `divisores/app.js` (fichas que se arrastran con pointer events, si hace falta
arrastrar), el inventario `inventario-unidad2.tsv` de la carpeta de apuntes (ruta en `proyecto.md`)
para el texto exacto de cada destreza, y las «Reglas de contenido comunes» de `proyecto.md`.
Propios de esta tarea:

- Inventario de la unidad 1 (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv`, filas 1A-01 a 1A-15, 2A-05 a 2A-15,
  3A-01 a 3A-14, 4A-01 a 4A-15.
- `practicas/parentesis/` si existe (solo lectura; se copia, no se importa).

## Cómo saber que ha terminado

- Test: en 3000 ítems, el operador «que toca» en cada paso coincide con una definición
  independiente (prioridad y posición), cada línea del historial vale lo mismo que la
  anterior, y el valor final coincide con la evaluación directa; todas las operaciones
  intermedias son naturales; en el ejercicio 4 los paréntesis esperados reproducen el
  árbol de la expresión en dos alturas.
- Navegador: expresiones de cinco operaciones caben en 375 px (si no, dos filas); la
  animación de fundir dos operandos no bloquea el siguiente toque.

## Trampas conocidas

- La raíz sobre una suma en una línea necesita paréntesis: `√(16 + 9)`; en dos alturas no.
  El ejercicio 4 muestra la versión en dos alturas con un SVG o con `<span>` apilados;
  mantén el signo radical cubriendo todo el radicando.
- Potencias con exponente sobre un paréntesis: el exponente se toca después de resolver el
  paréntesis, nunca antes.

## Prohibido (propio de esta tarea)

- Resultados negativos o divisiones inexactas en ningún paso (nada que no se haya dado).
- Dar por error un paréntesis redundante.

## Salida esperada

- `practicas/jerarquia/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
  (vacío si no hace falta nada propio). `logica.js` puro: sin DOM ni red.
- `tests/practicas-jerarquia.test.js`: para cada ejercicio, al menos 1000 ítems generados con
  semilla fija y comprobados contra definiciones **independientes** por fuerza bruta (no
  contra las funciones de `aritmetica.js`): la respuesta correcta es verdad, cada opción
  dada por falsa es falsa (regla de oro), y no gana quien pulsa siempre lo mismo (ninguna
  opción es correcta en más del 70 % de los ítems de un ejercicio de elegir).
- `reparto-practicas-u2/salidas/20-jerarquia/ENTREGA.md` con su marcador `.ok-<sid>`.
- En la terminada: la petición a la tarea 18 de poner `disponible: true` en el catálogo
  para `jerarquia` (si la base usa ese campo), y cualquier propuesta de cambio del contrato.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 20, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-20.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/20--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/20--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/20-jerarquia/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/20--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/20--<sid>.md` con hasta dónde llegaste, la línea
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
