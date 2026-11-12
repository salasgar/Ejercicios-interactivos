// «No lo sé» en `dos-signos` (tarea 179): la explicación de cada ejercicio lleva la solución
// del ítem, calculada con la lógica de la práctica y no copiada de la explicación. Por fuerza
// bruta: 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt, MENOS } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/dos-signos/logica.js';
import * as X from '../practicas/dos-signos/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const s = x => (x === '+' ? 1 : -1);

const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

test('dos-signos · ejercicio 1: la explicación lleva el signo y el resultado', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarUnSigno, 201)) {
      const html = X.explicaUnSigno(item, ctx(idioma));
      const signo = L.mult(item.op, item.interno);
      const termino = s(signo) * item.b;
      const valor = item.solo ? termino : item.a + termino;
      assert.equal(signo, item.signo);
      assert.equal(valor, item.valor);
      assert.ok(plano(html).includes(`${fmt(valor)}`), 'el resultado');
      assert.ok(html.includes(`${L.ver(signo)} `) || html.includes(`${L.ver(signo)}<`) || html.includes(`${L.ver(signo)}${item.b}`), 'el signo');
      assert.ok(html.includes(item.texto), 'la cuenta del ítem');
      const iguales = item.op === item.interno;
      assert.equal(/same|iguales/.test(plano(html)) && !/different|distintos/.test(plano(html)), iguales, 'iguales o distintos');
    }
  }
});

test('dos-signos · ejercicio 2: la explicación lleva la reescritura y el resultado', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarNegativo, 202)) {
      const html = X.explicaNegativo(item, ctx(idioma));
      const signo = item.op === '+' ? '-' : '+';
      const valor = item.a + s(signo) * item.b;
      assert.equal(valor, item.valor);
      assert.ok(html.includes(`${fmt(item.a)} ${L.ver(signo)} ${item.b} = ${fmt(valor)}`), 'reescritura y resultado');
      assert.ok(html.includes(item.texto));
    }
  }
});

test('dos-signos · ejercicio 3: la explicación lleva cada signo y el resultado', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarQuita, 203)) {
      const html = X.explicaQuita(item, ctx(idioma));
      const signos = item.terminos.map((t, i) => (i === 0 ? t.interno : L.mult(t.op, t.interno)));
      assert.ok(L.esReescrituraCorrecta(item, signos), 'son los signos que el ejercicio da por buenos');
      const valor = item.terminos.reduce((acc, t, i) => acc + s(signos[i]) * t.mag, 0);
      assert.equal(valor, item.valor);
      assert.ok(html.includes(`${L.textoSinParentesis(signos, item.terminos)} = ${fmt(valor)}`), 'cuenta sin paréntesis y resultado');
      for (const t of item.terminos) assert.ok(html.includes(`(${L.ver(t.interno)}${t.mag})`), 'cada término');
    }
  }
});

test('dos-signos · ejercicio 4: la explicación lleva la cuenta bien escrita', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarBienEscrita, 204)) {
      const html = X.explicaBien(item, ctx(idioma));
      const buenas = item.opciones.filter(o => o.bien);
      assert.equal(buenas.length, 1);
      assert.equal(buenas[0].texto, item.buena);
      assert.ok(html.includes(item.buena));
      assert.ok(item.buena.includes('('), 'la buena lleva paréntesis');
      for (const o of item.opciones.filter(o => !o.bien)) assert.ok(!html.includes(o.texto), 'no cita las malas');
    }
  }
});

test('dos-signos · las explicaciones no usan × ni dejan restos', () => {
  for (const idioma of IDIOMAS) {
    for (const [fn, gen] of [[X.explicaUnSigno, L.generarUnSigno], [X.explicaNegativo, L.generarNegativo], [X.explicaQuita, L.generarQuita], [X.explicaBien, L.generarBienEscrita]]) {
      for (const item of generar(gen, 205, 200)) {
        const html = fn(item, ctx(idioma));
        assert.ok(!/undefined|NaN|\[object|×/.test(html));
        assert.ok(!html.includes('-1') && !html.includes(`${MENOS}${MENOS}`));
      }
    }
  }
});
