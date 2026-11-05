// Niveles adaptables (practicas/_comun/nivel.js, tarea 134): los umbrales uno a uno,
// el tope por vidas, `?nivel=` solo sin código, y `elegirDeNivel` por fuerza bruta
// (nunca por encima del nivel del alumno; 70 % del actual cuando hay de debajo).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NIVELES, nivelDe, nivelForzado, hayCodigoEnLaPagina, elegirDeNivel, etiquetaNivel, TX_NIVEL } from '../practicas/_comun/nivel.js';
import { OBJETIVO, VIDAS } from '../practicas/_comun/contador.js';
import { crearRng } from '../practicas/_comun/rng.js';

test('nivel: tres niveles, y los umbrales cuentan con el objetivo y las vidas de siempre', () => {
  assert.equal(NIVELES, 3);
  assert.equal(OBJETIVO, 10, 'si cambia el objetivo, revisa los ejemplos de nivel.js y del doc');
  assert.equal(VIDAS, 5, 'si cambian las vidas, revisa el tope por vidas de nivel.js y del doc');
});

test('nivel: por puntos, 0-2 → 1, 3-6 → 2, 7-10 → 3 (con todas las vidas)', () => {
  const esperado = { 0: 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 3 };
  for (const [puntos, nivel] of Object.entries(esperado)) {
    assert.equal(nivelDe({ puntos: Number(puntos), vidas: 5 }), nivel, `${puntos} puntos`);
  }
});

test('nivel: tope por vidas, 5 o 4 sin tope, 3 → como mucho 2, 2 o menos → 1', () => {
  const tope = { 5: 3, 4: 3, 3: 2, 2: 1, 1: 1, 0: 1 };
  for (const [vidas, maximo] of Object.entries(tope)) {
    assert.equal(nivelDe({ puntos: 9, vidas: Number(vidas) }), maximo, `9 puntos y ${vidas} vidas`);
    assert.equal(nivelDe({ puntos: 4, vidas: Number(vidas) }), Math.min(2, maximo), `4 puntos y ${vidas} vidas`);
    assert.equal(nivelDe({ puntos: 0, vidas: Number(vidas) }), 1, `0 puntos y ${vidas} vidas`);
  }
  // El nivel 3 lo alcanza quien llega a 7 puntos habiendo fallado una vez como mucho.
  assert.equal(nivelDe({ puntos: 7, vidas: 4 }), 3);
  assert.equal(nivelDe({ puntos: 7, vidas: 3 }), 2);
});

test('nivel: con otro objetivo, los umbrales son el 30 % y el 70 %; con otras vidas, se cuentan las perdidas', () => {
  // Objetivo 20: 0-5 → 1, 6-13 → 2, 14-20 → 3.
  const con20 = p => nivelDe({ puntos: p, vidas: 5 }, { objetivo: 20 });
  assert.deepEqual([0, 5, 6, 13, 14, 20].map(con20), [1, 1, 2, 2, 3, 3]);
  // Objetivo 5: 0-1 → 1, 2-3 → 2, 4-5 → 3 (1,5 y 3,5 no son enteros: el borde va por arriba).
  const con5 = p => nivelDe({ puntos: p, vidas: 5 }, { objetivo: 5 });
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(con5), [1, 1, 2, 2, 3, 3]);
  // Un ejercicio con 3 vidas empieza sin tope (no ha perdido ninguna).
  assert.equal(nivelDe({ puntos: 8, vidas: 3 }, { vidasTotales: 3 }), 3);
  assert.equal(nivelDe({ puntos: 8, vidas: 1 }, { vidasTotales: 3 }), 2);
});

test('nivel: sesión vacía, sin campos o con valores raros → nivel 1 (o lo que digan los puntos)', () => {
  assert.equal(nivelDe(undefined), 1);
  assert.equal(nivelDe(null), 1);
  assert.equal(nivelDe({}), 1);
  assert.equal(nivelDe({ puntos: -3, vidas: 5 }), 1, 'puntos negativos cuentan como 0');
  assert.equal(nivelDe({ puntos: 8 }), 3, 'sin vidas, sin tope');
  assert.equal(nivelDe({ puntos: 'ocho', vidas: 5 }), 1);
});

test('nivel: el forzado manda sobre los puntos y las vidas; uno que no es 1-3 no cuenta', () => {
  assert.equal(nivelDe({ puntos: 0, vidas: 1 }, { forzado: 3 }), 3);
  assert.equal(nivelDe({ puntos: 10, vidas: 5 }, { forzado: 1 }), 1);
  assert.equal(nivelDe({ puntos: 10, vidas: 5 }, { forzado: 7 }), 3, 'forzado 7 se ignora: mandan los puntos');
  assert.equal(nivelDe({ puntos: 0, vidas: 5 }, { forzado: null }), 1);
});

test('nivelForzado: ?nivel=1-3 sin código; con código o con otro valor, null', () => {
  assert.equal(nivelForzado('?nivel=1', false), 1);
  assert.equal(nivelForzado('?nivel=2', false), 2);
  assert.equal(nivelForzado('?nivel=3&idioma=es', false), 3);
  assert.equal(nivelForzado('?nivel=3', true), null, 'con código, un alumno no se salta los niveles');
  for (const raro of ['?nivel=7', '?nivel=0', '?nivel=abc', '?nivel=', '?nivel=2.5', '?nivel=-1', '?nivel=12', '', '?otro=2']) {
    assert.equal(nivelForzado(raro, false), null, raro);
  }
  // `?c=` en la dirección cuenta como código.
  assert.equal(hayCodigoEnLaPagina('?c=ABCD'), true);
  assert.equal(nivelForzado('?c=ABCD&nivel=3'), null);
  // Fuera del navegador no hay código recordado: sin `?c=`, se respeta el nivel.
  assert.equal(hayCodigoEnLaPagina('?nivel=3'), false);
  assert.equal(nivelForzado('?nivel=3'), 3);
});

test('nivelForzado: el código recordado en el navegador también cuenta', () => {
  const antes = globalThis.localStorage;
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => (almacen.has(k) ? almacen.get(k) : null), setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  try {
    assert.equal(nivelForzado('?nivel=2'), 2);
    almacen.set('practicas.codigo', 'ABCD');
    assert.equal(hayCodigoEnLaPagina(''), true);
    assert.equal(nivelForzado('?nivel=2'), null);
  } finally {
    if (antes === undefined) delete globalThis.localStorage; else globalThis.localStorage = antes;
  }
});

// Un banco de prueba: 20 ítems de cada nivel.
const banco = [1, 2, 3].flatMap(nivel => Array.from({ length: 20 }, (_, i) => ({ nivel, i })));
const sesionDe = { 1: { puntos: 0, vidas: 5 }, 2: { puntos: 4, vidas: 5 }, 3: { puntos: 8, vidas: 5 } };

function tirar(b, sesion, opciones, veces = 10000, semilla = 134) {
  const rng = crearRng(semilla);
  const cuenta = { 1: 0, 2: 0, 3: 0 };
  const actuales = new Set();
  for (let k = 0; k < veces; k++) {
    const r = elegirDeNivel(rng, b, sesion, opciones);
    assert.ok(b.includes(r.item));
    assert.equal(r.nivel, r.item.nivel);
    cuenta[r.item.nivel]++;
    actuales.add(r.actual);
  }
  return { cuenta, actuales: [...actuales] };
}

test('elegirDeNivel: nunca por encima del nivel del alumno; 60-80 % del actual si hay de debajo; 100 % si no', () => {
  for (const nivel of [1, 2, 3]) {
    const { cuenta, actuales } = tirar(banco, sesionDe[nivel]);
    assert.deepEqual(actuales, [nivel]);
    for (let n = nivel + 1; n <= 3; n++) assert.equal(cuenta[n], 0, `nivel ${nivel}: ningún ítem de nivel ${n}`);
    const parte = cuenta[nivel] / 10000;
    if (nivel === 1) assert.equal(parte, 1);
    else assert.ok(parte >= 0.6 && parte <= 0.8, `nivel ${nivel}: ${parte} del nivel actual`);
    // Los de debajo salen todos alguna vez (no solo el nivel inmediatamente inferior).
    for (let n = 1; n < nivel; n++) assert.ok(cuenta[n] > 0, `nivel ${nivel}: salen ítems de nivel ${n}`);
  }
});

test('elegirDeNivel: si el nivel actual no tiene ítems, baja al más alto que los tenga', () => {
  const sin3 = banco.filter(it => it.nivel !== 3);
  const r3 = tirar(sin3, sesionDe[3], {}, 3000);
  assert.deepEqual(r3.actuales, [2]);
  assert.equal(r3.cuenta[3], 0);
  const solo1y3 = banco.filter(it => it.nivel !== 2);
  const r2 = tirar(solo1y3, sesionDe[2], {}, 3000);
  assert.deepEqual(r2.actuales, [1], 'nivel 2 sin ítems de nivel 2: baja al 1, nunca sube al 3');
  assert.equal(r2.cuenta[3], 0);
  // Un banco sin nada a la altura del alumno (mal hecho) no lo deja parado: el nivel más bajo que haya.
  const solo3 = banco.filter(it => it.nivel === 3);
  assert.deepEqual(tirar(solo3, sesionDe[1], {}, 200).actuales, [3]);
});

test('elegirDeNivel: el forzado y otro `nivelDe` del ítem', () => {
  const r = tirar(banco, sesionDe[1], { forzado: 3 }, 3000);
  assert.deepEqual(r.actuales, [3]);
  assert.ok(r.cuenta[3] > 0);
  const otro = banco.map(({ nivel, i }) => ({ n: nivel, i }));
  const rng = crearRng(1);
  for (let k = 0; k < 2000; k++) assert.ok(elegirDeNivel(rng, otro, sesionDe[2], { nivelDe: it => it.n }).item.n <= 2);
  assert.throws(() => elegirDeNivel(crearRng(1), [], sesionDe[1]), /vacío/);
  assert.throws(() => elegirDeNivel(crearRng(1), [{ nivel: 5 }], sesionDe[1]), /nivel/);
});

test('etiquetaNivel: «Nivel 2 · ●●○», escapa, y nada si el nivel no es 1-3', () => {
  assert.match(etiquetaNivel(2), /Nivel 2 · <span aria-hidden="true">●●○<\/span>/);
  assert.match(etiquetaNivel(1), /●○○/);
  assert.match(etiquetaNivel(3), /●●●/);
  assert.match(etiquetaNivel(3), /aria-label="Nivel 3 de 3"/);
  for (const raro of [0, 4, 'x', null, undefined, 2.5]) assert.equal(etiquetaNivel(raro), '', String(raro));
  // `esc` se aplica a los textos: el de la api, o el propio.
  const marcado = etiquetaNivel(2, t => `[${t}]`);
  assert.match(marcado, /\[Nivel 2\]/);
  assert.match(marcado, /aria-label="\[Nivel 2 de 3\]"/);
  assert.equal(TX_NIVEL.sube(3), '¡Subes al nivel 3!');
  assert.equal(TX_NIVEL.nivel(1), 'Nivel 1');
});
