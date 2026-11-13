// «No lo sé» en suma-resta (tarea 172; revisada en la 190): cada explicación lleva la solución del
// ítem, calculada con su `logica.js` (no copiada de la explicación), en los dos idiomas. Además
// vigila lo que corrigió la revisión: que la tarjeta enseñe CÓMO sale cada número (por cuánto se
// multiplica al ampliar, entre cuánto se divide al simplificar), que no se salte la simplificación
// antes de la respuesta, que «Caza el error» dé la cuenta bien hecha y la razón, y que la regla no
// se repita.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion, htmlFraccion, htmlRaya } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/suma-resta/logica.js';
import * as X from '../practicas/suma-resta/textos.js';

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
  assert.doesNotMatch(plano(html), /\d\s*\/\s*\d/, `fracciones con raya, nunca con barra — ${donde}`);
};
const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));
const veces = (html, trozo) => html.split(trozo).length - 1;
/** Si r se simplifica, la tarjeta dice entre cuánto se divide y escribe «r = irreducible». */
const enseñaSimplificar = (html, r, idioma) => {
  const g = mcd(r.num, r.den);
  if (g === 1) return;
  assert.ok(plano(html).includes(idioma === 'es' ? `entre ${g}` : `by ${g}`), `entre cuánto se divide: ${plano(html)}`);
  assert.ok(html.includes(`${htmlFraccion(r)} = ${htmlFraccion(r.simplificar())}`), `el paso de simplificar: ${plano(html)}`);
};

test('suma-resta, ejercicio 1: la regla una vez, la cuenta de los numeradores y el resultado simplificado', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarMismo, 1)) {
    const html = X.explicaMismo(item, textosDe(idioma));
    sano(html, `mismo ${idioma}`);
    const r = L.resultadoMismo(item);
    assert.ok(html.includes(htmlFraccion(r.simplificar())), plano(html));
    assert.ok(plano(html).includes(`${item.op === '+' ? '+' : '−'} ${item.b.n} = ${r.num < 0 ? `−${-r.num}` : r.num}`), `los numeradores: ${plano(html)}`);
    enseñaSimplificar(html, r, idioma);
    assert.equal(veces(plano(html), idioma === 'es' ? 'denominador' : 'denominator'), 2, `la regla no se repite: ${plano(html)}`);
  }
});

test('suma-resta, ejercicio 2: tres pasos en lista, con el m.c.m., por cuánto se multiplica cada una y el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarPasos, 2)) {
    const html = X.explicaPasos(item, textosDe(idioma));
    sano(html, `pasos ${idioma}`);
    const r = L.resultadoPasos(item);
    assert.ok(html.includes(htmlFraccion(r.simplificar())), plano(html));
    assert.match(plano(html), new RegExp(`(m\\.c\\.m\\.|LCM)\\(${item.fracs.map(f => f.d).join(', ')}\\) = ${item.m} \\.`), 'el m.c.m.');
    assert.equal(veces(html, '<li>'), 3, `tres pasos: ${plano(html)}`);
    assert.ok(html.includes('class="pasos-ayuda"'));
    for (const f of item.fracs) {
      const k = item.m / f.d;
      if (k > 1) assert.ok(html.includes(`${htmlRaya(`${f.n} · ${k}`, `${f.d} · ${k}`)} = ${htmlFraccion(fraccion(f.n * k, item.m))}`), `cómo se amplía ${f.n}/${f.d}: ${plano(html)}`);
    }
    enseñaSimplificar(html, r, idioma);
  }
});

test('suma-resta, ejercicio 3: el natural, multiplicado por el denominador, y el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarNaturales, 3)) {
    const html = X.explicaNat(item, textosDe(idioma));
    sano(html, `nat ${idioma}`);
    const r = L.resultadoNat(item);
    assert.ok(html.includes(htmlFraccion(r)), plano(html));
    assert.ok(plano(html).includes(`${item.nat} · ${item.f.d} = ${item.nat * item.f.d}`), `cómo se pasa el natural: ${plano(html)}`);
    assert.ok(plano(html).includes(` = ${r.num < 0 ? `−${-r.num}` : r.num}`), `la cuenta de los numeradores: ${plano(html)}`);
    assert.equal(veces(html, '<li>'), 2);
  }
});

test('suma-resta, ejercicio 4: la respuesta buena sale de una cuenta, también cuando hay que simplificar', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarQueda, 4)) {
    const html = X.explicaQueda(item, textosDe(idioma));
    sano(html, `queda ${idioma}`);
    const buena = htmlFraccion(L.respuestaQueda(item));
    assert.ok(plano(html).includes(plano(`= ${buena}`)), `la cuenta llega a la respuesta: ${plano(html)}`);
    assert.ok(html.includes(buena), plano(html));
    assert.equal(veces(plano(html), idioma === 'es' ? 'falta hasta 1' : 'missing up to 1'), 1, `la regla no se repite: ${plano(html)}`);
  }
});

test('suma-resta, ejercicio 5: qué línea falla (o que no hay error), cómo queda bien y la razón', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarCaza, 5)) {
    const html = X.explicaCazaAyuda(item, textosDe(idioma));
    sano(html, `caza ${idioma}`);
    const texto = plano(html);
    const m = item.m;
    if (item.mala === null) {
      assert.ok(/No hay error|No mistake/.test(texto), texto);
      continue;
    }
    assert.ok(texto.includes(idioma === 'es' ? `es la línea ${item.mala + 1},` : `is line ${item.mala + 1},`), texto);
    assert.ok(texto.includes(X.nombreError(item.error, idioma)), `la razón que hay que elegir: ${texto}`);
    let bien;
    if (item.mala === 0) bien = fraccion((item.a.n * m) / item.a.d, m);
    else if (item.mala === 1) bien = fraccion(item.l1.x.n + item.l1.y.n, m);
    else bien = L.F(item.l2.s).simplificar();
    assert.ok(html.includes(htmlFraccion(bien)), `la cuenta bien hecha (${bien.num}/${bien.den}): ${texto}`);
    assert.ok(L.lineaCorrecta({ ...item, ...[{ l1: { ...item.l1, x: { n: bien.num, d: bien.den } } }, { l2: { s: { n: bien.num, d: bien.den } } }, { l3: { r: { n: bien.num, d: bien.den } } }][item.mala] }, item.mala), 'lo que da como bueno lo es');
  }
});
