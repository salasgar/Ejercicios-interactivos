// Práctica «Del enunciado al álgebra» (U6): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, ninguna falsa equivalente a otra ni a la buena (forma canónica), todo error
// con nombre, sin paréntesis ni decimales, y las cotas de realismo de cada contexto.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { leerExpresion, huellaCanonica, lineal } from '../practicas/_comun/algebra.js';
import {
  generarElige, generarEscribe, generarFrase, generarSituacion, corregirEscribe, leerEscrito,
  ESTA_DEFINIDO, COTAS, claveItem, fraseDe, FRASES_S1, CASOS_HOJA, HUELLAS_EXAMEN, reservado,
} from '../practicas/traduce/logica.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const sinTags = h => h.replace(/<[^>]*>/g, '');

function revisaElecciones(its) {
  for (const it of its) {
    assert.equal(it.opciones.length, 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1, claveItem(it));
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, 4, `valores repetidos en ${claveItem(it)}`);
    for (const o of it.opciones) {
      if (o.correcta) continue;
      assert.ok(ESTA_DEFINIDO(o.error), `error sin nombre: ${o.error}`);
      assert.ok(o.por_que.es && o.por_que.en);
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
}

test('elige la expresión: buena única, sin equivalentes, sin paréntesis', () => {
  const its = items(generarElige, 11);
  revisaElecciones(its);
  for (const it of its) {
    const claves = it.opciones.map(o => leerExpresion(o.texto).valor.clave());
    assert.equal(new Set(claves).size, 4, claveItem(it));
    for (const o of it.opciones) assert.ok(!/[()]/.test(o.texto), o.texto);
  }
  assert.ok(new Set(its.map(i => i.plantilla)).size >= FRASES_S1.length);
});

test('escríbela: la buena se acepta, sus equivalentes también y un error típico se nombra', () => {
  const its = items(generarEscribe, 12);
  for (const it of its) {
    assert.deepEqual(corregirEscribe(it, it.correcta), { valida: true, acierto: true });
    const lee = leerExpresion(it.correcta).valor;
    const alReves = lee.aTexto('es', { constanteDelante: true });
    assert.equal(corregirEscribe(it, alReves).acierto, true, `${it.correcta} / ${alReves}`);
    for (const e of it.errores) {
      const c = corregirEscribe(it, e.texto);
      if (leerExpresion(e.texto).valor.equals(lee)) continue;
      assert.equal(c.acierto, false);
      assert.ok(ESTA_DEFINIDO(c.error), c.error);
    }
  }
  assert.equal(corregirEscribe(its[0], '2x+').valida, false);
  assert.equal(corregirEscribe(its[0], '').valida, false);
});

test('elige la frase: una buena, cuatro frases distintas, expresión sin paréntesis', () => {
  const its = items(generarFrase, 13);
  revisaElecciones(its);
  for (const it of its) {
    assert.equal(new Set(it.opciones.map(o => o.frases.es)).size, 4);
    assert.equal(new Set(it.opciones.map(o => o.frases.en)).size, 4);
    assert.ok(!/[()]/.test(it.texto));
    for (const o of it.opciones) assert.ok(!/\d\.\d|undefined|NaN/.test(o.frases.es + o.frases.en));
  }
});

test('situaciones: una buena, cotas de realismo y valores posibles', () => {
  const its = items(generarSituacion, 14);
  revisaElecciones(its);
  const tipos = new Set(its.map(i => i.tipo));
  assert.deepEqual([...tipos].sort(), ['cantidad', 'expresion', 'valor']);
  for (const it of its) {
    if (it.tipo === 'valor') {
      const [, id, f, p, c] = it.clave.split('|');
      const cot = COTAS[id];
      assert.ok(+f >= cot.f[0] && +f <= cot.f[1] && +p >= cot.p[0] && +p <= cot.p[1] && +c >= cot.c[0] && +c <= cot.c[1]);
      const buena = it.opciones.find(o => o.correcta).numero;
      assert.equal(buena, +f + +p * +c);
      assert.ok(buena <= cot.tope, `${buena} > tope en ${id}`);
      assert.ok(it.opciones.every(o => o.numero > 0 && Number.isInteger(o.numero)));
    }
    if (it.tipo === 'expresion') {
      const [, id, f, p] = it.clave.split('|');
      const cot = COTAS[id];
      assert.ok(+f + +p * cot.c[1] <= cot.tope, `${id}: tope`);
      const buena = leerExpresion(it.opciones.find(o => o.correcta).texto).valor;
      assert.ok(buena.equals(lineal(+p, +f, cot.letra)));
      assert.equal(new Set(it.opciones.map(o => leerExpresion(o.texto).valor.clave())).size, 4);
    }
  }
});

test('el alumno puede cambiar de letra al escribir (una sola letra)', () => {
  const r = leerEscrito('2n+3');
  assert.ok(r.ok && r.valor.equals(lineal(2, 3, 'x')));
  assert.equal(leerEscrito('2x+3y').ok, false);
});

test('casos reservados: hooks vacíos pero operativos', () => {
  assert.equal(CASOS_HOJA.size >= 0, true);
  const e = lineal(2, 3);
  HUELLAS_EXAMEN.add(huellaCanonica(e));
  assert.equal(reservado(e), true);
  HUELLAS_EXAMEN.delete(huellaCanonica(e));
  assert.equal(reservado(e), false);
});

test('frases: sin ambigüedad en lo que lleva dos operaciones', () => {
  assert.equal(fraseDe({ k: '2', n: 3, op: '+' }, 'es'), 'el doble de un número, más tres');
  assert.equal(fraseDe({ k: '2', n: 3, op: '+' }, 'en'), 'twice a number, plus three');
  assert.equal(fraseDe({ k: '1', n: 5, op: 'n-' }, 'es'), 'cinco menos un número');
});

test('situaciones: el dinero siempre con dos decimales y sin «veces más»', () => {
  const its = items(generarSituacion, 21);
  const euros = /(\d+)[,.](\d+) ?€|€(\d+)\.(\d+)/;
  let vistos = 0;
  for (const it of its) {
    const textos = [it.enunciado, it.pregunta, it.solucion].filter(Boolean);
    for (const t of textos) assert.ok(!/veces más/.test(t.es), claveItem(it));
    if (it.tipo === 'cantidad') continue;
    if (it.tipo === 'valor') {
      for (const o of it.opciones) {
        assert.match(o.frases.es, /^\d+,\d\d €$/);
        assert.match(o.frases.en, /^€\d+\.\d\d$/);
        if (!o.correcta) { assert.match(o.por_que.es, /\d+,\d\d/); assert.match(o.por_que.en, /\d+\.\d\d/); }
      }
      assert.match(it.solucion.es, /\d+,\d\d \+ \d+,\d\d · \d+ = \d+,\d\d \+ \d+,\d\d = \d+,\d\d/);
    }
    const intro = it.enunciado;
    assert.match(intro.es, /\d+,\d\d €/, claveItem(it));
    assert.match(intro.en, /€\d+\.\d\d/, claveItem(it));
    assert.ok(euros.test(intro.es + intro.en));
    vistos++;
  }
  assert.ok(vistos > 1000);
});
