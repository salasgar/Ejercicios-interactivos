// Práctica «Quita denominadores» (U6): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, nada equivalente, todo error con nombre, sin ×, %, x², dos letras, «1x» ni «+ −».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { leerEcuacion, leerExpresion, huellaCanonica, ecuacion, Ecuacion } from '../practicas/_comun/algebra.js';
import { Fraccion } from '../practicas/_comun/fracciones.js';
import { mcm } from '../practicas/_comun/aritmetica.js';
import {
  generarMcm, generarSin, generarResuelve, generarPasos, corregirResuelve, corregirPasos, leerSolucion,
  ESTA_DEFINIDO, explicaError, claveItem, CASOS_HOJA, HUELLAS_EXAMEN, reservado, candidatosMcm, candidatosCerrados,
  denominadoresDe,
} from '../practicas/denominadores/logica.js';
import { TX } from '../practicas/denominadores/textos.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const limpio = t => !/[×^²%]|\b1[xy]|\+ −|\+ \+|− −|\.\d/.test(t);
const soloX = t => !/[a-wyzA-WYZ]/.test(t);
const eq = t => { const r = leerEcuacion(t, { letras: ['x'] }); assert.ok(r.ok, t); return r.valor; };
const sol = q => q.resolver();
const mismaSolucion = (a, b) => { const x = sol(a), y = sol(b); return x instanceof Fraccion && y instanceof Fraccion && x.equals(y); };
const sinDenominadores = q => [...q.terminosIzq, ...q.terminosDer].every(t => t.coef.simplificar().den === 1);

test('los enunciados: una letra, denominadores de 2 a 12, m.c.m. ≤ 36, solución entera, sin lo que el acta deja fuera', () => {
  for (const [generar, semilla] of [[generarMcm, 11], [generarSin, 12], [generarResuelve, 13], [generarPasos, 14]]) {
    const plantillas = new Set();
    for (const it of items(generar, semilla)) {
      plantillas.add(it.plantilla);
      const q = eq(it.origen);
      assert.ok(limpio(it.origen) && soloX(it.origen), it.origen);
      assert.ok(!/\)|\(/.test(it.origen), it.origen);
      const dens = denominadoresDe(q);
      assert.ok(dens.length >= 1 && dens.every(d => d >= 2 && d <= 12), it.origen);
      assert.ok(q.mcmDenominadores() <= 36, it.origen);
      const s = sol(q);
      assert.ok(s instanceof Fraccion && s.den === 1 && s.num !== 0 && s.num >= -30 && s.num <= 60, `${it.origen}: ${s}`);
      assert.equal(q.terminosDer.length, 1);
      assert.equal(q.terminosDer[0].letra, null);
      assert.ok(Math.abs(q.terminosDer[0].coef.num) <= 150 && q.terminosDer[0].coef.num !== 0, it.origen);
      for (const t of q.terminosIzq) {
        if (t.letra) assert.ok(t.coef.den > 1 && Math.abs(t.coef.num) <= 5, it.origen);
        else assert.ok(t.coef.den === 1 && Math.abs(t.coef.num) >= 1 && Math.abs(t.coef.num) <= 9, it.origen);
      }
      assert.ok(q.terminosIzq.filter(t => t.letra).length <= 3);
      assert.ok(!reservado(q));
      assert.equal(claveItem(it), it.origen);
    }
    assert.ok(plantillas.size >= 3, [...plantillas].join());
  }
});

test('ejercicio 1: el m.c.m. exacto y tres distractores con nombre, todos distintos de él', () => {
  for (const it of items(generarMcm, 21)) {
    const q = eq(it.origen);
    const dens = denominadoresDe(q);
    assert.equal(it.mcm, mcm(...dens));
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const buena = it.opciones.find(o => o.correcta);
    assert.equal(Number(buena.valor), it.mcm);
    const valores = it.opciones.map(o => Number(o.valor));
    assert.equal(new Set(valores).size, 4, `${it.origen}: ${valores}`);
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(ESTA_DEFINIDO(o.error), o.error);
      assert.notEqual(Number(o.valor), it.mcm);
      assert.ok(Number(o.valor) > 1, 'multiplicar por 1 no es un distractor');
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
  assert.deepEqual(candidatosMcm([2, 3]).map(c => [c.id, c.valor]), [['mayor-denominador', 3], ['suma-de-denominadores', 5], ['multiplo-no-menor', 12]]);
  assert.deepEqual(candidatosMcm([4, 6]).map(c => [c.id, c.valor]), [['producto-de-denominadores', 24], ['mayor-denominador', 6], ['suma-de-denominadores', 10], ['mcd-en-vez-de-mcm', 2], ['multiplo-no-menor', 24]].filter(([, v], i, a) => a.findIndex(([, w]) => w === v) === i));
});

test('ejercicio 2: solo una opción es la ecuación sin denominadores equivalente; las otras tienen otra solución', () => {
  for (const it of items(generarSin, 22)) {
    const original = eq(it.origen);
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const qs = it.opciones.map(o => eq(o.valor));
    for (const [i, o] of it.opciones.entries()) {
      assert.ok(sinDenominadores(qs[i]), `${it.origen}: ${o.valor}`);
      assert.ok(limpio(o.valor) && soloX(o.valor), o.valor);
      if (o.correcta) {
        assert.ok(mismaSolucion(qs[i], original), `${it.origen}: ${o.valor}`);
        assert.ok(qs[i].equivalente(original.sinDenominadores(it.mcm)));
      } else {
        assert.ok(ESTA_DEFINIDO(o.error), o.error);
        assert.ok(!qs[i].equivalente(original), `${it.origen}: ${o.valor} es equivalente`);
      }
    }
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      assert.ok(!qs[i].equivalente(qs[j]), `${it.origen}: dos opciones equivalentes (${it.opciones[i].valor} / ${it.opciones[j].valor})`);
      assert.notEqual(it.opciones[i].valor, it.opciones[j].valor);
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
});

test('ejercicio 2: los candidatos de un caso fijo, con los números a mano', () => {
  const q = ecuacion('3x/4 + x/6', 22);
  assert.equal(q.sinDenominadores().aTexto(), '9x + 2x = 264');
  const c = Object.fromEntries(candidatosCerrados(q).map(x => [x.id, x.ecuacion.aTexto()]));
  assert.equal(c['mcm-solo-denominadores'], '9x + 2x = 22');
  assert.equal(c['olvidar-numerador'], '3x + 2x = 264');
  assert.equal(c['cada-por-su-denominador'], '3x + x = 22');
  assert.equal(c['signo-perdido-al-multiplicar'], '9x − 2x = 264');
  assert.ok(!('un-solo-miembro' in c), 'igual que el primero: se queda solo uno');
  const r = ecuacion('x/2 + 1', 4);
  assert.equal(r.sinDenominadores().aTexto(), 'x + 2 = 8');
  assert.equal(candidatosCerrados(r).find(x => x.id === 'mcm-solo-denominadores').ecuacion.aTexto(), 'x + 1 = 4');
});

test('ejercicio 3: la solución es exacta, se comprueba sustituyendo, y los errores no la dan', () => {
  const its = items(generarResuelve, 23);
  const negativas = its.filter(i => leerSolucion(i.solucion).num < 0).length;
  for (const it of its) {
    const q = eq(it.origen);
    const s = leerSolucion(it.solucion);
    assert.ok(s && s.den === 1);
    assert.ok(q.esSolucion(s), `${it.origen} con x = ${it.solucion}`);
    for (const e of it.errores) {
      assert.ok(ESTA_DEFINIDO(e.error), e.error);
      assert.ok(!leerSolucion(e.texto).equals(s), `${it.origen}: ${e.error} da lo bueno`);
      assert.ok(!q.esSolucion(leerSolucion(e.texto)), `${it.origen}: ${e.error} cumple la ecuación`);
    }
    assert.equal(new Set(it.errores.map(e => leerSolucion(e.texto).num + '/' + leerSolucion(e.texto).den)).size, it.errores.length);
    assert.equal(corregirResuelve(it, it.solucion).acierto, true);
    assert.equal(corregirResuelve(it, `x = ${it.solucion}`).acierto, true);
    assert.ok(it.explicacion.es && it.explicacion.en);
    assert.match(it.explicacion.es, /✓/);
  }
  assert.ok(negativas > 100 && negativas < N / 3, `negativas: ${negativas}`);
});

test('ejercicio 3: la corrección del alumno', () => {
  const it = generarResuelve(crearRng(9));
  assert.equal(corregirResuelve(it, '').valida, false);
  assert.equal(corregirResuelve(it, 'x').valida, false);
  assert.equal(corregirResuelve(it, '3x').valida, false);
  assert.equal(corregirResuelve(it, 'hola').valida, false);
  const e = it.errores[0];
  assert.deepEqual(corregirResuelve(it, e.texto), { valida: true, acierto: false, error: e.error });
  assert.equal(corregirResuelve({ ...it, errores: [], solucion: '3' }, '5').error, 'otra-solucion');
  assert.equal(leerSolucion('x = −2').num, -2);
  assert.equal(leerSolucion('x=6/3').num, 2);
});

test('ejercicio 4: tres huecos, cualquier ecuación equivalente sin denominadores vale', () => {
  const its = items(generarPasos, 24);
  for (const it of its) {
    const q = eq(it.origen);
    assert.equal(it.mcm, q.mcmDenominadores());
    const bien = [String(it.mcm), it.cerrada, `x = ${it.solucion}`];
    const r = corregirPasos(it, bien);
    assert.equal(r.acierto, true, it.origen);
    assert.ok(q.esSolucion(leerSolucion(it.solucion)));
    // otras formas válidas del hueco 2: la ecuación reducida y la solución, con otro orden de los miembros
    const reducida = `${q.sinDenominadores().izq.aTexto()} = ${q.sinDenominadores().der.aTexto()}`;
    assert.equal(corregirPasos(it, [bien[0], reducida, bien[2]]).acierto, true, reducida);
    assert.equal(corregirPasos(it, [bien[0], `${q.sinDenominadores().der.aTexto()} = ${q.sinDenominadores().izq.aTexto()}`, bien[2]]).acierto, true);
    assert.equal(corregirPasos(it, [bien[0], `x = ${it.solucion}`, bien[2]]).acierto, true);
    // el hueco 2 con los denominadores todavía puestos o con otra ecuación falla, con su error
    assert.equal(corregirPasos(it, [bien[0], it.origen, bien[2]]).error, 'con-denominadores');
    assert.equal(corregirPasos(it, [bien[0], 'x = 0', bien[2]]).acierto, false);
    // el hueco 1: el m.c.m. y nada más
    const doble = corregirPasos(it, [String(it.mcm * 2), bien[1], bien[2]]);
    assert.equal(doble.acierto, false);
    assert.ok(['multiplo-no-menor', 'producto-de-denominadores', 'suma-de-denominadores', 'mayor-denominador'].includes(doble.error), doble.error);
    assert.equal(corregirPasos(it, ['1', bien[1], bien[2]]).acierto, false);
    assert.equal(corregirPasos(it, [bien[0], bien[1], `x = ${it.solucion}1`]).acierto, false);
    assert.ok(it.explicacion.es && it.explicacion.en);
  }
});

test('ejercicio 4: huecos vacíos o ilegibles no son un fallo, son «sin comprobar»', () => {
  const it = generarPasos(crearRng(3));
  assert.equal(corregirPasos(it, ['', '', '']).valida, false);
  assert.equal(corregirPasos(it, ['hola', it.cerrada, it.solucion]).valida, false);
  assert.equal(corregirPasos(it, [String(it.mcm), '3x + 2x', it.solucion]).valida, false);
  assert.equal(corregirPasos(it, [String(it.mcm), 'x² = 4', it.solucion]).valida, false);
  assert.equal(corregirPasos(it, [String(it.mcm), it.cerrada, '2x']).valida, false);
  assert.equal(corregirPasos(it, ['1/2', it.cerrada, it.solucion]).valida, false);
});

test('los errores tienen nombre en los dos idiomas y la explicación habla de «Has…» / «You…»', () => {
  for (const id of ['producto-de-denominadores', 'mayor-denominador', 'cada-por-su-denominador', 'un-solo-miembro', 'signo-perdido-al-multiplicar', 'con-denominadores', 'mcm-solo-denominadores', 'olvidar-numerador', 'transponer-sin-signo']) {
    assert.ok(ESTA_DEFINIDO(id), id);
    assert.match(explicaError(id, 'es'), /^Has /, id);
    assert.match(explicaError(id, 'en'), /^You /, id);
  }
});

test('textos: cada instrucción e introducción en los dos idiomas, sin × ni %', () => {
  const recorre = (o, f) => { if (typeof o === 'string') f(o); else if (o && typeof o === 'object') Object.values(o).forEach(v => recorre(v, f)); };
  recorre(TX, s => assert.ok(!/×|%/.test(s), s));
  assert.equal(TX.ejercicios.length, 4);
  for (const e of TX.ejercicios) assert.ok(e.introduccion.es && e.introduccion.en && e.nombre.es && e.nombre.en && e.detalle.es && e.detalle.en);
  for (const o of Object.values(TX.instrucciones)) assert.ok(o.es && o.en);
});

test('casos reservados: hooks vacíos pero operativos', () => {
  assert.equal(CASOS_HOJA.size, 0);
  const e = ecuacion('x/2 + x/3', 5);
  assert.equal(reservado(e), false);
  HUELLAS_EXAMEN.add(huellaCanonica(e));
  assert.equal(reservado(e), true);
  HUELLAS_EXAMEN.delete(huellaCanonica(e));
  CASOS_HOJA.add(e.clave());
  assert.equal(reservado(e), true);
  CASOS_HOJA.delete(e.clave());
  assert.equal(reservado(e), false);
  assert.ok(e instanceof Ecuacion);
  assert.ok(leerExpresion('x/2', { letras: ['x'] }).ok);
});
