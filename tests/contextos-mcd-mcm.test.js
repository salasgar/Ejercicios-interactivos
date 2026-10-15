// Banco de contextos de los problemas de m.c.d. y m.c.m. (tarea 25 del reparto
// de la unidad 2): que haya bastantes y variados, que cada uno dé siempre un
// problema válido y que los generadores de problemas los usen todos.

import test from 'node:test';
import assert from 'node:assert/strict';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng, construirOpciones, mcd, mcm } from '../src/ejercicios/index.js';
import { SUBTIPOS, problemaDeContexto, claveDeContexto } from '../src/ejercicios/divisibilidad.js';
import { CONTEXTOS, ESQUEMAS } from '../src/ejercicios/contextos_mcd_mcm.js';

const divisibilidad = TIPOS.divisibilidad;
const SEMILLAS = 400;
const POR_CLAVE = new Map(CONTEXTOS.map(c => [claveDeContexto(c), c]));

test('banco: al menos 40 contextos, 5 o más por esquema, y como mucho la mitad de la hoja', () => {
  assert.ok(CONTEXTOS.length >= 40, `solo ${CONTEXTOS.length} contextos`);
  for (const esquema of Object.keys(ESQUEMAS)) {
    const n = CONTEXTOS.filter(c => c.esquema === esquema).length;
    assert.ok(n >= 5, `${esquema}: solo ${n} contextos`);
  }
  const deFuera = CONTEXTOS.filter(c => /^(hoja|examen)/.test(c.origen)).length;
  assert.ok(deFuera <= CONTEXTOS.length / 2, `${deFuera} de ${CONTEXTOS.length} vienen de la hoja o de exámenes`);
});

test('banco: cada contexto declara todo lo que le toca', () => {
  const ids = CONTEXTOS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length, 'ids repetidos');
  for (const c of CONTEXTOS) {
    assert.match(c.id, /^[a-z_]+$/, `id raro: ${c.id}`);
    assert.ok(ESQUEMAS[c.esquema], `${c.id}: esquema desconocido ${c.esquema}`);
    assert.equal(c.pide, ESQUEMAS[c.esquema].pide, `${c.id}: pide ${c.pide} y su esquema ${ESQUEMAS[c.esquema].pide}`);
    assert.ok(c.unidad?.es && c.unidad?.en, `${c.id}: sin unidad bilingüe`);
    assert.match(c.origen, /^(hoja \d+|examen 2024-25|app|nuevo)$/, `${c.id}: origen raro`);
    const { g, cof, max } = c.rango;
    assert.ok(Array.isArray(g) && Array.isArray(cof) && max > 0, `${c.id}: rango incompleto`);
  }
});

test('banco: textos bilingües con los dos datos, inglés con su aclaración y nada que no se haya dado', () => {
  for (const c of CONTEXTOS) {
    for (const idioma of ['es', 'en']) {
      const t = c[idioma];
      assert.ok(t && t.includes('{a}') && t.includes('{b}'), `${c.id} (${idioma}): faltan los datos`);
      assert.ok(t.indexOf('{a}') < t.indexOf('{b}'), `${c.id} (${idioma}): {b} antes que {a}`);
      assert.ok(!/×|\\times|€|\$|\d[.,]\d|%/.test(t), `${c.id} (${idioma}): producto con aspa, dinero, decimales o porcentajes`);
      assert.ok(!/HCF|GCF|coprime|primos entre sí|\bfactor\b/i.test(t), `${c.id} (${idioma}): terminología que no es la de clase`);
    }
    // La palabra no matemática que decide la respuesta, aclarada entre paréntesis al final.
    assert.match(c.en, /\([^()]* = [^()]*\)$/, `${c.id}: el inglés no lleva la aclaración «(palabra = palabra)» al final`);
    // Sin nombres propios: ninguna mayúscula salvo al empezar frase.
    const sinInicios = c.es.replace(/(^|[.?!]\s+|¿|¡)[A-ZÁÉÍÓÚ]/g, '');
    assert.ok(!/[A-ZÁÉÍÓÚÑ]/.test(sinInicios.replace(/Tecnología/g, '')), `${c.id} (es): ¿un nombre propio?`);
  }
});

test('banco: cada contexto da siempre un problema válido, dentro de su rango y con una sola respuesta buena', () => {
  for (const c of CONTEXTOS) {
    const { min = 2, max, maxMcm = Infinity, ordenados, evitar = [] } = c.rango;
    const pares = new Set();
    for (let s = 1; s <= SEMILLAS; s++) {
      const rng = crearRng(s);
      const p = problemaDeContexto(rng, c);
      assert.ok(p, `${c.id}, semilla ${s}: no salen los datos`);
      const { a, b } = p.texto.params;
      pares.add(`${a},${b}`);
      assert.equal(p.texto.clave, claveDeContexto(c));
      assert.ok(a >= min && b >= min && a <= max && b <= max, `${c.id}: datos ${a}, ${b} fuera del rango`);
      assert.ok(a !== b && a % b !== 0 && b % a !== 0, `${c.id}: ${a} y ${b}, uno múltiplo del otro`);
      if (ordenados) assert.ok(a > b, `${c.id}: el largo ${a} no es mayor que el ancho ${b}`);
      assert.ok(!evitar.some(([x, y]) => (a === x && b === y) || (a === y && b === x)), `${c.id}: salen los números de la hoja (${a}, ${b})`);
      const g = mcd(a, b), m = mcm(a, b);
      assert.ok(g >= 2, `${c.id}: ${a} y ${b} sin divisores comunes (el m.c.m. sería el producto)`);
      assert.ok(m <= maxMcm, `${c.id}: m.c.m. ${m} por encima del tope`);
      const buena = c.pide === 'mcd' ? g : m;
      assert.equal(p.correcta.clave, buena, `${c.id}: la correcta no es el ${c.pide}`);
      // Distractores inequívocamente falsos: en un m.c.d., o no divide a los dos datos
      // o no es el mayor; en un m.c.m., o no es múltiplo de los dos o no es el menor.
      for (const d of p.distractores) {
        const v = d.clave;
        const valida = c.pide === 'mcd' ? a % v === 0 && b % v === 0 && v >= g : v % a === 0 && v % b === 0 && v <= m;
        assert.ok(!valida, `${c.id}: el distractor ${v} (${d.error.id}) también es respuesta buena con ${a} y ${b}`);
      }
      const opciones = construirOpciones(rng, p.correcta, p.distractores);
      assert.ok(opciones, `${c.id}, semilla ${s}: no salen 4 opciones distintas`);
      assert.equal(new Set(opciones.map(o => o.tex)).size, 4);
      assert.equal(opciones.filter(o => o.correcta).length, 1);
    }
    assert.ok(pares.size >= 10, `${c.id}: solo ${pares.size} parejas de datos distintas`);
  }
});

test('generadores: cada subtipo de problema usa todos los contextos de su esquema', () => {
  const ESQUEMA_DE = {
    problema_coincidencia: 'coincidencia', problema_reparto: 'grupos', problema_cortar: 'cortar',
    problema_baldosas: 'baldosas', problema_menor_cantidad: 'menor_cantidad', problema_paquetes: 'paquetes',
  };
  for (const [id, esquema] of Object.entries(ESQUEMA_DE)) {
    const subtipo = SUBTIPOS.find(s => s.id === id);
    assert.ok(subtipo, `falta el subtipo ${id}`);
    const vistos = new Set();
    for (let s = 1; s <= SEMILLAS; s++) {
      const p = subtipo.generar(crearRng(s));
      if (!p) continue;
      const c = POR_CLAVE.get(p.texto.clave);
      assert.ok(c, `${id}: clave sin contexto ${p.texto.clave}`);
      assert.equal(c.esquema, esquema, `${id}: sale un contexto de ${c.esquema}`);
      vistos.add(c.id);
    }
    const todos = CONTEXTOS.filter(c => c.esquema === esquema).map(c => c.id);
    assert.deepEqual([...vistos].sort(), todos.sort(), `${id}: no salen todos sus contextos`);
  }
});

test('generadores: la práctica de divisibilidad saca los seis esquemas y es reproducible', () => {
  const esquemas = new Set();
  for (let s = 1; s <= 3000; s++) {
    const q = divisibilidad.generar(crearRng(s));
    const c = POR_CLAVE.get(q.texto.clave);
    if (c) {
      esquemas.add(c.esquema);
      assert.deepEqual(divisibilidad.generar(crearRng(s)).texto, q.texto, `semilla ${s}: no es reproducible`);
      assert.ok(divisibilidad.preguntas[q.texto.clave]?.es && divisibilidad.preguntas[q.texto.clave]?.en);
    }
  }
  assert.deepEqual([...esquemas].sort(), Object.keys(ESQUEMAS).sort());
});

test('generadores: en una tarea con muchos problemas seguidos, el contexto va cambiando', () => {
  // El motor genera cada ejercicio sin memoria de los anteriores, así que no se
  // puede garantizar que no se repita; sí que en diez problemas seguidos de un
  // mismo esquema salgan varios contextos distintos.
  for (const subtipo of SUBTIPOS.filter(s => s.id.startsWith('problema_'))) {
    for (let s = 1; s <= 50; s++) {
      const rng = crearRng(s);
      const vistos = new Set();
      for (let i = 0; i < 10; i++) vistos.add(subtipo.generar(rng)?.texto.clave);
      assert.ok(vistos.size >= 3, `${subtipo.id}, semilla ${s}: solo ${vistos.size} contextos en 10 problemas`);
    }
  }
});

test('los enunciados de antes del banco siguen ahí para las tareas ya guardadas', () => {
  for (const clave of ['coincidencia', 'reparto']) {
    assert.ok(divisibilidad.preguntas[clave]?.es && divisibilidad.preguntas[clave]?.en, clave);
  }
});
