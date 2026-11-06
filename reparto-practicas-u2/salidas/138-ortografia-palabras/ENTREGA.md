# ENTREGA · Tarea 138 · «Ortografía: palabras que se confunden» (`ortografia-palabras`, id 67)

Sesión: `s-20261105T234513-7aac9da7`. Commit del código: **`353aaf8`** (4 ficheros). Fecha: 2026-11-06.

## Ficheros entregados

- `practicas/ortografia-palabras/logica.js`: los bancos `JUNTAS`, `HOMOFONOS` (con `PARES` y `SIGNIFICADOS`),
  `NUMEROS` y `SIMBOLOS`; `LISTA_NEGRA`, `INEXISTENTES`, `ERRORES` (regla + predicado de cada error del
  ejercicio 3); generadores con `elegirDeNivel`, explicaciones e `idError`.
- `practicas/ortografia-palabras/practica.js`: los tres ejercicios con `montarHueco` y `etiquetaNivel` (sustituye
  los tres `enConstruccion(138)`).
- `practicas/ortografia-palabras/textos.js`: nombre, detalle (`{ es, en }`, «Spanish spelling: …») e introducción.
- `tests/practicas-ortografia-palabras.test.js` (nuevo, 10 tests).

`index.html` y `estilos.css` del esqueleto, sin cambios: las piezas comunes ya ponen sus estilos.

## Los tres ejercicios (ítems por nivel 1 / 2 / 3)

1. **¿Junto o separado?** (38 / 37 / 25). Botones siempre en el orden junto · separado; la buena va junta el 50 %,
   41 % y 44 % de las veces en cada nivel.
   - N1: sino / si no, también / tan bien, tampoco / tan poco; siempre separadas (a veces, o sea, en serio, de repente,
     por favor, a lo mejor, por fin, de acuerdo, a pesar de, así que) y siempre juntas (adelante, atrás, detrás,
     afuera, adentro, conmigo, contigo).
   - N2: aparte / a parte, demás / de más, sobre todo / sobretodo, mediodía / medio día, entorno / en torno,
     sinvergüenza / sin vergüenza, ni siquiera, acerca de / a cerca de; separadas: al menos, a menudo, de pronto,
     en fin, a gusto, a través, sin embargo, de verdad, en vez de, a tiempo.
   - N3: conque / con que / con qué (tres botones), sinfín / sin fin, sinnúmero / sin número, malentendido / mal
     entendido, porvenir / por venir, a bordo / abordo, quehacer(es) / que hacer.
2. **Suenan igual, se escriben distinto** (24 / 29 / 30). La explicación da el significado de las dos (o tres).
   - N1: hola/ola, tubo/tuvo, hasta/asta, vaya/valla, hizo/izo, hierba/hierva.
   - N2: haya/halla, rallar/rayar, callado/cayado, bello/vello, vaya/valla/baya, honda/onda, huso/uso, deshecho/desecho.
   - N3: bienes/vienes, sabia/savia, grabar/gravar, rebelar/revelar, abría/habría, cabo/cavo, errar/herrar,
     basto/vasto, bota/vota, bacilo/vacilo, baca/vaca.
3. **Números y símbolos** (27 / 23 / 30). Hueco con la buena y una mala, barajadas.
   - N1: 16-29 en una palabra, centenas, cien / ciento, «mil» sin plural, «dos mil veintiséis» sin «y».
   - N2: apócopes en masculino (veintiún, algún, ningún, cualquier, primer, tercer), millones (de), por ciento, años sin punto.
   - N3: símbolos (sin plural, sin mayúscula, sin punto, kg/km/cm/m/g/h/min/s/km/h, € detrás) y ordinales
     compuestos sin tilde en «decimo-».

`idError`: `<puesta>-por-<buena>` en los ejercicios 1 y 2 (`si-no-por-sino`, `aveces-por-a-veces`, `tuvo-por-tubo`);
en el 3, el error con nombre (`numeral-separado`, `sin-apocope`, `simbolo-en-plural`…; además de los de la ficha,
`millon-sin-plural` y `millones-sin-de`).

## Descartado por tener dos formas válidas (o por dudoso), con la fuente

Cotejado el 2026-11-06 en el DLE y el DPD 2.ª ed. (rae.es/dpd), desde Chrome.

| Fuera | Por qué | Fuente |
|---|---|---|
| alrededor / **al rededor** (la ficha la daba como mala) | «Es preferible esta forma… a la grafía en dos palabras al rededor»: se admite | DPD «alrededor», 1 |
| en medio / **enmedio** (la ficha la daba como «siempre separada») | «es también válida la grafía unitaria enmedio» | DPD «medio», 7 |
| enhorabuena / en hora buena, tal vez / talvez | las dos formas registradas | DPD |
| porque / por qué / porqué / por que | son de la tarea 139; además, el DPD admite «porque» final con subjuntivo donde va «por que» | ficha 139, DPD «porque» |
| asimismo / a sí mismo | «también» encaja en casi cualquier frase (incluso «Se mira también en el espejo») | ficha 138, trampas |
| hojear / ojear | «ojear una revista» (echar un vistazo) se defiende | FundéuRAE (sin poder abrirla: fuera por dudoso) |
| bienvenido / bien venido, encima / en cima, debajo / de bajo, apenas / a penas, además / a demás | la forma separada existe como secuencia en otras frases; no es una falta inequívoca | — |
| «por que» relativo, «dondequiera», «contrarreloj» | dobles grafías o casos dudosos | DPD |
| min., h., gr. como malas | podrían leerse como abreviaturas; se usan solo malas sin punto (mins, hrs, grs, seg, sg) o el punto en kg, cm, km | DPD «símbolo» |
| 31-99 en letras, apócope en femenino, separador de millares, 5 € / 5€, 1.º / 1º | de la ficha | DPD «cardinales», «ordinales» |

Confirmado como falta: «⊗diez y seis», «⊗cuatro cientos» (DPD «cardinales»); «⊗agusto» (DPD «gusto»);
«⊗apesar de» y «⊗sinembargo» (DPD); «⊗abordo» por «a bordo» (DPD «bordo»); «porciento» solo como nombre americano,
y en los porcentajes «se escribe siempre en dos palabras» (DPD «porciento»); «sinfín» / «sin fin», «sinnúmero» /
«sin número», «malentendido», «porvenir» / «por venir», «quehacer» / «que hacer», «entorno», «sinvergüenza»,
«mediodía» / «medio día», «acerca de» / «a cerca de» (DPD, cada entrada); los símbolos «se escriben siempre sin
punto», no varían en plural, tienen mayúsculas fijas y van «pospuestos a la cifra» (DPD «símbolo»); los años, sin
punto (DPD «números», f); «decimotercero» o «décimo tercero», nunca en una palabra con tilde (DPD «ordinales»).
Las formas juntas «aveces», «osea» y «asique» resultan ser formas raras de verbos (avezar, osear, asicar): en la frase
siguen siendo falta, pero ninguna explicación dice «no existe».

## Decisiones donde la ficha dejaba margen

1. Los botones del ejercicio 1 y 2 van en orden fijo (junto · separado; el del par), como en la 45; los del 3 se barajan.
2. El ejercicio 3 es un hueco en los tres niveles (no «¿cuál está bien escrita?»): con una sola mala por ítem el error
   es siempre uno y el `idError` sale del ítem.
3. La comparación con la 136 en el test importa su `logica.js` con `import().catch()`: si un día no carga, no tumba
   este test (la 136 se escribía a la vez). Hoy carga y compara: dos frases mías coincidían con las suyas y se cambiaron.

## Cómo probarlo en 1 minuto

`npm run servir` → http://localhost:8080/practicas/ortografia-palabras/?nivel=3 → «Probar sin código» → cualquiera de
los tres ejercicios. Probado así en los tres niveles (un acierto y un fallo en cada ejercicio y nivel), en ancho y a
375 px (dentro de un iframe de 375 px: la ventana de Chrome no se dejó estrechar).

## Propuestas (no hechas: no son ficheros de esta tarea)

- Añadir a la lista de `docs/practicas-ortografia.md`, §6, **alrededor / al rededor** y **en medio / enmedio** (DPD
  2.ª ed.), y avisar a las tareas 136, 137 y 139 por si las usan como malas.
- La ficha 138 dice que las hojas del curso escriben los millares con punto; las de `apuntes-1eso-bilingue` usan espacio
  fino (`1\,350`). No cambia nada aquí (el separador está fuera), pero conviene corregirlo en las fichas.
