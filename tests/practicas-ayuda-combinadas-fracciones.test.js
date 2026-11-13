// «No lo sé» en combinadas-fracciones (tarea 172; revisada en la 190): cada explicación lleva la
// solución del ítem, calculada con `fracciones.js` y `logica.js` (no copiada de la explicación), en
// los dos idiomas. Además vigila lo que corrigió la revisión: la regla dice «de izquierda a derecha»
// entre las del mismo nivel (sin ella, `7/9 − 1/3 + 4/9` no se decide); el ejercicio 1 no anuncia el
// atajo de las cadenas (`a · b : c`) como «vale cualquiera»; dice por qué va primero; el ejercicio 3
// dice la razón que hay que elegir, no repite la cuenta y no da pistas de denominadores en «2 + 2».

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion, leerFraccion, evaluar, analizar, pasosPosibles, valorLiteral, html as htmlExp } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/combinadas-fracciones/logica.js';
import * as X from '../practicas/combinadas-fracciones/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const sano = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\d\s*\/\s*\d/, `fracciones con raya — ${donde}`);
};
const izquierda = idioma => (idioma === 'es' ? 'de izquierda a derecha' : 'from left to right');
const span = op => `<span class="cuenta">${htmlExp(op)}</span>`;

test('combinadas-fracciones, ejercicio 1: la regla completa, la operación que va primero y por qué', () => {
  let cadenas = 0;
  for (const idioma of IDIOMAS) for (const item of items(L.generarPrimero, 1)) {
    const html = X.explicaPrimero(item, textosDe(idioma));
    sano(html, `primero ${idioma}`);
    const texto = plano(html);
    assert.ok(texto.includes(izquierda(idioma)), texto);
    const arbol = L.arbolDe(item.texto);
    const ya = pasosPosibles(arbol, { cadenas: false }).map(p => p.operacion);
    const todas = L.primerosPasos(arbol);
    // Lo que nombra la tarjeta lo acepta el ejercicio.
    for (const op of ya) assert.ok(todas.includes(op));
    for (const op of ya) assert.ok(html.includes(span(op)), texto);
    // El atajo de las cadenas no se anuncia.
    for (const op of todas.filter(o => !ya.includes(o))) { cadenas++; assert.ok(!html.includes(span(op)), `atajo anunciado: ${texto}`); }
    if (ya.length === 1) assert.match(texto, idioma === 'es' ? /, porque / : /, because /, texto);
  }
  assert.ok(cadenas > 0, 'hay ítems con atajo de cadena (si no, el test no prueba nada)');
});

test('combinadas-fracciones, ejercicio 2: la regla completa y la explicación acaba en el valor de la expresión', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarPasos, 2)) {
    const html = X.explicaPasosAyuda(item, textosDe(idioma));
    sano(html, `pasos ${idioma}`);
    assert.ok(plano(html).includes(izquierda(idioma)));
    const valor = htmlFraccion(evaluar(analizar(item.texto)));
    assert.ok(html.trim().endsWith(`<span class="cuenta">${valor}</span>.`), plano(html));
    assert.ok((html.match(/<li>/g) ?? []).length >= 2, 'al menos dos pasos');
  }
});

test('combinadas-fracciones, ejercicio 3: la línea, la razón que hay que elegir y la línea bien hecha', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarError, 3)) {
    const html = X.explicaErrorAyuda(item, textosDe(idioma));
    sano(html, `error ${idioma}`);
    const texto = plano(html);
    const razon = X.TX.ej3[item.tipo === 'orden' ? 'es_orden' : 'es_calculo'][idioma];
    assert.ok(texto.includes(idioma === 'es' ? `es la línea ${item.linea}: «${razon}».` : `is line ${item.linea}: “${razon}”.`), texto);
    const literal = valorLiteral(analizar(item.bueno)) !== null;
    if (item.tipo === 'orden' || !literal) assert.ok(html.includes(`<span class="cuenta">= ${htmlExp(item.bueno)}</span>`), texto);
    if (item.tipo === 'orden') {
      assert.ok(html.includes(htmlExp(item.canonica)), texto);
      assert.match(texto, idioma === 'es' ? /, porque / : /, because /, texto);
    } else {
      assert.ok(html.includes(htmlFraccion(leerFraccion(item.valorBueno))), texto);
      if (!/\//.test(item.operacion)) assert.doesNotMatch(texto, /denominador|denominator|numerador|numerator|cruz|cross/i, `pista de fracciones en una cuenta de naturales: ${texto}`);
    }
    // La línea bien hecha vale lo mismo que la expresión de partida.
    assert.ok(evaluar(analizar(item.bueno)).equals(evaluar(analizar(item.lineas[0]))), 'la línea buena no cambia el valor');
  }
});
