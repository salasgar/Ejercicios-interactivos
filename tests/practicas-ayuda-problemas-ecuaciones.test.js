// «No lo sé» en `problemas-ecuaciones` (tarea 177): la explicación de cada ejercicio lleva la
// solución que el ejercicio da por buena. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/problemas-ecuaciones/logica.js';
import * as X from '../practicas/problemas-ecuaciones/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('problemas-ecuaciones · ejercicio 1: la explicación dice qué es x', () => {
  for (const item of items(L.generarIncognita, 801)) {
    const buena = item.opciones.filter(o => o.correcta);
    assert.equal(buena.length, 1);
    for (const idioma of IDIOMAS) assert.ok(X.explicaIncognita(item, ctx(idioma)).includes(buena[0].texto[idioma]));
  }
});

test('problemas-ecuaciones · ejercicio 2: la explicación lleva la ecuación buena y la x que sale', () => {
  for (const item of items(L.generarEcuacion, 802)) {
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    for (const idioma of IDIOMAS) {
      const html = X.explicaEcuacion(item, ctx(idioma));
      assert.ok(html.includes(item.eqTxt[idioma].replace(/x/g, '<i>x</i>')), 'la ecuación');
      assert.ok(html.includes(`<i>x</i> = ${L.fmtVal({ dinero: item.dinero }, item.x, idioma)}`), 'el valor de x');
    }
  }
});

test('problemas-ecuaciones · ejercicio 3: la explicación lleva la respuesta que se acepta', () => {
  for (const item of items(L.generarResuelve, 803)) {
    const texto = item.dinero ? (item.valor / 100).toFixed(2) : String(item.valor);
    assert.equal(L.corregirResuelve(item, texto).acierto, true, 'es la que el ejercicio da por buena');
    for (const idioma of IDIOMAS) {
      const html = X.explicaResuelve(item, ctx(idioma));
      assert.ok(html.includes(item.frases[idioma]), 'la frase de respuesta');
      assert.ok(html.includes(item.pasos[idioma].at(-1).replace(/x/g, '<i>x</i>')), 'la última línea de la resolución');
    }
  }
});

test('problemas-ecuaciones · ejercicio 4: la explicación lleva la cantidad que se pide', () => {
  for (const item of items(L.generarPide, 804)) {
    const buena = item.opciones.filter(o => o.correcta);
    assert.equal(buena.length, 1);
    assert.equal(buena[0].valor, item.valor);
    for (const idioma of IDIOMAS) {
      const html = X.explicaPide(item, ctx(idioma));
      assert.ok(html.includes(item.frases[idioma]), 'la frase de respuesta');
      assert.ok(html.includes(item.nombreP[idioma]), 'lo que se pide');
    }
  }
});

test('problemas-ecuaciones · ejercicio 5: la explicación dice si tiene sentido y dónde falla', () => {
  for (const item of items(L.generarSentido, 805)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaSentido(item, ctx(idioma));
      const si = idioma === 'es' ? 'Sí tiene sentido' : 'Yes, it makes sense';
      const no = idioma === 'es' ? 'No tiene sentido' : 'It does not make sense';
      assert.equal(html.includes(si), item.correcta === 'bien');
      assert.equal(html.includes(no), item.correcta !== 'bien');
      if (item.donde === 'ecuacion') assert.ok(html.includes(item.eqTxt[idioma].replace(/x/g, '<i>x</i>')), 'la ecuación buena');
      // La línea mala, con la fracción ya con raya (revisión 191): en texto plano, «322/3» queda «3223».
      const plano = h => h.replace(/<[^>]+>/g, '');
      if (item.donde === 'resolucion') assert.ok(plano(html).includes(plano(item.linea[idioma]).replace(/(\d)\/(\d)/g, '$1$2')), 'la línea mala');
      assert.doesNotMatch(plano(html), /\d\/\d/, `fracción con barra — ${plano(html)}`);
    }
  }
});
