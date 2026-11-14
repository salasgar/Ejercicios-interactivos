// «No lo sé» en `constructor` (tarea 188): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/constructor/logica.js';
import * as X from '../practicas/constructor/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const F = (n, idioma) => L.fmt(n, idioma).replace(/\s/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('constructor · ejercicio 1: la explicación lleva el número que da por bueno el ejercicio', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarConstruir, 1)) {
    const t = plano(X.explicaConstruir(item, ctx(idioma)));
    assert.equal(L.solucionDe(item.cifras, item.consigna, item.objetivo), item.solucion);
    assert.ok(t.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${F(item.solucion, idioma)}`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('constructor · ejercicio 2: cada tipo de ítem lleva su solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDescomposicion, 2, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaDescomposicion(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'a_suma') assert.ok(t.includes(`${F(item.n, idioma)} = ${item.correctas.map(v => F(v, idioma)).join(' + ')}`), t);
    else if (item.tipo === 'a_numero') assert.ok(t.includes(`${item.sumandos.map(v => F(v, idioma)).join(' + ')} = ${F(item.n, idioma)}`), t);
    else if (item.tipo === 'valor') assert.ok(t.includes(`= ${F(item.correcto, idioma)}`), t);
    else assert.ok(t.includes(` ${item.cifra} `) && t.includes(L.fmt(item.n, idioma).replace(/\s/g, ' ')), t);
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['a_numero', 'a_suma', 'posicion', 'valor']);
});

test('constructor · ejercicio 3: comas y palabras llevan la solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarComaPalabras, 3, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaComaPalabras(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'coma') assert.ok(t.includes(item.correcto.replace(/\s/g, ' ')), t);   // «776 304» lleva espacio fino: se normaliza como en plano()
    else assert.ok(t.includes(F(item.n, idioma)), t);
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['coma', 'palabras']);
});

// ─── Revisión 193 ───────────────────────────────────────────────────────────────

const RESP = { es: 'La respuesta es', en: 'The answer is' };
const veces = (t, s) => t.split(s).length - 1;

test('constructor · ejercicio 1 (revisión 193): la respuesta, al final y una vez; en «cercano», los dos vecinos bien calculados', () => {
  let cercanos = 0;
  for (const idioma of IDIOMAS) for (const item of generar(L.generarConstruir, 11)) {
    const t = plano(X.explicaConstruir(item, ctx(idioma)));
    assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.solucion, idioma)}.`), t);
    assert.equal(veces(t, RESP[idioma]), 1, t);
    assert.ok(!/\. [a-z]/.test(t.replace(/ \d[\d ,.]*\./g, ' ')), `mayúscula tras punto: ${t}`);
    if (item.consigna !== 'cercano') continue;
    cercanos++;
    const todas = L.permutaciones(item.cifras);
    const debajo = todas.filter(n => n < item.objetivo), encima = todas.filter(n => n > item.objetivo);
    if (debajo.length) assert.ok(t.includes(`${F(Math.max(...debajo), idioma)} (`), t);
    if (encima.length) assert.ok(t.includes(`${F(Math.min(...encima), idioma)} (`), t);
    const vecinos = [debajo.length ? Math.max(...debajo) : null, encima.length ? Math.min(...encima) : null].filter(v => v !== null);
    const mejor = vecinos.sort((a, b) => Math.abs(a - item.objetivo) - Math.abs(b - item.objetivo))[0];
    assert.equal(mejor, item.solucion, 'el más cercano es uno de los dos vecinos');
  }
  assert.ok(cercanos > 0);
});

test('constructor · ejercicio 2 (revisión 193): la regla una vez y «La respuesta es …» al final', () => {
  const ORD = { es: ['primera', 'segunda', 'tercera', 'cuarta', 'quinta'], en: ['first', 'second', 'third', 'fourth', 'fifth'] };
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDescomposicion, 12, 2400)) {
    const t = plano(X.explicaDescomposicion(item, ctx(idioma)));
    assert.equal(veces(t, RESP[idioma]), 1, t);
    if (item.tipo === 'a_suma') {
      assert.equal(veces(t, idioma === 'es' ? 'lo que vale en su posición' : 'what it is worth in its position'), 1, t);
      assert.ok(t.endsWith(`${F(item.correctas.at(-1), idioma)}.`), t);
      for (const v of item.correctas) assert.ok(t.split(RESP[idioma])[1].includes(F(v, idioma)), t);
    } else if (item.tipo === 'a_numero') assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.n, idioma)}.`), t);
    else if (item.tipo === 'valor') assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.correcto, idioma)}.`), t);
    else {
      const p = X.POSICION[item.pos][idioma];
      assert.ok(t.endsWith(idioma === 'es' ? `${RESP.es} «${p}».` : `${RESP.en} “${p}”.`), t);
      assert.equal(String(item.n).length - 1 - String(item.n).indexOf(String(item.cifra)), item.pos);
      assert.ok(t.includes(` ${ORD[idioma][item.pos]} `), t);
    }
  }
});

test('constructor · ejercicio 3 (revisión 193): sin «·» entre los grupos, sin repetir el número, respuesta al final', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarComaPalabras, 13, 2400)) {
    const t = plano(X.explicaComaPalabras(item, ctx(idioma)));
    assert.equal(veces(t, RESP[idioma]), 1, t);
    if (item.tipo === 'coma') {
      const sol = `${RESP[idioma]} ${item.correcto.replace(/\s/g, ' ')}.`;
      assert.ok(t.includes(sol), t);
      const resto = t.slice(t.indexOf(sol) + sol.length);
      assert.ok(resto === '' || /^ (Ojo|Careful): /.test(resto), t);
      if (item.sub === 'decimal') assert.equal(veces(t, item.correcto), 1, t);
    } else {
      assert.ok(!t.includes('·'), `el «·» es el producto en la U1: ${t}`);
      assert.ok(t.endsWith(`${RESP[idioma]} ${F(item.n, idioma)}.`), t);
      const g = x => String(x).padStart(3, '0');
      const k = Math.floor(item.n / 1000) % 1000, u = item.n % 1000;
      assert.ok(t.includes(`${g(k)};`) && t.includes(` ${g(u)}.`), t);
    }
  }
});
