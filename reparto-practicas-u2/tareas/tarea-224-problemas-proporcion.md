# Tarea 224 · Práctica de la unidad 7 «Problemas de toda la unidad» (problemas-proporcion)

Actualizado: 2026-11-19 (adaptada a la unidad 7 por un subagente de la montadora: ejercicios, cotas, tests y trampas; **todo su contenido es propuesta hasta el acta de la 02 de la U7**). Antes: 2026-11-18 (alta de la montadora del reparto de la unidad 7, s-20261118T221619-b66ec280, a partir de la ficha 153 de la unidad 6, con sus trampas)
Precondición: 211 LISTA · mejor con la hoja y el examen de su paquete ya LISTOS en el reparto de la U7 (paquete 5: tareas 11 y 26 de aquel reparto, la hoja 5 y el tipo test 5): si existen, excluye sus casos desde el principio (hoja en claro, examen por huella FNV-1a del caso normalizado por valor); si no, dilo en la ENTREGA y lo coteja la tarea de publicación de tu paquete (la 231) · Disparo: MANUAL (sesión atendida) · **Plazo: vie 29-1 (ideal); límite vie 26-3**
Duración esperada: 1 h 15 min (tiempo de sesión, no de persona) · Banda de modelo: MEDIO · Encadenable con: —
Carpeta de salida (dueña exclusiva): `reparto-practicas-u2/salidas/224-problemas-proporcion/` (solo `ENTREGA.md` y su marcador; el código va en los ficheros de abajo)
Ficheros que toca (ninguna otra tarea en paralelo los toca): `practicas/problemas-proporcion/*` (sustituye el esqueleto que deja la 211: desde que la 211 está LISTA, la dueña de esa carpeta es esta tarea), `tests/practicas-problemas-proporcion.test.js` (nuevo), `tests/practicas-ayuda-problemas-proporcion.test.js` (nuevo: el del botón «No lo sé»)

La duración esperada no es informativa: de ella sale la caducidad del reclamo (2 ×, mínimo
45 min), el plazo tras el cual otra sesión puede relevarte si te cortas. **Este fichero es
la fuente de la banda**: el tablón la copia de aquí cada vez que se regenera. La banda
dice con qué modelo conviene abrir la sesión; la tabla de bandas de `proyecto.md` la
traduce al menú de hoy (ALTO = Opus 5.5, esfuerzo Alto; MEDIO = Sonnet 5.5, esfuerzo Medio).

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
   printf 'sesión: %s\ntarea: 224\nabierto: %s\ncaduca: %s\nlatidos:\n- %s reclamo abierto\n' "$sid" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$caduca" "$(date -u +%H:%M:%SZ)" > $R/hechos/reclamos/224--$sid.md; echo $sid
   ```
   donde MINUTOS = 2 × la duración esperada de arriba en minutos (mínimo 45). A partir
   de aquí tu sid es el del nombre de ese fichero (`ls $R/hechos/reclamos/224--*`); no lo
   guardes en un fichero de nombre fijo.
4. `sleep 30 && ls $R/hechos/reclamos/` — el comando, no la intención. Si hay otro
   reclamo vivo de la tarea 224 con `abierto:` más antiguo (o igual y sid menor), añade a tu
   reclamo una línea `CEDIDA a <sid del otro>` y elige otra tarea.
5. Si el reclamo que encuentras está caducado (RELEVABLE en el tablón), relévalo con la
   línea `releva a: <sid anterior>` **en tu propio reclamo**; el suyo no se toca. Después
   mira qué dejó hecho: `ls practicas/`, `git log --oneline -5`, `git status -sb`, y la
   carpeta de salida. Lo que haya con tests en verde se hereda y se dice en la terminada;
   lo que no, se rehace.
6. Si ganas, **regenera `$R/_ESTADO.md` entero** (todas las filas contra `hechos/` y la
   hora real; banda y «encadenable» recopiadas de las fichas) antes de empezar, y sigue
   con la tarea hasta cerrarla o soltarla; **no termines el turno para pedir confirmación**.
   Si hay otras sesiones en el árbol (`.claude/sesiones/`), retoque de tus filas y del registro, no regeneración completa.
7. Idempotencia: comprueba si `practicas/<tu slug>/` o tu test ya existen (de una sesión
   caída) antes de crearlos. Si existen, léelos y continúa desde ahí.

Añade un latido (`printf -- '- %s latido: <qué>\n' "$(date -u +%H:%M:%SZ)" >> $R/hechos/reclamos/224--<sid>.md`)
al terminar cada paso grande. Si vas a tardar más de lo que te queda de caducidad, añade
antes una línea `caduca:` más allá. A tu reclamo solo se añade (`>>`), nunca se reescribe.
Cualquier pausa cuenta como operación larga: tras un turno terminado o un «Continúa»,
`date -u`, relee tu reclamo y busca tu sid en las líneas `releva a:` de
`$R/hechos/reclamos/*.md`; si te han relevado, `ABANDONADA (relevado)` y no toques nada.

## Objetivo

Práctica **«Problemas de toda la unidad» / «Mixed problems»** (`problemas-proporcion`, id 96 del catálogo, 5 ejercicios) para la **unidad 7, Proportionality and percentages**, que
se da del lunes 1-3 al viernes 23-4-2027. Paquete 5 (sesiones 20-21; va en la tarea semanal del lunes 19-4). Tiene que estar LISTA antes del plazo de la tarea de publicación
de su paquete, la 231 (paquete 1: **mié 24-2**; paquete 2: **jue 4-3**; paquete 3: **jue 11-3**; paquete 4: **jue 8-4**; paquete 5: **jue 15-4**), y mejor antes del vie 29-1.

Destrezas (descripción; los ids definitivos, en el inventario tras F0 y en la ENTREGA de la 211): ¿qué tipo de problema es? (directa, inversa, porcentaje, reparto, escala); velocidad, tiempo y distancia; cambio de moneda; el precio por unidad (la mejor oferta); interpretar la respuesta (la unidad, el redondeo, si tiene sentido). El texto exacto
de cada una, su sesión y su nota (errores típicos y riesgos) están en el inventario: léelas antes de escribir nada.

**Es un diseño propuesto por la montadora del reparto de la U7 (18/19-11), sin acta todavía: la lista de ejercicios de abajo es la
propuesta de `proyecto.md` («Tareas 211-233») y, con F0 firmada, manda el acta** (`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`);
Juan Luis puede cambiarlo. **Dos de los cinco ejercicios son puntos a decidir de la 02 y van en condicional: la velocidad (ej. 2) y
el cambio de moneda (ej. 3) solo se escriben si el acta los admite**; también la inversa como casilla del ej. 1. Si el acta quita
uno, ese ejercicio no se escribe ni se sustituye por otro: se entrega la práctica con los que queden y se dice en la terminada (el
número de ejercicios del catálogo lo corrige la coordinadora o la 231, no esta tarea).
Si al hacerla ves que un ejercicio no se sostiene (dos respuestas correctas inevitables, algo de una sesión posterior, algo
que el acta del inventario dejó fuera), no lo cambies por tu cuenta: entrégalo como propuesta en la terminada y sigue con lo
demás. El número de ejercicios (5) está fijado en el catálogo por la 211; otro número también es propuesta.

Modelo de interfaz: `practicas/problemas-ecuaciones/` de la U6 (el más cercano: contextos con su cota y su `assert`, campo con unidad, «¿Tiene sentido?») y `practicas/fraccion-de/` de la U4 (problemas con contexto y el modelo del botón «No lo sé»).

## Siguiente paso

1. **Lo primero, el acta** (`…/7. Proportionality/inventario-unidad7-revision.md`): apunta en tu reclamo si admite la velocidad, el cambio de moneda y los problemas de inversa, y con qué cotas. Si no existe, no escribas los ejercicios 2 y 3 ni la casilla «inversa»: haz el resto y dilo en la terminada.
2. Lee la ficha de la tarea 01 (§3, el contrato de `arrancar(practica)` y la `api` de `montar`), `docs/no-lo-se.md` (el botón «No lo sé», mejora M22: lo llevan todas las prácticas de la U7 desde el principio), la `ENTREGA.md` de la 211 (`reparto-practicas-u2/salidas/211-base-unidad7/`), `docs/practicas-unidad7.md` y el módulo que dejó: `practicas/_comun/proporcion.js` (cantidades con unidad y razones con fracciones exactas; `deTexto`, `aTexto`, `aHtml`, `mismoValor`, `proporcionDirecta`, `proporcionInversa`, `porcentajeDe`, `aplicarPorcentaje`, `repartir`, `escala`, `cambiarUnidad` con sus pasos, `redondear`, `ERRORES_TIPICOS`, `CONTEXTOS` con la cota de cada uno; los nombres exactos, los que diga su ENTREGA). **No lo reescribas**: si te falta algo, cópialo en tu `logica.js` y proponlo en la terminada.
3. Lee `practicas/plantilla/` entero y las prácticas modelo que cita el Objetivo; `practicas/_comun/piezas.js` (`elecciones`, `campoNumero`, `claseCorreccion`: los cuatro estados tras comprobar) y cómo ocultan «Comprobar» al responder las prácticas de la U5 y la U6.
4. `ls practicas/problemas-proporcion/`: la 211 dejó un esqueleto que carga y declara tus ejercicios. Sustitúyelo empezando por `logica.js` y su test, en verde; después `practica.js` (`montar`) y `textos.js`.
5. Mira si existen ya la hoja y el examen de tu paquete en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` (`hojas-de-ejercicios/hoja-unidad7-semana5.tex` y sus soluciones, `exámenes-semanales/semana-5/casos-examen-semana5.tsv`) y, como la práctica mezcla toda la unidad, los de los paquetes anteriores: si sí, sus casos se excluyen desde el principio (regla 9).

## Qué hay que hacer

**Todos los problemas son de un paso** (los de varios pasos son del papel: regla 7), con los datos elegidos para que el resultado salga **exacto** (dinero al céntimo, personas y objetos enteros, horas naturales o «y media») y cada contexto con su cota de la regla 7 y su `assert` (si `CONTEXTOS` de `proporcion.js` ya la trae, se usa la suya). El dinero, siempre con dos decimales (`7,50 €`; en inglés, como lo escriba `aHtml`). Cantera de contextos: el apartado 5 de la nota de material de otros cursos (abajo), con números nuevos.

1. **¿Qué tipo de problema es?** · *What kind of problem is it?* Un enunciado corto, **sin resolver**, y cinco casillas: proporcionalidad directa, proporcionalidad inversa, un porcentaje, un reparto proporcional, una escala. Ejemplos: «3 kg de naranjas cuestan 4,50 €. ¿Cuánto cuestan 5 kg?» (directa); «6 pintores, todos al mismo ritmo, pintan una valla en 10 días. ¿Cuánto tardarían 4 pintores?» (inversa); «Una camiseta de 45,00 € tiene un 20 % de descuento. ¿Cuánto se paga?» (porcentaje); «Tres amigos reparten 120,00 € en proporción a las horas que ha trabajado cada uno» (reparto); «En un mapa a escala `1 : 50 000`, dos pueblos están a 3 cm» (escala). **Riesgo de regla de oro, que hay que cerrar por construcción**: un porcentaje y una escala también son proporcionalidad directa. Por eso la introducción y el texto de cada casilla lo dicen sin ambigüedad («Directa (sin porcentajes ni escalas)», «Un porcentaje: el enunciado lleva un %», «Una escala: el enunciado lleva una escala o un plano», «Un reparto: se reparte un total en partes proporcionales») y cada plantilla declara su tipo y sus marcas: una de «directa» o de «inversa» no lleva `%`, escala ni reparto; una de «porcentaje» lleva `%` y no lleva escala; y así las demás. Si aun así no se sostiene, se entrega como propuesta (p. ej. solo directa / inversa / reparto). La casilla «inversa», solo si el acta admite los problemas de inversa. Banco de 8 plantillas o más por tipo, con números generados dentro de su cota.
2. **Velocidad, tiempo y distancia** · *Speed, time and distance* (**solo si el acta admite la velocidad**). Un móvil que va **siempre a la misma velocidad, dicho en el enunciado**, y se pide una de las tres: la distancia («Un tren va siempre a 180 km/h. ¿Qué distancia recorre en 2 horas y media?» → `180 · 2,5 = 450` km), el tiempo («En bici, siempre a 18 km/h, ¿cuántas horas se tarda en hacer 45 km?» → `45 : 18 = 2,5` h) o la velocidad («Un coche recorre 240 km en 3 horas, siempre a la misma velocidad. ¿A qué velocidad va?» → `240 : 3 = 80` km/h). Campo de número con la unidad a la derecha. Cotas: a pie 3-6 km/h y hasta 6 h (30 km como mucho); corriendo 8-15 km/h y hasta 2 h; en bici 10-30 km/h, hasta 5 h y hasta 50 km; en coche 30-120 km/h, hasta 8 h y hasta 1000 km; en tren 80-300 km/h y hasta 6 h; el tiempo, un natural de horas o «y media» (se genera eligiendo la velocidad y el tiempo). El tiempo se contesta en horas (`2,5`); que 2,5 h son 2 h 30 min lo dice el feedback, y **«2 h 50 min» no se pide ni se ofrece** mientras el acta no admita las unidades de tiempo. Errores con nombre: multiplicar cuando toca dividir (`45 · 18 = 810`) y dividir al revés (`18 : 45 = 0,4`).
3. **Cambio de moneda** · *Changing money* (**solo si el acta admite el cambio de moneda**). El tipo de cambio es **inventado y el enunciado lo dice**: «En este problema, 1 € se cambia por 1,20 dólares. ¿Cuántos dólares te dan por 50,00 €?» → `50 · 1,20 = 60,00` dólares; al revés, «¿cuántos euros son 90,00 dólares?» → `90 : 1,20 = 75,00` €; con libras, «1 € se cambia por 0,85 libras»: 200,00 € → 170,00 libras, y 68,00 libras → 80,00 €. Campo de número con la moneda a la derecha. Cotas: el tipo, entre 0,80 y 1,30 en pasos de 0,05 (libras, por debajo de 1; dólares, por encima); cantidades de 20 a 500 €, múltiplos de 10; **se elige primero la cantidad en euros** para que el resultado sea exacto al céntimo en los dos sentidos (`assert`). Errores con nombre: multiplicar cuando toca dividir (`90 · 1,20 = 108`) y al revés; como el valor erróneo puede no ser exacto, se reconoce comparando lo tecleado con su redondeo al céntimo.
4. **La mejor oferta** · *Best buy*. El mismo producto en dos envases, con su precio («Zumo de naranja: 2 L por 3,00 € o 5 L por 7,00 €. ¿Cuál sale mejor de precio?»): elegir entre tres casillas (la primera, la segunda, «cuestan lo mismo por litro»). Se decide **por el precio por unidad**: `3,00 : 2 = 1,50` €/L y `7,00 : 5 = 1,40` €/L, gana la segunda. Se genera eligiendo primero los dos precios por unidad, en céntimos enteros, y multiplicando: así los dos cocientes son exactos al céntimo, y la diferencia, de 5 céntimos o más o exactamente cero (empate en un 15 % de los ítems: 2 kg por 3,00 € y 5 kg por 7,50 €, los dos a 1,50 €/kg, para que la tercera casilla sea verdad alguna vez). El envase grande gana en la mitad de los ítems con ganador y el pequeño en la otra mitad, para que «el grande siempre sale mejor» y «el más barato en total» no acierten por sistema. Contextos y cotas: zumo o leche (0,60-3,00 €/L; envases de 1, 2, 3, 5 o 6 L), arroz o fruta (0,80-6,00 €/kg; de 1 a 5 kg), yogures (0,20-0,90 € cada uno; paquetes de 4, 6, 8 o 12), cuadernos (0,80-3,00 €; paquetes de 2, 3 o 5); el precio de cada envase, de 0,20 a 30,00 €.
5. **¿Tiene sentido la respuesta?** · *Does the answer make sense?* Un problema de un paso con la respuesta que ha dado un compañero, y cuatro casillas: «Sí, está bien»; «La unidad está mal»; «El número no puede ser decimal: hay que redondearlo»; «La cuenta está mal: el resultado es absurdo». **Cada ítem tiene un solo defecto, o ninguno** (un tercio, bien): la unidad («El tren recorre 450 km/h» por 450 km, con el número bien); el redondeo que pide el contexto («300 alumnos en autobuses de 40 plazas: hacen falta 7,5 autobuses», cuando `300 : 40 = 7,5` está bien calculado y hacen falta 8; el feedback dice hacia dónde se redondea y por qué); o un resultado absurdo que sale de un error típico («entre los dos pueblos hay 150 000 km», la escala sin cambio de unidad; «con el 20 % de descuento, la camiseta de 45,00 € cuesta 54,00 €», un descuento que sube el precio). En los ítems «absurdos» el número es un natural o una medida legítima y la unidad es la correcta, y en los de redondeo la cuenta está bien: así ninguna casilla se solapa con otra. Los ítems con velocidad, moneda o inversa, solo si el acta los admite.
6. **Para todos los ejercicios**: introducción con un ejemplo resuelto en los dos idiomas; el ítem en el idioma que le toque (la base alterna); «Comprobar» que se oculta al responder; los cuatro estados tras comprobar donde haya opciones; cada fallo pasado a `api.responder` con su `error` (el nombre del error típico) y la `respuesta` del alumno, para el registro de fallos. **Feedback con los números del ítem**, el método antes que la cifra, una operación por línea y **la frase de respuesta con su unidad** al final («Recorre 450 km»). Dos métodos correctos no se enfrentan ni se corrigen (reducción a la unidad, regla de tres, la constante). En inglés, la palabra no matemática que decide se aclara entre paréntesis (*at the same speed* (a la misma velocidad), *exchange rate* (tipo de cambio), *each* (cada uno), *pack* (paquete)). Los campos, con `inputmode="text"` y lectura con `deTexto` de `proporcion.js` (coma o punto, con o sin unidad, `7,5` o `7,50 €`; comparación **por valor** con fracciones exactas y el dinero en céntimos enteros, nunca `Number`). Los nombres de persona, inventados y poco habituales.
7. **Botón «No lo sé»** (decisión del 12-11; `docs/no-lo-se.md`): los cinco ejercicios declaran `explicacion(item, { idioma, t, tt, esc })`, pura y exportada desde `textos.js`; el 2 y el 3, además, `noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' }` (son de calcular); el 1, el 4 y el 5, el texto por defecto. La explicación de un problema dice qué se pide, las cuentas con sus unidades y la frase de respuesta; en el ej. 4, los dos precios por unidad y cuál gana. **El feedback del fallo reutiliza la misma función** (decisión del 14-11: no se inventa una tercera versión). Ningún `sinAyuda`.
8. **Test** `tests/practicas-problemas-proporcion.test.js` (por fuerza bruta, 3000 ítems por ejercicio con semillas fijas):
- Ej. 1: cada plantilla, con sus marcas (las de «directa» e «inversa», sin `%`, sin escala y sin reparto; las de «porcentaje», con `%` y sin escala…); las de «inversa» dicen «al mismo ritmo» (o que los grifos son iguales) y las de «reparto», proporcional a qué; los números, dentro de la cota del contexto.
- Ej. 2: velocidad, tiempo y distancia dentro de la cota de su medio (`assert`); `distancia = velocidad · tiempo` comprobado por un segundo camino con enteros (el tiempo en medias horas); el enunciado dice que la velocidad no cambia; el resultado, natural o «y media».
- Ej. 3: el tipo, entre 0,80 y 1,30, y el enunciado lo da y dice que es de este problema; las dos cantidades, exactas al céntimo (céntimos enteros con `BigInt`), comprobadas en los dos sentidos.
- Ej. 4: los dos precios por unidad, exactos al céntimo y dentro de la cota del producto; la casilla correcta sale de compararlos **con enteros** (producto cruzado: precio A · cantidad B frente a precio B · cantidad A), nunca dividiendo en coma flotante; hay empates (10-20 %) y, entre los demás, el envase grande gana entre el 35 y el 65 % de las veces.
- Ej. 5: un defecto por ítem como mucho; en los «absurdos», el valor queda fuera de la cota del contexto por un factor de 10 o más, o el precio rebajado supera al inicial; en los de redondeo, la cuenta mostrada es exacta y el resultado no es natural; en los de unidad, el número es el correcto; un tercio (30-37 %) está bien.
- Ningún texto de alumno (enunciado, opciones, feedback, explicación, en los dos idiomas) con `×`, con una cantidad de dinero sin sus dos decimales, con un número de cinco cifras o más sin su espacio fino, con un periódico, con «aproximadamente» ni con «veces más que»; ni con lo que el acta deje fuera (regla 2).
- Todo distractor, distinto de la correcta **por valor** (`mismoValor`); ningún par de opciones equivalentes.
- Variedad (criterio del 13-11): ningún ítem sale en más del 10 % de los de su ejercicio.
- Los casos de las hojas (en claro) y los de los exámenes (por huella FNV-1a del **caso normalizado por valor**: tipo de problema y datos como fracciones irreducibles en un orden fijo, sin el contexto; calculada fuera del repo) no salen nunca: `CASOS_HOJA`, `HUELLAS_EXAMEN` y `esReservado` existen desde el principio y **todos** los generadores los consultan, aunque estén vacíos al escribirla.
- `tests/practicas-ayuda-problemas-proporcion.test.js`: 1000 ítems por ejercicio e idioma; la explicación contiene la solución que el ejercicio da por buena, calculada con `logica.js`.

## Datos de entrada

- El inventario de la unidad 7, solo lectura: `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7.tsv` (lo propone la tarea 01 de aquel reparto y lo aprueba la 02: ids definitivos tras la firma F0; la ENTREGA de la 211 dice cuáles son los tuyos).
- Carpeta de la unidad (solo lectura): `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/` — `secuenciación-unidad7.pdf` (qué se da en cada sesión), `inventario-unidad7-revision.md` (el acta: si entran la velocidad, el cambio de moneda y la inversa, la notación y las cotas; mientras no exista, la propuesta de `reparto-unidad7/proyecto.md`), `../Repaso de todo/contenidos-unidad7.tex` si ya existe (errores típicos) y las hojas y exámenes que existan (para no repetir sus casos).
- Material de otros cursos, por si sirve (no es obligatorio): la nota `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/hechos/notas/s-20261118T221619-b66ec280-inventario-material-otros-cursos.md` (sus exámenes y hojas de proporcionalidad; **el apartado 5 es un banco de 241 contextos de problemas**, por tipo: 5.A directa, 5.B inversa, 5.C repartos, 5.D-5.G porcentajes, 5.H escalas, 5.I unidades, velocidad y moneda, 5.J situaciones para decidir directa / inversa / ninguna: cantera de contextos, con números nuevos y pasados por el repaso de realismo).
- `practicas/_comun/*` y `practicas/plantilla/*`: solo lectura.

## Cómo saber que ha terminado

- `node --test tests/practicas-comun.test.js tests/practicas-problemas-proporcion.test.js tests/practicas-ayuda-problemas-proporcion.test.js tests/practicas-no-lo-se.test.js` en verde y `npm test` sin fallos en tus ficheros.
- En local (`npm run servir`), http://localhost:8080/practicas/problemas-proporcion/ con «Probar sin código» (nunca el código de un alumno ni AJJN), a 375 px y en ventana ancha, en español y en inglés; en cada ejercicio, un ítem acertado y uno fallado, mirando el feedback, y el botón «No lo sé» pulsado una vez (`?probar=1&ejercicio=<n>`), con la consola limpia. La práctica **no sale en la portada** (está con `disponible: false` hasta su tarea de publicación, la 231): se entra por la URL.
- A mano, **el repaso de realismo**: 20 enunciados de cada ejercicio en cada idioma, mirando que la situación es posible y que los números son creíbles (no solo el ejemplo), y 15 explicaciones con las cuentas comprobadas una a una.

## Trampas conocidas

- Los personajes llevan nombres inventados y la lista de nombres de la práctica se coteja contra los alumnos reales si la sesión llega a la carpeta de datos (si no, nombres poco habituales); nunca un nombre de alumno real en el repositorio público.
- `.cuenta` no se parte (`nowrap`): solo cuentas cortas; las frases del feedback van como texto normal o se salen de 375 px. Comprueba a 375 px la línea más larga que saque tu generador; los signos pegados a una cuenta los junta la base (`pegarSignos`, tarea 197), no la práctica.
- `-` y `−`, `*` y `·` se parecen, y el espacio fino (`&#8239;`) y el de no separación no se ven: en los tests busca por código; lo que teclea el alumno pasa por `deTexto`, que los normaliza.
- Puede haber varias sesiones a la vez en este árbol (las prácticas 212-226 van en paralelo): no metas en tu commit nada que no sea tuyo, y nada de `git stash`. Si el `http.server` del 8080 de otra sesión se cae, levanta el tuyo en otro puerto y mátalo al acabar. Se escribe, se comitea y se empuja **desde este árbol** (regla del 16-11 en `proyecto.md` y en el `CLAUDE.md` de la raíz): nada de worktrees, salvo la salida que describe `proyecto.md` cuando el push se rechaza, y después se realinea.
- El test compara **por valor** (`mismoValor` de `proporcion.js`, con fracciones exactas y la unidad pasada a la base): dos opciones equivalentes con distinta escritura son un fallo del test, no un caso raro.
- (U4) Las prácticas se reabrieron en bloque el 28-10 y el 30-10 por copiar casos de las hojas y de los exámenes escritos después: excluye lo que exista al escribirla y deja la huella de examen lista para que la publicación solo tenga que cotejar.
- (U6, tarea 153) Se escribió antes que el papel con la reserva vacía y la revisión de su paquete la reabrió: deja `CASOS_HOJA`, `HUELLAS_EXAMEN` y `esReservado` conectados en todos los generadores y con su test, para que la 231 solo tenga que rellenarlos.
- (U6, tarea 153, reabierta del 10-11) El dinero salía unas veces con decimales y otras sin ellos: una sola función para escribirlo, siempre con dos decimales en enunciados, opciones, feedback y explicación, y el campo acepta `12` y `12,00`.
- (U6, tarea 153, reabierta del 18-11) Concordancias que solo se ven leyendo muchos ítems (el género de un objeto del banco, «Ese número es…» con una cantidad que no era un número): cada cosa del banco declara su género y su plural, y las frases del feedback se leen con todas.
- (U6, tarea 153) Una clase CSS propia chocó con `.pasos` de la base: mira `practicas/_comun/estilos.css` antes de poner nombre a las tuyas. Y no se pudo probar a 375 px porque la ventana no cambió de ancho: si te pasa, dilo en la ENTREGA; lo mira la revisión con clics de la 231.
- Duración real de una práctica de 4 ejercicios en la U4 sobre la base ya hecha: 11-30 min; en la U6, la primera pasada de la 153 duró 14 min, pero se reabrió cinco veces (acta, dinero, reserva, concordancias).
- (U7, tarea 224) Sin el acta de la 02, el catálogo decía 5 ejercicios y la práctica declaraba 3: `practicas-comun.test.js` y el test de «declaran lo que dice el catálogo» se ponen rojos para todas las sesiones. Si dejas ejercicios sin escribir, ajusta `nEjercicios` (y el total de la unidad en `practicas-comun.test.js`) en el mismo commit y dilo en la terminada, aunque la ficha prohíba tocar `catalogo.js`.
- (U7, tarea 224) Con casos que el generador descarta con `continue` (ganador, empate), decide el tipo de caso **antes** del bucle de reintentos: si no, lo que sobrevive más a las restricciones sale sobrerrepresentado (los empates salían al 27 % en vez de al 15 %).

## Prohibido (propio de esta tarea)

- Tocar otras prácticas, la base (`practicas/_comun/`), `catalogo.js`, `portada.js`, `registro.js`, `tareas.js` o los docs: lo que haga falta ahí es propuesta en la terminada. `disponible: true` lo pone la tarea de publicación de su paquete (la 231), no esta.
- Meter la práctica en una tarea semanal.
- Escribir casos de examen en claro en el repositorio (ni en tests, ni en comentarios, ni en la ENTREGA).
- Escribir el ejercicio de velocidad, el de cambio de moneda o la casilla «inversa» sin que el acta los admita; un tipo de cambio que el enunciado no dé o que no diga que es de ese problema; un movimiento sin decir que la velocidad no cambia.
- Problemas de varios pasos, porcentajes encadenados, «el precio antes de la rebaja», proporcionalidad compuesta o repartos inversos.
- Decidir «la mejor oferta» con una división en coma flotante o con precios por unidad que no sean exactos al céntimo.

## Salida esperada

- `practicas/problemas-proporcion/*`, `tests/practicas-problemas-proporcion.test.js` y `tests/practicas-ayuda-problemas-proporcion.test.js` comiteados, con `npm test` sin fallos en tus ficheros.
- `reparto-practicas-u2/salidas/224-problemas-proporcion/ENTREGA.md` (hash, ficheros, los ejercicios y sus destrezas con id, las cotas de realismo que has fijado, qué casos de hoja/examen excluye y qué faltaba al escribirla, cómo probarlo en 1 minuto) y su marcador `ENTREGA.md.ok-<sid>`.

## Reglas de contenido de la unidad 7 (copia de `proyecto.md` de su reparto; lo común no se lee, por eso va aquí)

Las reglas 2-4 y 8-9 de la lista de la unidad 2 (signos `·` y `:`, inglés, regla de oro, feedback, realismo) valen igual.
La fuente es `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/reparto-unidad7/proyecto.md` («Reglas de contenido comunes») y el acta
`/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/inventario-unidad7-revision.md`, **que todavía no existe**: la tarea 02 de aquel reparto la
escribe con Juan Luis (firma F0). **Si esta copia y el acta discrepan, manda el acta.** **Hasta el acta, todo lo que esta copia
dice de qué entra, en qué sesión, con qué notación y con qué cotas es la propuesta de partida de la montadora (18-11-2026)**, no
una decisión de Juan Luis, y **lo marcado como «punto a decidir» no entra en ninguna práctica**. La coordinadora pone al día
esta copia cuando exista el acta. Calendario de la unidad: del lun 1-3 al vie 23-4-2027, 23 clases en cinco paquetes; el
paquete 3 es doble (sesiones 9-11 del 15 al 18 de marzo y 12-14 del 5 al 8 de abril, con vacaciones del 19-3 al 2-4); pruebas
tipo test los viernes 5-3, 12-3, 9-4 y 16-4 y examen final el vie 23-4; y **seis tareas semanales de la app** (propuesta), una
por lunes lectivo (1-3, 8-3, 15-3, 5-4, 12-4 y 19-4), con entrega el jueves.

1. **Una misma razón tiene muchas escrituras, y todas son la misma respuesta.** `3/4`, `6/8`, `0,75`, `75 %` y «3 de cada 4»;
   `1/5`, `0,2` y `20 %`; «aumentar un 20 %» y «multiplicar por 1,2»; «rebajar un 25 %» y «pagar el 75 %»; la escala `1 : 50 000`
   y «1 cm son 500 m»; `1,5 h` y «1 h 30 min»; `2,5 km` y `2500 m`; `1,50 €/kg` y «2 kg por 3,00 €». Es la trampa propia de la
   unidad: una pregunta con `0,2` y `20 %` entre las opciones, o con `1/4` y `25 %`, tiene dos respuestas correctas. En cualquier
   ejercicio de elegir, emparejar o verdadero/falso, ninguna opción puede valer lo mismo que otra: el test lo comprueba **por
   valor**, con las fracciones exactas de `_comun/fracciones.js` (nunca `Number` en coma flotante), después de pasar cada opción
   a un número con su unidad (`p %` es la fracción `p/100`; una cantidad con unidad se pasa a la unidad base). El módulo base
   de la unidad será `practicas/_comun/proporcion.js`, que escribe la tarea 211: úsalo, no lo dupliques. Solo si el ejercicio
   evalúa la forma escrita («escribe como porcentaje», «la razón más sencilla», «expresa en metros») cuenta la escritura, y el
   enunciado lo dice. **Y la trampa hermana: dos métodos correctos** (reducción a la unidad, regla de tres, la constante, la
   fracción equivalente, los productos cruzados) **dan el mismo resultado**: nunca se enfrentan como opciones ni se corrige el
   método, salvo que el enunciado lo pida.
   **Lo que teclea el alumno** se interpreta sin `eval` y se compara por valor: vale cualquier escritura equivalente salvo que
   el ejercicio pida una forma (`20 %`, `0,2` o `1/5`; `12 €`, `12,00 €` o `12`; `20 %`, `20%` o, si el campo ya lleva el signo,
   `20`; con coma o con punto decimal, que al mostrar van según el idioma); **un periódico con puntos suspensivos, nunca** (ni
   como respuesta que se muestra ni como opción: los datos se eligen para que salga exacto), y `0,33` no es `1/3` (es su
   redondeo): nunca equivalen. En un ejercicio de elegir, **nunca dos opciones con el mismo valor**: no simplificar una razón
   nunca es un distractor cuando no se pide la más sencilla.
2. **Nada que no se haya dado**: cada ejercicio respeta la columna `sesion` de sus destrezas en el inventario aprobado; hasta
   el acta, el calendario propuesto (semana 1, sesiones 1-3: razón parte-parte y parte-todo, razones equivalentes, proporción,
   productos cruzados y el término que falta, magnitudes directamente proporcionales, la tabla y la constante, lo que no es
   proporcional, problemas de directa por reducción a la unidad y regla de tres; semana 2, sesiones 5-7: magnitudes
   inversamente proporcionales, la tabla y el producto constante, problemas de inversa, «¿directa, inversa o ninguna?», repartos
   directamente proporcionales; semana 3, en dos tareas de la app: sesiones 9-11, el porcentaje como fracción y como decimal,
   los porcentajes fáciles, el tanto por ciento de una cantidad, qué porcentaje es una cantidad de otra y hallar el total;
   sesiones 12-14, descuentos y aumentos en dos pasos y en uno, el IVA, problemas mezclados; semana 4, sesiones 16-18: escalas
   y unidades de medida; semana 5, sesiones 20-21: velocidad, cambio de moneda, precio por unidad, problemas de toda la unidad).
   **Ninguna magnitud inversa antes de la sesión 5, ningún reparto antes de la 7, ningún porcentaje antes de la 9** (ni «la
   mitad es el 50 %» de pasada), **ningún aumento o descuento antes de la 12, ninguna escala antes de la 16**, ninguna unidad
   «rara» (dam, hm, dag, hg, daL, hL), de superficie o de volumen antes de la 17 y la 18.
   **Fuera de la unidad** (propuesta; hasta que el acta diga otra cosa): la proporcionalidad compuesta, los repartos
   inversamente proporcionales, el interés compuesto, las funciones y la gráfica de `y = kx` (2.º ESO), la probabilidad y la
   estadística, y **la geometría con fórmula** (áreas, perímetros con fórmula, Pitágoras: U8; una escala se aplica a longitudes,
   nunca a un área). **Puntos a decidir en la 02, que no entran en ninguna práctica hasta el acta:**
   - **el método** que se enseña (reducción a la unidad, regla de tres o la constante) y cómo se presenta `3/4 = 6/x`;
   - **la inversa**: si entra y hasta dónde;
   - **los porcentajes encadenados** y **«el precio antes de la rebaja»**;
   - **las unidades de medida** (si van aquí o en la U8; el volumen y el tiempo), **la velocidad** y **el cambio de moneda**;
   - **la calculadora**, la notación del `%` y de la razón (regla 3) y **cómo se reparte el paquete 3** (las seis tareas de la
     app son parte de esa propuesta).
   Se saben la jerarquía y las potencias (U1), el m.c.d. y el m.c.m. (U2: simplificar una razón), los enteros (U3), las
   fracciones (U4: equivalentes, fracción de una cantidad, producto y cociente), los decimales (U5: multiplicar y dividir, por
   10, 100 y 1000, redondear, fracción ↔ decimal, y los cambios km-m, m-cm, kg-g, L-mL y euros-céntimos) y el álgebra (U6: se
   pueden usar letras; saben resolver `3x = 24`). **Ojo con la `x` en el denominador**: la U6 la dejó fuera, así que `3/4 = 6/x`
   no se «despeja»: se resuelve con los productos cruzados (`3x = 24`, `x = 8`) o se escribe con la `x` arriba.
3. **Notación en pantalla** (propuesta; la fija la 02): el porcentaje, **en español con cifra, espacio y signo** (`20 %`, con
   espacio de no separación, `&nbsp;`) y **en inglés pegado** (`20%`, que se lee *twenty per cent*). La razón, **como fracción**
   (`htmlFraccion` de `fracciones.js`) o con palabras («3 a 4», *3 to 4*, «3 de cada 4», *3 out of 4*); **`3 : 4` como razón,
   solo en las escalas** (`1 : 50 000`, «uno a cincuenta mil») **y en los repartos** («en la razón 2 : 3»), nunca en una línea
   que lleve también una división (en este curso «:» es el signo de dividir entre números). La regla de tres, en dos filas con
   las magnitudes arriba (`3 kg ⟶ 4,50 €` / `5 kg ⟶ x`), y **una operación por línea** en el paso a paso. **Los números de
   cinco cifras o más, con espacio fino entre grupos de tres** (`50 000`, `1 000 000`; `&#8239;`), en los dos idiomas; nunca
   punto ni coma de millares; los de cuatro cifras, sin separar (`2500`). **Coma decimal en español y punto en inglés** (`3,50`
   / `3.50`). **El dinero, siempre con dos decimales en el enunciado** (`12,00 €`; en inglés `12.00`). Las unidades, con su
   símbolo del SI, sin punto y **separadas del número** (`3,5 km`, `250 g`, `90 km/h`), el litro con `L` mayúscula; en inglés
   británico (*metres, litres, kilometres per hour*). **El producto entre números con `·`, nunca `×`**; la división entre
   números con `:`; entre número y letra, nada (`3x`). La constante se llama `k` solo si el enunciado la define. En inglés:
   *ratio*, *proportion*, *directly / inversely proportional*, *unit rate*, *per*, *for every*, *out of*, *percentage*,
   *discount*, *increase*, *decrease*, *sale price*, *VAT*, *scale*, *map*, *share in the ratio*. El alumno puede teclear `20%`,
   `20 %`, `0,2`, `0.2` o `1/5`: el lector de `proporcion.js` los acepta todos; nunca `eval`.
4. **Regla de oro**: todo distractor, inequívocamente falso, y cada distractor sale de un **error típico** de la columna `nota`
   del inventario, calculado con los números del ítem y comprobado en el test (nunca un número al azar): **razonar sumando en
   vez de multiplicando** (si 2 cuestan 5 €, 4 cuestan 7 €, en vez de 10 €); invertir la razón (`4/3` por `3/4`); confundir
   parte-parte con parte-todo (chicos y chicas en razón 2 a 3 → «2/3 de la clase son chicos», en vez de 2/5); aplicar la regla
   de tres directa a una situación inversa (6 obreros, 10 días → 4 obreros, «6,67 días», en vez de 15) y al revés; dar por
   proporcional lo que no lo es (la edad y la altura; el taxi con bajada de bandera); el 20 % de 50 como `50 : 20 = 2,5` (es
   10); `20 % = 0,02` o `= 2`; `5 % = 0,5`; restar el porcentaje como si fuera un número (`50 − 20 % = 30`, en vez de 40); dar
   el descuento cuando se pide el precio final (45 € con un 20 % → 9 €, en vez de 36,00 €) y al revés; «sube un 20 % y luego
   baja un 20 %: se queda igual»; sumar porcentajes encadenados; para hallar el total, calcular el porcentaje del dato (el 20 %
   son 30 → 6, en vez de 150); para «qué porcentaje», dividir al revés o dejar la fracción sin pasar a tanto por ciento; en un
   reparto, a partes iguales (120 € en la razón 2 : 3 → 60 € y 60 €, en vez de 48 € y 72 €); en una escala, multiplicar cuando
   toca dividir u olvidar el cambio de unidad (3 cm a escala `1 : 50 000` → «150 000 km», en vez de 1,5 km); en las unidades,
   subir cuando toca bajar, multiplicar por 10 en las de superficie, y **`1,5 h` leído como 1 h 50 min**. Los generadores de
   estos valores estarán en `_comun/proporcion.js` (`ERRORES_TIPICOS`, como en `_comun/algebra.js`): úsalos, y **cada función
   dice cuándo no sirve** (devuelve `null` cuando el error da lo mismo que la respuesta: el 50 % de 100 y `100 : 50` no, pero
   «sumar en vez de multiplicar» coincide a veces). **Lo que no es un error**: una escritura equivalente cuando no se pide la
   forma (`0,2` o `1/5` por `20 %`); un método distinto del explicado; *percent* por *per cent*; `12 €` por `12,00 €`; una
   razón sin simplificar cuando no se pide la más sencilla.
5. **Parejas válidas, que nunca se enfrentan**: *per cent* / *percent*; «tanto por ciento» / «porcentaje»; *ratio 3 to 4* /
   `3 : 4` / `3/4`; *VAT* / IVA; *discount* / *reduction*; «regla de tres» / «reducción a la unidad» / «productos cruzados»;
   *directly proportional* / *in direct proportion*; una fracción irreducible, su decimal exacto y su porcentaje; una cantidad
   y la misma en otra unidad. «Cinco veces más que» no se usa (es ambiguo); en inglés, *five times as many as*.
6. **Inglés sencillo**; la palabra no matemática que decide la respuesta se aclara entre paréntesis (*discount* (descuento),
   *sale* (rebajas), *increase* (subida), *each* (cada uno), *altogether* (en total), *share* (repartir), *per* (por cada),
   *at the same rate* (al mismo ritmo), *tap* (grifo), *recipe* (receta)), salvo que sea justo lo que se evalúa. **El enunciado
   no puede ser ambiguo, y en esta unidad lo es con facilidad**: «aumenta un 50 %» frente a «aumenta al 150 %»; «un 20 % más
   barato» (¿de qué precio?); «el 30 % de descuento sobre el precio ya rebajado»; en la inversa, **hay que decir que todos
   trabajan al mismo ritmo** (o que los grifos son iguales); en un reparto, **proporcional a qué**.
7. **Realismo** (regla de Juan Luis del 16-10): la situación tiene que ser posible y **todos** los números que pueda sacar el
   generador, creíbles, con **una cota por contexto que el test comprueba** (un `assert` en cada generador, como
   `src/ejercicios/contextos_mcd_mcm.js`). **Una situación solo es de proporcionalidad si lo es de verdad**: un corredor no
   mantiene en 42 km el ritmo de 2 km; diez albañiles no levantan un muro en dos minutos; una tarta no se hornea en la mitad de
   tiempo con el doble de temperatura. **Cotas de partida** (las aprueba la 02; si discrepan, manda el acta): descuentos del 5
   al 70 % (10, 15, 20, 25, 30, 40, 50, 60 y 70; nunca más del 100 %); IVA, el de España: 4, 10 o 21 %; subidas de un precio,
   un sueldo o una población del 1 al 20 %; una propina del 5 al 15 %; un porcentaje de un grupo del 1 al 99 %, con el resultado
   **en personas enteras**; recetas para 2 a 12 personas, con cantidades de cocina (50-1000 g, 0,1-2 L, 1-12 huevos); obreros,
   pintores, máquinas o grifos de 1 a 12, de 1 a 60 días o de 1 a 24 horas, **todos al mismo ritmo y dicho en el enunciado**;
   consumo de un coche de 4 a 9 L cada 100 km; velocidades: a pie 3-6 km/h, corriendo 8-15, en bici 10-30, en coche 30-120, en
   tren 80-300, en avión 700-900; escalas: planos `1 : 50`, `1 : 100` y `1 : 200`, mapas de `1 : 25 000` a `1 : 1 000 000`,
   maquetas `1 : 18`, `1 : 24`, `1 : 43` y `1 : 87`, con una medida en el plano de 0,5 a 30 cm y una real creíble (una
   habitación 2-10 m; de Murcia a Cartagena, unos 50 km); cambio de moneda con un tipo inventado y dicho en el enunciado, entre
   0,80 y 1,30 para dólares y libras; repartos entre 2-4 personas, proporcionales a algo dicho, **exactos al céntimo**; dinero y
   medidas como en la U5 y la U6 (un producto 0,20-30 €, fruta 0,80-6 €/kg, una prenda 5-120 €, un móvil 80-1200 €, una entrada
   3-60 €, gasolina 1,20-2,00 €/L, una persona 1,20-2,10 m y 30-120 kg, temperaturas de −10 a 45 °C, distancias a pie o en bici
   hasta 50 km y en coche hasta 1000 km). **El resultado de un problema es creíble y exacto**: personas, obreros y objetos, un
   número natural; días u horas, un natural o «y media»; dinero, exacto al céntimo (50 € más el 21 % de IVA son 60,50 €); **los
   datos se eligen para que el porcentaje salga exacto** (nada de `33,333… %` ni de «aproximadamente», salvo que se evalúe el
   redondeo, y entonces el enunciado dice a qué se redondea). **Contextos de la app** (propuesta; punto a decidir): la compra al
   peso, las recetas, el consumo del coche, los descuentos y el IVA de una tienda y las escalas de planos, generados eligiendo
   primero la constante o el resultado, y, **en problemas de un solo paso**, los obreros y los grifos, los repartos, las
   escalas de mapas y el cambio de moneda (prácticas `inversa`, `repartos`, `escalas`, `problemas-proporcion`); esos mismos
   contextos en problemas de varios pasos o con tabla son del papel. Los personajes llevan nombres inventados (no de alumnos reales).
8. **Feedback ligado al error**, con los números del ítem («el 20 % de 150 no es `150 : 20`: es `20/100 · 150 = 30`»; «el 20 %
   de 45 € son 9 €, que es el descuento: se pagan `45 − 9 = 36,00 €`»), no una regla genérica. Frase sencilla antes que caso
   límite.
9. **Casos fijos** (frases, contextos, números) que no copien los de las hojas, los exámenes semanales ni el examen final de la
   unidad 7 (en `/Users/salasgar/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/7. Proportionality/hojas-de-ejercicios/`, `exámenes-semanales/`, `examen-final/`): los alumnos los verán en papel. **Los casos de
   las hojas se excluyen en claro; los de los exámenes, por huella FNV-1a calculada fuera del repositorio, nunca en claro** (regla de
   PU2 del 30-10; modelo: `practicas/equivalentes/logica.js` y `tests/practicas-equivalentes.test.js` tras el commit b0e4cfd, y la
   reabierta `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md`). Con proporcionalidad, la huella se calcula sobre el
   **caso normalizado por valor** (tipo de problema y datos como fracciones irreducibles en un orden fijo), no sobre el texto: «el
   20 % de 150», «el 20 % de 150 €» y «0,2 · 150» son el mismo caso; `3/4 = x/20` y `x/20 = 3/4`, también; y una regla de tres con
   los mismos tres datos en otro contexto, también. Si al reclamar la hoja o el examen de tu paquete no existen aún, dilo en la
   ENTREGA: la tarea de publicación de tu paquete coteja y reabre si hace falta.
10. **Aritmética exacta**: las razones, los porcentajes y los resultados son `Fraccion` de `_comun/fracciones.js` (o enteros;
    **el dinero, en céntimos enteros**); nunca se compara ni se muestra con `Number` en coma flotante (`1.21 * 50`, `0.1 + 0.2`);
    **el redondeo, al más cercano (la mitad, hacia arriba) y solo cuando el enunciado lo pida, nunca `toFixed` sobre un
    flotante** ni truncando; nunca `eval` sobre lo que teclea el alumno. Cada resultado se comprueba en el test **por un segundo
    camino** (la regla de tres contra la constante; el precio final contra «precio menos descuento»; el reparto contra «las
    partes suman el total»), con `BigInt` o aritmética entera propia.

## Si la sesión se alarga

Señales: releer un fichero que ya leíste porque no recuerdas lo que decía, respuestas
claramente más lentas, aviso de límite de sesión. Con una señal, termina esta tarea y no
encadenes otra (ámbar). Con varias, a mitad de esta tarea (rojo): no apures, deja el
código en un estado coherente (los tests que tengas, en verde; lo que no funcione, sin
registrar en `practica.js`), commitea tus rutas con el mensaje «Tarea 224, a medias», escribe
`$R/hechos/notas/<sid>-traspaso-224.md` con el estado exacto (qué está hecho, qué falta, qué
has descubierto, en qué orden seguir), `$R/hechos/fallos/224--<sid>.md` con
`parada por: sesión agotada` y la ruta de esa nota, y `ABANDONADA` en tu reclamo.

## Si esta tarea resulta ser más de una

Si solo es **larga**, no se parte: haz lo que te quepa, commitea coherente y actualiza
arriba la duración esperada antes de soltarla. Si está **mal cortada** (una parte tiene que
terminar antes de poder especificar la otra, o dos partes quieren el mismo fichero), tú no
la recortas: termina el trozo coherente, escribe `$R/hechos/incidencias/<sid>.md` con el
tamaño real y el corte natural, `$R/hechos/fallos/224--<sid>.md` con `parada por: mal cortada`
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
   `git add <rutas> && git commit -m "<qué>" -- <rutas>`. Apunta el hash
   (`git rev-parse --short HEAD`).
3. Escribe `$R/salidas/224-problemas-proporcion/ENTREGA.md` (ficheros entregados, hash, URL local, qué
   ejercicios tiene y qué destrezas cubre, cotas de realismo, cómo probarlo en 1 minuto) y su marcador vacío
   `ENTREGA.md.ok-<sid>`.
4. Escribe `$R/hechos/terminadas/224--<sid>.md`: hash del commit, ficheros (lo que dice
   `git show --stat`, no lo que crees), número de tests propios en verde, hora y
   **duración real** (de `abierto:` a ahora), y propuestas pendientes si las hay.
5. Añade `CERRADA` a tu reclamo (línea propia que empieza por esa palabra).
6. Choques encontrados → `$R/hechos/incidencias/<sid>.md`.
7. `git fetch origin`, relista `$R/hechos/` **ahora** y regenera `$R/_ESTADO.md` (entero si
   no hay otras sesiones en el árbol; si las hay, retoque de tus filas y del registro):
   banda y «encadenable» recopiadas de las fichas, leyenda de bandas de `proyecto.md`. Anota qué
   tareas pasan de BLOQUEADA a PENDIENTE. Si tu duración real difiere mucho de la estimada,
   díselo al usuario.
8. Vuelca abajo, en «Trampas conocidas» de esta ficha, lo que hayas aprendido por las
   malas (es lo único de la ficha que editas, además de la duración).
9. Un solo commit con rutas explícitas de tus ficheros de `$R/hechos/` (por sid), tu
   carpeta de `$R/salidas/`, `$R/_ESTADO.md` y esta ficha, y `git push origin main`. Si el
   push se rechaza: `git pull --rebase origin main`, regenera el tablón otra vez desde
   `hechos/` (no lo fusiones a mano) y vuelve a comitear y empujar. **Nunca si `main` lleva
   commits ajenos sin empujar**: incidencia y díselo al usuario.
10. Dile al usuario la **foto del momento** en tres líneas («EN CURSO: … · LIBRES ahora: … ·
    BLOQUEADAS: …»), sacada de la lectura de `hechos/` del paso 7, y después, **solo para las
    LIBRES**, las frases de arranque de `proyecto.md` literales, en bloques de cita, una por
    sesión que quepa a la vez, con la tarea o la cadena, la banda traducida y el nombre de
    sesión delante.
11. Decide si encadenas (solo en verde: misma banda, tarea corta, sin esperas; si tu frase
    de arranque nombra la cadena, encadenas por defecto) o paras. Si encadenas, «Antes de
    empezar» entero otra vez, con reclamo nuevo, y di el nombre nuevo que te toca.

Si paras sin terminar: `$R/hechos/fallos/224--<sid>.md` con hasta dónde llegaste, la línea
`parada por: sesión agotada | avería | mal cortada`, y `ABANDONADA` en tu reclamo.

## Prohibido (común a todo el reparto)

- Editar ficheros que no estén en «Ficheros que toca»: ni `divisores/`, ni
  `practicas/_comun/` (salvo la tarea 01; en cada unidad, su base y sus tareas de publicación; cada una en lo que declara), ni `css/estilos.css`, ni `README.md` (salvo
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
  CDN; las prácticas no usan ni siquiera KaTeX (exponentes con `<sup>`; las fracciones con
  `htmlFraccion`).
- Las reglas de contenido de la unidad 7 (en esta ficha y en `proyecto.md` de su reparto): `×` en vez de `·`; `eval` o coma
  flotante; un periódico con puntos suspensivos; lo que es punto a decidir mientras no haya acta, lo que el acta deje fuera
  (la proporcionalidad compuesta, los repartos inversos, el interés compuesto, la geometría con fórmula, una escala aplicada a un
  área) o algo de una sesión posterior a la de la destreza; distractores que puedan ser
  verdad, y en especial **dos opciones con el mismo valor** (`0,2` y `20 %`; `2,5 km` y `2500 m`; dos métodos correctos enfrentados), que son dos
  respuestas correctas; casos de examen en claro en el repositorio.
- (U6, tarea 153, reabierta del 13-11 por los hallazgos 4 y 5 de la 191) En contextos de dinero, ninguna línea ni solución con fracción: se descarta el caso si no son céntimos exactos y se pasan a decimales las líneas que salgan de `ERRORES_TIPICOS`. Y un valor que se pide y no es el dato que se acaba de calcular enseña su cuenta en el feedback y en la explicación.
