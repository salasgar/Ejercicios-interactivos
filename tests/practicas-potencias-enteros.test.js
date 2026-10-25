// Práctica «Productos y potencias con signo» (reparto-practicas-u2, tarea 86): la
// lógica se prueba por fuerza bruta (3000 ítems por ejercicio, semillas fijas) contra
// JavaScript (`**`, `*`) y contra el evaluador de la base.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import { fmt, analizar, evaluar, nodoEn, aTexto, html, ERRORES_TIPICOS } from '../practicas/_comun/enteros.js';
import { TX } from '../practicas/potencias-enteros/textos.js';
import {
  generarProducto, producto, posicionesNegativas, expresionProducto, errorProducto,
  generarPotencia, POTENCIAS, valorPotencia, textoPotencia, errorPotencia,
  generarBase, textoBase, arbolBase, valorBase, rutaBase, baseDeItem, errorBase,
  generarRaiz, buenasCuadrados, cuadrado, errorCuadrados, errorRaiz, esAciertoRaiz,
  MAX_VALOR, MAX_PRODUCTO,
} from '../practicas/potencias-enteros/logica.js';

const N = 3000;
const GUION = '-';

function generarN(fn, n = N, semilla = 7) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

// --- Ejercicio 1 -----------------------------------------------------------------------

test('ej. 1: de 3 a 5 factores, |factor| ≤ 5, |producto| ≤ 500 y el producto coincide con el evaluador', () => {
  for (const item of generarN(generarProducto)) {
    assert.ok(item.factores.length >= 3 && item.factores.length <= 5);
    assert.ok(item.factores.every(f => Number.isInteger(f) && Math.abs(f) <= 5));
    assert.ok(Math.abs(producto(item)) <= MAX_PRODUCTO);
    assert.equal(producto(item), evaluar(expresionProducto(item)));
  }
});

test('ej. 1: el signo del producto lo decide la paridad de los negativos (si no hay ceros)', () => {
  for (const item of generarN(generarProducto)) {
    if (item.factores.includes(0)) { assert.equal(producto(item), 0); continue; }
    const k = posicionesNegativas(item).length;
    assert.equal(producto(item) < 0, k % 2 === 1);
  }
});

test('ej. 1: hay ceros y −1 en torno a uno de cada cinco ítems; salen pares e impares', () => {
  const items = generarN(generarProducto);
  const especiales = items.filter(it => it.factores.includes(0) || it.factores.includes(-1)).length / items.length;
  assert.ok(especiales >= 0.15 && especiales <= 0.55, `especiales = ${especiales}`);
  const ceros = items.filter(it => it.factores.includes(0)).length / items.length;
  assert.ok(ceros >= 0.05 && ceros <= 0.2, `ceros = ${ceros}`);
  const impares = items.filter(it => posicionesNegativas(it).length % 2 === 1).length / items.length;
  assert.ok(impares >= 0.3 && impares <= 0.7, `impares = ${impares}`);
});

test('ej. 1: errorProducto distingue contar mal, signo cambiado y cuenta mal hecha', () => {
  const item = { factores: [-2, 3, -1, -5] };
  assert.equal(producto(item), -30);
  assert.equal(errorProducto(item, [0, 2], -30), 'cuenta-mal-los-negativos');
  assert.equal(errorProducto(item, [0, 2, 3], 30), 'signo-cambiado');
  assert.equal(errorProducto(item, [0, 2, 3], -25), 'producto-mal-calculado');
});

// --- Ejercicio 2 -----------------------------------------------------------------------

test('ej. 2: bases de −1 a −10, exponente 2-4 (5 solo con −1 y −2) y |valor| ≤ 1000', () => {
  for (const item of generarN(generarPotencia)) {
    assert.ok(item.base >= -10 && item.base <= -1);
    assert.ok(item.exp >= 2 && item.exp <= 5);
    if (item.exp === 5) assert.ok(item.base === -1 || item.base === -2);
    assert.ok(Math.abs(valorPotencia(item)) <= MAX_VALOR);
    assert.equal(valorPotencia(item), evaluar(textoPotencia(item.base, item.exp)));
  }
});

test('ej. 2: el catálogo de potencias tiene todas las bases, y pares e impares', () => {
  assert.deepEqual([...new Set(POTENCIAS.map(p => p.base))].sort((a, b) => a - b), [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
  assert.ok(POTENCIAS.some(p => p.exp % 2 === 0) && POTENCIAS.some(p => p.exp % 2 === 1));
  assert.ok(POTENCIAS.some(p => p.exp === 5));
});

test('ej. 2: el signo lo decide el exponente y los errores típicos nunca dan la respuesta buena', () => {
  for (const item of generarN(generarPotencia)) {
    const v = valorPotencia(item);
    assert.equal(v < 0, item.exp % 2 === 1);
    for (const [id, args] of [
      ['potencia-par-negativa', [item.base, item.exp]],
      ['potencia-impar-positiva', [item.base, item.exp]],
      ['base-por-exponente', [item.base, item.exp]],
    ]) {
      const mal = ERRORES_TIPICOS[id].fn(...args);
      if (mal !== null) assert.notEqual(mal, v);
    }
  }
  assert.equal(errorPotencia({ base: -2, exp: 4 }, -16), 'potencia-par-negativa');
  assert.equal(errorPotencia({ base: -2, exp: 3 }, 8), 'potencia-impar-positiva');
  assert.equal(errorPotencia({ base: -5, exp: 2 }, -10), 'base-por-exponente');
  assert.equal(errorPotencia({ base: -5, exp: 2 }, 7), 'otro-error-potencia');
});

// --- Ejercicio 3 -----------------------------------------------------------------------

test('ej. 3: los tres tipos salen, el valor coincide con el evaluador y |valor| ≤ 1000', () => {
  const items = generarN(generarBase);
  assert.deepEqual([...new Set(items.map(i => i.tipo))].sort(), ['a', 'b', 'c']);
  for (const item of items) {
    assert.ok(item.a >= 2 && item.a <= 10 && item.exp >= 2 && item.exp <= 4);
    const cuando = item.exp % 2 === 0 ? 1 : -1;
    // (−a)ⁿ, −aⁿ y −(−a)ⁿ, calculados por su cuenta
    const valor = { a: cuando * item.a ** item.exp, b: -(item.a ** item.exp), c: -(cuando * item.a ** item.exp) }[item.tipo];
    assert.equal(valorBase(item), valor);
    assert.ok(Math.abs(valor) <= MAX_VALOR);
  }
});

test('ej. 3: con −a², la base resaltada es a; con (−a)², −a; la ruta señala esa base en el árbol', () => {
  for (const item of generarN(generarBase)) {
    const base = baseDeItem(item);
    assert.equal(base, item.tipo === 'b' ? item.a : -item.a);
    const nodo = nodoEn(arbolBase(item), rutaBase(item));
    assert.equal(evaluar(nodo), base);
    // el árbol: la base es lo que lleva el exponente pegado
    const padre = nodoEn(arbolBase(item), rutaBase(item).split('.').slice(0, -1).join('.'));
    assert.equal(padre.tipo, 'pot');
    assert.equal(padre.exp, item.exp);
    // y el HTML la envuelve
    const salida = html(arbolBase(item), { envolver: { [rutaBase(item)]: 'base-resaltada' } });
    assert.ok(salida.includes('<span class="base-resaltada">'));
    assert.equal(aTexto(arbolBase(item)), textoBase(item));
  }
});

test('ej. 3: los errores típicos del ítem dan un valor distinto del bueno', () => {
  for (const item of generarN(generarBase)) {
    const v = valorBase(item);
    if (item.tipo === 'b') {
      const mal = ERRORES_TIPICOS['menos-en-la-base'].fn(item.a, item.exp);
      assert.notEqual(mal, v);
      if (mal !== null) assert.equal(errorBase(item, mal), 'menos-en-la-base');
    }
    if (item.tipo === 'c') {
      const mal = ERRORES_TIPICOS['signos-antes-de-la-potencia'].fn(-item.a, item.exp);
      assert.notEqual(mal, v);
      if (mal !== null) assert.equal(errorBase(item, mal), 'signos-antes-de-la-potencia');
    }
  }
  assert.equal(errorBase({ tipo: 'b', a: 3, exp: 2 }, 9), 'menos-en-la-base');
  assert.equal(errorBase({ tipo: 'c', a: 3, exp: 2 }, 9), 'signos-antes-de-la-potencia');
});

// --- Ejercicio 4 -----------------------------------------------------------------------

test('ej. 4: cuadrados perfectos de 1 a 144 y los tres tipos de ítem', () => {
  const items = generarN(generarRaiz);
  assert.deepEqual([...new Set(items.map(i => i.tipo))].sort(), ['cuadrados', 'negativa', 'raiz']);
  const cuadrados = items.filter(i => i.tipo === 'cuadrados').length / items.length;
  assert.ok(cuadrados >= 0.4 && cuadrados <= 0.6, `cuadrados = ${cuadrados}`);
  for (const item of items) {
    assert.ok(Number.isInteger(item.r) && item.r >= 1 && item.r <= 12);
    assert.ok(cuadrado(item) >= 1 && cuadrado(item) <= 144);
    assert.ok(Number.isInteger(Math.sqrt(cuadrado(item))));
  }
});

test('ej. 4: «qué enteros dan n»: solo r y −r cumplen, ninguna falsa lo cumple, y hay al menos dos falsas', () => {
  for (const item of generarN(generarRaiz).filter(i => i.tipo === 'cuadrados')) {
    const n = cuadrado(item);
    const buenas = item.opciones.filter(v => v * v === n);
    assert.deepEqual(buenas, buenasCuadrados(item));
    assert.deepEqual(buenas, [-item.r, item.r]);
    assert.ok(item.falsas.length >= 2 && item.falsas.length <= 3);
    assert.equal(item.opciones.length, 2 + item.falsas.length);
    assert.equal(new Set(item.opciones).size, item.opciones.length);
    for (const f of item.falsas) {
      assert.notEqual(f.valor * f.valor, n);
      assert.ok(item.opciones.includes(f.valor));
      assert.ok(errorValido(f.error), f.error);
    }
  }
});

test('ej. 4: nunca 7 y ±7 a la vez entre las opciones: la pregunta de los dos enteros no lleva √, y las otras no llevan opciones', () => {
  for (const item of generarN(generarRaiz)) {
    if (item.tipo === 'cuadrados') {
      assert.ok(!('opcionesRaiz' in item));
      const enunciado = TX.ej4.cuadrados.es(cuadrado(item)) + TX.ej4.cuadrados.en(cuadrado(item));
      assert.ok(!enunciado.includes('√'));
      assert.ok(!enunciado.includes('±'));
    } else {
      assert.ok(!('opciones' in item));
    }
  }
});

test('ej. 4: aciertos y errores de √', () => {
  assert.ok(esAciertoRaiz({ tipo: 'raiz', r: 7 }, 7));
  assert.ok(!esAciertoRaiz({ tipo: 'raiz', r: 7 }, -7));
  assert.ok(!esAciertoRaiz({ tipo: 'raiz', r: 7 }, 'no-existe'));
  assert.ok(esAciertoRaiz({ tipo: 'negativa', r: 7 }, 'no-existe'));
  assert.ok(!esAciertoRaiz({ tipo: 'negativa', r: 7 }, -7));
  assert.equal(errorRaiz({ tipo: 'raiz', r: 7 }, -7), 'raiz-negativa');
  assert.equal(errorRaiz({ tipo: 'raiz', r: 7 }, 'no-existe'), 'raiz-no-existe');
  assert.equal(errorRaiz({ tipo: 'raiz', r: 7 }, 8), 'raiz-mal-calculada');
  assert.equal(errorRaiz({ tipo: 'negativa', r: 3 }, -3), 'raiz-de-negativo-negativa');
  assert.equal(errorRaiz({ tipo: 'negativa', r: 3 }, 3), 'raiz-de-negativo-positiva');
  const item = { tipo: 'cuadrados', r: 7, falsas: [{ valor: 14, error: 'base-por-exponente' }] };
  assert.equal(errorCuadrados(item, [7]), 'solo-un-signo');
  assert.equal(errorCuadrados(item, [7, 14]), 'base-por-exponente');
});

// --- Registro de fallos y textos de alumno ----------------------------------------------

test('todos los identificadores de error tienen el formato que acepta el registro de fallos', () => {
  const ids = [
    'cuenta-mal-los-negativos', 'signo-cambiado', 'producto-mal-calculado', 'otro-error-potencia',
    'base-equivocada', 'otro-error-base', 'solo-un-signo', 'raiz-no-existe', 'raiz-negativa', 'raiz-mal-calculada',
    'raiz-de-negativo-negativa', 'raiz-de-negativo-positiva',
    ...generarN(generarRaiz).flatMap(i => (i.falsas ?? []).map(f => f.error)),
  ];
  for (const id of ids) assert.ok(errorValido(id), id);
});

/** Todos los textos de TX en los dos idiomas, con argumentos de muestra para las funciones. */
function textosDeAlumno() {
  const salida = [];
  const recorrer = (nodo, ruta) => {
    if (nodo && typeof nodo === 'object' && ('es' in nodo || 'en' in nodo)) {
      for (const idioma of ['es', 'en']) {
        const t = nodo[idioma];
        if (typeof t === 'string') salida.push([`${ruta}.${idioma}`, t]);
        else if (typeof t === 'function') {
          for (const args of [[1, true], [3, false], [7, 49], [2, 4, 16], ['5'], [49]]) {
            let r;
            try { r = t(...args); } catch { continue; }
            if (typeof r === 'string') salida.push([`${ruta}.${idioma}(${args.join(',')})`, r]);
          }
        }
      }
      return;
    }
    if (nodo && typeof nodo === 'object') for (const [k, v] of Object.entries(nodo)) recorrer(v, `${ruta}.${k}`);
  };
  recorrer(TX, 'TX');
  return salida;
}

test('ningún texto de alumno lleva ×, el guion como signo, «(+», letras de variable ni decimales', () => {
  const textos = textosDeAlumno();
  assert.ok(textos.length > 60);
  for (const [donde, t] of textos) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!plano.includes('×'), `${donde}: ×`);
    assert.ok(!plano.includes('(+'), `${donde}: (+`);
    assert.ok(!new RegExp(`(^|[\\s(])\\${GUION}\\d`).test(plano), `${donde}: guion como menos`);
    assert.ok(!/[=]\s*[xyn]\b|\b[xyn]\s*=/.test(plano), `${donde}: variable`);
    assert.ok(!/\d[.,]\d/.test(plano), `${donde}: decimal`);
  }
});

test('el menos que se ve es U+2212 en todos los textos generados con números', () => {
  const { es } = TX.ej4.solo_uno;
  assert.ok(es(7, 7).includes('−7'));
  assert.ok(TX.ej4.los_dos.es(7, 49).includes('−7'));
  assert.ok(TX.ej4.negativa_no_existe.es(49).includes('√(−49)'));
  assert.equal(fmt(-3), '−3');
  assert.ok(expresionProducto({ factores: [-2, 3, -1] }).startsWith('(−2)'));
});

test('los textos de la práctica existen en español e inglés y las clases del catálogo coinciden', () => {
  for (const k of ['ej1', 'ej2', 'ej3', 'ej4']) {
    for (const campo of ['nombre', 'detalle', 'introduccion']) {
      assert.ok(TX[k][campo].es && TX[k][campo].en, `${k}.${campo}`);
    }
  }
  assert.equal(analizar(textoBase({ tipo: 'a', a: 3, exp: 2 })) !== null, true);
});
