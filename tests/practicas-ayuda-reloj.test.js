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
      // Revisión 193: sin dos puntos tras «es», con la frase de respuesta, y las listas hasta el primer común (no hasta 60).
      assert.match(texto, new RegExp(`(La respuesta es el segundo|The answer is second) ${m}: `), donde);
      assert.match(texto, /^(Se pide|You need)/, `qué se pide, delante — ${donde}`);
      for (const p of item.periodos) {
        const lista = Array.from({ length: m / p }, (_, k) => (k + 1) * p).join(', ');
        assert.ok(texto.includes(`${p} s: ${lista}.`), `lista de ${p} hasta ${m} — ${donde}`);
      }
      assert.ok(texto.includes(`(${item.periodos.join(', ')}) = ${m} s`), donde);
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
      assert.match(texto, new RegExp(`(La respuesta es|The answer is) ${fin}: `), donde);
      assert.ok(texto.includes(`${m} min`), donde);
      // Revisión 193: qué se pide, el m.c.m. por factorización (datos de dos cifras, como en los apuntes) y la
      // suma de la hora sin pasar nunca de 59 minutos en una cuenta (el error de sumar hasta 100).
      assert.match(texto, /^(Se pide una hora|You need a clock time)/, donde);
      for (const p of item.periodos) assert.match(texto, new RegExp(`\\b${p} = [0-9 ·]+`), `factorización de ${p} — ${donde}`);
      const sumas = [...texto.matchAll(/(\d+):(\d\d) \+ (\d+) (h|min) = (\d+):(\d\d)/g)];
      assert.ok(sumas.length >= 1, donde);
      for (const [, h1, m1, n, u, h2, m2] of sumas) {
        const antes = Number(h1) * 60 + Number(m1), despues = Number(h2) * 60 + Number(m2);
        assert.equal(despues - antes, u === 'h' ? Number(n) * 60 : Number(n), `cuenta mal hecha — ${donde}`);
        if (u === 'min') assert.ok(Number(m1) + Number(n) <= 60, `pasa de la hora en una sola suma — ${donde}`);
      }
      assert.equal(`${sumas.at(-1)[5]}:${sumas.at(-1)[6]}`, fin, donde);
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
      assert.match(texto, new RegExp(`(La respuesta es|The answer is) ${m} (días|days): `), donde);
      assert.match(texto, /^(Se pide|You need)/, donde);
      assert.ok(!/(La respuesta es|The answer is):/.test(texto), donde);
      for (const p of item.periodos) assert.ok(texto.includes(String(p)), donde);
    }
  }
  assert.ok(vistos.tres > 100 && vistos.multiplo > 100, JSON.stringify(vistos));
});
