// Práctica «Términos semejantes» (U6): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, nada equivalente, todo error con nombre, sin x², sin paréntesis y sin «1x».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { leerExpresion, huellaCanonica, lineal, hayEquivalentes } from '../practicas/_comun/algebra.js';
import {
  generarSemejantes, generarCoeficiente, generarReducir, generarErrores, corregirReducir, candidatosDe,
  ESTA_DEFINIDO, explicaError, claveItem, CASOS_HOJA, HUELLAS_EXAMEN, reservado, sinReducirAun,
} from '../practicas/terminos-semejantes/logica.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const limpio = t => !/[()^²×]|\b1[xy]|\+ −|\.\d/.test(t);
const val = t => leerExpresion(t, { variasLetras: true }).valor;

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
    if (it.error === null) {
      assert.ok(e.equals(rhs), claveItem(it));
    } else {
      assert.ok(!e.equals(rhs), claveItem(it));
      assert.ok(ESTA_DEFINIDO(it.error));
      const quienes = candidatosDe(leerExpresion(it.origen, { variasLetras: true }).terminos).filter(c => c.valor && c.valor.equals(rhs));
      assert.deepEqual(quienes.map(c => c.error), [it.error], claveItem(it));
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
  assert.deepEqual([...vistos].sort(), ['ninguno', 'perder-signo', 'suma-no-semejantes', 'x-sin-coeficiente']);
});

test('los errores con nombre se explican en los dos idiomas', () => {
  for (const id of ['suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente', 'semejantes-por-el-numero']) {
    assert.match(explicaError(id, 'es'), /^Has /);
    assert.match(explicaError(id, 'en'), /^You /);
  }
});

test('casos reservados: hooks vacíos pero operativos', () => {
  assert.equal(CASOS_HOJA.size, 0);
  const e = lineal(2, 3);
  HUELLAS_EXAMEN.add(huellaCanonica(e));
  assert.equal(reservado(e), true);
  HUELLAS_EXAMEN.delete(huellaCanonica(e));
  assert.equal(reservado(e), false);
});
