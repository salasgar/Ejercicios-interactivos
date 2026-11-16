// Retos con puntos extra (tarea 205 del reparto PU2): lo que añade al contador
// (`sumar`, `sinVidas`), al contrato de la base (`parametrosDe`, `validarPractica`,
// `api.sumar`, `api.intentoFallido`) y al editor de tareas del panel (el reto se
// pone y se quita, también en una tarea que ya ha empezado). El modelo de tareas
// (`reto`, `puntosExtra`) se prueba en tests/practicas-semana.test.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ejercicioNuevo, anotar, sumar, queHaPasado, migrarProgreso } from '../practicas/_comun/contador.js';
import { validarPractica, parametrosDe } from '../practicas/_comun/base.js';
import { fusionarProgreso } from '../practicas/_comun/nube.js';
import { T } from '../practicas/_comun/textos.js';
import { tareaDeFormulario, conservarSiBloqueada, avisosDeTarea, resumenTarea } from '../practicas/profesor-tareas.js';

// --- Contador ------------------------------------------------------------------------------

test('sumar: k puntos de golpe, un solo acierto, sin racha; termina al llegar al objetivo', () => {
  let ej = ejercicioNuevo(54);
  ej = sumar(ej, 6, 70);
  assert.deepEqual([ej.puntos, ej.aciertos, ej.racha, ej.terminado, ej.fallos, ej.vidas], [6, 1, 0, false, 0, 5]);
  const antes = ej;
  ej = sumar(ej, 14, 71);
  assert.deepEqual([ej.puntos, ej.aciertos, ej.racha], [20, 2, 0]);
  const cambio = queHaPasado(antes, ej);
  assert.deepEqual([cambio.ganados, cambio.extra], [14, false], 'los puntos de golpe no son el «extra» de la racha');
  ej = sumar(ej, 15, 72);
  ej = sumar(ej, 19, 73);
  assert.deepEqual([ej.puntos, ej.terminado, ej.dia], [54, true, 73], '6 + 14 + 15 + 19 = 54: los cuatro niveles de la 206');
  assert.equal(sumar(ej, 5, 80), ej, 'terminado ya no cambia');
  // Pasarse del objetivo lo deja en el objetivo.
  assert.deepEqual([sumar(ejercicioNuevo(10), 25, 5).puntos, sumar(ejercicioNuevo(10), 25, 5).terminado], [10, true]);
  // Un k raro no suma nada (pero cuenta el ítem).
  assert.equal(sumar(ejercicioNuevo(10), -3).puntos, 0);
  assert.equal(sumar(ejercicioNuevo(10), 2.9).puntos, 2);
  assert.equal(sumar(ejercicioNuevo(10), 3).dia, 0, 'sin terminar, el día no se apunta');
});

test('sumar: el entrante no se toca y una racha en curso sigue igual', () => {
  let ej = ejercicioNuevo(20);
  for (let i = 0; i < 3; i++) ej = anotar(ej, true, 1);
  const copia = { ...ej };
  const sig = sumar(ej, 4, 2);
  assert.deepEqual(ej, copia);
  assert.deepEqual([sig.racha, sig.puntos, sig.aciertos], [3, 7, 4]);
});

test('sinVidas: 20 fallos no quitan vidas ni puntos ni reinician; se cuentan y cortan la racha', () => {
  let ej = sumar(ejercicioNuevo(54), 6, 1);
  ej = anotar(ej, true, 1, { sinVidas: true });
  assert.deepEqual([ej.puntos, ej.racha], [7, 1]);
  for (let i = 0; i < 20; i++) ej = anotar(ej, false, 2, { sinVidas: true, penalizacion: 3, vidas: 2 });
  assert.deepEqual([ej.puntos, ej.vidas, ej.reinicios, ej.fallos, ej.racha, ej.aciertos, ej.terminado], [7, 5, 0, 20, 0, 2, false]);
  // Las pistas siguen sumándose a los fallos.
  assert.equal(anotar(ej, false, 2, { sinVidas: true, pistas: 2 }).fallos, 23);
  // Sin `sinVidas`, lo de siempre.
  const normal = anotar(ejercicioNuevo(), false, 1);
  assert.deepEqual([normal.vidas, normal.fallos], [4, 1]);
});

test('sinVidas y sumar: la fusión de la nube y la migración siguen valiendo', () => {
  const a = sumar(ejercicioNuevo(54), 20, 1);
  const b = anotar(sumar(ejercicioNuevo(54), 6, 1), false, 1, { sinVidas: true });
  const [f] = fusionarProgreso([a], [b]);
  assert.deepEqual([f.puntos, f.fallos], [20, 1], 'gana el de más puntos; los fallos, el máximo');
  // Un progreso guardado antes del cambio (sin el campo) se lee igual.
  const viejo = { puntos: 3, objetivo: 10, vidas: 4, racha: 1, aciertos: 3, fallos: 1, rapidos: 0, reinicios: 0, terminado: false, dia: 0, repeticiones: 0 };
  assert.equal(migrarProgreso(viejo, { objetivo: 10, vidas: 5 }), viejo);
  assert.deepEqual(migrarProgreso(a, { objetivo: 54, vidas: 5 }), a);
});

// --- Contrato de la base ----------------------------------------------------------------------

const ejercicio = extra => ({ nombre: { es: 'a', en: 'a' }, detalle: { es: 'b', en: 'b' }, generar: () => ({}), montar: () => {}, ...extra });

test('base: sinVidas es opcional y booleano; parametrosDe solo lo lleva si es true', () => {
  assert.deepEqual(parametrosDe({}), { objetivo: 10, penalizacion: 1, vidas: 5 });
  assert.deepEqual(parametrosDe({ objetivo: 54, sinVidas: true }), { objetivo: 54, penalizacion: 1, vidas: 5, sinVidas: true });
  assert.deepEqual(parametrosDe({ sinVidas: false }), { objetivo: 10, penalizacion: 1, vidas: 5 });
  assert.ok(validarPractica({ slug: 'plantilla', ejercicios: [ejercicio({ sinVidas: true, objetivo: 54 }), ejercicio()] }));
  assert.throws(() => validarPractica({ slug: 'plantilla', ejercicios: [ejercicio({ sinVidas: 'sí' }), ejercicio()] }), /«sinVidas» tiene que ser true o false/);
});

test('base: api.sumar e api.intentoFallido están en la api, usan el contador y están documentados en la plantilla', () => {
  const base = readFileSync(new URL('../practicas/_comun/base.js', import.meta.url), 'utf8');
  assert.match(base, /sumar: \(k, \{ html = '', espera = 'boton' \} = \{\}\) =>/);
  assert.match(base, /intentoFallido: \(\{ html = '', error, respuesta \} = \{\}\) =>/);
  assert.match(base, /actual\.sesion = sumar\(actual\.sesion, k, diaDe\(new Date\(\)\)\)/);
  assert.match(base, /sinVidas: p\.sinVidas/);
  const plantilla = readFileSync(new URL('../practicas/plantilla/practica.js', import.meta.url), 'utf8');
  for (const c of ['api.sumar(k', 'api.intentoFallido(', 'sinVidas']) assert.ok(plantilla.includes(c), c);
  for (const idioma of ['es', 'en']) {
    const t = T[idioma];
    assert.match(t.menu_regla_sin_vidas(54), /54/);
    assert.match(t.regla_fila_sin_vidas(54), /54/);
    assert.match(t.suma_puntos(6), /\+6/);
    assert.equal(typeof t.sin_penalizacion, 'string');
  }
});

// --- Editor de tareas del panel -----------------------------------------------------------------

const marcas = [
  { slug: 'semaforo', n: 1, tipo: 'estrella' }, { slug: 'recta', n: 1, tipo: 'elegir' },
  { slug: 'venn', n: 1, tipo: 'reto' }, { slug: 'venn', n: 2, tipo: '' },
];
const formulario = m => ({ tituloEs: 'a', tituloEn: 'b', unidad: 2, desde: '', hasta: '', asignada: false, nElegir: 1, marcas: m });

test('editor: el reto se marca como los demás; sin reto, la tarea no lleva el campo', () => {
  const t = tareaDeFormulario({ id: 4 }, formulario(marcas));
  assert.deepEqual([t.estrella, t.elegir, t.reto], [[['semaforo', 1]], [['recta', 1]], [['venn', 1]]]);
  const sin = tareaDeFormulario({ id: 4 }, formulario(marcas.map(m => (m.tipo === 'reto' ? { ...m, tipo: '' } : m))));
  assert.equal('reto' in sin, false);
  assert.match(resumenTarea(t), /1 ★ \+ 1 de 1 · reto 1/);
  assert.doesNotMatch(resumenTarea(sin), /reto/);
});

test('editor: en una tarea que ya ha empezado, el reto se puede poner y quitar; los ★ y los de elegir, no', () => {
  const original = { id: 4, unidad: 2, titulo: { es: 'a', en: 'b' }, desde: '2026-10-01', estrella: [['semaforo', 1]], elegir: [['recta', 1]], nElegir: 1 };
  const editada = { ...original, estrella: [['semaforo', 2]], elegir: [], nElegir: 0, reto: [['venn', 1]] };
  const r = conservarSiBloqueada(original, editada, '2026-10-05');
  assert.deepEqual([r.estrella, r.elegir, r.nElegir, r.reto], [[['semaforo', 1]], [['recta', 1]], 1, [['venn', 1]]]);
  const quitado = conservarSiBloqueada({ ...original, reto: [['venn', 1]] }, { ...original }, '2026-10-05');
  assert.equal(quitado.reto, undefined);
  // Un reto que repite un ★ no se puede guardar.
  const config = { unidades: [], tareas: [original] };
  assert.ok(avisosDeTarea(config, { ...original, reto: [['semaforo', 1]] }).some(a => /semaforo\/1 está repetido/.test(a)));
  assert.deepEqual(avisosDeTarea(config, { ...original, reto: [['venn', 1]] }), []);
});

test('editor: un reto de otra unidad se puede añadir y, una vez en la tarea, sale en el formulario', async () => {
  const { ejerciciosDelFormulario, retosDeOtraUnidad, ejerciciosDeUnidad } = await import('../practicas/profesor-tareas.js');
  const u3 = { id: 20, unidad: 3, titulo: { es: 'a', en: 'b' }, estrella: [], elegir: [], nElegir: 0 };
  const propios = ejerciciosDeUnidad(3).length;
  assert.equal(ejerciciosDelFormulario(u3).length, propios, 'sin nada de otra unidad, solo los de la unidad');
  const venn = retosDeOtraUnidad(u3).find(e => e.slug === 'venn' && e.n === 1);
  assert.ok(venn, 'una práctica publicada de la U2 se ofrece como reto en una tarea de la U3');
  const deLaUnidad = new Set(ejerciciosDeUnidad(3).map(e => `${e.slug}/${e.n}`));
  assert.ok(retosDeOtraUnidad(u3).every(e => e.practica.disponible && !deLaUnidad.has(`${e.slug}/${e.n}`)), 'solo publicadas y que no estén ya en la tabla');
  assert.ok(!retosDeOtraUnidad(u3).some(e => e.slug === 'plantilla'), 'la plantilla no');
  const conReto = { ...u3, reto: [['venn', 1]] };
  const filas = ejerciciosDelFormulario(conReto);
  assert.equal(filas.length, propios + 1);
  assert.deepEqual([filas.at(-1).slug, filas.at(-1).n, filas.at(-1).otraUnidad], ['venn', 1, true]);
  assert.ok(!retosDeOtraUnidad(conReto).some(e => e.slug === 'venn' && e.n === 1), 'lo que ya está no se ofrece otra vez');
  // Al guardar se conserva: las marcas salen de las filas del formulario.
  const marcasDe = t => ejerciciosDelFormulario(t).map(e => ({ slug: e.slug, n: e.n, tipo: (t.reto ?? []).some(([s, k]) => s === e.slug && k === e.n) ? 'reto' : '' }));
  assert.deepEqual(tareaDeFormulario(conReto, formulario(marcasDe(conReto))).reto, [['venn', 1]]);
});
