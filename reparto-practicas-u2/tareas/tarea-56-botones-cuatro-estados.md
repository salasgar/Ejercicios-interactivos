# Tarea 56 · Botones de números: los cuatro estados de la corrección en el CSS común y en todas las prácticas que los usan

Actualizado: 2026-10-17
Precondición: ninguna (las 40 y 42 están LISTAS; para este cambio la dueña de los ficheros de abajo es esta tarea) · Disparo: MANUAL (sesión atendida)
Duración esperada: 1 h (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/56-botones-cuatro-estados/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/estilos.css` (solo el bloque «Botones cuadrados para cifras y primos»), `practicas/_comun/piezas.js` (solo añadir una función pura al final), `practicas/semaforo/estilos.css`, `practicas/semaforo/practica.js`, `practicas/rectangulos/estilos.css`, `practicas/rectangulos/practica.js`, `practicas/constructor/practica.js`, `practicas/baldosas/practica.js`, `tests/practicas-botones.test.js` (nuevo)

Ojo con el paralelo: la 51 toca `practicas/_comun/{base,registro,textos}.js` y `tests/practicas-{comun,registro}.test.js`; la 52, `practicas/_comun/textos.js`, `semana.*`, portada; la 53, el panel y `resultados.js`. Ninguno de esos está arriba: **esta tarea no toca `tests/practicas-comun.test.js`** (por eso el test va en un fichero nuevo) ni ningún `.js` del común salvo `piezas.js`.

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
   printf 'sesión: %s\ntarea: 56\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/56--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/56--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 56 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/56--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.



## Objetivo

Cuando Juan Luis revisó la app el 2026-10-16 vio en el semáforo que, tras Check, el 9 (sobraba) y el 10 (acertado) se veían iguales: azules y atenuados. Con él se decidió un código de **cuatro estados**, el mismo en toda la app para los botones de números que se encienden:

| El alumno… | …y el número era correcto | …y no lo era |
|---|---|---|
| lo pulsó | `bien`: verde relleno | `mal`: rojo, número tachado |
| no lo pulsó | `falta`: blanco con borde verde de puntos | sin clase: gris atenuado de `:disabled` |

La causa está en el CSS común: `.botones-numeros button[aria-pressed="true"]` y `.botones-numeros button:disabled` pesan más que `.botones-numeros .bien` / `.mal`, así que un botón pulsado se queda azul y atenuado, acierte o no. El arreglo **solo está copiado en dos prácticas**: en `rectangulos/estilos.css` (commit 31733ea) y en `semaforo/estilos.css` (tarea 40). La sesión de fuera del reparto que iba a llevarlo al común no lo publicó: el último commit de `practicas/_comun/estilos.css` es 7d3f019, anterior a la revisión. Constructor (ej. 2, «descomposición a suma») sigue enseñando igual el botón acertado y el fallado. Juan Luis dio el visto bueno a esta tarea el 2026-10-17.

Lo decidido (no se rediscute):

1. Las reglas de los cuatro estados van **al CSS común**, y se quitan las copias de semáforo y rectángulos.
2. Una **función pura** en `piezas.js` decide la clase. Así el criterio está en un solo sitio y se puede probar con un test.
3. **Todas** las prácticas que pintan `.botones-numeros` al corregir usan esa función. También las de una sola respuesta (semáforo ej. 4 «cifra que falta» y baldosas): en ellas, la correcta que el alumno no eligió lleva `falta` (borde de puntos), no `bien`.
4. Fuera de esta tarea: los botones grandes de una opción (`.eleccion`, `piezas.elecciones` / `marcar`), que ya se pintan bien con `!important`; y las prácticas que tienen clases propias (`exp-click--*`, `factor--*`, `pareja__boton--*`, `casilla--*`, `operacion--*`).

## Siguiente paso

1. Lee `practicas/_comun/estilos.css`, líneas 114-124 (bloque «Botones cuadrados para cifras y primos»), y los dos CSS que llevan la copia: `practicas/semaforo/estilos.css`, líneas 1-11, y `practicas/rectangulos/estilos.css`, líneas 13-22.
2. Lee los cinco sitios que pintan al corregir (números de línea del 17-10):
   - `practicas/semaforo/practica.js`, 60-70 (ej. 1 y 2, ya con cuatro estados) y 118-126 (ej. 4, `montarCifra`: hoy, si falla, la solución sale con `bien`);
   - `practicas/rectangulos/practica.js`, 130-150 (banco del ej. 2, ya con cuatro estados);
   - `practicas/constructor/practica.js`, 128-138 (`montarASuma`: hoy `bien` a toda ficha correcta, pulsada o no);
   - `practicas/baldosas/practica.js`, 124-133 (botón «Es esta»: hoy `bien` al m.c.d. aunque no se eligiera).
3. `git log --oneline -3 -- practicas/_comun/estilos.css practicas/semaforo practicas/rectangulos practicas/constructor practicas/baldosas` y `git status -sb`. Si hay cambios sin commit en alguno de tus ficheros, son de otra sesión: no los pises.
4. Orden de trabajo: primero la función y su test; después el CSS común y quitar las copias; después las cuatro prácticas; al final, el navegador.

## Qué hay que hacer

1. **Función pura** al final de `practicas/_comun/piezas.js`, con su comentario de cabecera como las demás (y una línea más en la lista del comentario inicial del fichero):
   ```js
   /**
    * Clase de un botón de número al corregir (cuatro estados, iguales en toda la app):
    * pulsado y correcto → 'bien' (verde relleno); pulsado y no → 'mal' (rojo tachado);
    * no pulsado y correcto → 'falta' (borde verde de puntos); ni lo uno ni lo otro → ''.
    */
   export function claseCorreccion(pulsado, correcto) {
     if (pulsado) return correcto ? 'bien' : 'mal';
     return correcto ? 'falta' : '';
   }
   ```
   El fichero no puede tocar `document` al importarse: el test lo importa en Node.
2. **CSS común.** En el bloque de `.botones-numeros`, sustituye las dos líneas `.botones-numeros .bien` / `.botones-numeros .mal` por las reglas de la copia de rectángulos: `button.bien`, `button.falta` y `button.mal` con `opacity: 1`, y `mal` con `text-decoration: line-through; text-decoration-thickness: 2px`. Van **después** de las de `[aria-pressed="true"]` y `:disabled`, con `button` en el selector para que pesen lo mismo que ellas y ganen por el orden. Añade un comentario corto con la tabla de los cuatro estados.
   Antes, `grep -rn "botones-numeros" practicas/*/estilos.css divisores/estilos.css`: si alguna práctica pisa `.bien` o `.mal` con otro sentido, anótalo en la terminada y no lo toques.
3. **Quitar las copias.** En `semaforo/estilos.css` borra las líneas 1-11 (deja el comentario de cabecera reducido a lo que queda: el botón «Ninguno»). **Las reglas `.ninguno.bien/.mal/.falta` se quedan**: corrigen el color del texto y el borde de «Ninguno», que tiene los suyos. En `rectangulos/estilos.css` borra las líneas 13-22. Así, el verde, el rojo y los puntos del común son la única fuente.
4. **Prácticas.** Importa `claseCorreccion` desde `../_comun/piezas.js` y úsala en los cinco sitios. Cuando devuelve `''`, no añadas ninguna clase: `const c = claseCorreccion(p, ok); if (c) b.classList.add(c);`.
   - semáforo ej. 1 y 2, y banco de rectángulos: mismo comportamiento que hoy, solo cambia que la decisión la toma la función.
   - semáforo ej. 4 (`montarCifra`): para cada botón `d`, `claseCorreccion(d === elegida, esCorrecta(item, d))`. Si el alumno falla, la solución sale con borde de puntos, no rellena.
   - constructor `montarASuma`: `claseCorreccion(aria-pressed === 'true', item.correctas.includes(v))`. Hoy una ficha correcta sin pulsar sale rellena: pasa a `falta`.
   - baldosas: `claseCorreccion(valor === s, valor === g)`. Aquí el botón del lado actual tiene `aria-pressed="true"` antes de corregir, y con el CSS nuevo `mal` y `bien` ya se imponen al azul.
   No cambies nada más de esas funciones: ni la puntuación, ni la espera, ni los textos.
5. **Test nuevo** `tests/practicas-botones.test.js`, con `node:test` como los demás:
   - (a) la tabla de verdad de `claseCorreccion`: las cuatro combinaciones;
   - (b) el CSS común, leído como texto (`readFileSync`), contiene reglas para `.botones-numeros button.bien`, `button.falta` (con `dashed`) y `button.mal` (con `line-through`), y aparecen **después** de la de `[aria-pressed="true"]` y de la de `:disabled` (compara posiciones con `indexOf`);
   - (c) ni `practicas/semaforo/estilos.css` ni `practicas/rectangulos/estilos.css` contienen ya `.botones-numeros button.bien` sin `.ninguno` delante, para que la copia no vuelva;
   - (d) ningún `practicas/*/practica.js` hace `classList.add('bien')`, `add('mal')` ni `add('falta')` literales sobre botones de `.botones-numeros`. Basta con comprobar que en esos cinco ficheros esas cadenas solo salen a través de `claseCorreccion`. Si el test (d) no se puede escribir sin ser frágil, quítalo y dilo en la terminada.

## Datos de entrada

Comunes (solo lectura): `practicas/_comun/piezas.js` (cómo están comentadas las piezas), `practicas/recta/` (la casilla olvidada con borde de puntos: es el mismo lenguaje visual; **no la toques**, y menos ahora: el 17-10 había cambios de otra sesión sin commit en `practicas/recta/`). Las fichas `tarea-40-semaforo-ninguno.md` y `tarea-42-rectangulos-celda-fija.md`, por el contexto.

## Cómo saber que ha terminado

En el navegador (`npm run servir`), ventana estrecha (375 px) y ancha, en español y en inglés:

- **Semáforo ej. 1** (http://localhost:8080/practicas/semaforo/), el caso de la captura de Juan Luis: 4150 con 9 y 10 pulsados. Debe verse el 10 en verde relleno, el 9 en rojo tachado, el 2 y el 5 con borde de puntos y el 3 gris. Con «Ninguno» en un ítem de conjunto vacío, «Ninguno» en verde.
- **Semáforo ej. 4**: falla a propósito. La cifra elegida, roja y tachada; la solución, con borde de puntos; el resto, gris.
- **Rectángulos ej. 2**: un acierto, uno que sobra y uno que falta, cada uno en su estado.
- **Constructor ej. 2** (ítems de tipo `a_suma`, «¿qué fichas suman…?»; si sale el otro tipo, pasa al siguiente): pulsa una ficha correcta y una que sobra, y deja una correcta sin pulsar. Deben verse en verde relleno, rojo tachado y borde de puntos.
- **Baldosas**: elige un lado que no es el m.c.d. Debe verse rojo tachado, y el m.c.d. con borde de puntos. Elige el m.c.d.: verde relleno.
- Ningún botón pulsado se queda azul después de Check.
- `node --test tests/practicas-botones.test.js tests/practicas-semaforo.test.js tests/practicas-rectangulos.test.js tests/practicas-constructor.test.js tests/practicas-baldosas.test.js` en verde y `npm test` sin fallos en tus ficheros.

## Trampas conocidas

- Especificidad: `.botones-numeros .bien` (0,2,0) pierde contra `.botones-numeros button[aria-pressed="true"]` (0,2,1) y contra `button:disabled` (0,2,1). Por eso el `button` en el selector, y por eso **después** en el fichero. No uses `!important`: el «Ninguno» del semáforo ajusta color y borde encima.
- `.elegido` (rectángulos) se pinta con la misma regla que `[aria-pressed="true"]`, así que el arreglo lo cubre igual.
- La caché de GitHub Pages: tras publicar, Juan Luis puede ver el CSS viejo un rato. No es un fallo de la tarea; dilo en la entrega («recarga forzada»).
- `divisores/` (la práctica antigua) tiene su propio CSS y no carga el común de `practicas/`: queda fuera.
- (Cierre del 17-10, s-20261017T082757-d15878d1) En zsh, `F="a b c"; git add $F` no separa las rutas: usar un array `F=(a b); git add "${F[@]}"`. Un test que busque `.botones-numeros button.mal {` encuentra antes la regla agrupada de `opacity`: buscar `button.mal { background`. La prueba en navegador NO se hizo (la extensión de Chrome no estaba conectada): pendiente de Juan Luis o de la 55.

## Prohibido (propio de esta tarea)

- Tocar del común algo que no sea el bloque `.botones-numeros` de `estilos.css` y la función nueva de `piezas.js`. Nada de `base.js`, `textos.js` ni `registro.js`: son de la 51 y la 52.
- Tocar `.eleccion` / `elecciones().marcar` o las prácticas con clases propias (lista del «Objetivo», punto 4). Si crees que alguna debería pasar a los cuatro estados, proponlo en la terminada.
- Cambiar la lógica de corrección (`esCorrecta`, `esAciertoASuma`, `esLaMasGrande`), la puntuación o las esperas.
- `practicas/recta/`: cambios ajenos sin commit (17-10).

## Salida esperada

- Los ficheros de «Ficheros que toca» cambiados y comiteados.
- `tests/practicas-botones.test.js` nuevo.
- `reparto-practicas-u2/salidas/56-botones-cuatro-estados/ENTREGA.md` (hash, ficheros, cómo probarlo en 2 minutos práctica por práctica, recordatorio de la recarga forzada) y su marcador `ENTREGA.md.ok-<sid>`.
- En la terminada: qué prácticas has cambiado y, si has encontrado otras con botones que se encienden y se corrigen a su manera, la lista como propuesta.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 56, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-56.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/56--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/56--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/56-botones-cuatro-estados/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/56--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/56--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01 y, en esta, el bloque y la función declarados arriba), ni `css/estilos.css`, ni `README.md` (salvo
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
