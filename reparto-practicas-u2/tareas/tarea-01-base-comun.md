# Tarea 01 · Base común de las prácticas, panel único del profesor y práctica de plantilla

Actualizado: 2026-10-07 (19:30 UTC: fila 16 del catálogo y campo `pistas`; 19:50 UTC: contador con `maximo` y `rapidos`, alineado con divisores/ actual)
Precondición: ninguna · Disparo: MANUAL (sesión atendida)
Duración esperada: 2 h 30 min (tiempo de sesión, no de persona) · Banda de modelo: ALTO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/01-base-comun/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/_comun/*` (nuevo), `practicas/index.html`, `practicas/portada.js`, `practicas/profesor.html`, `practicas/profesor.js`, `practicas/resultados.js`, `practicas/plantilla/*` (nuevo), `tests/practicas-comun.test.js` (nuevo), `firestore.rules`, `src/firebase.js`, `README.md` (solo un apartado nuevo «Prácticas de la unidad 2»)

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
   printf 'sesión: %s\ntarea: 01\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/01--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/01--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 01 con `abierto:` más antiguo (o igual y sid menor), añade a tu
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

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/01--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.


## Objetivo

Construir lo que las dieciséis prácticas comparten para que cada una se reduzca a su
lógica y su interfaz: entrada por código de alumno, menú de ejercicios con contador,
feedback, código de resultado, guardado local y en Firestore, selector ES/EN, portada y
panel del profesor. Es la tarea de la que dependen las otras diecisiete; su salida es un
**contrato** que las demás sesiones leen en esta ficha y ven funcionando en la práctica
de plantilla. Es ALTO porque fija una API que después no se puede cambiar sin tocar
dieciséis carpetas.

## Siguiente paso

Lee entera la práctica existente `divisores/` (`app.js`, `logica.js`, `textos.js`,
`profesor.js`, `resultados.js`, `estilos.css`, `index.html`, `profesor.html`) y su test
`tests/divisores.test.js`. **Es el modelo y es de solo lectura**: la sesión que lo escribió
puede seguir editándolo. Casi todo lo que hay que hacer aquí es generalizar ese código.

## Qué hay que hacer

### 1. Catálogo fijo (`practicas/_comun/catalogo.js`)

Copia este catálogo tal cual. Los ids numéricos viajan dentro del código de resultado y
**no se renumeran**; `nEjercicios` es el número de ejercicios que la práctica tiene que
declarar (la base lo comprueba al arrancar y falla con un mensaje claro si no coincide).
`ruta` es relativa a `practicas/`.

| id | slug | ruta | nombre es | nombre en | nEjercicios | tarea |
|---|---|---|---|---|---|---|
| 0 | divisores | ../divisores/ | Divisor, múltiplo, divisible | Divisor, multiple, divisible | 5 | 17 |
| 1 | semaforo | semaforo/ | Semáforo de divisibilidad | Divisibility traffic light | 4 | 02 |
| 2 | rectangulos | rectangulos/ | Divisores por parejas | Divisors in pairs | 3 | 03 |
| 3 | recta | recta/ | Múltiplos y divisores en la recta | Multiples and divisors on the number line | 3 | 04 |
| 4 | criba | criba/ | Criba y números primos | Sieve and prime numbers | 3 | 05 |
| 5 | arbol | arbol/ | Árbol de factores | Factor tree | 3 | 06 |
| 6 | divisiones | divisiones/ | Divisiones sucesivas | Repeated division | 3 | 07 |
| 7 | fabrica | fabrica/ | Fábrica de divisores | Divisor factory | 3 | 08 |
| 8 | venn | venn/ | m.c.d. y m.c.m. con factores primos | GCD and LCM with prime factors | 4 | 09 |
| 9 | imposibles | imposibles/ | Detector de imposibles | Impossible answers | 3 | 10 |
| 10 | clasificador | clasificador/ | ¿m.c.d. o m.c.m.? | GCD or LCM? | 3 | 11 |
| 11 | reloj | reloj/ | Reloj de coincidencias | Coincidence clock | 3 | 12 |
| 12 | baldosas | baldosas/ | Baldosas y cuerdas | Tiles and ropes | 3 | 13 |
| 13 | errores | errores/ | Caza el error | Spot the mistake | 3 | 14 |
| 14 | leelo | leelo/ | Léelo en inglés | Say it in English | 3 | 15 |
| 15 | factorizaciones | factorizaciones/ | Operar con factorizaciones | Working with factorisations | 3 | 16 |
| 16 | parentesis | parentesis/ | Coloca los paréntesis (repaso de la unidad 1) | Place the brackets (unit 1 review) | 4 | 19 |
| 31 | plantilla | plantilla/ | Práctica de plantilla | Template practice | 2 | 01 |

Exporta `CATALOGO` (array de `{ id, slug, ruta, nombre: { es, en }, nEjercicios }`),
`practicaPorSlug(slug)` y `practicaPorId(id)`. La portada no muestra la 31 ni las que
todavía no existen (ver §6).

### 2. Módulos puros (`practicas/_comun/`)

Todos sin DOM ni red, probados en `tests/practicas-comun.test.js`:

- `rng.js`: `crearRng(semilla)` idéntico al de `divisores/logica.js`.
- `codigos.js`:
  - `ALFABETO`, `MAX_ALUMNOS`, `codigoAlumno(indice)`, `leerCodigoAlumno(texto)` con **la
    misma sal (`divisores/1eso/2026-27`), el mismo PASO y el mismo DESFASE** que
    `divisores/logica.js`, de modo que `codigoAlumno(i)` dé exactamente lo mismo que allí
    para los 1024 índices (test obligatorio importando los dos módulos).
  - `codigoResultado(practicaId, indice, ejercicios, dia)` → 16 caracteres en cuatro
    grupos de 4 separados por guiones. 80 bits: práctica (5), índice mezclado (10), seis
    ejercicios × 5 bits (bit de terminado + fallos hasta 15; los que no existan, 0), día
    (10) y control (25), enmascarados como en `divisores` (hash FNV + mezcla). Sal
    propia `practicas/1eso/2026-27`.
  - `leerCodigoResultado(texto)` → `{ practica, indice, ejercicios: [{ terminado, fallos }] (recortado a nEjercicios del catálogo), dia }` o `null`. Un código de **12** caracteres se
    delega a `divisores/logica.js` (importado, solo lectura) y se devuelve con
    `practica: 0`.
  - `extraerCodigosResultado(texto)`: encuentra los de 12 y los de 16 caracteres.
- `contador.js`: `ejercicioNuevo(inicial = 20)`, `anotar(ej, acierto, dia, { penalizacion = 5, maximo = 40, pistas = 0 } = {})`,
  `diaDe`, `fechaDeDia`, como en `divisores/logica.js` **tal como está hoy en `main`** (desde el
  commit 47a54eb: `PENALIZACION = 2`, `MAXIMO = 40` como tope de pendientes, campo `rapidos`
  en el ejercicio, parámetro `rapido` de `anotar` en suspenso). La base generaliza: cada
  ejercicio de una práctica declara `inicial`, `penalizacion` y `maximo` (por defecto 20, 5 y
  40), `pistas` se suma a `fallos` sin tocar `pendientes`, y el objeto del ejercicio conserva
  el campo `rapidos` (siempre 0 salvo que una práctica lo use) para que los documentos de
  Firestore de `divisores` y de `practicas` tengan la misma forma.
- `aritmetica.js` (lo que las dieciséis prácticas necesitan y no deben reescribir):
  `PRIMOS` (hasta 200), `esPrimo(n)`, `factorizar(n)` → `[[p, e], …]` con bases
  crecientes, `valorDe(f)`, `divisores(n)` (ordenados, con 1 y n), `parejasDivisores(n)`
  (`[[1, 24], [2, 12], [3, 8], [4, 6]]`), `raizEntera(n)`, `mcd(a, b, …)`, `mcm(a, b, …)`,
  `sumaCifras(n)`, `cifras(n)`, `criterio(n, d)` para d ∈ {2, 3, 5, 9, 10, 11} →
  `{ divisible, razon: { es, en } }` con la razón numérica («la suma de las cifras es 12»,
  «acaba en 8»), `multiplicarFact(f, g)`, `dividirFact(f, g)` (null si no es múltiplo),
  `esMultiploFact(f, g)`, `mcdFact(f, g)`, `mcmFact(f, g)`, `htmlFact(f)` →
  `2<sup>3</sup> · 3<sup>2</sup> · 5` (punto medio, sin exponente 1), `textoFact(f)` →
  `2^3 · 3^2 · 5`. Tests por fuerza bruta frente a definiciones independientes (como hace
  `tests/divisores.test.js`).
- `textos.js`: `T = { es: {…}, en: {…} }` con todo lo común que hoy está en
  `divisores/textos.js` (entrada, menú, botones, bien/mal, penalización, fin, código de
  resultado, salir…), parametrizado el «20» y el «5» (`menu_regla(inicial, penalizacion)`),
  más `unir(frases, idioma)` y `esc(texto)`.

### 3. La base (`practicas/_comun/base.js`)

Exporta `arrancar(practica)`. `practica` es:

```js
{
  slug: 'semaforo',                          // debe estar en CATALOGO; de ahí salen id, título y nEjercicios
  ejercicios: [                              // exactamente nEjercicios; el alumno los ve como «Ejercicio 1», «Ejercicio 2»…
    {
      nombre: { es, en },                    // una línea
      detalle: { es, en },                   // una línea
      inicial: 20, penalizacion: 5,          // opcionales (la criba usa 5 y 1)
      introduccion: { es: html, en: html },  // opcional: tarjeta con botón «Empezar» antes del primer ítem de cada sesión del ejercicio
      generar(rng, sesion) => item,          // puro, en logica.js; sesion = { aciertos, fallos, pendientes, anterior } (anterior = ítem previo o null)
      clave(item) => string,                 // opcional; por defecto JSON.stringify(item); la base evita repetir la clave anterior (hasta 5 intentos)
      montar(contenedor, item, api) => void, // pinta el ítem dentro de un <div> vacío e instala los eventos
    },
  ],
}
```

`api` que recibe `montar`:

```js
{
  idioma,                       // 'es' | 'en'
  t,                            // textos comunes del idioma (T[idioma])
  tt: obj => obj[idioma],       // atajo para { es, en }
  esc,                          // escapar HTML
  respondido: () => boolean,    // true cuando ya se llamó a responder para este ítem
  responder({ acierto, html, espera, pistas }),  // UNA vez por ítem. html: la explicación con los números del ítem.
                                // acierto: feedback verde y pasa al siguiente a los `espera` ms (1300 por defecto);
                                // fallo: feedback rojo con «+penalización» y botón «Siguiente».
                                // pistas (opcional, entero ≥ 0): ayudas usadas en este ítem; se suman a `fallos`
                                // del contador sin tocar `pendientes` (lo usa la práctica 16, parentesis, donde
                                // un ítem se termina siempre y lo que se mide son las pistas).
}
```

Comportamiento de la base, copiado de `divisores/app.js` y generalizado: entrada por
código (o «Probar sin código»), `?c=ABCD` en la URL, menú con las filas de los ejercicios
(estado, botón Empezar/Seguir/Practicar otra vez), ejercicio con cabecera (nombre, «te
quedan n», barra), tarjeta con el contenedor del ítem, feedback, fin de ejercicio con
caja del código de resultado (que aparece en cuanto hay un ejercicio terminado), botón
Salir. Cambiar de idioma vuelve a montar el ítem si no se ha respondido (por eso el ítem
tiene que ser datos puros) y pasa al siguiente si ya se respondió.

Guardado: `localStorage` con claves `practicas.idioma`, `practicas.codigo`,
`practicas.v1.<slug>.<codigo>`; Firestore por REST como en `divisores` (PATCH con
`keepalive`), documento `practicas/<slug>--<codigo>` con campos `estado` (JSON string
`{ v: 1, idioma, ej }`) y `actualizado` (int), al terminar un ejercicio o cada 5 respuestas.
Las repeticiones de un ejercicio ya terminado no cambian lo guardado.

### 4. Estilos (`practicas/_comun/estilos.css`)

Parte de `divisores/estilos.css` y generaliza: tarjeta del ejercicio, `.elecciones` y
`.eleccion` (2, 3 y 4 columnas en pantalla ancha, 1 o 2 en estrecha), `.feedback`,
`.ficha`, `.hueco`, `.resultado`, `.fin`, panel del profesor. Añade lo que varias
prácticas van a necesitar y es mejor tener una vez: `.botones-numeros` (botones cuadrados
de 44 px mínimo para cifras y primos), `.pasos` (steppers −/valor/+ para exponentes),
`.rejilla` (tablas de celdas tocables, para la criba y la recta), `.si-no` (dos botones
grandes). Móvil primero: todo tiene que caber en 375 px de ancho sin desplazamiento
horizontal.

### 5. Práctica de plantilla (`practicas/plantilla/`)

`index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css` (puede estar vacío).
Dos ejercicios de verdad, sencillos, que sirvan de ejemplo de los dos patrones: uno de
**elegir** (botones `.eleccion`: «¿es 51 primo o compuesto?» con `si-no`) y uno de
**construir** (steppers de exponentes: «escribe 72 como producto de potencias de primos»),
este con `introduccion`. Comentarios en el código explicando cada parte del contrato: es
lo que las otras quince sesiones copiarán. `index.html` carga `../../css/estilos.css`,
`../_comun/estilos.css` y `./estilos.css`, y `<script type="module" src="practica.js">`.

### 6. Portada (`practicas/index.html` + `practicas/portada.js`)

Lista las prácticas del catálogo (salvo la 31) con su nombre en el idioma elegido y el
enlace a su ruta. Como la portada no puede saber qué carpetas existen ya, cada entrada
del catálogo lleva `disponible: true | false`; la montadora deja `true` solo en `divisores`
y `plantilla`, y **cada tarea de aplicación, al cerrar, pide en su terminada que la 18 lo
ponga a `true`** (la 18 es la única que vuelve a tocar `catalogo.js`). Si prefieres que
la portada compruebe con `fetch(ruta + 'practica.js', { method: 'HEAD' })`, vale también,
y entonces no hace falta `disponible`; dilo en la terminada.

### 7. Panel único del profesor (`practicas/profesor.html`, `profesor.js`, `resultados.js`)

Generaliza `divisores/profesor.*`: (1) lista de alumnos → códigos y enlaces directos (los
enlaces a la portada `practicas/?c=ABCD`, y la base guarda el código para todas las
prácticas); (2) códigos de resultado pegados, de 12 o 16 caracteres, de cualquier práctica;
(3) nube: colección `practicas` entera más la antigua `divisores`, con
`firebase.datos.listarPracticas()` nuevo en `src/firebase.js` (solo añadir esa función y
exportarla junto a `listarPracticaDivisores`). Vista: un selector de práctica; «Resumen»
muestra una matriz alumnos × prácticas con «hechos/n»; una práctica concreta muestra la
tabla por ejercicio como hoy en `divisores`. CSV de las dos vistas. `resultados.js` puro
(`juntarResultados(nombres, deCodigos, deNube, nEjercicios)`) con tests.

### 8. Reglas de Firestore y README

En `firestore.rules`, junto a la regla de `divisores`, añade:

```
match /practicas/{doc} {
  allow read: if esProfesor();
  allow create, update: if doc.matches('^[a-z0-9-]+--[A-HJ-NP-Z2-9]{4}$')
    && request.resource.data.keys().hasOnly(['estado', 'actualizado'])
    && request.resource.data.estado is string
    && request.resource.data.estado.size() < 4000
    && request.resource.data.actualizado is int;
}
```

**Las reglas no se publican solas**: hay que pegarlas en la consola de Firebase (Firestore
→ Reglas → Publicar) o `npx firebase-tools deploy --only firestore:rules`. Eso lo hace el
usuario: díselo al cerrar, con la ruta del fichero. Hasta entonces el guardado en la nube
falla en silencio y la práctica funciona igual (código de resultado y guardado local).

En `README.md`, un apartado nuevo «Prácticas de la unidad 2 (`practicas/`)» de diez líneas
después del de `divisores/`: qué es, URL de la portada y del panel, cómo se añade una
práctica (copiar `plantilla/`, registrar en el catálogo) y dónde está el contrato (esta
ficha y los comentarios de `plantilla/practica.js`). No toques el resto del README.

## Datos de entrada

- `divisores/*` y `tests/divisores.test.js`: el modelo. Solo lectura.
- `css/estilos.css`: variables y clases que ya existen (`.tarjeta`, `.lista`, botones).
  Solo lectura.
- `src/config.js` (`firebaseConfig`) y `src/firebase.js` (`iniciarFirebase`,
  `mensajeDeError`, `datos.listarPracticaDivisores`).
- `reparto-practicas-u2/proyecto.md`, «Reglas de contenido comunes».

## Salida esperada

- `practicas/_comun/{catalogo,rng,codigos,contador,aritmetica,textos,base}.js` y
  `practicas/_comun/estilos.css`.
- `practicas/index.html`, `practicas/portada.js`, `practicas/profesor.html`,
  `practicas/profesor.js`, `practicas/resultados.js`.
- `practicas/plantilla/{index.html,practica.js,logica.js,textos.js,estilos.css}`.
- `tests/practicas-comun.test.js`: códigos de alumno iguales a los de `divisores` (1024
  casos), ida y vuelta de códigos de resultado (todas las prácticas del catálogo, índices
  0, 1, 500, 1023, fallos 0 y 15+, días 0 y 1023), rechazo de códigos corrompidos,
  `extraerCodigosResultado` con un texto que mezcle códigos de 12 y 16, contador con
  parámetros, aritmética por fuerza bruta hasta 500 (factorizar·valorDe, divisores,
  parejas, mcd/mcm, criterios frente a `n % d`), `htmlFact`, `juntarResultados`.
- `firestore.rules` y `src/firebase.js` con lo de §8 y §7, `README.md` con el apartado.
- `reparto-practicas-u2/salidas/01-base-comun/ENTREGA.md` + `.ok-<sid>`.

## Cómo saber que ha terminado

- `npm test` en verde, con al menos 25 tests nuevos en `tests/practicas-comun.test.js`.
- `http://localhost:8080/practicas/plantilla/` funciona de principio a fin: entrar con el
  código `codigoAlumno(0)`, hacer los dos ejercicios hasta terminarlos (puede bajarse
  `inicial` a 2 en una copia local para probar; no en el commit), ver el código de
  resultado de 16 caracteres, y que `practicas/profesor.html` lo lea pegado y lo atribuya
  al alumno 1 y a la práctica «Práctica de plantilla».
- `http://localhost:8080/practicas/` muestra la portada con `divisores` enlazado.
- `http://localhost:8080/divisores/` sigue funcionando exactamente igual que antes
  (no se ha tocado).
- En el móvil (o ventana de 375 px): nada se sale de la pantalla.

## Trampas conocidas

- `divisores/*` puede estar reservado por otra sesión (hook de sesiones): no intentes
  editarlo; esta tarea no lo necesita.
- La fecha BSD de macOS no admite `-d`: usa la forma doble `GNU || BSD` del reclamo.
- `shuf` no existe en macOS.
- El portapapeles (`navigator.clipboard`) falla sin HTTPS salvo en `localhost`: `divisores`
  ya tiene el fallback de seleccionar el texto; consérvalo.
- Dos `import` del mismo módulo con rutas distintas (`../divisores/logica.js` desde
  `_comun/codigos.js` y desde los tests) funcionan, pero el test que compara códigos tiene
  que importar `divisores/logica.js` **y** `practicas/_comun/codigos.js`.

## Prohibido (propio de esta tarea)

- Cambiar `divisores/` o su colección de Firestore: eso es la tarea 17.
- Renumerar o reordenar el catálogo. Añadirle entradas es decisión de la coordinadora.
- Hacer que la base dependa de KaTeX o de Firebase SDK (la base usa REST como `divisores`).
- Dejar el contrato distinto del descrito aquí sin escribirlo en `plantilla/practica.js`
  **y** en la terminada: las otras quince sesiones solo leen esta ficha y ese fichero. Si
  cambias algo del contrato, actualiza también los comentarios de la plantilla y pide en
  la terminada que la coordinadora corrija esta ficha.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 01, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-01.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/01--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/01--<sid>.md` con `parada por: mal cortada`
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
3. Escribe `$R/salidas/01-base-comun/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/01--<sid>.md`: hash del commit, ficheros (lo que dice
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

Si paras sin terminar: `$R/hechos/fallos/01--<sid>.md` con hasta dónde llegaste, la línea
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
