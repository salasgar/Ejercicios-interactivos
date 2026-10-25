// Práctica «Sumas y restas con saltos» (reparto-practicas-u2, tarea 83): la lógica y los
// textos se prueban por fuerza bruta con semillas fijas. Los valores se comprueban con
// un evaluador propio (JavaScript), no con las funciones de la práctica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/saltos/logica.js';
import { txt, NOMBRES } from '../practicas/saltos/textos.js';

const N = 3000;
const generar = (fn, semilla = 11) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Valor de una cuenta escrita (`−3 + 8 − 2`), con JavaScript. */
const js = texto => Function(`"use strict"; return (${texto.replace(/−/g, '-')});`)();
const sinMenosRaro = s => !/[(]/.test(s);

test('textoDe: sin paréntesis y con el menos de verdad', () => {
  assert.equal(L.textoDe([-3, 8, -2]), '−3 + 8 − 2');
  assert.equal(L.textoDe([3, -7]), '3 − 7');
  assert.equal(js(L.textoDe([-3, 8, -2])), 3);
});

test('ejercicio 1: términos y resultado de −10 a 10, nunca 0, sin paréntesis, un tercio de cada tipo', () => {
  const items = generar(L.generarSalto);
  const por = {};
  for (const { tipo, terminos } of items) {
    por[tipo] = (por[tipo] ?? 0) + 1;
    const r = js(L.textoDe(terminos));
    assert.equal(r, L.valorDe(terminos));
    assert.ok(r !== 0 && Math.abs(r) <= 10, L.textoDe(terminos));
    assert.ok(terminos.every(t => Math.abs(t) >= 1 && Math.abs(t) <= 10));
    assert.ok(sinMenosRaro(L.textoDe(terminos)));
    if (tipo === 'resta') assert.ok(terminos[0] > 0 && terminos[1] < 0 && r < 0);
    if (tipo === 'menos-mas') assert.ok(terminos[0] < 0 && terminos[1] > 0);
    if (tipo === 'menos-menos') assert.ok(terminos[0] < 0 && terminos[1] < 0);
  }
  for (const tipo of L.TIPOS_SALTO) assert.ok(por[tipo] > N * 0.28 && por[tipo] < N * 0.38, `${tipo}: ${por[tipo]}`);
});

test('ejercicio 1: los errores típicos salen con nombre y no coinciden con el resultado', () => {
  let vistos = 0;
  for (const { terminos } of generar(L.generarSalto)) {
    const r = L.valorDe(terminos);
    const errores = L.erroresDeDos(terminos);
    for (const e of errores) {
      assert.notEqual(e.valor, r, L.textoDe(terminos));
      assert.ok(ERRORES_TIPICOS[e.error], e.error);
      vistos++;
    }
    assert.equal(new Set(errores.map(e => e.valor)).size, errores.length);
    // El caso de Juan Luis: −2 − 3 = 5 aparece cuando hay dos negativos.
    if (terminos[0] < 0 && terminos[1] < 0) assert.ok(errores.some(e => e.error === 'regla-signos-en-suma' && e.valor === -terminos[0] - terminos[1]));
  }
  assert.ok(vistos > N);
});

test('ejercicio 2: nunca resultado 0, de −20 a 20, mitad aproximada de positivos y negativos', () => {
  const items = generar(L.generarSigno);
  let pos = 0;
  for (const { terminos } of items) {
    const r = js(L.textoDe(terminos));
    assert.ok(r !== 0 && Math.abs(r) <= 20, L.textoDe(terminos));
    assert.ok(terminos.every(t => Math.abs(t) <= 20));
    assert.ok(sinMenosRaro(L.textoDe(terminos)));
    assert.equal(L.signoDe(terminos), r > 0 ? 'positivo' : 'negativo');
    if (r > 0) pos++;
  }
  assert.ok(pos > N * 0.3 && pos < N * 0.7, `positivos: ${pos}`);
});

test('ejercicio 3: el valor coincide con el evaluador, ningún paso se sale de ±20 y no hay paréntesis', () => {
  let numeros = 0, palabras = 0, otroResultado = 0;
  for (const item of generar(L.generarCadena)) {
    const { terminos } = item;
    assert.ok(terminos.length === 3 || terminos.length === 4);
    assert.equal(L.valorDe(terminos), js(L.textoDe(terminos)));
    assert.ok(L.parciales(terminos).every(p => Math.abs(p) <= 20), L.textoDe(terminos));
    assert.ok(terminos.every(t => t !== 0 && Math.abs(t) <= 12));
    assert.ok(sinMenosRaro(L.textoDe(terminos)));
    const pasos = L.pasosIzquierdaADerecha(terminos);
    assert.equal(pasos.length, terminos.length - 1);
    assert.equal(pasos.at(-1).valor, L.valorDe(terminos));
    if (item.modo === 'numeros') {
      numeros++;
      assert.equal(item.opciones, undefined);
      if (ERRORES_TIPICOS['derecha-a-izquierda'].fn(L.textoDe(terminos)) !== null) otroResultado++;
    } else {
      palabras++;
      // Cuatro formas de escribirla: la buena y tres con un verbo cambiado, todas con otro valor.
      assert.equal(item.opciones.length, 4);
      assert.equal(new Set(item.opciones).size, 4);
      assert.equal(item.opciones[item.correcta], L.textoDe(terminos));
      item.opciones.forEach((o, i) => {
        assert.ok(sinMenosRaro(o));
        if (i !== item.correcta) assert.notEqual(js(o), L.valorDe(terminos), o);
      });
    }
  }
  assert.ok(numeros > N * 0.4 && palabras > N * 0.4, `${numeros}/${palabras}`);
  assert.ok(otroResultado > numeros * 0.6, `derecha a izquierda distinta: ${otroResultado}/${numeros}`);
});

test('ejercicio 4: de cuatro a seis términos, positivos y negativos, y la mitad con una pareja de opuestos', () => {
  const items = generar(L.generarTerminos);
  let conPareja = 0;
  for (const { terminos, pareja } of items) {
    assert.ok(terminos.length >= 4 && terminos.length <= 6);
    assert.ok(terminos.some(t => t > 0) && terminos.some(t => t < 0));
    assert.equal(L.valorDe(terminos), js(L.textoDe(terminos)));
    assert.ok(Math.abs(L.valorDe(terminos)) <= 20);
    assert.ok(sinMenosRaro(L.textoDe(terminos)));
    assert.equal(L.positivosDe(terminos).length + L.negativosDe(terminos).length, terminos.length);
    assert.equal(pareja, L.hayPareja(terminos));
    if (pareja !== null) {
      conPareja++;
      assert.ok(terminos.includes(pareja) && terminos.includes(-pareja));
    }
    const sp = L.valorDe(L.positivosDe(terminos)), sn = L.valorDe(L.negativosDe(terminos));
    for (const e of L.erroresDeAgrupar(sp, sn)) {
      assert.notEqual(e.valor, sp + sn);
      assert.ok(ERRORES_TIPICOS[e.error], e.error);
    }
  }
  assert.ok(conPareja >= N * 0.5, `con pareja: ${conPareja}`);
});

test('ejercicio 5: todos los pasos dentro de la cota del contexto, y los distractores salen de errores con nombre', () => {
  const vistos = new Set();
  for (const item of generar(L.generarProblema)) {
    const { contexto, terminos } = item;
    const cota = L.CONTEXTOS[contexto];
    vistos.add(contexto);
    assert.ok(terminos.length === 4 || terminos.length === 5, 'tres o cuatro movimientos tras el inicio');
    assert.ok(L.parciales(terminos).every(p => p >= cota.min && p <= cota.max), `${contexto}: ${L.textoDe(terminos)}`);
    assert.ok(terminos[0] >= cota.inicio[0] && terminos[0] <= cota.inicio[1]);
    assert.ok(terminos.slice(1).every(m => Math.abs(m) >= cota.mueve[0] && Math.abs(m) <= cota.mueve[1] && Math.abs(m) % cota.paso === 0));
    const r = js(L.textoDe(terminos));
    assert.equal(r, L.valorDe(terminos));
    assert.notEqual(r, 0);
    // La cuenta: la buena y tres falsas con otro valor.
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4);
    assert.equal(item.opciones[item.correcta], L.textoDe(terminos));
    item.opciones.forEach((o, i) => { if (i !== item.correcta) assert.notEqual(js(o), r, o); });
    // La frase: tres números distintos; los dos falsos, de un error típico con nombre.
    assert.equal(item.frases.length, 3);
    assert.equal(new Set(item.frases).size, 3);
    assert.equal(item.frases[item.frase], r);
    // Realismo: la buena y las falsas caen dentro de la cota del contexto (regla de Juan Luis del 16-10).
    assert.ok(item.frases.every(v => v >= cota.min && v <= cota.max), `${contexto}: frases ${item.frases} fuera de [${cota.min}, ${cota.max}]`);
    item.frases.forEach((v, i) => {
      if (i === item.frase) return;
      assert.notEqual(v, r);
      assert.ok(ERRORES_TIPICOS[item.erroresFrase[i]], `${item.erroresFrase[i]}`);
    });
  }
  assert.deepEqual([...vistos].sort(), Object.keys(L.CONTEXTOS).sort());
});

test('ejercicio 5: los cuatro contextos salen casi por igual (el filtro de la cota no sesga el reparto)', () => {
  const cuenta = {};
  for (const item of generar(L.generarProblema, 99)) cuenta[item.contexto] = (cuenta[item.contexto] ?? 0) + 1;
  for (const k of Object.keys(L.CONTEXTOS)) assert.ok(cuenta[k] > N * 0.2, `${k}: ${cuenta[k]}`);
});

test('errata: «te falta 1» en singular, «te faltan 2» en plural; el inglés no lleva comillas españolas ni «he» para el buzo', () => {
  assert.match(txt('es').salto.explica([-5, 4], null), /te falta 1\b/);
  assert.match(txt('es').salto.explica([-6, 4], null), /te faltan 2\b/);
  const en = txt('en');
  const textosEn = [...en.intro, en.verbos, en.problema.intro ?? ''].join(' ');
  assert.ok(!/[«»]/.test(textosEn.replace(/<[^>]+>/g, '')), 'comillas españolas en inglés');
  assert.match(en.intro.join(' '), /the diver is 15 m below the surface/);
});

test('las cotas de los contextos son creíbles', () => {
  assert.ok(L.CONTEXTOS.buzo.max < 0, 'un buceador no sube por encima de la superficie');
  assert.ok(L.CONTEXTOS.buzo.min >= -40);
  assert.ok(L.CONTEXTOS.saldo.min >= -50 && L.CONTEXTOS.saldo.max <= 300);
  assert.ok(L.CONTEXTOS.ascensor.min >= -5 && L.CONTEXTOS.ascensor.max <= 20);
  assert.ok(L.CONTEXTOS.temperatura.min >= -30 && L.CONTEXTOS.temperatura.max <= 45);
  assert.ok(L.CONTEXTOS.temperatura.mueve[1] <= 20);
});

// ─── Textos ────────────────────────────────────────────────────────────────────

const MENOS_GUION = /(^|[\s(>:;,])-\s?\d/;   // un guion usado como signo
const PROHIBIDOS = [/×/, /\(\+/, /\+\d+(?!\d)\s*(?:=|<\/span>)/, /[a-zA-Z]\s*=\s*□/];

function revisar(texto, donde) {
  const sinEtiquetas = texto.replace(/<[^>]*>/g, ' ');
  assert.ok(!MENOS_GUION.test(sinEtiquetas), `${donde}: guion como signo en «${sinEtiquetas}»`);
  for (const p of PROHIBIDOS) assert.ok(!p.test(sinEtiquetas), `${donde}: ${p} en «${sinEtiquetas}»`);
  assert.ok(!/undefined|NaN|\[object/.test(texto), `${donde}: valor sin rellenar en «${texto}»`);
}

test('los dos idiomas tienen las mismas claves', () => {
  const claves = (o, ruta = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? claves(v, `${ruta}${k}.`) : [`${ruta}${k}`])).sort();
  assert.deepEqual(claves(txt('es')), claves(txt('en')));
  assert.equal(txt('es').intro.length, 5);
  assert.equal(NOMBRES.length, 5);
});

test('ningún texto del alumno, en los dos idiomas, lleva ×, guion como signo, (+ ni +N como resultado', () => {
  for (const idioma of ['es', 'en']) {
    const T = txt(idioma);
    T.intro.forEach((h, i) => revisar(h, `${idioma} intro ${i}`));
    for (const { terminos } of generar(L.generarSalto, 3).slice(0, 600)) {
      revisar(T.salto.orden(terminos), `${idioma} salto orden`);
      for (const e of [null, ...Object.keys(ERRORES_TIPICOS).filter(k => ['regla-signos-en-suma', 'suma-valores-absolutos', 'olvida-el-signo', 'signo-del-primero'].includes(k))]) {
        revisar(T.salto.explica(terminos, e), `${idioma} salto explica`);
      }
    }
    for (const { terminos } of generar(L.generarSigno, 4).slice(0, 600)) {
      revisar(T.signo.razon(terminos), `${idioma} signo`);
      revisar(T.salto.explica(terminos, null), `${idioma} signo/camino`);
    }
    for (const item of generar(L.generarCadena, 5).slice(0, 600)) {
      revisar(item.modo === 'palabras' ? T.cadena.ordenPalabras(item) : T.cadena.ordenNumeros, `${idioma} cadena orden`);
      revisar(T.cadena.pasos(item.terminos), `${idioma} cadena pasos`);
      revisar(T.cadena.cuentaBuena(item.terminos), `${idioma} cadena cuenta`);
      revisar(T.cadena.derecha(item.terminos, 7), `${idioma} cadena derecha`);
    }
    for (const item of generar(L.generarTerminos, 6).slice(0, 600)) {
      revisar(T.agrupa.orden(item.terminos), `${idioma} agrupa orden`);
      revisar(T.agrupa.mal(item.terminos), `${idioma} agrupa mal`);
      revisar(T.agrupa.explica(item.terminos, item.pareja), `${idioma} agrupa explica`);
      revisar(T.agrupa.sumaMal('pos', 13) + T.agrupa.sumaMal('neg', -19), `${idioma} agrupa suma`);
    }
    for (const item of generar(L.generarProblema, 7).slice(0, 600)) {
      revisar(T.problema.enunciado(item), `${idioma} problema`);
      revisar(T.problema.cuentaBuena(item.terminos), `${idioma} problema cuenta`);
      for (const v of item.frases) revisar(T.problema.fin(item.contexto, v), `${idioma} problema frase`);
    }
  }
});

test('las frases del problema no repiten los casos de Juan Luis de las hojas (el buzo del ejemplo de la introducción no se genera con su cuenta)', () => {
  // La introducción enseña −12 + 5 − 8; el generador puede dar otros buzos, pero esa cuenta exacta no es un ítem
  // porque tiene tres términos y los ítems llevan cuatro o cinco.
  assert.ok(generar(L.generarProblema).every(i => i.terminos.length >= 4));
});
