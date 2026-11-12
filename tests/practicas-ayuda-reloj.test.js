// «No lo sé» en reloj: cada explicación lleva la solución del ítem, calculada aquí por fuerza bruta.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarLinea, generarHora, generarTresOMultiplo, explicaLinea, explicaHora, explicaTres } from '../practicas/reloj/logica.js';

const IDIOMAS = ['es', 'en'];
const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const mcmBruto = lista => { for (let m = Math.max(...lista); ; m++) if (lista.every(p => m % p === 0)) return m; };
const sinRestos = (html, donde) => assert.ok(!/undefined|NaN|\[object|null|×/.test(html), donde);
const hhmm = min => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;

test('reloj, ejercicio 1: la explicación lista los múltiplos y da el segundo del m.c.m.', () => {
  const rng = crearRng(61);
  for (let i = 0; i < N; i++) {
    const item = generarLinea(rng);
    const m = mcmBruto(item.periodos);
    assert.equal(item.solucion, m);
    for (const idioma of IDIOMAS) {
      const html = explicaLinea(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): (el segundo|second) ${m}\\.`), donde);
      for (const p of item.periodos) assert.ok(texto.includes(`${p}, ${2 * p}`), `lista de ${p} — ${donde}`);
    }
  }
});

test('reloj, ejercicio 2: la explicación da la hora de reloj correcta', () => {
  const rng = crearRng(62);
  for (let i = 0; i < N; i++) {
    const item = generarHora(rng);
    const m = mcmBruto(item.periodos);
    const fin = hhmm(item.inicio.h * 60 + item.inicio.m + m);
    for (const idioma of IDIOMAS) {
      const html = explicaHora(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): ${fin}\\.`), donde);
      assert.ok(texto.includes(`${m} min`), donde);
    }
  }
});

test('reloj, ejercicio 3: la explicación da el m.c.m. de los tres datos o el múltiplo', () => {
  const rng = crearRng(63);
  const vistos = { tres: 0, multiplo: 0 };
  for (let i = 0; i < N; i++) {
    const item = generarTresOMultiplo(rng);
    vistos[item.tipo]++;
    const m = mcmBruto(item.periodos);
    for (const idioma of IDIOMAS) {
      const html = explicaTres(item, idioma);
      const texto = plano(html);
      const donde = `${idioma}: ${texto}`;
      sinRestos(html, donde);
      assert.match(texto, new RegExp(`(La respuesta es|The answer is): ${m}\\.`), donde);
      for (const p of item.periodos) assert.ok(texto.includes(String(p)), donde);
    }
  }
  assert.ok(vistos.tres > 100 && vistos.multiplo > 100, JSON.stringify(vistos));
});
