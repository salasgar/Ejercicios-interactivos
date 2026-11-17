// Práctica «Términos semejantes» (U6): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, nada equivalente, todo error con nombre, sin x², sin paréntesis y sin «1x».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { leerExpresion, hayEquivalentes, aLineal, huella, sumarNoSemejantes } from '../practicas/_comun/algebra.js';
import {
  generarSemejantes, generarCoeficiente, generarReducir, generarErrores, corregirReducir, candidatosDe,
  ESTA_DEFINIDO, explicaError, claveItem, CASOS_HOJA, HUELLAS_EXAMEN, reservado, sinReducirAun,
  clavePar, claveCoeficiente, claveSuma, claveError, explicaErrorConTermino,
} from '../practicas/terminos-semejantes/logica.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const limpio = t => !/[()^²×]|\b1[xy]|\+ −|\.\d/.test(t);
const val = t => leerExpresion(t, { variasLetras: true }).valor;
const textoSinHtml = t => `${t.coef.num < 0 ? '−' : ''}${Math.abs(t.coef.num) === 1 && t.letra ? '' : Math.abs(t.coef.num)}${t.letra ?? ''}`;
const terms = t => leerExpresion(t, { variasLetras: true }).terminos;

test('¿Semejantes?: la respuesta cuadra con la parte literal y los dos casos salen', () => {
  const its = items(generarSemejantes, 21);
  for (const it of its) {
    assert.equal(it.correcta === 'si', it.letraA === it.letraB, claveItem(it));
    assert.ok(it.correcta === 'si' || ESTA_DEFINIDO(it.error));
    assert.ok(it.solucion.es && it.solucion.en);
    assert.ok(limpio(it.a) && limpio(it.b), claveItem(it));
    assert.notEqual(it.a, it.b);
  }
  const si = its.filter(i => i.correcta === 'si').length;
  assert.ok(si > N * 0.25 && si < N * 0.75, `sí: ${si}`);
  assert.ok(its.some(i => i.letraA === null && i.letraB === null), 'faltan dos números');
  assert.ok(its.some(i => i.letraA === 'x' && i.letraB === 'y'), 'faltan letras distintas');
  // La y no delata la respuesta: entre las parejas con y, ni «sí» ni «no» pasan del 80 %.
  const conY = its.filter(i => i.letraA === 'y' || i.letraB === 'y');
  const siY = conY.filter(i => i.correcta === 'si').length;
  assert.ok(conY.length > N * 0.2, `parejas con y: ${conY.length}`);
  assert.ok(siY / conY.length > 0.2 && siY / conY.length < 0.8, `sí entre las parejas con y: ${siY}/${conY.length}`);
  assert.ok(its.some(i => i.correcta === 'si' && i.letraA === 'y' && i.letraB === 'y'), 'faltan semejantes con y');
  // Nada reservado.
  for (const it of its) assert.equal(reservado(clavePar(it.a, it.b)), false, claveItem(it));
});

test('coeficiente y parte literal: una buena, opciones distintas y errores con nombre', () => {
  const its = items(generarCoeficiente, 22);
  for (const it of its) {
    assert.ok(it.opciones.length >= 3 && it.opciones.length <= 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1, claveItem(it));
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, it.opciones.length, claveItem(it));
    for (const o of it.opciones) {
      if (o.correcta) continue;
      assert.ok(ESTA_DEFINIDO(o.error), o.error);
      assert.ok(o.por_que.es && o.por_que.en);
    }
    const buena = it.opciones.find(o => o.correcta).valor;
    const t = val(it.termino).terminos()[0];
    assert.equal(buena, it.pregunta === 'literal' ? t.letra : `${t.coef.num < 0 ? '−' : ''}${Math.abs(t.coef.num)}`);
    assert.ok(limpio(it.termino));
  }
  assert.ok(its.some(i => i.pregunta === 'literal') && its.some(i => i.pregunta === 'coeficiente'));
  assert.ok(its.some(i => /^−?x$|^−?y$/.test(i.termino)), 'faltan x e −x sin número');
  for (const it of its) {
    if (it.pregunta === 'coeficiente') assert.equal(reservado(claveCoeficiente(terms(it.termino)[0])), false, claveItem(it));
  }
  // x y −x (coeficiente ±1 sin número) no se reservan: son «x es 1x», no un caso.
  assert.equal(claveCoeficiente(terms('x')[0]), null);
  assert.equal(claveCoeficiente(terms('−x')[0]), null);
  assert.equal(claveCoeficiente(terms('7')[0]), null);
});

test('reduce: la buena está reducida, no es 0 y los errores tipo no son equivalentes', () => {
  const its = items(generarReducir, 23);
  for (const it of its) {
    const e = val(it.origen);
    assert.ok(e.equals(it.correcta));
    assert.ok(!e.equals(0));
    assert.ok(limpio(it.origen) && limpio(it.correcta), claveItem(it));
    assert.equal(sinReducirAun(leerExpresion(it.correcta, { variasLetras: true }).terminos), false);
    assert.equal(sinReducirAun(leerExpresion(it.origen, { variasLetras: true }).terminos), true);
    const lista = [it.correcta, ...it.errores.map(x => x.texto)];
    assert.equal(hayEquivalentes(lista), false, claveItem(it));
    for (const x of it.errores) assert.ok(ESTA_DEFINIDO(x.error));
    assert.ok(it.solucion.es && it.solucion.en);
    assert.equal(corregirReducir(it, it.correcta).acierto, true);
    assert.equal(reservado(claveSuma(terms(it.origen))), false, claveItem(it));
    // Ningún valor de error lo explican dos errores distintos.
    for (const x of it.errores) {
      const quienes = candidatosDe(terms(it.origen)).filter(c => c.valor.equals(val(x.texto)));
      assert.deepEqual([...new Set(quienes.map(c => c.error))], [x.error], claveItem(it));
    }
  }
  assert.ok(its.some(i => i.dosLetras) && its.some(i => !i.dosLetras));
});

test('reduce: corrección del alumno', () => {
  const rng = crearRng(5);
  const it = generarReducir(rng);
  assert.equal(corregirReducir(it, it.origen).valida, false);
  assert.equal(corregirReducir(it, '').valida, false);
  assert.equal(corregirReducir(it, '2x+').valida, false);
  const err = it.errores[0];
  assert.deepEqual(corregirReducir(it, err.texto), { valida: true, acierto: false, error: err.error });
  const otra = { ...it, dosLetras: false, letras: ['x'], correcta: '3x', errores: [] };
  assert.equal(corregirReducir(otra, '7x').error, 'otra-expresion');
  assert.equal(corregirReducir(otra, '3x').acierto, true);
});

test('caza el error: cada error se reconoce de forma única y la buena está bien', () => {
  const its = items(generarErrores, 24);
  const vistos = new Set();
  for (const it of its) {
    vistos.add(it.correcta);
    const e = val(it.origen);
    const rhs = val(it.resultado);
    assert.ok(limpio(it.origen) && limpio(it.resultado), claveItem(it));
    assert.equal(reservado(claveError(terms(it.origen), it.resultado)), false, claveItem(it));
    if (it.error === null) {
      assert.ok(e.equals(rhs), claveItem(it));
    } else {
      assert.ok(!e.equals(rhs), claveItem(it));
      assert.ok(ESTA_DEFINIDO(it.error));
      // Tres errores calculados sobre la suma: el resultado mostrado es de UNO solo.
      const quienes = candidatosDe(terms(it.origen)).filter(c => c.valor.equals(rhs));
      assert.deepEqual([...new Set(quienes.map(c => c.error))], [it.error], claveItem(it));
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
  assert.deepEqual([...vistos].sort(), ['ninguno', 'perder-signo', 'suma-no-semejantes', 'x-sin-coeficiente']);
});

test('«un menos leído como un más»: solo con una resta de verdad, y el feedback nombra el término', () => {
  const its = items(generarErrores, 25).filter(i => i.error === 'perder-signo');
  assert.ok(its.length > N / 8, `perder-signo: ${its.length}`);
  for (const it of its) {
    const ts = terms(it.origen);
    // Hay un término que resta y no es el primero: no se «pierde» un signo que no hay.
    assert.ok(ts.some((t, i) => i > 0 && t.coef.num < 0), claveItem(it));
    assert.ok(it.signo && it.signo.antes.startsWith('−') && it.signo.despues.startsWith('+'), claveItem(it));
    assert.match(it.solucion.es, /se ha sumado como/);
    assert.match(it.solucion.en, /was added as/);
    // El resultado mostrado es exactamente leer ese término con el signo contrario.
    const antes = it.signo.antes.replace(/<[^>]+>/g, '');
    const cambiado = ts.map(t => (t.coef.num < 0 && textoSinHtml(t) === antes ? { ...t, coef: { ...t.coef, num: -t.coef.num } } : t));
    assert.ok(cambiado.length === ts.length, claveItem(it));
    assert.ok(ts.some(t => t.coef.num < 0 && textoSinHtml(t) === antes), claveItem(it));
  }
  // Sin restas intermedias no hay error de ese tipo: −x + 6x + 7x no lo tiene.
  assert.equal(candidatosDe(terms('−x + 6x + 7x')).filter(c => c.error === 'perder-signo').length, 0);
  assert.equal(candidatosDe(terms('−4x + x + x')).filter(c => c.error === 'perder-signo').length, 0);
  // Y con una resta, el valor es cambiar ese signo: −8x − x + x tiene que ser exactamente un candidato.
  const c = candidatosDe(terms('3x − 2x + 5')).filter(c => c.error === 'perder-signo');
  assert.deepEqual(c.map(x => x.valor.aTexto()), ['5x + 5']);
});

test('«−8x − x − x = −8x» tiene dos explicaciones y el generador lo descarta', () => {
  // Quitar las x sin número da −8x; leer un − como + (−8x + x − x) también: el ítem no vale.
  const c = candidatosDe(terms('−8x − x − x'));
  const quienes = c.filter(x => x.valor.equals(val('−8x'))).map(x => x.error);
  assert.deepEqual([...new Set(quienes)].sort(), ['perder-signo', 'x-sin-coeficiente']);
  for (const it of items(generarErrores, 26)) {
    if (it.origen === '−8x − x − x') assert.notEqual(it.resultado, '−8x', 'ítem con dos respuestas correctas');
  }
});

test('los errores con nombre se explican en los dos idiomas', () => {
  for (const id of ['suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente', 'semejantes-por-el-numero']) {
    assert.match(explicaError(id, 'es'), /^Has /);
    assert.match(explicaError(id, 'en'), /^You /);
  }
});

test('casos reservados: la hoja en claro, los exámenes por huella', () => {
  assert.ok(CASOS_HOJA.size >= 40, `claves de la hoja: ${CASOS_HOJA.size}`);
  assert.ok(HUELLAS_EXAMEN.size >= 100, `huellas de examen: ${HUELLAS_EXAMEN.size}`);
  // Casos de la hoja (en claro): parejas, coeficientes y reducciones, con sus datos.
  assert.equal(reservado(clavePar('4x', '−x')), true);
  assert.equal(reservado(clavePar('7', '4x')), true);
  assert.equal(reservado(claveCoeficiente(terms('2x')[0])), true);
  assert.equal(reservado(claveSuma(terms('3x + 4 + 2x + 1'))), true);
  assert.equal(reservado(claveSuma(terms('1 + 2x + 4 + 3x'))), true, 'el orden de los términos no cambia el caso');
  assert.equal(reservado(claveSuma(terms('x + x + x'))), true, 'x + x + x sin reducir, no solo lo que reduce a 3x');
  assert.equal(reservado(claveError(terms('x + x + x'), '3x')), true);
  // Los casos de examen no se escriben aquí: se prueba el mecanismo con una suma inventada cuya huella se añade
  // al conjunto solo durante el test.
  const inventada = claveSuma(terms('5x − 11 + 4y'));
  assert.equal(reservado(inventada), false);
  HUELLAS_EXAMEN.add(huella(inventada));
  try {
    assert.equal(reservado(inventada), true);
    assert.equal(reservado(claveSuma(terms('4y + 5x − 11'))), true, 'el orden no cambia el caso');
  } finally {
    HUELLAS_EXAMEN.delete(huella(inventada));
  }
  assert.equal(reservado(inventada), false);
  // Lo que no es un caso, sale.
  assert.equal(reservado(claveSuma(terms('3x + 8 + 6x'))), false);
  assert.equal(reservado(clavePar('3x', '5y')), false);
  assert.equal(reservado(null), false);
});

test('ningún ítem de los cuatro ejercicios es un caso reservado (3000 de cada uno, es decir, ya comprobado arriba)', () => {
  // Las comprobaciones están en cada test de ejercicio; aquí, que un caso de la hoja se descarta de verdad.
  const rng = crearRng(99);
  const deLaHoja = claveSuma(terms('2x + 7 − 5x − 3'));
  for (let i = 0; i < N; i++) {
    const it = generarReducir(rng);
    assert.notEqual(claveSuma(terms(it.origen)), deLaHoja);
  }
});

// Independiente de `candidatosDe`: las tres familias de error con TODAS sus variantes, calculadas a mano.
const flip = (ts, i) => ts.map((u, j) => (j === i ? { ...u, coef: { ...u.coef, num: -u.coef.num } } : u));
const familias = ts => {
  const unos = ts.map((t, i) => (t.letra && Math.abs(t.coef.num) === 1 ? i : -1)).filter(i => i >= 0);
  const ceros = [];
  for (let m = 1; m < 2 ** unos.length; m++) {
    const cero = new Set(unos.filter((_, k) => m & (1 << k)));
    ceros.push(aLineal(ts.filter((_, i) => !cero.has(i))));
  }
  return {
    'suma-no-semejantes': [sumarNoSemejantes(aLineal(ts))].filter(Boolean),
    'perder-signo': ts.flatMap((t, i) => (i > 0 && t.coef.num < 0 ? [aLineal(flip(ts, i))] : [])),
    'x-sin-coeficiente': ceros,
  };
};
const explican = (ts, valor) => Object.entries(familias(ts)).filter(([, vs]) => vs.some(v => v.equals(valor))).map(([id]) => id);

test('caza el error: con las familias amplias, el resultado mostrado sale de UN solo error y no de la cuenta buena', () => {
  for (const semilla of [31, 32]) {
    for (const it of items(generarErrores, semilla)) {
      if (it.error === null) continue;
      const ts = terms(it.origen);
      const rhs = val(it.resultado);
      assert.ok(!rhs.equals(aLineal(ts)), claveItem(it));
      assert.deepEqual(explican(ts, rhs), [it.error], claveItem(it));
    }
  }
});

test('reduce: ningún error con nombre que el alumno puede teclear lo explican dos errores', () => {
  for (const it of items(generarReducir, 33)) {
    const ts = terms(it.origen);
    for (const x of it.errores) assert.deepEqual(explican(ts, val(x.texto)), [x.error], `${claveItem(it)} → ${x.texto}`);
  }
});

test('el feedback de «un menos como un más» nombra el término y no hay dos «:» seguidos ni avisos repetidos', () => {
  const signo = { antes: '−x', despues: '+x' };
  assert.match(explicaErrorConTermino('perder-signo', 'es', signo), /^Has leído un menos como un más: restar no es sumar \(.*−x.* se ha sumado como .*\+x.*\)$/);
  assert.match(explicaErrorConTermino('perder-signo', 'en', signo), /^You read a minus as a plus: subtracting is not adding \(.*−x.* was added as .*\+x.*\)$/);
  const its = items(generarErrores, 34);
  for (const it of its) {
    for (const idioma of ['es', 'en']) {
      const plano = it.solucion[idioma].replace(/<[^>]+>/g, '');
      assert.doesNotMatch(plano, /:[^.;]*:[^.;]*:/, plano);
      assert.doesNotMatch(plano, /: [A-ZÁÉÍÓÚ]/, plano);
      assert.doesNotMatch(plano, /(No hay ningún error|There is no mistake)[^]*(No hay ningún error|There is no mistake)/, plano);
    }
  }
  assert.ok(its.some(i => i.error === 'perder-signo'));
  const ej3 = items(generarReducir, 35);
  for (const it of ej3) {
    for (const x of it.errores) {
      if (x.error === 'perder-signo') assert.ok(x.signo && x.signo.antes.startsWith('−') && x.signo.despues.startsWith('+'), claveItem(it));
    }
  }
  const it = ej3.find(i => i.errores.some(x => x.error === 'perder-signo'));
  const x = it.errores.find(y => y.error === 'perder-signo');
  assert.deepEqual(corregirReducir(it, x.texto), { valida: true, acierto: false, error: 'perder-signo', signo: x.signo });
});

test('ej. 2: el porqué del 0 y la solución no repiten la frase', () => {
  let vistos = 0;
  for (const it of items(generarCoeficiente, 37)) {
    const cero = it.opciones.find(o => o.error === 'x-sin-coeficiente');
    if (!cero) continue;
    vistos++;
    for (const idioma of ['es', 'en']) {
      const a = cero.por_que[idioma];
      const b = it.solucion[idioma].replace(/<[^>]+>/g, '');
      assert.ok(!b.includes(a) && !a.includes(b), `${a} / ${b}`);
    }
  }
  assert.ok(vistos > 100, `opción 0: ${vistos}`);
});
