// Práctica «¿Qué se hace primero? Con fracciones» (reparto-practicas-u2, tarea 106): la lógica se
// prueba por fuerza bruta (3000 ítems por ejercicio, semillas fijas) con el evaluador de la base y
// recorriendo TODOS los órdenes válidos de pasos. Las fracciones se comparan siempre POR VALOR.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import {
  analizar, evaluar, aTextoExpresion, pasosPosibles, aplicarPaso, valorLiteral, hayEquivalentes,
  ERRORES_TIPICOS, html, MENOS,
} from '../practicas/_comun/fracciones.js';
import { TX, pistaDe } from '../practicas/combinadas-fracciones/textos.js';
import {
  generarPrimero, generarPasos, generarError, valida, clasificarToque, opcionesDePaso, opcionesOrdenadas,
  diagnosticar, cuentaOperaciones, esUltimo, MAX_TERMINO_PASO, MAX_DEN_FINAL,
} from '../practicas/combinadas-fracciones/logica.js';

const N = 3000;

function generarN(fn, n = N, semilla = 11) {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
}

/** Todos los estados alcanzables con pasos válidos, con el paso que lleva a cada uno. */
function recorrer(texto) {
  const estados = [];
  const visto = new Set();
  const ir = arbol => {
    const clave = aTextoExpresion(arbol);
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

const hayNegativa = texto => texto.includes('−');

for (const [nombre, gen] of [['ej. 1', generarPrimero], ['ej. 2', generarPasos]]) {
  test(`${nombre}: 2 o 3 operaciones, final en cota y pasos en cota y distintos de 0, por cualquier orden válido`, () => {
    for (const { texto } of generarN(gen)) {
      const final = evaluar(texto);
      assert.ok(final.num !== 0 && final.den <= MAX_DEN_FINAL && Math.abs(final.num) <= MAX_TERMINO_PASO, `${texto} = ${final}`);
      const ops = cuentaOperaciones(texto);
      assert.ok(ops >= 2 && ops <= 3, `${texto}: ${ops} operaciones`);
      const estados = recorrer(texto);
      assert.ok(estados.length > 0);
      for (const { arbol, paso } of estados) {
        assert.ok(paso.valor.num !== 0 && Math.abs(paso.valor.num) <= MAX_TERMINO_PASO && paso.valor.den <= MAX_TERMINO_PASO, `${texto}: ${paso.operacion}`);
        // el paso que acepta la práctica no cambia el valor de la expresión
        assert.ok(evaluar(aplicarPaso(arbol, paso)).equals(final), `${texto}: ${paso.operacion}`);
      }
    }
  });
}

test('ej. 1-2: al menos una cuarta parte lleva una fracción negativa; los negativos solo van primero, tras · o : o abriendo un paréntesis', () => {
  for (const gen of [generarPrimero, generarPasos]) {
    const textos = generarN(gen).map(i => i.texto);
    const conNegativa = textos.filter(hayNegativa).length / textos.length;
    assert.ok(conNegativa >= 0.2, `con negativa: ${conNegativa}`);
    for (const t of textos) {
      // un «−» pegado a un número solo vale al principio, tras «(» o dentro de «(−…)» tras · o :
      assert.ok(!/[+−] −/.test(t), t);
      assert.ok(!/[·:] −/.test(t), `negativa sin paréntesis tras · o :  ${t}`);
    }
  }
});

test('ej. 1-3: nada de potencias, decimales, números mixtos, letras ni ×', () => {
  const textos = [
    ...generarN(generarPrimero, 1500).map(i => i.texto),
    ...generarN(generarPasos, 1500).map(i => i.texto),
    ...generarN(generarError, 600).flatMap(i => i.lineas),
  ];
  for (const t of textos) {
    assert.ok(!/[²³^×]/.test(t) && !/\d[.,]\d/.test(t) && !/[a-zA-Z]/.test(t), t);
    assert.ok(!/\d \d/.test(t), `número mixto: ${t}`);
    assert.ok(!t.includes('-'), `guion como menos: ${t}`);
  }
});

test('ej. 1: salen sin paréntesis, con paréntesis y cadenas; hay expresiones con varias operaciones a la vez', () => {
  const textos = generarN(generarPrimero).map(i => i.texto);
  assert.ok(textos.some(t => !t.includes('(') && /[·:]/.test(t) && /[+−] /.test(t.replace(/^−/, ''))));
  assert.ok(textos.some(t => /^\(/.test(t) || /\(\d/.test(t)));
  assert.ok(textos.some(t => !t.includes('(') && !/[·:]/.test(t)));           // A − B + C
  assert.ok(textos.some(t => pasosPosibles(analizar(t)).length > 1));
});

test('clasificarToque: vale lo que vale `pasosPosibles` y lo demás es un error con nombre', () => {
  for (const { texto } of [...generarN(generarPasos, 500), ...generarN(generarPrimero, 500)]) {
    const arbol = analizar(texto);
    const validas = new Set(pasosPosibles(arbol).map(p => p.ruta));
    for (const ruta of ['', 'izq', 'der', 'izq.izq', 'izq.der', 'der.izq', 'der.der', 'izq.arg', 'der.arg', 'izq.izq.izq']) {
      const r = clasificarToque(arbol, ruta);
      assert.equal(r.valido, validas.has(ruta), `${texto} @${ruta}`);
      if (!r.valido && r.canonico) {
        assert.ok(['jerarquia-olvidada', 'derecha-a-izquierda'].includes(r.error));
        assert.ok(errorValido(r.error) && TX.pista[r.error]);
        assert.equal(typeof r.canonico.operacion, 'string');
      }
    }
  }
  assert.equal(clasificarToque(analizar('1/2 − 1/3 + 1/4'), '').error, 'derecha-a-izquierda');
  assert.equal(clasificarToque(analizar('1/2 + 1/3 · 3/4'), '').error, 'jerarquia-olvidada');
  assert.equal(clasificarToque(analizar('1/2 + 1/3 · 3/4'), 'der').valido, true);
  // el paréntesis manda: 2/3 : (1/2 + 1/6), la división no puede ir primero
  assert.equal(clasificarToque(analizar('2/3 : (1/2 + 1/6)'), '').valido, false);
  assert.equal(clasificarToque(analizar('2/3 : (1/2 + 1/6)'), 'der.arg').valido, true);
});

test('opciones de un paso: la buena y de 2 a 3 falsas distintas POR VALOR, cada una de un error con nombre, en cada paso de cada orden', () => {
  for (const { texto } of [...generarN(generarPasos, 700), ...generarN(generarPrimero, 500)]) {
    const original = analizar(texto);
    for (const { arbol, paso } of recorrer(texto)) {
      for (const orig of [null, original]) {
        const o = opcionesDePaso(arbol, paso, orig);
        assert.ok(o.correcta.equals(paso.valor));
        assert.ok(o.falsas.length >= 2 && o.falsas.length <= 3, `${texto}: ${paso.operacion} → ${o.falsas.length}`);
        const valores = [o.correcta, ...o.falsas.map(f => f.valor)];
        assert.ok(!hayEquivalentes(valores), `${texto}: ${paso.operacion} tiene dos opciones equivalentes`);
        for (const f of o.falsas) {
          assert.ok(!f.valor.equals(paso.valor));
          assert.ok(f.valor.esIrreducible(), 'se muestran todas irreducibles');
          assert.ok(errorValido(f.error), f.error);
          assert.ok(TX.pista[f.error], `sin pista para ${f.error}`);
          assert.ok(ERRORES_TIPICOS[f.error] || f.error === 'confunde-la-operacion', f.error);
        }
        const orden = opcionesOrdenadas(o).map(x => x.valor);
        for (let i = 1; i < orden.length; i++) assert.ok(orden[i - 1].num * orden[i].den < orden[i].num * orden[i - 1].den, 'ordenadas de menor a mayor');
        assert.equal(opcionesOrdenadas(o).filter(x => x.error === null).length, 1);
      }
    }
  }
});

test('opciones de un paso: nunca sale la trampa de izquierda a derecha, y son deterministas', () => {
  const arbol = analizar('1/2 + 1/3 · 3/4');
  const intermedio = aplicarPaso(arbol, pasosPosibles(arbol)[0]);
  const ultimo = pasosPosibles(intermedio)[0];
  assert.ok(esUltimo(intermedio, ultimo));
  assert.ok(!opcionesDePaso(intermedio, ultimo, arbol).falsas.some(f => f.error === 'izquierda-a-derecha'));
  for (const { texto } of generarN(generarPasos, 300)) {
    for (const { arbol: a, paso } of recorrer(texto)) {
      assert.deepEqual(opcionesDePaso(a, paso, analizar(texto)), opcionesDePaso(a, paso, null));
      assert.ok(!opcionesDePaso(a, paso, null).falsas.some(f => f.error === 'izquierda-a-derecha'));
    }
  }
});

test('la pista de signo-perdido en · y : es la regla de los signos; en + y −, la de restar', () => {
  assert.equal(pistaDe('signo-perdido', `${MENOS}1 : 3/5`), TX.pista['signo-perdido-producto']);
  assert.equal(pistaDe('signo-perdido', `1/2 · (${MENOS}3/4)`), TX.pista['signo-perdido-producto']);
  assert.equal(pistaDe('signo-perdido', '1/4 − 2/3'), TX.pista['signo-perdido']);
  for (const idioma of ['es', 'en']) assert.ok(!/resta|take away|subtract/.test(TX.pista['signo-perdido-producto'][idioma]));
});

test('con un natural en una suma, el error es el del natural y no el de multiplicar denominadores', () => {
  const arbol = analizar('2 + 8/15');
  const paso = pasosPosibles(arbol)[0];
  const falsas = opcionesDePaso(arbol, paso).falsas;
  assert.ok(falsas.some(f => f.error === 'natural-al-numerador' && f.valor.equals(evaluar('10/15'))), JSON.stringify(falsas));
  assert.ok(!falsas.some(f => f.error === 'suma-multiplicando-denominadores' && f.valor.equals(evaluar('10/15'))));
});

test('una cadena de pasos: derecha-a-izquierda solo si la de la izquierda se podía hacer; si no, jerarquía', () => {
  assert.equal(clasificarToque(analizar('2/5 + 4 · 3/10 − 3/5'), '').error, 'jerarquia-olvidada');
  assert.equal(clasificarToque(analizar('2/5 + 4 · 3/10 − 3/5'), 'izq').valido, false);
  assert.equal(clasificarToque(analizar('1/2 − 1/3 + 1/4'), '').error, 'derecha-a-izquierda');
});

test('el natural 1 no va detrás de · o : ni delante de ·', () => {
  for (const { texto } of [...generarN(generarPrimero, 1500), ...generarN(generarPasos, 1500)]) {
    const f = texto.split(' ');
    f.forEach((x, i) => {
      if (!/^\(*[−]?1\)*$/.test(x)) return;
      assert.ok(!['·', ':'].includes(f[i - 1]) && f[i + 1] !== '·', texto);
    });
  }
});

test('ej. 3: exactamente una línea mal, y el diagnóstico independiente coincide con el ítem', () => {
  const items = generarN(generarError, 1500);
  for (const item of items) {
    assert.ok(item.lineas.length >= 3 && item.lineas.length <= 5, item.lineas.join(' | '));
    const diag = diagnosticar(item);
    const malas = diag.map((d, i) => [d, i + 1]).filter(([d]) => d !== 'bien');
    assert.equal(malas.length, 1, `${item.lineas.join(' | ')} → ${diag}`);
    assert.equal(malas[0][1], item.linea);
    assert.equal(malas[0][0], item.tipo, item.lineas.join(' | '));
    // el último es un número y la expresión de partida es válida
    assert.notEqual(valorLiteral(analizar(item.lineas.at(-1))), null);
    assert.ok(valida(item.lineas[0], { maxOperaciones: 3 }));
    assert.ok(errorValido(item.error) && TX.pista[item.error], item.error);
    // la línea buena, calculada por la base, no es la que se enseña
    assert.notEqual(item.bueno, item.lineas[item.linea]);
  }
});

test('ej. 3: salen los dos tipos de error y todos los errores tienen nombre; cada tipo pesa algo más del 30 %', () => {
  const items = generarN(generarError, 1500);
  const orden = items.filter(i => i.tipo === 'orden').length / items.length;
  assert.ok(orden > 0.3 && orden < 0.7, `orden = ${orden}`);
  assert.ok(items.filter(i => i.tipo === 'orden').every(i => i.error === 'izquierda-a-derecha'));
  const errores = new Set(items.filter(i => i.tipo === 'calculo').map(i => i.error));
  assert.ok(errores.size >= 6, [...errores].join(', '));
  // cuando el error es de cálculo, la operación se enseña y el valor bueno es irreducible
  for (const i of items.filter(x => x.tipo === 'calculo')) assert.match(i.valorBueno, /^−?\d+(\/\d+)?$/);
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
          // los argumentos llegan ya pintados (con raya), como en la práctica
          const [a, b] = [html('1/2 + 1/3'), html('5/6')];
          for (const args of [[a], [a, b], [2, html('1/2 · 1/3')]]) {
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

test('ningún texto de alumno lleva ×, el guion como signo, letras de variable ni decimales', () => {
  const textos = textosDeAlumno();
  assert.ok(textos.length > 60);
  for (const [donde, t] of textos) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!plano.includes('×'), `${donde}: ×`);
    assert.ok(!/(^|[\s(])-\d/.test(plano), `${donde}: guion como menos`);
    assert.ok(!/[=]\s*[xyn]\b|\b[xyn]\s*=/.test(plano), `${donde}: variable`);
    assert.ok(!/\d[.,]\d/.test(plano), `${donde}: decimal`);
    assert.ok(!/(^|\s)\d+\/\d+(\s|$|[.,;])/.test(plano.replace(/<[^>]+>/g, '')) || donde.includes('.en'), `${donde}: fracción con barra`);
  }
});

test('hay pista (es y en) para todo error con nombre que pueda salir', () => {
  for (const [id, pista] of Object.entries(TX.pista)) {
    assert.ok(pista.es && pista.en, id);
    assert.ok(errorValido(id), id);
  }
});

test('valida rechaza lo fuera de cota (final, pasos o dividir entre 0) y lo que no tiene 2 operaciones', () => {
  assert.equal(valida('5/6 − 1/4 · 2/3'), true);
  assert.equal(valida('1/2 + 1/3'), false);                  // una sola operación
  assert.equal(valida('1/2 : (1/2 − 1/2)'), false);           // entre 0
  assert.equal(MAX_DEN_FINAL, 36);
});
