// Práctica «¿Qué se hace primero? Con enteros» (reparto-practicas-u2, tarea 87): la
// lógica se prueba por fuerza bruta (3000 ítems por ejercicio, semillas fijas) con
// el evaluador de la base y recorriendo TODOS los órdenes válidos de pasos.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import {
  analizar, evaluar, aTexto, pasosPosibles, aplicarPaso, valorLiteral, cadenaDePasos,
} from '../practicas/_comun/enteros.js';
import { TX } from '../practicas/jerarquia-enteros/textos.js';
import {
  generarPrimero, generarMezcla, generarCadena, generarCombinada, valida,
  clasificarToque, opcionesDePaso, opcionesOrdenadas, valoresDelPar, errorPar, esUltimo,
  MAX_FINAL, MAX_PASO,
} from '../practicas/jerarquia-enteros/logica.js';

const N = 3000;
const GUION = '-';

function generarN(fn, n = N, semilla = 11) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

const textosDe = items => items.flatMap(i => (i.tipo === 'par' ? [i.sin, i.con] : [i.texto]));

/** Todos los estados alcanzables con pasos válidos, con el paso que lleva a cada uno. */
function recorrer(texto) {
  const estados = [];
  const visto = new Set();
  const ir = arbol => {
    const clave = aTexto(arbol);
    if (visto.has(clave)) return;
    visto.add(clave);
    if (valorLiteral(arbol) !== null) return;
    for (const paso of pasosPosibles(arbol)) {
      estados.push({ arbol, paso });
      ir(aplicarPaso(arbol, paso));
    }
  };
  ir(analizar(texto));
  return estados;
}

const GENERADORES = [
  ['ej. 1', generarPrimero], ['ej. 2', generarMezcla], ['ej. 3', generarCadena], ['ej. 4', generarCombinada],
];

for (const [nombre, gen] of GENERADORES) {
  test(`${nombre}: resultado entero en ±100, pasos en ±200 y sin ceros, por cualquier orden válido`, () => {
    for (const texto of textosDe(generarN(gen))) {
      const final = evaluar(texto);
      assert.ok(Number.isInteger(final) && Math.abs(final) <= MAX_FINAL && final !== 0, `${texto} = ${final}`);
      const estados = recorrer(texto);
      assert.ok(estados.length > 0);
      for (const { arbol, paso } of estados) {
        assert.ok(Math.abs(paso.valor) <= MAX_PASO && paso.valor !== 0, `${texto}: ${paso.operacion}`);
        // el paso que acepta la práctica no cambia el valor de la expresión
        assert.equal(evaluar(aplicarPaso(arbol, paso)), final, `${texto}: ${paso.operacion}`);
      }
    }
  });
}

test('ej. 1-2 y 4: ningún paréntesis envuelve una operación; ej. 3: solo el del par (U3-3C-20)', () => {
  const sinOperacion = texto => {
    const mal = /\([^()]*[·:+−][^()]*\)/.exec(texto.replace(/\(−\d+\)/g, ''));
    return !mal;
  };
  for (const [nombre, gen] of GENERADORES) {
    for (const item of generarN(gen, 1500)) {
      if (item.tipo === 'par') {
        assert.ok(sinOperacion(item.sin), item.sin);
        assert.match(item.con, /^−?\d+ : \(−?\d+ · \(?−?\d+\)?\)$/);
      } else {
        assert.ok(sinOperacion(item.texto), `${nombre}: ${item.texto}`);
      }
    }
  }
});

test('ej. 3: salen cadenas y pares, y los pares dan resultados distintos y exactos', () => {
  const items = generarN(generarCadena);
  const pares = items.filter(i => i.tipo === 'par');
  assert.ok(pares.length / items.length > 0.3 && pares.length / items.length < 0.5);
  assert.ok(items.some(i => i.tipo === 'cadena'));
  for (const par of pares) {
    const [a, b] = valoresDelPar(par);
    assert.notEqual(a, b);
    assert.equal(a, evaluar(par.sin));
  }
  for (const c of items.filter(i => i.tipo === 'cadena')) assert.match(c.texto, /^[^+−]*$|^−?\d/);
});

test('ej. 3: las cadenas son solo de · y : y se calculan de izquierda a derecha', () => {
  for (const c of generarN(generarCadena).filter(i => i.tipo === 'cadena')) {
    const sinNegativos = c.texto.replace(/\(−\d+\)/g, 'n').replace(/^−/, '');
    assert.ok(!/[+−]/.test(sinNegativos), c.texto);
    // de izquierda a derecha, con la regla de la práctica: una sola respuesta
    const fichas = c.texto.replace(/[()]/g, '').replace(/−/g, '-').split(' ');
    let acc = Number(fichas[0]);
    for (let i = 1; i < fichas.length; i += 2) acc = fichas[i] === '·' ? acc * Number(fichas[i + 1]) : acc / Number(fichas[i + 1]);
    assert.equal(acc, evaluar(c.texto));
  }
});

test('ej. 2: la mitad lleva producto o cociente, la mitad una potencia; salen −b² al principio y negativos entre paréntesis', () => {
  const textos = textosDe(generarN(generarMezcla));
  const conPotencia = textos.filter(t => /[²³]/.test(t)).length / textos.length;
  assert.ok(conPotencia > 0.4 && conPotencia < 0.6, `conPotencia = ${conPotencia}`);
  assert.ok(textos.some(t => /^−\d[²³]/.test(t)));
  assert.ok(textos.some(t => /\(−\d+\)[²³]/.test(t)));
  assert.ok(textos.some(t => / : /.test(t)));
  for (const t of textos) assert.ok(!/[+−·:] −\d/.test(t), `signo sin paréntesis tras un operador: ${t}`);
});

test('ej. 4: todas llevan potencia, producto o cociente y suma o resta', () => {
  for (const t of textosDe(generarN(generarCombinada))) {
    assert.ok(/[²³]/.test(t) && /[·:]/.test(t) && /[+−]/.test(t.replace(/^−/, '').replace(/\(−/g, '(')), t);
    assert.ok(!/[+−·:] −\d/.test(t), t);
  }
});

test('ej. 1: nunca lleva potencia, producto y suma/resta a la vez (combinadas, sesión 13)', () => {
  const sumaOResta = t => /[+−]\s/.test(t.replace(/^−/, '').replace(/\(−/g, '('));
  for (const t of textosDe(generarN(generarPrimero))) {
    assert.ok(!(/[²³]/.test(t) && /[·:]/.test(t) && sumaOResta(t)), t);
  }
});

test('ej. 1: sale de las tres familias y hay un solo paso o varios que pueden ir primero', () => {
  const textos = textosDe(generarN(generarPrimero));
  assert.ok(textos.some(t => /[²³]/.test(t) && !/[·:]/.test(t)));
  assert.ok(textos.some(t => !/[²³]/.test(t) && /[·:]/.test(t) && /[+−]\s/.test(t.replace(/^−/, ''))));
  assert.ok(textos.some(t => !/[²³]/.test(t) && /[·:]/.test(t) && !/[+−]\s/.test(t.replace(/^−/, ''))));
  const varios = textos.filter(t => pasosPosibles(analizar(t)).length > 1).length;
  assert.ok(varios > 0);
});

test('clasificarToque: vale lo que vale `pasosPosibles` y lo demás es un error con nombre', () => {
  for (const texto of textosDe(generarN(generarMezcla, 400)).concat(textosDe(generarN(generarCadena, 400)), textosDe(generarN(generarCombinada, 400)))) {
    const arbol = analizar(texto);
    const validas = new Set(pasosPosibles(arbol).map(p => p.ruta));
    const rutas = ['', 'izq', 'der', 'izq.izq', 'izq.der', 'der.izq', 'der.der', 'izq.arg', 'der.base', 'izq.base'];
    for (const ruta of rutas) {
      const r = clasificarToque(arbol, ruta);
      assert.equal(r.valido, validas.has(ruta), `${texto} @${ruta}`);
      if (!r.valido) {
        assert.ok(['sin-jerarquia', 'derecha-a-izquierda'].includes(r.error));
        assert.ok(errorValido(r.error));
        assert.ok(r.canonico && typeof r.canonico.operacion === 'string');
      }
    }
  }
  // 2 − 4 + 3: tocar el + (la segunda) es ir de derecha a izquierda
  assert.equal(clasificarToque(analizar('2 − 4 + 3'), '').error, 'derecha-a-izquierda');
  // 3 + 4 · 2: tocar el + sin hacer antes el producto es no respetar la jerarquía
  assert.equal(clasificarToque(analizar('3 + 4 · 2'), '').error, 'sin-jerarquia');
  assert.equal(clasificarToque(analizar('3 + 4 · 2'), 'der').valido, true);
  // 10 · 8 : 4: adelantar el cociente no cambia el valor, vale
  assert.equal(clasificarToque(analizar('10 · 8 : 4'), '').valido, true);
});

test('opciones de un paso: la buena y de 2 a 3 falsas distintas, cada una de un error con nombre, en cada paso de cada orden', () => {
  const todos = [generarMezcla, generarCadena, generarCombinada, generarPrimero].flatMap(g => textosDe(generarN(g, 600)));
  for (const texto of todos) {
    for (const { arbol, paso } of recorrer(texto)) {
      for (const original of [null, analizar(texto)]) {
        const o = opcionesDePaso(arbol, paso, original);
        assert.equal(o.correcta, paso.valor);
        assert.ok(o.falsas.length >= 2 && o.falsas.length <= 3, `${texto}: ${paso.operacion} → ${o.falsas.length}`);
        const valores = [o.correcta, ...o.falsas.map(f => f.valor)];
        assert.equal(new Set(valores).size, valores.length, `${texto}: ${paso.operacion} repetidas`);
        for (const f of o.falsas) {
          assert.notEqual(f.valor, paso.valor);
          assert.ok(Number.isInteger(f.valor));
          assert.ok(errorValido(f.error), f.error);
          assert.ok(TX.pista[f.error], `sin pista para ${f.error}`);
        }
        const orden = opcionesOrdenadas(o).map(x => x.valor);
        assert.deepEqual(orden, [...orden].sort((a, b) => a - b));
        assert.equal(opcionesOrdenadas(o).filter(x => x.error === null).length, 1);
      }
    }
  }
});

test('opciones de un paso: las trampas del final salen en el último paso (jerarquía olvidada, menos en la base)', () => {
  const casos = [
    ['4 − 5 · 2', 'sin-jerarquia', -2],        // (4 − 5) · 2
    ['−3² + 6', 'menos-en-la-base', 15],       // (−3)² + 6
    ['2 − 4 + 3', 'derecha-a-izquierda', -5],  // 2 − (4 + 3)
  ];
  for (const [texto, error, valor] of casos) {
    const arbol = analizar(texto);
    let x = arbol;
    // se llega al último paso por el camino de la práctica
    while (true) {
      const paso = pasosPosibles(x)[0];
      if (esUltimo(x, paso)) {
        const o = opcionesDePaso(x, paso, arbol);
        const f = o.falsas.find(y => y.error === error);
        assert.ok(f, `${texto}: falta ${error} entre ${JSON.stringify(o.falsas)}`);
        assert.equal(f.valor, valor);
        break;
      }
      x = aplicarPaso(x, paso);
    }
  }
});

test('opciones de un paso: son deterministas (mismo paso, mismas opciones)', () => {
  for (const texto of textosDe(generarN(generarCombinada, 200))) {
    for (const { arbol, paso } of recorrer(texto)) {
      assert.deepEqual(opcionesDePaso(arbol, paso, false), opcionesDePaso(arbol, paso, false));
    }
  }
});

test('par de U3-3C-20: el error es ignorar el paréntesis cuando se intercambian los dos valores', () => {
  const par = { tipo: 'par', sin: '30 : (−5) · 2', con: '30 : (−5 · 2)' };
  assert.deepEqual(valoresDelPar(par), [-12, -3]);
  assert.equal(errorPar(par, 1, -12), 'ignora-el-parentesis');
  assert.equal(errorPar(par, 0, -3), 'ignora-el-parentesis');
  assert.equal(errorPar(par, 0, 12), 'signo-cambiado');
  assert.equal(errorPar(par, 1, 7), 'otro-error-cadena');
  assert.ok(errorValido('otro-error-cadena'));
  // la cadena de pasos que se enseña en el feedback llega al número
  assert.equal(cadenaDePasos(par.con).at(-1).arbol.valor ?? evaluar(cadenaDePasos(par.con).at(-1).arbol), -3);
});

/** Todos los textos de TX en los dos idiomas, con argumentos de muestra para las funciones. */
function textosDeAlumno() {
  const salida = [];
  const recorrerTX = (nodo, ruta) => {
    if (nodo && typeof nodo === 'object' && ('es' in nodo || 'en' in nodo)) {
      for (const idioma of ['es', 'en']) {
        const t = nodo[idioma];
        if (typeof t === 'string') salida.push([`${ruta}.${idioma}`, t]);
        else if (typeof t === 'function') {
          for (const args of [['3 · (−2)'], ['3 · (−2)', '−6'], ['3 · (−2), (−2)²']]) {
            const r = t(...args);
            if (typeof r === 'string') salida.push([`${ruta}.${idioma}`, r]);
          }
        }
      }
      return;
    }
    if (nodo && typeof nodo === 'object') for (const [k, v] of Object.entries(nodo)) recorrerTX(v, `${ruta}.${k}`);
  };
  recorrerTX(TX, 'TX');
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

test('hay pista (es y en) para todo error con nombre que pueda salir como falso', () => {
  for (const [id, pista] of Object.entries(TX.pista)) {
    assert.ok(pista.es && pista.en, id);
    assert.ok(errorValido(id), id);
  }
});

test('valida rechaza lo fuera de cota (resultado, pasos o divisiones no exactas)', () => {
  assert.equal(valida('4 − 5 · 2'), true);
  assert.equal(valida('9 · 9 · 9 : 9'), false);   // paso de 729
  assert.equal(valida('7 : 2 + 1'), false);       // división no exacta
  assert.equal(valida('4 − 4'), false);           // resultado 0
  assert.equal(MAX_FINAL, 100);
});
