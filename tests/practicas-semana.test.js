// Tareas de la semana (practicas/semana.html, practicas/_comun/tareas.js): los
// datos frente al catálogo y frente a lo que declara cada práctica, el estado
// («cumplida») en los casos límite, el código de resultado de la tarea (20
// caracteres) y el panel, que lee mezclados los tres tipos de código.
// También los arreglos de la base de la tarea 37 (campo numérico, progreso
// guardado) y que las 31 prácticas siguen declarándose bien.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as divisores from '../divisores/logica.js';
import { CATALOGO, ID_PLANTILLA, practicaPorSlug } from '../practicas/_comun/catalogo.js';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  codigoAlumno, leerCodigoResultado, codigoTarea, leerCodigoTarea, leerCualquierCodigo, extraerCodigosResultado,
} from '../practicas/_comun/codigos.js';
import {
  TAREAS, PUNTOS_POR_EJERCICIO, MAX_ESTRELLA, MAX_ELEGIR, tareaPorId, tareasPublicadas, estadoTarea, erroresTareas, enlaceEjercicio, fechaISO,
} from '../practicas/_comun/tareas.js';
import { declaracionDe, progresoGuardado, claveProgreso, urlSemana } from '../practicas/_comun/base.js';
import { leerNumero } from '../practicas/_comun/piezas.js';
import { juntarTareas } from '../practicas/resultados.js';

// --- Los datos de tareas.js ------------------------------------------------------------

test('tareas: coherentes con el catálogo, sin repetidos y dentro de los topes', () => {
  assert.deepEqual(erroresTareas(), []);
  assert.ok(TAREAS.length >= 1);
  for (const t of TAREAS) {
    assert.ok(t.estrella.length <= MAX_ESTRELLA && t.elegir.length <= MAX_ELEGIR);
    assert.ok(t.nElegir <= t.elegir.length);
    assert.equal(tareaPorId(t.id), t);
  }
  assert.equal(tareaPorId(999), null);
});

test('tareas: las cuatro semanas de la nota de temporización, 6 ★ + 4 de 8, 100 puntos', () => {
  assert.deepEqual(TAREAS.map(t => [t.id, t.estrella.length, t.elegir.length, t.nElegir]), [[1, 6, 8, 4], [2, 6, 8, 4], [3, 6, 8, 4], [4, 6, 8, 4]]);
  for (const t of TAREAS) assert.equal(estadoTarea(t, () => null).maximo, 100);
  // Muestras copiadas de la nota (slug/n), una por lista y semana.
  assert.deepEqual(tareaPorId(1).estrella[0], ['divisores', 4]);
  assert.deepEqual(tareaPorId(2).elegir.at(-1), ['especiales', 1]);
  assert.deepEqual(tareaPorId(3).estrella.slice(0, 4), [['venn', 1], ['venn', 2], ['venn', 3], ['venn', 4]]);
  assert.deepEqual(tareaPorId(4).elegir[5], ['criba', 3]);
});

test('tareas: erroresTareas avisa de lo que está mal', () => {
  const buena = { id: 9, titulo: { es: 'a', en: 'b' }, estrella: [['recta', 1]], elegir: [['recta', 2], ['recta', 3]], nElegir: 1 };
  assert.deepEqual(erroresTareas([buena]), []);
  const mal = cambios => erroresTareas([{ ...buena, ...cambios }]).join(' | ');
  assert.match(mal({ estrella: [['recta', 4]] }), /recta no tiene ejercicio 4/);
  assert.match(mal({ estrella: [['inventada', 1]] }), /no está en el catálogo/);
  assert.match(mal({ elegir: [['recta', 1], ['recta', 2]] }), /recta\/1 está repetido/);
  assert.match(mal({ nElegir: 3 }), /nElegir/);
  assert.match(mal({ id: 0 }), /id/);
  assert.match(mal({ titulo: 'solo' }), /titulo/);
  assert.match(mal({ desde: '19/10/2026' }), /desde/);
  assert.match(mal({ estrella: Array.from({ length: 11 }, (_, i) => ['divisores', 1 + (i % 6)]) }), /más de 10/);
  assert.match(erroresTareas([buena, { ...buena }]).join(), /id repetido/);
});

test('tareas: la portada enseña las que han llegado a su día', () => {
  // Calendario retrasado una semana (2026-10-15), y la semana 1 adelantada al
  // viernes 16-10 (publicada en Classroom ese día); las demás, en sus lunes.
  assert.deepEqual(tareasPublicadas('2026-10-15').map(t => t.id), []);
  assert.deepEqual(tareasPublicadas('2026-10-16').map(t => t.id), [1]);
  assert.deepEqual(tareasPublicadas('2026-10-19').map(t => t.id), [1]);
  assert.deepEqual(tareasPublicadas('2026-10-26').map(t => t.id), [1, 2]);
  assert.deepEqual(tareasPublicadas('2026-11-08').map(t => t.id), [1, 2, 3]);
  assert.deepEqual(tareasPublicadas('2026-11-09').map(t => t.id), [1, 2, 3, 4]);
  assert.deepEqual(tareasPublicadas('2026-12-01').map(t => t.id), [1, 2, 3, 4]);
  assert.deepEqual(tareasPublicadas('2020-01-01', [{ id: 7 }]).map(t => t.id), [7], 'sin «desde», siempre');
  assert.equal(fechaISO(new Date(2026, 9, 5)), '2026-10-05');
});

test('tareas: el enlace de cada ejercicio abre ese ejercicio y vuelve a la tarea', () => {
  assert.equal(enlaceEjercicio('recta', 2, 1, 'ABCD'), 'recta/?c=ABCD&ejercicio=2&semana=1');
  assert.equal(enlaceEjercicio('divisores', 4, 1), '../divisores/?ejercicio=4&semana=1');
  // Con el número que tiene en la lista de la tarea, para la cabecera del ejercicio.
  assert.equal(enlaceEjercicio('recta', 2, 1, 'ABCD', 3), 'recta/?c=ABCD&ejercicio=2&semana=1&num=3');
  assert.match(urlSemana(3, 'ABCD'), /\/practicas\/semana\.html\?t=3&c=ABCD$/);
});

// --- Estado de una tarea -----------------------------------------------------------------

const TAREA = { id: 50, titulo: { es: 'x', en: 'x' }, estrella: [['recta', 1], ['recta', 2]], elegir: [['semaforo', 1], ['semaforo', 2], ['semaforo', 3]], nElegir: 2 };
const hecho = (fallos = 0, dia = 40) => ({ puntos: 10, objetivo: 10, aciertos: 10, fallos, terminado: true, dia });
const medias = (puntos, objetivo = 10, fallos = 1) => ({ puntos, objetivo, aciertos: puntos, fallos, terminado: false, dia: 0 });
const con = mapa => (slug, n) => mapa[`${slug}/${n}`] ?? null;

test('estado: sin nada, a medias, cumplida justo y con elegidos de sobra', () => {
  const nada = estadoTarea(TAREA, con({}));
  assert.deepEqual([nada.cumplida, nada.empezada, nada.puntos, nada.maximo, nada.fallos, nada.dia], [false, false, 0, 40, 0, 0]);

  // Todos los de elegir terminados pero falta un ★: no está cumplida.
  const sinEstrella = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'semaforo/1': hecho(), 'semaforo/2': hecho(), 'semaforo/3': hecho() }));
  assert.equal(sinEstrella.cumplida, false);
  assert.equal(sinEstrella.puntos, 30, 'los de elegir de sobra no suman más de nElegir × 10');

  // Los ★ terminados y uno de elegir menos de los que hacen falta.
  const casi = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'recta/2': hecho(2), 'semaforo/3': hecho(1, 44) }));
  assert.deepEqual([casi.cumplida, casi.estrellaHechos, casi.elegirHechos, casi.fallos, casi.dia], [false, 2, 1, 3, 44]);

  // Justo: los ★ y exactamente nElegir.
  const justo = estadoTarea(TAREA, con({ 'recta/1': hecho(), 'recta/2': hecho(), 'semaforo/1': hecho(), 'semaforo/3': hecho() }));
  assert.deepEqual([justo.cumplida, justo.puntos], [true, 40]);

  // Con nElegir 0 basta con los ★; sin ★, basta con los de elegir.
  assert.equal(estadoTarea({ ...TAREA, nElegir: 0 }, con({ 'recta/1': hecho(), 'recta/2': hecho() })).cumplida, true);
  assert.equal(estadoTarea({ ...TAREA, estrella: [] }, con({ 'semaforo/1': hecho(), 'semaforo/2': hecho() })).cumplida, true);
});

test('estado: los puntos de un ejercicio a medias son proporcionales y nunca llegan a 10', () => {
  const p = mapa => estadoTarea(TAREA, con(mapa)).puntos;
  assert.equal(p({ 'recta/1': medias(5) }), 5);
  assert.equal(p({ 'recta/1': medias(9) }), 9);
  assert.equal(p({ 'recta/1': medias(10) }), 9, 'diez puntos sin «terminado» (no debería pasar) no cuentan como terminado');
  assert.equal(p({ 'recta/1': medias(3, 6) }), 5, 'objetivo distinto de 10 (el árbol pide 6)');
  assert.equal(p({ 'recta/1': medias(0, 10, 4) }), 0);
  // De los de elegir cuentan los nElegir mejores, terminados o no.
  assert.equal(p({ 'semaforo/1': medias(2), 'semaforo/2': medias(7), 'semaforo/3': hecho() }), 17);
  const empezado = estadoTarea(TAREA, con({ 'semaforo/2': medias(0, 10, 1) }));
  assert.deepEqual([empezado.empezada, empezado.puntos, empezado.elegir[1].empezado], [true, 0, true], 'con un fallo y 0 puntos ya está empezado');
  assert.equal(PUNTOS_POR_EJERCICIO, 10);
});

// --- El código de resultado de la tarea ------------------------------------------------------

const azar = (rng, n) => Array.from({ length: n }, () => rng.azar() < 0.5);

test('código de tarea: ida y vuelta para todos los alumnos y todas las tareas', () => {
  const rng = crearRng(37);
  for (const t of TAREAS) {
    for (let indice = 0; indice < 1024; indice++) {
      const datos = { estrella: azar(rng, t.estrella.length), elegir: azar(rng, t.elegir.length), fallos: rng.entero(0, 1023), dia: rng.entero(0, 1023) };
      const codigo = codigoTarea(t.id, indice, datos);
      assert.match(codigo, /^([A-HJ-NP-Z2-9]{4}-){4}[A-HJ-NP-Z2-9]{4}$/);
      assert.deepEqual(leerCodigoTarea(codigo), { tarea: t.id, indice, ...datos, tope: datos.fallos === 1023 });
    }
  }
});

test('código de tarea: los extremos, los fallos con tope y cualquier forma de escribirlo', () => {
  const t = TAREAS[0];
  const todo = { estrella: t.estrella.map(() => true), elegir: t.elegir.map(() => true), fallos: 0, dia: 1023 };
  const nada = { estrella: t.estrella.map(() => false), elegir: t.elegir.map(() => false), fallos: 0, dia: 0 };
  for (const datos of [todo, nada]) assert.deepEqual(leerCodigoTarea(codigoTarea(t.id, 0, datos)), { tarea: t.id, indice: 0, ...datos, tope: false });
  const muchos = leerCodigoTarea(codigoTarea(t.id, 5, { ...nada, fallos: 5000 }));
  assert.deepEqual([muchos.fallos, muchos.tope], [1023, true]);
  const c = codigoTarea(t.id, 5, todo);
  assert.deepEqual(leerCodigoTarea(c.toLowerCase().replaceAll('-', ' ')), leerCodigoTarea(c));
  assert.deepEqual(leerCodigoTarea(c.replaceAll('-', '')), leerCodigoTarea(c));
  // Una tarea con 10 ★ y 15 de elegir (los topes) también cabe.
  assert.throws(() => codigoTarea(t.id, 0, { estrella: Array(11).fill(true) }), /más ejercicios/);
});

test('código de tarea: no vale con un carácter cambiado, de otro alumno, de otra tarea ni de una que no existe', () => {
  const t = TAREAS[1];
  const datos = { estrella: [true, false, true, true, false, true], elegir: [true, true, false, false, false, false, false, true], fallos: 12, dia: 45 };
  const codigo = codigoTarea(t.id, 33, datos);
  const limpio = codigo.replaceAll('-', '');
  let cazados = 0, total = 0;
  for (let i = 0; i < limpio.length; i++) {
    for (const otro of 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') {
      if (otro === limpio[i]) continue;
      total++;
      if (leerCodigoTarea(limpio.slice(0, i) + otro + limpio.slice(i + 1)) === null) cazados++;
    }
  }
  assert.equal(cazados, total, 'un error de copia siempre se detecta (30 bits de control)');
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 34, datos)).indice, 34);
  assert.notEqual(codigoTarea(t.id, 34, datos), codigo, 'dice de quién es');
  assert.notEqual(codigoTarea(TAREAS[2].id, 33, datos), codigo, 'y de qué tarea');
  assert.equal(leerCodigoTarea(codigoTarea(999, 33, datos)), null, 'de una tarea que no está en tareas.js');
  // Un ★ terminado que la tarea no tiene (el 7.º de seis): no vale.
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 33, { ...datos, estrella: [...datos.estrella, true] })), null);
  assert.equal(leerCodigoTarea(codigoTarea(t.id, 33, { ...datos, elegir: [...datos.elegir, true] })), null);
  for (const malo of ['', 'ABCD-EFGH-JKLM-NPQR', 'ABCD-EFGH-JKLM-NPQR-STUV', `${codigo}-ABCD`, codigo.slice(0, -1) + '1']) assert.equal(leerCodigoTarea(malo), null);
});

// Un código de 16 caracteres, como los que daba cada práctica hasta el 2026-10-16: ya no vale.
const DE_16_ANTIGUO = 'ABCD-EFGH-JKLM-NPQR';

test('códigos: los dos tipos no se confunden y el de práctica de 16 ya no existe', () => {
  const t = TAREAS[0];
  const deTarea = codigoTarea(t.id, 7, { estrella: [true], elegir: [], fallos: 3, dia: 44 });
  const deDivisores = divisores.codigoResultado(7, divisores.EJERCICIOS.map(() => ({ terminado: true, fallos: 0 })), 44);
  assert.equal(leerCodigoResultado(deTarea), null, 'uno de tarea no es de práctica');
  assert.equal(leerCodigoTarea(deDivisores), null);
  assert.equal(leerCodigoResultado(DE_16_ANTIGUO), null);
  assert.equal(leerCualquierCodigo(DE_16_ANTIGUO), null);
  assert.equal(leerCualquierCodigo(deTarea).tipo, 'tarea');
  assert.equal(leerCualquierCodigo(deTarea).tarea, 1);
  assert.deepEqual([leerCualquierCodigo(deDivisores).tipo, leerCualquierCodigo(deDivisores).practica], ['practica', 0]);
  assert.equal(leerCualquierCodigo('ABCD-EFGH-JKLM-NPQR-STUV'), null);
  // Al azar, ninguna tira de 20 símbolos es un código de tarea (30 bits de control).
  const rng = crearRng(5);
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < 20000; i++) assert.equal(leerCodigoTarea(Array.from({ length: 20 }, () => rng.elegir([...alfabeto])).join('')), null);
});

test('extraerCodigosResultado: encuentra los de 12 y 20 mezclados en un texto cualquiera', () => {
  const t = TAREAS[0];
  const de20 = codigoTarea(t.id, 2, { estrella: [true, true], elegir: [false, true], fallos: 7, dia: 44 });
  const otro20 = codigoTarea(TAREAS[3].id, 9, { estrella: [true], elegir: [], fallos: 0, dia: 50 });
  const de12 = divisores.codigoResultado(3, divisores.EJERCICIOS.map(() => ({ terminado: true, fallos: 0 })), 36);
  const texto = `Hola profe, mi tarea: ${de20.toLowerCase()}.
    Luis: ${otro20.replaceAll('-', ' ')} para la semana 4 (y otra vez ${de20})
    Divisores: ${de12} gracias`;
  assert.deepEqual(extraerCodigosResultado(texto), [de20, otro20, de12]);
  // Un código de 16 (el de práctica, que ya no existe) sale como no válido (con sus 12 primeros
  // caracteres) y no tapa a los demás.
  assert.deepEqual(extraerCodigosResultado(`Mi práctica: ${DE_16_ANTIGUO}`), ['ABCD-EFGH-JKLM']);
  assert.deepEqual(extraerCodigosResultado(`${DE_16_ANTIGUO} ${de20}`), ['ABCD-EFGH-JKLM', de20]);
  assert.deepEqual(extraerCodigosResultado(`${de20} ${DE_16_ANTIGUO}`), [de20, 'ABCD-EFGH-JKLM']);
  // Pegados con un espacio: uno de 12 y uno de 20.
  assert.deepEqual(extraerCodigosResultado(`${de12} ${de20}`), [de12, de20]);
  assert.deepEqual(extraerCodigosResultado(`casa ${de20} para`), [de20]);
  assert.deepEqual(extraerCodigosResultado(`${de20.replaceAll('-', '')}`), [de20]);
  // Uno de 20 mal copiado sale como inválido, entero.
  const malo = `${de20.slice(0, -1)}${de20.at(-1) === 'A' ? 'B' : 'A'}`;
  assert.deepEqual(extraerCodigosResultado(`Mi código: ${malo}`), [malo]);
  assert.equal(leerCualquierCodigo(malo), null);
});

// --- Panel --------------------------------------------------------------------------------

test('panel: tareas de la semana con códigos de tarea, de práctica y la nube', () => {
  const tarea = { ...TAREA, id: 1 };  // recta/1, recta/2 ★; semaforo/1-3, elegir 2
  const sin = { terminado: false, fallos: 0 };
  const filas = juntarTareas(
    ['Ana', 'Luis', 'Eva', 'Paco'],
    [
      // Ana mandó un código de la tarea a medias y otro después, cumplida.
      { tarea: 1, indice: 0, estrella: [true, false], elegir: [true, false, false], fallos: 2, tope: false, dia: 40 },
      { tarea: 1, indice: 0, estrella: [true, true], elegir: [true, false, true], fallos: 3, tope: false, dia: 42 },
      { tarea: 2, indice: 3, estrella: [true], elegir: [], fallos: 0, tope: false, dia: 41 },   // de otra tarea
    ],
    // Luis no mandó código de la tarea, pero sí el de la recta (los ★) y uno del semáforo.
    [
      { practica: practicaPorSlug('recta').id, indice: 1, ejercicios: [{ terminado: true, fallos: 1 }, { terminado: true, fallos: 0 }, sin], dia: 43 },
      { practica: practicaPorSlug('semaforo').id, indice: 1, ejercicios: [{ terminado: true, fallos: 4 }, sin, sin, sin], dia: 43 },
    ],
    // Eva solo tiene la nube, con un ejercicio empezado.
    [{ practica: practicaPorSlug('semaforo').id, indice: 2, ej: [{ puntos: 3, objetivo: 10, aciertos: 3, fallos: 1, terminado: false, dia: 0 }] }],
    [tarea],
  );
  const de = i => filas.find(f => f.indice === i).tareas[0];
  assert.deepEqual(filas.map(f => [f.indice, f.nombre]), [[0, 'Ana'], [1, 'Luis'], [2, 'Eva'], [3, 'Paco']]);
  assert.deepEqual([de(0).cumplida, de(0).estrellaHechos, de(0).elegirHechos, de(0).fallos, de(0).dia, de(0).fuente], [true, 2, 2, 3, 42, 'código de la tarea']);
  assert.deepEqual([de(1).cumplida, de(1).estrellaHechos, de(1).elegirHechos, de(1).fallos, de(1).fuente], [false, 2, 1, 5, 'prácticas']);
  assert.deepEqual([de(2).cumplida, de(2).empezada, de(2).estrellaHechos, de(2).fuente], [false, true, 0, 'prácticas']);
  assert.deepEqual([de(3).empezada, de(3).fuente], [false, ''], 'Paco solo mandó el código de otra tarea');
  // Mezcla: el código de la tarea y una práctica se suman.
  const mezcla = juntarTareas([], [{ tarea: 1, indice: 9, estrella: [true, false], elegir: [false, false, false], fallos: 0, tope: false, dia: 40 }],
    [{ practica: practicaPorSlug('recta').id, indice: 9, ejercicios: [sin, { terminado: true, fallos: 0 }, sin], dia: 41 }], [], [tarea]);
  assert.deepEqual([mezcla[0].tareas[0].estrellaHechos, mezcla[0].tareas[0].fuente], [2, 'código de la tarea + prácticas']);
  assert.deepEqual(juntarTareas([], [], [{ practica: practicaPorSlug('venn').id, indice: 4, ejercicios: [sin], dia: 0 }], [], [tarea]), [], 'una práctica que no está en ninguna tarea no añade filas');
});

// --- Lo que la tarea 37 añade a la base ----------------------------------------------------

test('leerNumero: acepta los millares con punto o espacio, y la coma solo en inglés', () => {
  const casos = [['4730', 4730], ['4.730', 4730], ['4 730', 4730], [' 12.345.678 ', 12345678], ['12 345 678', 12345678], ['0', 0], ['007', 7], ['4 730', 4730]];
  for (const [texto, n] of casos) assert.equal(leerNumero(texto), n, texto);
  for (const malo of ['', '   ', '4.73', '4,730', '47.30', '4..730', '12a', '-5', '4.7300', '.730', '1e3', '4,5']) assert.equal(leerNumero(malo), null, malo);
  assert.equal(leerNumero('4,730', 'en'), 4730);
  assert.equal(leerNumero('4,73', 'en'), null);
  assert.equal(leerNumero('99999999999999999999'), null, 'demasiado grande para ser exacto');
});

test('progresoGuardado: lee lo que guarda la base y junta las dos claves de divisores/', () => {
  const almacen = new Map();
  globalThis.localStorage = { getItem: k => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, String(v)), removeItem: k => almacen.delete(k) };
  try {
    assert.deepEqual(progresoGuardado('recta', 'ABCD'), []);
    almacen.set(claveProgreso('recta', 'ABCD'), JSON.stringify({ ej: [hecho(1), medias(4)] }));
    assert.deepEqual(progresoGuardado('recta', 'ABCD').map(e => e.puntos), [10, 4]);
    almacen.set(claveProgreso('criba', 'ABCD'), '{roto');
    assert.deepEqual(progresoGuardado('criba', 'ABCD'), []);
    // divisores: la clave nueva y la de antes de la tarea 17; gana el terminado.
    almacen.set(claveProgreso('divisores', 'ABCD'), JSON.stringify({ ej: [medias(3), medias(2), null, null, null, medias(1)] }));
    almacen.set('divisores.v1.ABCD', JSON.stringify({ ej: [hecho(), { pendientes: 4, aciertos: 2, fallos: 5, terminado: false }] }));
    const d = progresoGuardado('divisores', 'ABCD');
    assert.deepEqual(d.map(e => e?.terminado ?? null), [true, false, null, null, null, false]);
    assert.equal(d[1].fallos, 5, 'sin terminar en ninguna, la que tiene más fallos');
  } finally {
    delete globalThis.localStorage;
  }
});

test('estilos de la base: «Comprobar» se esconde con hidden y las cuentas no ensanchan la página', () => {
  const css = readFileSync(new URL('../practicas/_comun/estilos.css', import.meta.url), 'utf8');
  assert.match(css, /\.comprobar\[hidden\]\s*\{\s*display:\s*none;?\s*\}/);
  const cuenta = css.match(/\n\.cuenta\s*\{([^}]*)\}/)[1];
  assert.doesNotMatch(cuenta, /nowrap/);
  assert.match(cuenta, /max-width:\s*100%/);
});

test('base: generar recibe el idioma del ítem, elegido antes de generarlo', () => {
  const base = readFileSync(new URL('../practicas/_comun/base.js', import.meta.url), 'utf8');
  const siguiente = base.slice(base.indexOf('function siguiente()'), base.indexOf('function pintarEjercicio()'));
  assert.ok(siguiente.indexOf('actual.idioma =') < siguiente.indexOf('def.generar('), 'el idioma se elige antes de generar');
  assert.match(siguiente, /const sesion = \{[^}]*idioma: actual\.idioma[^}]*\}/);
});

// --- Las 31 prácticas siguen declarándose bien, y los nombres de la semana existen ----------

test('las 31 prácticas (y la plantilla) cargan y declaran lo que dice el catálogo', async () => {
  for (const ficha of CATALOGO) {
    const d = await declaracionDe(ficha);
    assert.ok(d, `${ficha.slug}: su practica.js no carga`);
    assert.equal(d.slug, ficha.slug);
    assert.equal(d.ejercicios.length, ficha.nEjercicios, `${ficha.slug}: ejercicios declarados`);
    for (const e of d.ejercicios) {
      assert.ok(typeof e.nombre?.es === 'string' && typeof e.nombre?.en === 'string', `${ficha.slug}: nombre { es, en }`);
      assert.equal(typeof e.generar, 'function');
    }
  }
  assert.ok(CATALOGO.some(p => p.id === ID_PLANTILLA));
});

test('tareas: cada ejercicio de una tarea tiene el nombre que dice la nota de temporización', async () => {
  // Los nombres de la nota (2026-10-09), para cazar un ejercicio que cambió de número.
  // (divisores/4, «Mezcla» en la nota, se llama «Multiplicaciones y divisiones»: es la mezcla de las dos anteriores.)
  const esperado = {
    'divisores/4': 'Multiplicaciones y divisiones', 'recta/1': 'múltiplos', 'recta/2': 'divisores', 'rectangulos/2': 'Sin dibujo', 'semaforo/1': 'básico',
    'clasificador/1': 'limpios', 'semaforo/2': '11', 'semaforo/4': 'cifra', 'recta/3': 'falso', 'rectangulos/1': 'rectángulos',
    'reloj/1': 'Predice', 'leelo/2': 'lee', 'jerarquia/1': 'Sin paréntesis', 'division/2': 'prueba',
    'criba/2': 'Primo o compuesto', 'semaforo/3': 'ompuestos', 'arbol/1': 'Construye', 'divisiones/1': 'scalera', 'divisiones/2': 'potencias',
    'fabrica/1': 'Construye', 'criba/1': 'criba', 'arbol/2': 'terminad', 'arbol/3': 'Completa', 'divisiones/3': 'multiplicando',
    'fabrica/2': 'Cuántos', 'factorizaciones/2': 'múltiplo', 'exponente/2': 'repetida', 'especiales/1': 'erdadero',
    'venn/1': 'Reparte', 'venn/2': 'm.c.d.', 'venn/3': 'm.c.m.', 'venn/4': 'Mezcla', 'imposibles/1': 'Puede ser', 'factorizaciones/1': 'producto',
    'imposibles/2': 'producto', 'imposibles/3': 'Nómbralo', 'factorizaciones/3': 'cociente', 'fabrica/3': 'Sin dividir', 'leelo/3': 'Completa',
    'divisores/6': 'miente', 'parentesis/1': 'Tres', 'raiz/2': 'Sin dibujo',
    'clasificador/2': 'trampa', 'reloj/2': 'hora', 'baldosas/1': 'más grande', 'baldosas/2': 'Cuántas', 'errores/1': 'error',
    'errores/2': 'paso', 'clasificador/3': 'Justif', 'reloj/3': 'días', 'baldosas/3': 'Cuerdas', 'errores/3': 'Nombra', 'leelo/1': 'Escúchalo',
    'criba/3': 'probar', 'expresion/1': 'Dos operaciones', 'errores1/1': 'error',
  };
  const vistos = new Set();
  for (const t of TAREAS) {
    for (const [slug, n] of [...t.estrella, ...t.elegir]) {
      const d = await declaracionDe(practicaPorSlug(slug));
      const nombre = d.ejercicios[n - 1].nombre.es;
      const clave = `${slug}/${n}`;
      assert.ok(clave in esperado, `${clave} no está en la lista de la nota`);
      assert.ok(nombre.toLowerCase().includes(esperado[clave].toLowerCase()), `${clave} se llama «${nombre}», no «…${esperado[clave]}…»`);
      vistos.add(clave);
    }
  }
  assert.equal(vistos.size, 56, 'las cuatro semanas: 14 ejercicios cada una, sin repetir ninguno entre semanas');
});
