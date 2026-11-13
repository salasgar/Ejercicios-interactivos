// «No lo sé» en leelo4 (tarea 172; revisada en la 190): cada explicación lleva la solución del ítem
// (las cinco parejas, la opción buena, la cuenta que dice la frase), en los dos idiomas. Además vigila
// lo que corrigió la revisión: la regla de leer fracciones dice half y quarter (sin eso es falsa en
// 1/2 y 3/4); las cuentas llevan la regla de su operación y no repiten la lectura entera; el dictado
// no dice «en el orden en que se dicen» con «subtract… from…», no usa letras («subtract b from a») y
// solo explica las palabras de su frase; y la respuesta va al final.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/leelo4/logica.js';
import * as X from '../practicas/leelo4/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => String(x) });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const sano = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\b[ab] [+−·:] [ab]\b|\b(from|and) [ab]\b/, `sin letras antes de la unidad 6 — ${donde}: ${plano(html)}`);
};
const veces = (texto, trozo) => texto.split(trozo).length - 1;

test('leelo4, ejercicio 1: la explicación lista las cinco parejas, con un consejo que es verdad', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarEmparejar, 1)) {
    const html = X.explicaEmparejar(item, textosDe(idioma));
    sano(html, `emparejar ${idioma}`);
    assert.doesNotMatch(plano(html), /solas|by themselves/, 'solo la última se empareja sola');
    assert.equal((html.match(/<li>/g) ?? []).length, L.PAREJAS_POR_ITEM);
    for (const id of item.en) {
      assert.ok(html.includes(L.terminoDe(id).en) && html.includes(L.terminoDe(id).es), `${id}: ${plano(html)}`);
    }
  }
});

for (const [n, generar, semilla] of [[2, L.generarLectura, 2], [3, L.generarQuePide, 3]]) {
  test(`leelo4, ejercicio ${n}: la regla delante y la opción buena al final`, () => {
    for (const idioma of IDIOMAS) for (const item of items(generar, semilla)) {
      const ctx = textosDe(idioma);
      const html = X.explicaElegir(item, ctx);
      sano(html, `elegir ${n} ${idioma}`);
      const buenas = item.opciones.filter(o => o.correcta);
      assert.equal(buenas.length, 1, 'una sola opción buena');
      const buena = buenas[0].html ?? buenas[0].texto;
      assert.ok(html.endsWith(`${idioma === 'es' ? '«' : '“'}${buena}${idioma === 'es' ? '»' : '”'}</span>.`), plano(html));
      if (item.instruccion === 'leer_cuenta') {
        assert.equal(veces(html, buena), 1, `la lectura no se repite: ${plano(html)}`);
        const signo = { leer_suma: '+', leer_resta: '−', leer_producto: '·', leer_cociente: ':' }[item.plantilla];
        if (signo) assert.ok(plano(html).startsWith(idioma === 'es' ? `«${signo}» se lee` : `“${signo}” is read`), plano(html));
        else assert.match(plano(html), /squared/);
      } else if (item.plantilla === 'de' && idioma === 'en') {
        assert.match(plano(html), /” means .* · \d+ = /, `«of» es multiplicar, no «1/2 of 38 is 1/2 of 38»: ${plano(html)}`);
      } else {
        assert.ok(html.includes(item.solucion[idioma]), plano(html));
      }
      if (item.plantilla === 'leer_fraccion') assert.match(plano(html), /half \(halves\).*quarter/, plano(html));
    }
  });
}

test('leelo4, ejercicio 4: el orden, solo las palabras de su frase y al final la cuenta', () => {
  let subtract = 0;
  for (const idioma of IDIOMAS) for (const item of items(L.generarDictado, 4)) {
    const html = X.explicaDictado(item, textosDe(idioma));
    sano(html, `dictado ${idioma}`);
    const texto = plano(html);
    assert.ok(html.endsWith(`<span class="cuenta">${L.cuentaDelItem(item)}</span>.`), texto);
    const enOrden = /orden en que se dicen|order they are said/.test(texto);
    if (/^subtract /.test(item.frase)) { subtract++; assert.ok(!enOrden, texto); assert.match(texto, /from/); }
    else assert.ok(enOrden, texto);
    // El ejemplo de cómo se escribe una fracción es una fracción de ESA frase (revisión 190).
    const [abre, cierra] = idioma === 'es' ? ['«', '»'] : ['“', '”'];
    const ejemplo = texto.match(new RegExp(`^${abre}([^${cierra}]+)${cierra}`))?.[1];
    assert.ok(ejemplo && item.frase.includes(ejemplo), `el ejemplo «${ejemplo}» no sale en «${item.frase}»`);
    // Solo las palabras que salen en la frase.
    for (const palabra of ['plus', 'minus', 'divided by', 'multiplied by', 'times', 'the sum of', 'the product of', 'the quotient of']) {
      if (!item.frase.includes(palabra)) assert.ok(!texto.includes(`${idioma === 'es' ? '«' : '“'}${palabra}${idioma === 'es' ? '»' : '”'}`), `${palabra} no sale en «${item.frase}»: ${texto}`);
    }
  }
  assert.ok(subtract > 0);
});
