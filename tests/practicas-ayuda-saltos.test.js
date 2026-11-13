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
    // Revisión 192: con dos negativos, cuánto se baja en total, no «3 y 6 se suman hacia abajo».
    assert.doesNotMatch(html, /se suman hacia abajo|are added downwards/);
    const [x, y] = item.terminos;
    if (x < 0 && y < 0) assert.ok(html.includes(`${-x} + ${-y} = ${-x - y}`), html);
  }
});

test('saltos · ejercicio 2: la explicación lleva el signo y el valor', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarSigno, 2)) {
    const html = plano(X.explicaSigno(item, ctx(idioma)));
    const v = L.valorDe(item.terminos);
    const palabra = L.signoDe(item.terminos) === 'positivo' ? (idioma === 'es' ? 'positivo' : 'positive') : (idioma === 'es' ? 'negativo' : 'negative');
    assert.ok(html.endsWith(`${palabra}: ${fmt(v)}.`), html);
    assert.doesNotMatch(html, /se suman hacia abajo|are added downwards/);
  }
});

test('saltos · ejercicio 3: la explicación lleva todos los pasos y el resultado', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarCadena, 3)) {
    const html = plano(X.explicaCadena(item, ctx(idioma)));
    const v = L.valorDe(item.terminos);
    for (const p of L.pasosIzquierdaADerecha(item.terminos)) assert.ok(html.includes(`${p.cuenta} = ${fmt(p.valor)}`));
    const fin = item.modo === 'palabras' ? `${L.textoDe(item.terminos)} = ${fmt(v)}.` : `${fmt(v)}.`;
    assert.ok(html.endsWith(fin), html);
    // Revisión 192: en la recta solo se sube y se baja; nada de ingresar, gastar ni «más/menos».
    if (item.modo === 'palabras') assert.doesNotMatch(html, /ingres|gast|paying|spending|«más»|“more”/);
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
    // La frase de la opción buena, sin mayúscula tras los dos puntos (revisión 192); con deuda, qué quiere decir.
    const fin = plano(X.txt(idioma).problema.fin(item.contexto, v));
    const frase = fin[0].toLowerCase() + fin.slice(1);
    const esperada = item.contexto === 'saldo' && v < 0
      ? frase.replace(/\.$/, idioma === 'es' ? `, o sea, debes ${-v} €.` : `, that is, you owe ${-v} €.`)
      : frase;
    assert.ok(html.endsWith(`: ${esperada}`), html);
    assert.doesNotMatch(html, /: [A-ZÁÉÍÓÚ]/, 'sin mayúscula tras los dos puntos');
    // Los verbos, los del contexto, y la regla no se repite en el primer paso.
    if (item.contexto === 'saldo') assert.doesNotMatch(html, /Subir|Going up/);
    else assert.doesNotMatch(html, /ingres|gast|Paying|spending/);
    assert.doesNotMatch(html, /Sube es \+|Going up is \+/);
  }
});
