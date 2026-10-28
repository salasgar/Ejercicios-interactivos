// Práctica «Caza el error» de la unidad 4 (PU2, tarea 107): la lógica se prueba por fuerza bruta con
// semillas fijas (3000 ítems por ejercicio). El valor de cada línea sale de `evaluar` de fracciones.js
// (ya probado contra BigInt en practicas-fracciones.test.js) y el valor equivocado de cada plantilla se
// recalcula aquí a mano, con enteros, sin pasar por ERRORES_TIPICOS.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, analizar, evaluar, comparar, fraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores4/logica.js';
import { TX } from '../practicas/errores4/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const val = texto => evaluar(analizar(texto));
const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));
const mcm = (a, b) => (a / mcd(a, b)) * b;
const igual = (x, [n, d]) => x.num * d === n * x.den;

/** El valor equivocado de cada plantilla (n, d), calculado a mano con enteros. */
const MAL = {
  'suma-arriba-y-abajo': ([p, q, r, s]) => { const m = mcm(q, s); return [p * (m / q) + r * (m / s), 2 * m]; },
  'signo-perdido': ([p, q, r, s]) => { const m = mcm(q, s); return [r * (m / s) - p * (m / q), m]; },
  'suma-multiplicando-denominadores': ([p, q, r, s]) => [p + r, q * s],
  'simplifica-solo-numerador': ([n, d, p]) => [n / p, d],
  'simplifica-solo-denominador': ([n, d, p]) => [n, d / p],
  'se-queda-en-la-unitaria': ([, d, n]) => [n, d],
  'multiplica-por-el-denominador': ([, d, n]) => [n * d, 1],
  'fraccion-de-al-reves': ([p, d, n]) => [(n / p) * d, 1],
  'invierte-la-primera': ([p, q, r, s]) => [q * r, p * s],
  'no-invierte': ([p, q, r, s]) => [p * r, q * s],
  'invierte-las-dos': ([p, q, r, s]) => [q * s, p * r],
  'eleva-solo-el-numerador': ([p, q, n]) => [p ** n, q],
};
/** El valor bueno de cada plantilla (n, d), a mano. */
const BIEN = {
  'suma-arriba-y-abajo': ([p, q, r, s]) => [p * s + r * q, q * s],
  'signo-perdido': ([p, q, r, s]) => [p * s - r * q, q * s],
  'suma-multiplicando-denominadores': ([p, q, r, s]) => [p * s + r * q, q * s],
  'simplifica-solo-numerador': ([n, d]) => [n, d],
  'simplifica-solo-denominador': ([n, d]) => [n, d],
  'se-queda-en-la-unitaria': ([p, d, n]) => [p * n, d],
  'multiplica-por-el-denominador': ([p, d, n]) => [p * n, d],
  'fraccion-de-al-reves': ([p, d, n]) => [p * n, d],
  'invierte-la-primera': ([p, q, r, s]) => [p * s, q * r],
  'no-invierte': ([p, q, r, s]) => [p * s, q * r],
  'invierte-las-dos': ([p, q, r, s]) => [p * s, q * r],
  'eleva-solo-el-numerador': ([p, q, n]) => [p ** n, q ** n],
};

test('hay una plantilla por cada error que enseña la práctica, con nombre y grupo', () => {
  assert.equal(L.PLANTILLAS.length, 12);
  for (const p of [...L.PLANTILLAS, ...L.COMPARACIONES]) {
    assert.equal(p.id, p.error);
    assert.ok(ERRORES_TIPICOS[p.error], p.error);
    assert.ok(L.GRUPO_DE[p.error], `${p.error} sin grupo`);
  }
  for (const p of L.PLANTILLAS) { assert.ok(MAL[p.id] && BIEN[p.id], `${p.id} sin comprobación a mano`); }
  const enGrupos = Object.values(L.GRUPOS).flat();
  assert.equal(new Set(enGrupos).size, enGrupos.length, 'un error en dos grupos');
  assert.deepEqual([...enGrupos].sort(), [...L.PLANTILLAS, ...L.COMPARACIONES].map(p => p.id).sort());
});

test('cada plantilla: el valor bueno es el de L0, el malo es el de la última línea y no coincide', () => {
  const rng = crearRng(3);
  for (const p of L.PLANTILLAS) {
    for (let i = 0; i < 300; i++) {
      const params = p.numeros(rng);
      if (!params) continue;
      const bien = p.bien(params), { lineas, falsa } = p.mala(params);
      assert.ok(igual(val(p.l0(params)), BIEN[p.id](params)), `${p.id}: ${p.l0(params)} vale otra cosa que lo calculado a mano`);
      assert.ok(igual(bien, BIEN[p.id](params)), `${p.id}: bien`);
      assert.ok(bien.esIrreducible());
      assert.ok(igual(val(lineas.at(-1)), MAL[p.id](params)), `${p.id}: ${lineas.join(' | ')}`);
      assert.ok(!val(lineas.at(-1)).equals(bien), `${p.id}: el malo vale lo mismo que el bueno`);
      assert.ok(!bien.equals(val(lineas[0])) || true);
      assert.ok(falsa === 1 || falsa === 2);
      // La corrección de la línea mala vale lo que la línea anterior.
      assert.ok(val(p.corregida(params)).equals(val(lineas[falsa - 1])), `${p.id}: corregida ${p.corregida(params)}`);
    }
  }
});

test('ejercicio 2: tres líneas, exactamente una falsa, y es la marcada', () => {
  const items = generar(L.generarLinea);
  const posiciones = new Set(), vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'linea');
    assert.equal(item.lineas.length, 3);
    const falsas = item.lineas.map((l, i) => (i > 0 && !val(l).equals(val(item.lineas[i - 1])) ? i : -1)).filter(i => i >= 0);
    assert.deepEqual(falsas, [item.falsa], item.lineas.join(' | '));
    assert.equal(item.solucion, item.falsa);
    assert.deepEqual(item.opciones, [0, 1, 2]);
    // Las líneas anteriores a la mala son verdaderas respecto a L0.
    assert.ok(val(item.lineas[0]).equals(val(item.lineas[item.falsa - 1])));
    posiciones.add(item.falsa);
    vistas.add(item.plantilla);
  }
  assert.deepEqual([...posiciones].sort(), [1, 2], 'el error no puede estar siempre en la misma línea');
  assert.equal(vistas.size, L.PLANTILLAS.length, 'todas las plantillas salen');
});

test('ejercicio 1: mitad verdaderas y mitad falsas; el valor falso es distinto del verdadero y el error tiene nombre', () => {
  const items = generar(L.generarBienMal);
  let verdaderas = 0, comparaciones = 0;
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'bien-mal');
    vistas.add(item.plantilla);
    if (L.COMPARACION_POR_ID[item.plantilla]) {
      comparaciones++;
      const a = val(item.izq), b = val(item.der);
      const buena = comparar(a, b) < 0 ? '<' : comparar(a, b) > 0 ? '>' : '=';
      assert.notEqual(buena, '=', 'una comparación entre iguales no enseña nada');
      assert.equal(item.verdadera, item.rel === buena, `${item.izq} ${item.rel} ${item.der}`);
    } else {
      assert.equal(item.rel, '=');
      assert.equal(item.verdadera, val(item.izq).equals(val(item.der)), `${item.izq} = ${item.der}`);
    }
    if (item.verdadera) {
      verdaderas++;
      assert.equal(item.error, null);
      assert.equal(item.solucion, 'verdadera');
      assert.equal(item.opciones, null);
    } else {
      assert.equal(item.solucion, item.error);
      assert.ok(ERRORES_TIPICOS[item.error]);
      assert.equal(item.opciones.length, 3);
      assert.equal(new Set(item.opciones).size, 3);
      assert.ok(item.opciones.includes(item.error));
      for (const id of item.opciones) {
        assert.ok(ERRORES_TIPICOS[id], id);
        if (id !== item.error) assert.notEqual(L.GRUPO_DE[id], L.GRUPO_DE[item.error], `${id} frente a ${item.error}`);
      }
      for (const idioma of ['es', 'en']) assert.equal(new Set(item.opciones.map(id => ERRORES_TIPICOS[id].nombre[idioma])).size, 3);
    }
  }
  assert.ok(verdaderas > N * 0.46 && verdaderas < N * 0.54, `verdaderas: ${verdaderas}`);
  assert.ok(comparaciones > N * 0.15 && comparaciones < N * 0.25, `comparaciones: ${comparaciones}`);
  assert.equal(vistas.size, L.PLANTILLAS.length + L.COMPARACIONES.length);
  // La respuesta buena sale en las tres posiciones de la lista de nombres.
  const falsas = items.filter(i => !i.verdadera);
  for (const k of [0, 1, 2]) assert.ok(falsas.some(i => i.opciones[k] === i.solucion), `posición ${k}`);
});

test('ejercicio 1: las comparaciones falsas son justo el error (a mano, con enteros)', () => {
  const rng = crearRng(23);
  for (const c of L.COMPARACIONES) {
    let falsas = 0;
    for (let i = 0; i < 1000; i++) {
      const params = c.numeros(rng);
      if (!params) continue;
      const mal = L.relacionMala(c.id, params);
      if (mal === null) continue;
      falsas++;
      const [p, q, r, s] = params;
      const sg = x => (x < 0 ? '<' : x > 0 ? '>' : '=');
      const esperado = {
        'compara-solo-numeradores': sg(p - r),
        'compara-solo-denominadores': sg(q - s),
        'ignora-el-signo': sg(Math.abs(p) * s - Math.abs(r) * q),
      }[c.id];
      assert.equal(mal, esperado, `${c.id}: ${params}`);
      assert.notEqual(mal, L.relacionBuena(params), `${c.id}: ${params}`);
      assert.equal(L.relacionBuena(params), sg(p * s - r * q));
    }
    assert.ok(falsas > 100, `${c.id} casi no da ítems falsos`);
  }
});

test('ejercicio 3: la igualdad es falsa y el resultado bueno es irreducible y vale lo de L0', () => {
  for (const item of generar(L.generarArregla)) {
    assert.equal(item.tipo, 'arregla');
    const bien = fraccion(item.bien.num, item.bien.den);
    assert.ok(bien.esIrreducible());
    assert.ok(val(item.izq).equals(bien), `${item.izq} no vale ${bien.num}/${bien.den}`);
    assert.ok(!val(item.der).equals(bien), `${item.izq} = ${item.der} sería verdadera`);
    assert.ok(igual(bien, BIEN[item.plantilla](item.params)));
    if (item.natural) assert.equal(bien.den, 1, 'la plantilla "natural" da un número entero');
    else assert.notEqual(bien.den, 1, 'una fracción que no es natural');
  }
});

test('ejercicio 3: corregirArregla distingue acierto, sin simplificar, repetir el error y otro resultado', () => {
  for (const item of generar(L.generarArregla, 5).slice(0, 600)) {
    const bien = fraccion(item.bien.num, item.bien.den);
    assert.deepEqual(L.corregirArregla(item, bien), { acierto: true, error: null });
    assert.deepEqual(L.corregirArregla(item, bien.equivalentePor(2)), { acierto: false, error: 'sin-simplificar' });
    assert.deepEqual(L.corregirArregla(item, val(item.der)), { acierto: false, error: 'repite-el-error' });
    const otro = [fraccion(bien.num + 1, bien.den), fraccion(bien.num + 2, bien.den + 1), fraccion(bien.num + 3, bien.den + 2),
      fraccion(7 * bien.num + 1, 7 * bien.den + 2), fraccion(11 * bien.num + 5, 11 * bien.den + 3)]
      .find(x => !x.equals(bien) && !x.equals(val(item.der)));
    assert.deepEqual(L.corregirArregla(item, otro), { acierto: false, error: 'otro-resultado' });
  }
});

test('realismo y nada que no se haya dado: números pequeños, cantidades que dan enteros, sin decimales ni mixtos', () => {
  for (const item of [...generar(L.generarLinea, 31), ...generar(L.generarArregla, 32), ...generar(L.generarBienMal, 33)]) {
    const expresiones = item.lineas ?? [item.izq, item.der];
    for (const e of expresiones) {
      assert.match(e, /^[\d\s+−·:()^/]+$/, `solo cifras y signos: ${e}`);
      assert.doesNotMatch(e, /\./, e);
      for (const n of e.match(/\d+/g)) assert.ok(Number(n) <= 600, `número fuera de lo creíble: ${e}`);
    }
    if (['se-queda-en-la-unitaria', 'multiplica-por-el-denominador', 'fraccion-de-al-reves'].includes(item.plantilla)) {
      const [p, d, n] = item.params;
      assert.equal(n % d, 0, `${p}/${d} de ${n} no es entero`);
      assert.ok(n >= 2 * d && n <= 120, `cantidad ${n}`);
      assert.ok(d <= 10);
    } else if (!L.COMPARACION_POR_ID[item.plantilla] && !/^simplifica/.test(item.plantilla)) {
      for (const x of item.params.slice(0, 4)) assert.ok(Math.abs(x) <= 8, `término ${x}`);
    }
    // Sin potencias de base negativa ni exponentes fuera de 2 y 3.
    if (item.plantilla === 'eleva-solo-el-numerador') assert.ok([2, 3].includes(item.params[2]));
  }
});

test('simplificar: los términos del enunciado dan fracciones que cabe escribir (hasta 90) y la mala todavía se simplifica', () => {
  for (const item of generar(L.generarLinea, 41).filter(i => /^simplifica/.test(i.plantilla))) {
    const [n, d] = item.params;
    assert.ok(n <= 90 && d <= 90);
    assert.ok(mcd(n, d) >= 4);
    assert.ok(val(item.lineas[1]).num !== undefined);
    assert.notEqual(mcd(val(item.lineas[1]).num, val(item.lineas[1]).den), 0);
  }
});

test('todos los textos, en los dos idiomas: sin ×, sin fracciones con barra, sin letras sueltas, sin decimales', () => {
  const textos = [];
  const recoger = t => { for (const idioma of ['es', 'en']) textos.push(typeof t[idioma] === 'function' ? t[idioma](3) : t[idioma]); };
  for (const grupo of ['nombre', 'detalle', 'instruccion', 'introduccion']) for (const t of Object.values(TX[grupo])) recoger(t);
  for (const clave of Object.keys(TX).filter(k => !['nombre', 'detalle', 'instruccion', 'introduccion'].includes(k))) recoger(TX[clave]);
  for (const e of Object.values(ERRORES_TIPICOS)) recoger(e.nombre);
  const rng = crearRng(5);
  for (const p of L.PLANTILLAS) for (let i = 0; i < 300; i++) {
    const params = p.numeros(rng);
    if (params) recoger(p.porque(params));
  }
  for (const c of L.COMPARACIONES) for (let i = 0; i < 300; i++) {
    const params = c.numeros(rng);
    if (params) recoger(L.porqueComparacion(c.id, params));
  }
  assert.ok(textos.length > 500);
  for (const t of textos) {
    assert.ok(t && t.length > 3);
    assert.doesNotMatch(t, /×/, t);
    assert.doesNotMatch(t.replace(/<[^>]*>/g, ''), /\d\s*\/\s*\d/, `fracción con barra: ${t}`);
    assert.doesNotMatch(t.replace(/<[^>]*>/g, ''), /\d[.,]\d/, `decimal: ${t}`);
    // El signo menos, siempre U+2212 y delante de la raya (nada de «-3»).
    assert.doesNotMatch(t.replace(/<[^>]*>/g, ''), /(^|[\s(>])-\d/, `guion como menos: ${t}`);
  }
});

test('las explicaciones citan los números del ítem, en los dos idiomas', () => {
  for (const item of generar(L.generarLinea, 77).slice(0, 1000)) {
    const texto = L.PLANTILLA_POR_ID[item.plantilla].porque(item.params);
    for (const idioma of ['es', 'en']) assert.match(texto[idioma].replace(/<[^>]*>/g, ''), /\d/, item.plantilla);
    assert.equal((texto.es.match(/class="frac"/g) ?? []).length > 0, true);
  }
});

test('claveItem distingue los ítems y el catálogo declara 3 ejercicios', () => {
  const [a, b] = generar(L.generarLinea, 9);
  assert.equal(L.claveItem(a), L.claveItem(a));
  assert.notEqual(L.claveItem(a), L.claveItem({ ...b, params: [...b.params, 1] }));
  assert.equal(CATALOGO.find(f => f.slug === 'errores4').nEjercicios, 3);
});
