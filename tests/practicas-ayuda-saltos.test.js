// «No lo sé» en `saltos` (tarea 178): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fmt } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/saltos/logica.js';
import * as X from '../practicas/saltos/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('saltos · ejercicio 1: la explicación lleva el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarSalto, 1)) {
    const html = plano(X.explicaSalto(item, ctx(idioma)));
    const v = L.valorDe(item.terminos);
    assert.ok(html.includes(`${L.textoDe(item.terminos)} = ${fmt(v)}`));
    assert.ok(html.endsWith(`${fmt(v)}.`), 'la respuesta, al final');
  }
});

test('saltos · ejercicio 2: la explicación lleva el signo y el valor', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarSigno, 2)) {
    const html = plano(X.explicaSigno(item, ctx(idioma)));
    const v = L.valorDe(item.terminos);
    const palabra = L.signoDe(item.terminos) === 'positivo' ? (idioma === 'es' ? 'positivo' : 'positive') : (idioma === 'es' ? 'negativo' : 'negative');
    assert.ok(html.endsWith(`${palabra}: ${fmt(v)}.`), html);
  }
});

test('saltos · ejercicio 3: la explicación lleva todos los pasos y el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarCadena, 3)) {
    const html = plano(X.explicaCadena(item, ctx(idioma)));
    const v = L.valorDe(item.terminos);
    for (const p of L.pasosIzquierdaADerecha(item.terminos)) assert.ok(html.includes(`${p.cuenta} = ${fmt(p.valor)}`));
    const fin = item.modo === 'palabras' ? `${L.textoDe(item.terminos)} = ${fmt(v)}.` : `${fmt(v)}.`;
    assert.ok(html.endsWith(fin), html);
  }
});

test('saltos · ejercicio 4: la explicación lleva las dos sumas y el total', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarTerminos, 4)) {
    const html = plano(X.explicaAgrupa(item, ctx(idioma)));
    const sp = L.valorDe(L.positivosDe(item.terminos)), sn = L.valorDe(L.negativosDe(item.terminos));
    assert.ok(html.includes(fmt(sp)) && html.includes(fmt(sn)));
    assert.ok(html.includes(`${L.textoDe([sp, sn])} = ${fmt(sp + sn)}`));
    assert.ok(html.endsWith(`${fmt(sp + sn)}.`), html);
    assert.equal(sp + sn, L.valorEvaluado(item.terminos));
  }
});

test('saltos · ejercicio 5: la explicación lleva la cuenta y la frase de respuesta', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarProblema, 5)) {
    const html = plano(X.explicaProblema(item, ctx(idioma)));
    const v = L.valorEvaluado(item.terminos);
    assert.ok(html.includes(L.textoDe(item.terminos)));
    assert.ok(html.endsWith(plano(X.txt(idioma).problema.fin(item.contexto, v))), html);
  }
});
