// «No lo sé» en `tanto-por-ciento` (PU2 tarea 219): cada explicación lleva la solución del ítem, en los dos idiomas,
// sin restos, sin «×» y acabada en «La respuesta es…» / «The answer is…».

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { numeroATexto } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/tanto-por-ciento/logica.js';
import * as X from '../practicas/tanto-por-ciento/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const blanco = x => x.replace(/[\s  ]+/g, ' ').trim();
const plano = html => blanco(html.replace(/<[^>]+>/g, ' '));
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'tanto-por-ciento'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
function sana(html, donde, idioma) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  const mal = idioma === 'es' ? /\d%|\d [%]|\d\u202f%/ : /\d[\s\u00a0\u202f]+%/;
  assert.doesNotMatch(html, mal, `% mal escrito — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}: ${plano(html)}`);
}
const fin = idioma => (idioma === 'es' ? /La respuesta es/ : /The answer is/);
const resultado = (it, idioma) => numeroATexto(L.parteDe(it.p, it.N), idioma);

for (const [nombre, ej, semilla] of [['ej. 1', ej1, 31], ['ej. 2', ej2, 32]]) {
  test(`tanto-por-ciento · ${nombre}: la explicación lleva el resultado y termina con la frase`, () => {
    for (const idioma of IDIOMAS) for (const it of items(ej, semilla)) {
      const html = ej.explicacion(it, textosDe(idioma));
      sana(html, `${nombre} ${idioma}`, idioma);
      assert.match(plano(html), fin(idioma));
      assert.ok(plano(html).endsWith(`${resultado(it, idioma)}.`), `${resultado(it, idioma)} — ${plano(html)}`);
    }
  });
}

test('tanto-por-ciento · ej. 3: nombra la cuenta buena y su resultado', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej3, 33)) {
    const html = ej3.explicacion(it, textosDe(idioma));
    sana(html, `ej3 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).includes(`${resultado(it, idioma)}.`), plano(html));
  }
});

test('tanto-por-ciento · ej. 4: la solución lleva su unidad', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej4, 34)) {
    const html = ej4.explicacion(it, textosDe(idioma));
    sana(html, `ej4 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(`${blanco(L.textoParte(it, idioma))}.`), `${L.textoParte(it, idioma)} — ${plano(html)}`);
  }
});

test('tanto-por-ciento · los ejercicios con cuenta declaran «No lo sé» y el ej. 3, no', () => {
  assert.ok(ej1.noLoSe && ej2.noLoSe && ej4.noLoSe);
  assert.ok(!ej3.noLoSe);
});

test('tanto-por-ciento · feedback: cada error lleva los números del ítem y los problemas, la regla de tres', () => {
  const it = { n: 1, p: 15, N: 80 };
  const casos = [['porcentaje-sin-dividir', '1200'], ['restar-el-porcentaje', '65'], ['porcentaje-entre-mil', '0,015'],
    ['porcentaje-entre-diez', '1,5'], ['dividir-entre-el-porcentaje', '5,33'], ['dar-el-resto', '68']];
  for (const idioma of IDIOMAS) for (const [e, cifra] of casos) {
    const txt = plano(X.feedbackCabeza(it, { escrito: '1', error: e }, idioma));
    const esperado = idioma === 'es' ? cifra : cifra.replace(',', '.');
    if (e !== 'dividir-entre-el-porcentaje') assert.ok(txt.includes(esperado), `${e} ${idioma}: ${txt}`);
    assert.ok(txt.includes('80') && txt.includes('15'), `${e} ${idioma}: ${txt}`);
  }
  for (const it4 of items(ej4, 51).slice(0, 200)) for (const idioma of IDIOMAS) {
    const txt = plano(ej4.explicacion(it4, textosDe(idioma)));
    assert.match(txt, idioma === 'es' ? /Regla de tres/ : /Rule of three/);
    assert.match(txt, /100x = /);
  }
});
