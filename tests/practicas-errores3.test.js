// Práctica «Caza el error» de la unidad 3 (PU2, tarea 89): la lógica se prueba por fuerza bruta con
// semillas fijas (3000 ítems por ejercicio). Los valores de cada línea se calculan con un evaluador
// propio (JavaScript), no con las funciones de la práctica ni con `evaluar` de enteros.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, evaluar } from '../practicas/_comun/enteros.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/errores3/logica.js';
import { TX } from '../practicas/errores3/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Valor de una línea escrita (`−(−8)^2 + 3`), con JavaScript. */
function valor(texto) {
  const t = texto.replace(/−/g, '-').replace(/·/g, '*').replace(/:/g, '/').replace(/(\([^()]*\)|\d+)\^(\d+)/g, 'Math.pow($1,$2)');
  return Function(`"use strict"; return (${t});`)();
}
const signo = n => (n < 0 ? -1 : 1);

/** Índices de las líneas falsas: su valor no es el de la anterior. */
const falsas = lineas => lineas.map((l, i) => (i > 0 && valor(l) !== valor(lineas[i - 1]) ? i : -1)).filter(i => i >= 0);

/** El valor de la línea mala, calculado a mano por plantilla (independiente de ERRORES_TIPICOS). */
const MAL = {
  'regla-signos-en-suma': ([a, b, c]) => -a - b + c,
  'suma-valores-absolutos': ([a, b, c]) => signo(Math.abs(a) >= Math.abs(b) ? a : b) * (Math.abs(a) + Math.abs(b)) + c,
  'olvida-el-signo': ([a, b, c]) => -(a + b) + c,
  'signo-del-primero': ([a, b, c]) => signo(a) * Math.abs(a + b) + c,
  'restar-negativo': ([a, b, c]) => a - Math.abs(b) + c,
  'sumar-negativo': ([a, b, c]) => a + Math.abs(b) + c,
  'opuesto-del-opuesto': ([a, c]) => -a + c,
  'menos-solo-al-primero': ([a, b, c]) => a - b + c,
  'mismo-signo-dos-veces': ([a, p, q]) => a + p * q,
  'signo-del-mayor-producto': ([a, b, c]) => signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a * b) + c,
  'signo-del-mayor-cociente': ([a, b, c]) => signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a / b) + c,
  'potencia-par-negativa': ([b, n, c]) => -(Math.abs(b) ** n) + c,
  'potencia-impar-positiva': ([b, n, c]) => Math.abs(b) ** n + c,
  'potencia-positiva-negativa': ([b, n, c]) => -(b ** n) + c,
  'base-por-exponente': ([b, n, c]) => b * n + c,
  'menos-en-la-base': ([a, n, c]) => a ** n + c,
  'signos-antes-de-la-potencia': ([b, n, c]) => Math.abs(b) ** n + c,
  'derecha-a-izquierda': ([a, b, c]) => a - (b + c),
  'sin-jerarquia': ([a, b, c, s]) => (a + s * b) * c,
};

test('textos de la lógica: evaluador propio y evaluador de la base coinciden en las líneas', () => {
  for (const item of [...generar(L.generarDonde), ...generar(L.generarSiNo, 3)].slice(0, 2000)) {
    for (const l of item.lineas) assert.equal(valor(l), evaluar(l), l);
  }
});

test('hay una plantilla por cada error del banco y cada una sale en grupo', () => {
  assert.equal(L.PLANTILLAS.length, 19);
  for (const p of L.PLANTILLAS) {
    assert.ok(ERRORES_TIPICOS[p.error], p.error);
    assert.ok(L.GRUPO_DE[p.error], `${p.error} sin grupo`);
    assert.ok(MAL[p.error], `${p.error} sin comprobación a mano`);
    assert.equal(p.id, p.error);
  }
  const enGrupos = Object.values(L.GRUPOS).flat();
  assert.equal(new Set(enGrupos).size, enGrupos.length, 'un error en dos grupos');
  assert.deepEqual([...enGrupos].sort(), L.PLANTILLAS.map(p => p.error).sort());
  for (const v of L.VALIDAS) assert.ok(ERRORES_TIPICOS[v.parecido], `${v.id}: parecido ${v.parecido}`);
});

test('ejercicio 1: el cálculo tiene exactamente una línea falsa, y es la marcada', () => {
  const items = generar(L.generarDonde);
  const posiciones = new Set();
  const vistos = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'donde');
    assert.ok(item.lineas.length === 3 || item.lineas.length === 4, item.lineas.join(' | '));
    assert.deepEqual(falsas(item.lineas), [item.falsa], item.lineas.join(' | '));
    assert.equal(item.solucion, item.falsa);
    assert.deepEqual(item.opciones, item.lineas.map((_, i) => i));
    assert.ok(item.falsa === 1 || item.falsa === 2);
    posiciones.add(item.falsa);
    vistos.add(item.plantilla);
    // La última línea es un número y sigue a la línea mala.
    assert.match(item.lineas.at(-1), /^−?\d+$/);
  }
  assert.deepEqual([...posiciones].sort(), [1, 2], 'el error no puede estar siempre en la misma línea');
  assert.equal(vistos.size, L.PLANTILLAS.length, 'todas las plantillas salen');
});

test('ejercicio 1: la línea mala vale lo que dice el error típico y la corrección vale lo de la línea anterior', () => {
  for (const item of generar(L.generarDonde, 29)) {
    const plantilla = L.PLANTILLA_POR_ID[item.plantilla];
    assert.equal(valor(item.lineas[item.falsa]), MAL[item.error](item.params), `${item.error}: ${item.lineas.join(' | ')}`);
    assert.equal(valor(plantilla.corregida(item.params)), valor(item.lineas[item.falsa - 1]), `${item.error}: corregida`);
    assert.notEqual(valor(plantilla.corregida(item.params)), valor(item.lineas[item.falsa]));
  }
});

test('ejercicio 2: tres errores distintos, el del ítem y dos de otro grupo', () => {
  const items = generar(L.generarCual);
  for (const item of items) {
    assert.equal(item.tipo, 'cual');
    assert.equal(item.opciones.length, 3);
    assert.equal(new Set(item.opciones).size, 3);
    assert.ok(item.opciones.includes(item.solucion));
    assert.equal(item.solucion, item.error);
    assert.deepEqual(falsas(item.lineas), [item.falsa]);
    for (const id of item.opciones) {
      assert.ok(ERRORES_TIPICOS[id], id);
      if (id !== item.error) assert.notEqual(L.GRUPO_DE[id], L.GRUPO_DE[item.error], `${id} frente a ${item.error}`);
    }
    // Los nombres son frases distintas, en los dos idiomas.
    for (const idioma of ['es', 'en']) {
      assert.equal(new Set(item.opciones.map(id => ERRORES_TIPICOS[id].nombre[idioma])).size, 3);
    }
  }
  // La respuesta buena sale en las tres posiciones.
  for (const i of [0, 1, 2]) assert.ok(items.some(it => it.opciones[i] === it.solucion), `posición ${i}`);
});

test('ejercicio 2: ninguna de las otras dos opciones describe también el cálculo (grupos, y casos que la ficha cita)', () => {
  // −2 − 3 = 5 no se explica con «sumar un negativo» ni «restar un negativo»: son del grupo de los paréntesis con negativos.
  for (const id of ['sumar-negativo', 'restar-negativo']) assert.notEqual(L.GRUPO_DE[id], L.GRUPO_DE['regla-signos-en-suma']);
  // 3 − (−2) = 3 − 2 es también «olvidar que el opuesto de un negativo es positivo»: mismo grupo.
  assert.equal(L.GRUPO_DE['restar-negativo'], L.GRUPO_DE['opuesto-del-opuesto']);
  // Pares que dan el mismo valor con otros números (ver ENTREGA de la 79): mismo grupo, nunca enfrentados.
  assert.equal(L.GRUPO_DE['olvida-el-signo'], L.GRUPO_DE['signo-del-primero']);
  assert.equal(L.GRUPO_DE['menos-solo-al-primero'], L.GRUPO_DE['restar-negativo']);
  // −3² = 9 y −(−3)² = 9 se explican de forma parecida: mismo grupo.
  assert.equal(L.GRUPO_DE['menos-en-la-base'], L.GRUPO_DE['signos-antes-de-la-potencia']);
  // El signo del mayor en un producto y «el signo del primero» en una suma: mismo grupo.
  assert.equal(L.GRUPO_DE['signo-del-mayor-producto'], L.GRUPO_DE['signo-del-primero']);
});

test('ejercicio 3: mitad y mitad; los «está bien» tienen todas las líneas verdaderas y los «error», exactamente una falsa', () => {
  const items = generar(L.generarSiNo);
  let bien = 0;
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'si-no');
    assert.deepEqual(item.opciones, ['bien', 'error']);
    if (item.solucion === 'bien') {
      bien++;
      assert.equal(item.falsa, null);
      assert.equal(item.error, null);
      assert.deepEqual(falsas(item.lineas), [], item.lineas.join(' | '));
      assert.ok(L.VALIDA_POR_ID[item.plantilla]);
    } else {
      assert.equal(item.solucion, 'error');
      assert.deepEqual(falsas(item.lineas), [item.falsa], item.lineas.join(' | '));
    }
    vistas.add(item.plantilla);
  }
  assert.ok(bien > N * 0.46 && bien < N * 0.54, `bien: ${bien}`);
  assert.equal(vistas.size, L.PLANTILLAS.length + L.VALIDAS.length);
});

test('todos los ítems: lo que ve el alumno respeta las reglas de la unidad', () => {
  const items = [...generar(L.generarDonde, 41), ...generar(L.generarCual, 42), ...generar(L.generarSiNo, 43)];
  for (const item of items) {
    for (const l of item.lineas) {
      // Solo cifras, + − · : ( ) ^ y espacios; el menos es U+2212; nada de letras, decimales ni corchetes.
      assert.match(l, /^[\d\s+−·:()^]+$/, l);
      assert.doesNotMatch(l, /^\+|\(\+|--|−\s*−|\+\s*−|·\s*−|:\s*−/, `signos seguidos o + al empezar: ${l}`);
      // Ningún número fuera de lo creíble para un ejercicio de papel: hasta 300 en valor absoluto.
      for (const n of l.match(/\d+/g)) assert.ok(Number(n) <= 300, l);
      assert.ok(Math.abs(valor(l)) <= 300, l);
    }
  }
});

test('todos los textos, en los dos idiomas: sin ×, sin guion como menos, sin (+', () => {
  const textos = [];
  const recoger = t => { for (const idioma of ['es', 'en']) textos.push(typeof t[idioma] === 'function' ? t[idioma](3) : t[idioma]); };
  for (const grupo of ['nombre', 'detalle', 'instruccion', 'introduccion']) for (const t of Object.values(TX[grupo])) recoger(t);
  for (const clave of ['bien', 'error', 'esta_bien', 'la_linea_es', 'correcta', 'se_llama']) recoger(TX[clave]);
  for (const e of Object.values(ERRORES_TIPICOS)) recoger(e.nombre);
  const rng = crearRng(5);
  for (const p of L.PLANTILLAS) for (let i = 0; i < 300; i++) {
    const params = L.PLANTILLA_POR_ID[p.id].numeros(rng);
    if (params) { recoger(p.porque(params)); textos.push(p.corregida(params)); }
  }
  for (const v of L.VALIDAS) for (let i = 0; i < 300; i++) {
    const params = v.numeros(rng);
    if (params) {
      const t = v.porque(params);
      recoger(t);
      assert.match(t.es, /^Está bien/);
      assert.match(t.en, /^It is right/);
    }
  }
  for (const t of textos) {
    assert.ok(t && t.length > 3);
    assert.doesNotMatch(t, /×/, t);
    assert.doesNotMatch(t, /\(\+/, t);
    assert.doesNotMatch(t, /(^|[\s(])-\d/, `guion como menos: ${t}`);
    assert.doesNotMatch(t, /\d-\d|\s-\s/, `guion entre números: ${t}`);
  }
});

test('ejercicio 3: las parejas válidas explican con los números del ítem', () => {
  for (const item of generar(L.generarSiNo, 77)) {
    if (item.solucion !== 'bien') continue;
    const texto = L.VALIDA_POR_ID[item.plantilla].porque(item.params);
    assert.ok(/\d/.test(texto.es) && /\d/.test(texto.en), item.plantilla);
    // El texto cita algún número de los desarrollos (los del paso que explica), en los dos idiomas.
    const citados = item.lineas.slice(1).flatMap(l => l.match(/\d+/g));
    assert.ok(citados.some(v => texto.es.includes(v) && texto.en.includes(v)), `${item.plantilla}: ${texto.es} / ${item.lineas.join(' | ')}`);
  }
});

test('claveItem distingue los ítems y el catálogo declara 3 ejercicios', () => {
  const [a, b] = generar(L.generarDonde, 9);
  assert.equal(L.claveItem(a), L.claveItem(a));
  assert.notEqual(L.claveItem(a), L.claveItem({ ...b, params: [...b.params, 1] }));
  assert.equal(CATALOGO.find(f => f.slug === 'errores3').nEjercicios, 3);
});
