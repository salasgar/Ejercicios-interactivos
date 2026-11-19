// «No lo sé» en `que-porcentaje` (PU2 tarea 220): cada explicación lleva la solución del ítem, en los dos idiomas,
// sin restos, sin «×» y acabada en «La respuesta es…» / «The answer is…».

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { numeroATexto, aTexto, cantidad } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/que-porcentaje/logica.js';
import * as X from '../practicas/que-porcentaje/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const blanco = x => x.replace(/[\s\u00a0\u202f]+/g, ' ').trim();
const plano = html => blanco(html.replace(/<[^>]+>/g, ' '));
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'que-porcentaje'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
function sana(html, donde, idioma) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  const mal = idioma === 'es' ? /\d%|\d %|\d\u202f%/ : /\d[\s\u00a0\u202f]+%/;
  assert.doesNotMatch(html, mal, `% mal escrito — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}: ${plano(html)}`);
}
const fin = idioma => (idioma === 'es' ? /La respuesta es/ : /The answer is/);

test('que-porcentaje · ej. 1: la explicación acaba con el porcentaje', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej1, 31)) {
    const html = ej1.explicacion(it, textosDe(idioma));
    sana(html, `ej1 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(`${blanco(aTexto(cantidad(it.p, '%'), idioma))}.`), plano(html));
  }
});

test('que-porcentaje · ej. 2: la explicación acaba con el total y sus cuentas son enteras', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej2, 32)) {
    const html = ej2.explicacion(it, textosDe(idioma));
    sana(html, `ej2 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(`${numeroATexto(L.trioDe(it).T, idioma)}.`), plano(html));
    assert.doesNotMatch(plano(html), /\d[.,]\d+ ·|· \d[.,]\d+ =/, plano(html));
  }
});

test('que-porcentaje · ej. 3: nombra los dos datos y lo que falta', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej3, 33)) {
    const html = ej3.explicacion(it, textosDe(idioma));
    sana(html, `ej3 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).includes(X.PIDEN[it.pregunta][idioma]), plano(html));
    for (const k of L.PREGUNTAS) if (k !== it.pregunta) assert.ok(plano(html).includes(blanco(k === 'porcentaje' ? aTexto(cantidad(it.p, '%'), idioma) : X.textoRespuesta({ ...it, pregunta: k }, idioma))), `${k}: ${plano(html)}`);
    for (const k of L.PREGUNTAS) sana(X.feedbackTipo(it, k, idioma), `fb3 ${idioma}`, idioma);
  }
});

test('que-porcentaje · ej. 4: la solución lleva su unidad', () => {
  for (const idioma of IDIOMAS) for (const it of items(ej4, 34)) {
    const html = ej4.explicacion(it, textosDe(idioma));
    sana(html, `ej4 ${idioma}`, idioma);
    assert.match(plano(html), fin(idioma));
    assert.ok(plano(html).endsWith(`${blanco(X.textoRespuesta(it, idioma))}.`), `${X.textoRespuesta(it, idioma)} — ${plano(html)}`);
  }
});

test('que-porcentaje · los fallos de cada ejercicio se explican sin restos', () => {
  for (const idioma of IDIOMAS) {
    for (const it of items(ej1, 35).slice(0, 300)) {
      const { P, A, T } = L.trioDe(it);
      for (const e of L.erroresPorcentaje(P, A, T)) sana(X.feedbackPorcentaje(it, { escrito: '1', error: e.error }, idioma), `fb1 ${e.error}`, idioma);
    }
    for (const it of items(ej2, 36).slice(0, 300)) {
      const { P, A, T } = L.trioDe(it);
      for (const e of L.erroresTotal(P, A, T)) sana(X.feedbackTotal(it, { escrito: '1', error: e.error }, idioma), `fb2 ${e.error}`, idioma);
    }
    for (const it of items(ej4, 37).slice(0, 300)) sana(X.feedbackProblema(it, { escrito: '1', error: L.errorProblema(it, { valor: { num: 7, den: 3, equals: () => false }, unidad: null }) }, idioma), 'fb4', idioma);
  }
});

test('que-porcentaje · los ejercicios con cuenta declaran «No lo sé» y el ej. 3, no', () => {
  assert.ok(ej1.noLoSe && ej2.noLoSe && ej4.noLoSe);
  assert.ok(!ej3.noLoSe);
});
