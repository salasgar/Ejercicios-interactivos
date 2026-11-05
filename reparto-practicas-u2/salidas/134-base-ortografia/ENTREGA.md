# ENTREGA · Tarea 134 · Base de la ortografía en bloques

Sesión: `s-20261105T221032-77dcff9f` (relevo de `s-20261103T150013-c62ef816`, cuyo reclamo caducó el
2026-11-04T01:28:58Z). Commit del código: **`43a2c00`** (35 ficheros). Fecha: 2026-11-05.

## Qué se ha heredado y qué se ha hecho ahora

La sesión caída dejó sin commitear el catálogo, la sección de la portada, `nivel.js`, `ortografia.js` y los cinco
esqueletos. Se verificó con `npm test` (1368/1368 en verde con ese trabajo en el árbol), se leyó entero contra la ficha y
se hereda sin cambios. Esta sesión añadió los dos tests nuevos, `docs/practicas-ortografia.md`, la línea del `README.md`
y la prueba en el navegador. Incidencia: `hechos/incidencias/s-20261105T221032-77dcff9f.md`.

## Ficheros entregados

- `practicas/_comun/catalogo.js`: filas 64-68 (`unidad: 3, transversal: true, seccion: 'ortografia', disponible: false`),
  la 45 con `seccion` y el nombre nuevo («Ortografía: lo más frecuente» / «Spanish spelling: the most frequent slips»;
  slug, id, orden y 11 ejercicios sin tocar), `SECCIONES` y el comentario de `seccion`.
- `practicas/vista-tareas.js`: `seccionesPorUnidad` excluye las prácticas con `seccion`; `seccionesPropias` nueva.
- `practicas/portada.js`: la sección plegable, `seccionSaleAbierta`, las descripciones de los seis bloques.
- `practicas/_comun/nivel.js` y `practicas/_comun/ortografia.js` (nuevos).
- `practicas/ortografia-{tildes,letras,puntuacion,palabras,ampliacion}/` (esqueletos: `index.html`, `estilos.css`,
  `practica.js`, `logica.js`, `textos.js`).
- `tests/practicas-comun.test.js` (las cinco filas en la lista fija), `tests/practicas-nivel.test.js` (12 tests) y
  `tests/practicas-ortografia-comun.test.js` (7 tests), nuevos.
- `docs/practicas-ortografia.md` (siete secciones) y `README.md` (apartado «Ortografía»).

No hizo falta tocar `practicas/profesor-tareas.js`, `tests/practicas-portada-unidades.test.js` ni
`tests/practicas-editor.test.js`: siguen en verde (el editor ya listaba las transversales al final).

## Cómo probarlo en 1 minuto

`npm run servir` y:
- http://localhost:8080/practicas/ → entre «Unidad 2» y «Unidad 1», la sección «Ortografía», plegada, con la 45 dentro.
- http://localhost:8080/practicas/ortografia-tildes/ (y los otros cuatro) → «Probar sin código» → N ejercicios «En
  construcción» (4, 4, 4, 3, 4).

## Decisiones donde la ficha dejaba margen

1. **Dónde va la sección**: debajo de la unidad actual y encima de las anteriores; si la unidad actual no sale (nada
   publicado), arriba del todo. Se recuerda abierta/plegada en la misma clave que las unidades
   (`practicas.portada.abiertas`, con la clave `ortografia`).
2. **Sale desde ya, no desde el 16-11.** Antes la 45 vivía en la sección de la U3, que no sale hasta que la U3 es la
   unidad actual; ahora la sección «Ortografía» no depende del día y sale en cuanto tiene algo publicado (la 45 lo
   está). Es transversal y la sección es para practicar por cuenta propia, así que se deja así; si Juan Luis la quiere
   escondida hasta la U3, es una condición de una línea en `seccionesPropias`.
3. **Cómo sabe `nivelForzado` si hay código**: la base no lo expone y no se toca, así que `hayCodigoEnLaPagina` mira lo
   mismo que la base al arrancar: `?c=` en la dirección o `practicas.codigo` en el navegador. Sin ninguno de los dos
   (que es cuando se ve «Probar sin código»), `?nivel=1|2|3` manda.
4. **Tope por vidas contado en vidas perdidas** (0-1 sin tope, 2 → máx. 2, 3 o más → 1): con las 5 vidas de siempre es
   exactamente lo de la ficha (5-4 sin tope, 3 → 2, ≤ 2 → 1), y un ejercicio que declare otras `vidas` no empieza con tope.
5. **`elegirDeNivel` devuelve `{ item, nivel, actual }`**: `nivel` el del ítem, `actual` el del alumno (el que se
   enseña). La ficha pedía `{ item, nivel }`; `actual` es un añadido.
6. **`enConstruccion(tarea)` vive en `_comun/ortografia.js`** (y no en cada esqueleto), para que el test compruebe que
   cada esqueleto declara los N del catálogo.
7. **`ortografia.js` pone sus estilos en la página** (`ESTILOS`, una sola vez), así los bloques no repiten CSS.

## El contrato en una página (para las tareas 135-139)

**Catálogo**: tu fila ya está (`disponible: false`); no la toques: la publican 140-142. El número de ejercicios es el
del catálogo.

**Esqueleto**: `practica.js` llama a `arrancar({ slug, idioma: 'es', ejercicios: [...] })` con N
`enConstruccion(NNN)`. Sustituye cada uno por tu ejercicio, en su sitio. Cada ejercicio: `nombre` y `detalle` en
`{ es, en }` (el `en` empieza por «Spanish spelling: …»), `generar(rng, sesion)` y `montar(contenedor, item, api)`.

**Banco** (`logica.js`, puro): ítems con `nivel: 1 | 2 | 3` (1 = lo que todo alumno de 1.º debe dominar y lo que más
falla; 2 = el resto de 1.º; 3 = más allá de 1.º, con una sola respuesta defendible). ≥ 16 por nivel (≥ 12 si es de
tocar o de tres o más opciones).

**Generador**:

```js
import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { barajarOpciones } from '../_comun/ortografia.js';
generar: (rng, sesion) => {
  const { item, actual } = elegirDeNivel(rng, BANCO, sesion, { forzado: nivelForzado() });
  return { i: BANCO.indexOf(item), nivel: actual, opciones: barajarOpciones(rng, item.opciones) };
}
```

`elegirDeNivel`: 70 % del nivel del alumno, 30 % de los de debajo, nunca de arriba; si su nivel no tiene ítems, baja.
Nivel del alumno (`nivelDe(sesion)`): 0-2 puntos → 1, 3-6 → 2, 7-10 → 3; con 3 vidas, máx. 2; con ≤ 2, nivel 1.

**`montar`** con las piezas de `_comun/ortografia.js` (todas llaman una vez a `api.responder` con `error` y
`respuesta` al fallar; `explicacion` e `idError` pueden ser texto o función de lo contestado; `etiqueta:
etiquetaNivel(item.nivel)` pone «Nivel 2 · ●●○» arriba):

| Pieza | Datos |
|---|---|
| `montarHueco(c, api, { antes, despues, opciones, buena, explicacion, idError })` | `opciones`: textos; `buena`: el texto bueno |
| `montarElegir(c, api, { instruccion, contexto, pregunta, opciones, buena, explicacion, idError })` | `opciones`: `[{ k, texto }]` de `barajarOpciones` (o `{ k, html }`); `buena`: una `k` |
| `montarTocar(c, api, { piezas, buenas, multiple, ninguna, unidas, explicacion, idError })` | `buenas`: índices (`[]` = «Ninguna»); `multiple` añade «Comprobar» |
| `montarDosPasos(c, api, { paso1: {…tocar}, paso2: {…elegir}, etiqueta })` | si falla el paso 1, termina ahí |

Textos comunes en `TXO`; `slug(texto)` para hacer `idError`. **`idError` estable por confusión**
(`^[a-z0-9-]{1,40}$`), no por frase.

**Tests mínimos** (`tests/practicas-ortografia-<bloque>.test.js`): forma del banco; ≥ 16/12 por nivel; equilibrio
(ningún botón > 60 % dentro de su nivel); ≥ 3000 ítems por ejercicio y nivel simulado sin ninguno por encima de
`nivelDe(sesion)`; lista negra de «Lo que nunca es distractor» (`docs/practicas-ortografia.md`, §6); `idError` con
el patrón. Para revisar un nivel en el navegador: `?nivel=N` con «Probar sin código».

**Ojo**: `tests/practicas-ortografia-comun.test.js` cuenta las llamadas `enConstruccion(NNN)` del esqueleto solo
mientras haya alguna; cuando el bloque tenga los suyos, ese control se apaga solo. No hay que tocarlo.

## Propuestas (no hechas)

- Si se quiere que la sección «Ortografía» no salga hasta la U3 (16-11), es de Juan Luis decirlo (decisión 2).
- La 143 puede reutilizar `elegirDeNivel` en los 11 ejercicios de la 45 sin tocar sus `montar`.
