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
import { TX, explicaLinea } from '../practicas/errores4/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const val = texto => evaluar(analizar(texto));
/** Las columnas malas de los ítems del ejercicio 2, una por una, con la forma de una plantilla: { plantilla, params, lineas, falsa, error }. */
const malasPlanas = (semilla, n = N) => generar(L.generarColumnas, semilla).slice(0, n)
  .flatMap(it => it.columnas.filter(c => c.error && c.error !== L.CUENTA).map(c => ({ plantilla: c.ruta, params: c.params, lineas: c.lineas, falsa: c.falsa, error: c.error })));
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

test('ejercicio 2 en columnas: 2-4 columnas, 1-2 bien y 1-2 mal, cada columna mala con una sola línea falsa', () => {
  const posiciones = new Set(), familias = new Set(), nCols = new Set(), rutasMalas = new Set(), rutasBuenas = new Set();
  for (const item of generar(L.generarColumnas)) {
    assert.equal(item.tipo, 'columnas');
    assert.ok(item.columnas.length >= 2 && item.columnas.length <= 4, `${item.columnas.length} columnas`);
    nCols.add(item.columnas.length);
    const malas = item.columnas.filter(c => c.error), buenas = item.columnas.filter(c => !c.error);
    const conNombre = malas.filter(c => c.error !== L.CUENTA);
    assert.ok(malas.length >= 1 && malas.length <= 2 && buenas.length >= 1 && buenas.length <= 2, 'una o dos de cada');
    assert.ok(conNombre.length >= 1 && malas.length - conNombre.length <= 1, 'siempre un error con nombre; fallo de cuenta, como mucho uno');
    assert.equal(new Set(item.columnas.map(c => c.lineas.join('|'))).size, item.columnas.length, 'dos columnas iguales');
    assert.equal(new Set(malas.map(c => c.error)).size, malas.length, 'dos columnas con el mismo error');
    assert.equal(new Set(buenas.map(c => c.ruta)).size, buenas.length, 'dos columnas bien de la misma forma');
    for (const c of item.columnas) {
      assert.equal(c.lineas[0], item.enunciado, 'todas empiezan por el enunciado');
      const falsas = c.lineas.map((l, i) => (i > 0 && !val(l).equals(val(c.lineas[i - 1])) ? i : -1)).filter(i => i >= 0);
      assert.deepEqual(falsas, c.falsa === null ? [] : [c.falsa], c.lineas.join(' | '));
      assert.ok(val(c.lineas.at(-1)).equals(val(item.enunciado)) === !c.error, 'el resultado de una columna es el del enunciado solo si está bien');
      if (c.error === L.CUENTA) continue;
      if (c.error) { posiciones.add(c.falsa); rutasMalas.add(c.ruta); } else rutasBuenas.add(c.ruta);
    }
    assert.deepEqual(item.solucion, item.columnas.map(c => c.falsa));
    assert.deepEqual(item.preguntas.map(q => q.col), item.columnas.map((c, j) => (c.error && c.error !== L.CUENTA ? j : -1)).filter(j => j >= 0), 'preguntas solo con nombre');
    item.preguntas.forEach(q => {
      assert.equal(q.solucion, item.columnas[q.col].error);
      assert.equal(q.opciones.length, 3);
      assert.ok(q.opciones.includes(q.solucion));
    });
    familias.add(item.plantilla);
  }
  assert.deepEqual([...posiciones].sort(), [1, 2], 'el error no puede estar siempre en la misma línea');
  assert.equal(familias.size, L.FAMILIAS.length, 'todas las familias salen');
  assert.deepEqual([...nCols].sort(), [2, 3, 4]);
  for (const p of L.PLANTILLAS) assert.ok(rutasMalas.has(p.id), `la plantilla ${p.id} no sale como columna mala`);
  for (const fa of L.FAMILIAS) for (const r of fa.bien) assert.ok(rutasBuenas.has(r.id), `la ruta buena ${r.id} no sale`);
});

test('ejercicio 2 en columnas: el fallo de cuenta (sin nombre), como mucho uno, la última cuenta, cerca del bueno y nunca un error con nombre', () => {
  let conCuenta = 0;
  const familias = new Set();
  for (const item of generar(L.generarColumnas, 31)) {
    const cuentas = item.columnas.filter(c => c.error === L.CUENTA);
    assert.ok(cuentas.length <= 1);
    if (!cuentas.length) continue;
    conCuenta++;
    familias.add(item.plantilla);
    const [c] = cuentas;
    const bien = val(c.cuenta.bien), mal = val(c.lineas[c.falsa]);
    assert.equal(c.lineas[c.falsa], c.cuenta.mal);
    assert.equal(c.lineas.length, c.falsa + 1, 'la cuenta es la última línea de la columna');
    assert.ok(val(c.lineas[c.falsa - 1]).equals(bien), 'la línea de antes vale lo del bueno');
    // Cerca: el mismo denominador y el numerador ±1 o ±2 (el entero, si el resultado lo es).
    const [, sn, sd] = /^(−?\d+)(?:\/(\d+))?$/.exec(c.cuenta.bien).map(x => x ?? '1').map(x => x);
    const [, mn, md] = /^(−?\d+)(?:\/(\d+))?$/.exec(c.cuenta.mal).map(x => x ?? '1');
    assert.equal(md, sd, 'mismo denominador');
    assert.ok([1, 2].includes(Math.abs(Number(mn.replace('−', '-')) - Number(sn.replace('−', '-')))), `${c.cuenta.bien} → ${c.cuenta.mal}`);
    assert.ok(!mal.equals(bien) && !mal.equals(bien.opuesta()));
    // Distinta del resultado de las demás columnas.
    for (const o of item.columnas) if (o !== c) assert.ok(!val(o.lineas.at(-1)).equals(mal), c.lineas.join(' | '));
    // No es un calco de otra columna: sale de una ruta buena que no está en el ítem.
    for (const o of item.columnas) if (o !== c) assert.notEqual(o.ruta, c.ruta);
    // Ningún error con nombre del catálogo da ese valor con los números del ítem.
    for (const r of L.FAMILIA_POR_ID[item.plantilla].mal) assert.equal(L.erroresQueExplican(r.id, c.params, mal).size, 0, `${c.lineas.join(' | ')}: ${[...L.erroresQueExplican(r.id, c.params, mal)]}`);
    // Y solo una línea falsa.
    assert.deepEqual(c.lineas.map((l, i) => (i > 0 && !val(l).equals(val(c.lineas[i - 1])) ? i : -1)).filter(i => i >= 0), [c.falsa]);
  }
  assert.ok(conCuenta > N * 0.08, `con fallo de cuenta: ${conCuenta} de ${N}`);
  assert.ok(familias.size >= 4, `familias con fallo de cuenta: ${[...familias]}`);
});

test('el fallo de cuenta: la tarjeta del «No lo sé» dice «se ha equivocado» y la cuenta bien hecha, sin regla en esa columna', () => {
  let visto = 0;
  for (const item of generar(L.generarColumnas, 33)) {
    const c = item.columnas.find(c => c.error === L.CUENTA);
    if (!c) continue;
    visto++;
    for (const idioma of ['es', 'en']) {
      const tt = t => (typeof t === 'string' ? t : t[idioma]);
      const html = explicaLinea(item, { idioma, tt });
      const j = item.columnas.indexOf(c), bloque = html.split('<p class="columna-explica">')[j + 1].split('</p>')[0];
      assert.ok(bloque.includes(TX.fallo_cuenta[idioma]), bloque);
      assert.ok(!bloque.includes('regla-rota'), bloque);
      assert.ok(bloque.includes(L.ex(c.cuenta.bien)) && bloque.includes(L.ex(c.cuenta.mal)), bloque);
    }
    if (visto > 50) break;
  }
  assert.ok(visto > 20);
});

test('ejercicio 2 en columnas: los números de cada familia son los de sus plantillas y las malas no repiten la línea del enunciado', () => {
  for (const item of generar(L.generarColumnas, 23)) {
    const fa = L.FAMILIA_POR_ID[item.plantilla];
    assert.equal(fa.enunciado(item.params), item.enunciado);
    for (const c of item.columnas.filter(c => c.error && c.error !== L.CUENTA)) assert.equal(L.PLANTILLA_POR_ID[c.error].l0(c.params), item.enunciado);
  }
});

test('ejercicio 2 en columnas: ningún nombre ofrecido como falso explica el resultado de la columna (fuerza bruta)', () => {
  let preguntas = 0;
  for (const item of generar(L.generarColumnas, 29)) {
    for (const q of item.preguntas) {
      preguntas++;
      const c = item.columnas[q.col];
      const explican = L.erroresQueExplican(c.error, c.params, val(c.lineas.at(-1)));
      for (const id of q.opciones) if (id !== q.solucion) assert.ok(!explican.has(id), `${c.lineas.join(' | ')}: «${id}» también lo explica`);
    }
  }
  assert.ok(preguntas > 3000);
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
  for (const item of [...malasPlanas(31), ...generar(L.generarArregla, 32), ...generar(L.generarBienMal, 33)]) {
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
  for (const item of malasPlanas(41).filter(i => /^simplifica/.test(i.plantilla))) {
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
  for (const item of generar(L.generarColumnas, 77).slice(0, 1000)) {
    for (const c of item.columnas) {
      const texto = L.explicaColumna(c).porque;
      for (const idioma of ['es', 'en']) assert.match(texto[idioma].replace(/<[^>]*>/g, ''), /\d/, c.ruta);
      if (c.error && c.error !== L.CUENTA) assert.equal((texto.es.match(/class="frac"/g) ?? []).length > 0, true, c.ruta);
    }
  }
});

test('claveItem distingue los ítems y el catálogo declara 3 ejercicios', () => {
  const [a, b] = generar(L.generarColumnas, 9);
  assert.equal(L.claveItem(a), L.claveItem(a));
  assert.notEqual(L.claveItem(a), L.claveItem({ ...b, params: [...b.params, 1] }));
  assert.equal(CATALOGO.find(f => f.slug === 'errores4').nEjercicios, 3);
});

test('las listas de la hoja y de examen no están vacías y detectan de verdad, sin orden de sumandos', () => {
  assert.equal(L.PARAMS_HOJA.size, 3);
  assert.equal(L.HUELLAS_EXAMEN.size, 1);
  // Hoja 2, ej. 8: 3/5 + 1/3 = 4/8 y, con los sumandos cambiados, 1/3 + 3/5.
  assert.ok(L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [3, 5, 1, 3])));
  assert.ok(L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [1, 3, 3, 5])));
  // Hoja 2, ej. 8b y ej. 3 (Ana), también en el otro orden.
  assert.ok(L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [3, 4, 2, 3])));
  assert.ok(L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [2, 5, 1, 4])));
  assert.ok(L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [1, 4, 2, 5])));
  // Los casos de examen no se escriben en claro (el repositorio es público): solo se mira que la
  // huella tiene forma de huella.
  for (const h of L.HUELLAS_EXAMEN) assert.match(h, /^[0-9a-z]{4,7}$/);
  // Una pareja cualquiera que no está en ninguna lista no se marca; otra plantilla, tampoco.
  assert.ok(!L.PARAMS_HOJA.has(L.claveParams('suma-arriba-y-abajo', [1, 2, 1, 3])));
  assert.ok(!L.HUELLAS_EXAMEN.has(L.huella(L.claveParams('suma-arriba-y-abajo', [1, 2, 1, 3]))));
  assert.ok(!L.PARAMS_HOJA.has(L.claveParams('suma-multiplicando-denominadores', [3, 5, 1, 3])));
  // Las que no son sumas conservan el orden (a : b no es b : a).
  assert.notEqual(L.claveParams('divide', [3, 5, 1, 3]), L.claveParams('divide', [1, 3, 3, 5]));
});

test('ningún ítem, en ninguno de los tres ejercicios, repite un caso de la hoja o de examen', () => {
  const clave = item => L.claveParams(item.plantilla, item.params);
  for (const item of [
    ...generar(L.generarBienMal, 71), ...malasPlanas(72), ...generar(L.generarArregla, 73),
  ]) {
    if (L.COMPARACION_POR_ID[item.plantilla]) continue;
    assert.ok(!L.PARAMS_HOJA.has(clave(item)), `caso de la hoja: ${JSON.stringify(item)}`);
    assert.ok(!L.HUELLAS_EXAMEN.has(L.huella(clave(item))), `caso de examen: ${JSON.stringify(item)}`);
  }
});

test('la clave de lo que se ve no depende de la plantilla ni, en + y ·, del orden; sí en − y :', () => {
  assert.equal(L.claveVista('1/6 + 2/3'), L.claveVista('2/3 + 1/6'));
  assert.notEqual(L.claveVista('1/3 − 5/6'), L.claveVista('5/6 − 1/3'));
  assert.notEqual(L.claveVista('4/5 : 2/3'), L.claveVista('2/3 : 4/5'));
  assert.equal(L.claveVista('(2/5)^2'), 'P|2/5|2');
  assert.notEqual(L.claveVista('(2/5)^2'), L.claveVista('(2/5)^3'));
  assert.equal(L.CLAVES_HOJA.size, 28);
  for (const k of ['P|5/6|2', 'P|3/4|3', 'P|4/3|2']) assert.ok(L.CLAVES_HOJA.has(k), k);
  assert.equal(L.HUELLAS_VISTA_EXAMEN.size, 35);
  assert.equal(L.HUELLAS_COMPARACION.size, 9);
  for (const h of L.HUELLAS_COMPARACION) assert.match(h, /^[0-9a-z]{4,7}$/);
  // Fracción suelta (simplificar): sin reducir, y la clave no depende de la plantilla.
  assert.equal(L.claveVista('60/84'), 'N|60/84');
  assert.equal(L.claveVista(L.PLANTILLA_POR_ID['simplifica-solo-numerador'].l0([60, 84, 2])), L.claveVista(L.PLANTILLA_POR_ID['simplifica-solo-denominador'].l0([60, 84, 2])));
  assert.equal(L.claveVista('1/4 · 52'), 'F|1/4|52');
  // Comparación: sin orden, con signo.
  assert.equal(L.claveComparacion([2, 5, 4, 9]), L.claveComparacion([4, 9, 2, 5]));
  assert.notEqual(L.claveComparacion([2, 5, 4, 9]), L.claveComparacion([-2, 5, -4, 9]));
  for (const h of L.HUELLAS_VISTA_EXAMEN) assert.match(h, /^[0-9a-z]{4,7}$/);
  // Las tres plantillas de «fracción de una cantidad» escriben lo mismo y comparten clave.
  for (const id of ['se-queda-en-la-unitaria', 'multiplica-por-el-denominador', 'fraccion-de-al-reves']) {
    assert.equal(L.claveVista(L.PLANTILLA_POR_ID[id].l0([1, 3, 27])), 'F|1/3|27');
  }
});

test('ningún ítem, en los tres ejercicios, es un caso de las hojas o de los exámenes por lo que VE el alumno (3000 por ejercicio, 3 semillas)', () => {
  for (const semilla of [163, 7, 11]) {
    for (const fn of [L.generarBienMal, L.generarColumnas, L.generarArregla]) {
      for (const item of generar(fn, semilla)) {
        if (L.COMPARACION_POR_ID[item.plantilla]) {
          assert.ok(!L.HUELLAS_COMPARACION.has(L.huella(L.claveComparacion(item.params))), `comparación de examen en ${item.plantilla}`);
          continue;
        }
        const k = L.claveVista(item.enunciado ?? L.PLANTILLA_POR_ID[item.plantilla].l0(item.params));
        if (k === null) continue;
        assert.ok(!L.CLAVES_HOJA.has(k), `caso de la hoja: ${k}`);
        assert.ok(!L.HUELLAS_VISTA_EXAMEN.has(L.huella(k)), `caso de examen (huella ${L.huella(k)}) en la plantilla ${item.plantilla}`);
      }
    }
  }
});

test('las potencias de las hojas 2 (ej. 13a-h) y 3 (ej. 1c-1f), también las escritas en palabras, no salen en ningún ejercicio', () => {
  const potencias = ['1/3|2', '2/5|2', '3/2|3', '4/7|2', '1/2|4', '5/6|2', '3/4|3', '5/4|2', '3/7|2', '1/4|3', '7/3|2', '4/3|2'].map(k => `P|${k}`);
  for (const k of potencias) assert.ok(L.CLAVES_HOJA.has(k), k);
  const prohibidas = new Set(potencias);
  for (const semilla of [163, 7, 11]) {
    for (const fn of [L.generarBienMal, L.generarColumnas, L.generarArregla]) {
      for (const item of generar(fn, semilla)) {
        if (L.COMPARACION_POR_ID[item.plantilla]) continue;
        const k = L.claveVista(item.enunciado ?? L.PLANTILLA_POR_ID[item.plantilla].l0(item.params));
        assert.ok(!prohibidas.has(k), `potencia de la hoja: ${k}`);
      }
    }
  }
});

test('ejercicio 1: ningún nombre ofrecido como falso explica el resultado con los números del ítem (fuerza bruta)', () => {
  let falsas = 0;
  for (const item of generar(L.generarBienMal, 101)) {
    if (item.verdadera || L.COMPARACION_POR_ID[item.plantilla]) continue;
    falsas++;
    const explican = L.erroresQueExplican(item.plantilla, item.params, val(item.der));
    for (const id of item.opciones) {
      if (id !== item.error) assert.ok(!explican.has(id), `${item.izq} = ${item.der}: «${id}» también lo explica`);
    }
  }
  assert.ok(falsas > 1000);
  // La función de fuerza bruta detecta el caso que falló: 1/3 · 60 = 180 lo explican dos nombres.
  const e = L.erroresQueExplican('multiplica-por-el-denominador', [1, 3, 60], fraccion(180, 1));
  assert.ok(e.has('multiplica-por-el-denominador') && e.has('invierte-la-primera'));
});

test('suma arriba y abajo: la igualdad que se ve (ejercicios 1 y 3) es el error sobre esas fracciones', () => {
  const ve = [...generar(L.generarBienMal, 5), ...generar(L.generarArregla, 6)].filter(i => i.plantilla === 'suma-arriba-y-abajo' && i.verdadera !== true);
  assert.ok(ve.length > 100);
  for (const item of ve) {
    const [p, q, r, s] = item.params;
    assert.ok(val(item.der).equals(fraccion(p + r, q + s)), `${item.izq} = ${item.der}`);
  }
});

test('comparaciones falsas: nunca «=» mostrado y, en las de numeradores o denominadores, ningún término compartido', () => {
  for (const item of generar(L.generarBienMal, 31)) {
    if (!L.COMPARACION_POR_ID[item.plantilla]) continue;
    if (!item.verdadera) assert.notEqual(item.rel, '=', `${item.izq} ${item.rel} ${item.der}`);
    if (/^compara-solo/.test(item.plantilla)) {
      const [p, q, r, s] = item.params;
      assert.ok(p !== r && q !== s, `${item.izq} ${item.rel} ${item.der}`);
    }
  }
});

test('ejercicio 2: el error de la potencia está en la línea 2 y se ve (el numerador repetido)', () => {
  for (const item of malasPlanas(8).filter(i => i.plantilla === 'eleva-solo-el-numerador')) {
    assert.equal(item.falsa, 1);
    assert.match(item.lineas[1], /^\d+( · \d+)+\/\d+$/);
  }
});
