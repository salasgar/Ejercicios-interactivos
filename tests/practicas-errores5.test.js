// Práctica «Caza el error» de la unidad 5 (PU2, tarea 128): la lógica se prueba por fuerza bruta con semillas
// fijas (3000 ítems por ejercicio). El valor bueno y el malo de cada plantilla se recalculan aquí a mano, con
// enteros, sin pasar por ERRORES_TIPICOS ni por la aritmética de decimales.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, deTexto, aTexto, mismoValor, MENOS } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/errores5/logica.js';
import { TX } from '../practicas/errores5/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const D = deTexto;
const p10 = n => 10n ** BigInt(n);
const B = BigInt;
/** Un Decimal es [m, 10^k] igual a [n, d]. */
const igual = (x, [n, d]) => B(x.m) * B(d) === B(n) * p10(x.k);
/** Cociente entero hacia el 0. */
const cociente = (p, q) => p / q;

/** [numerador, denominador] bueno y malo de cada plantilla, calculados a mano con BigInt. */
const MANO = {
  'alinea-a-la-derecha'([a, b, op]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k), s = op === '+' ? 1n : -1n;
    return {
      bien: [B(A.m) * p10(k - A.k) + s * B(Bb.m) * p10(k - Bb.k), p10(k)],
      mal: [B(A.m) + s * B(Bb.m), p10(k)],
    };
  },
  'coma-mal-puesta'([a, b]) {
    const A = D(a), Bb = D(b), m = B(A.m) * B(Bb.m);
    return { bien: [m, p10(A.k + Bb.k)], mal: [m, p10(Math.max(A.k, Bb.k))] };
  },
  'por-diez-anadiendo-cero'([d, n, c]) {
    const A = D(d);
    return { bien: [B(A.m) * p10(n) + B(c) * p10(A.k), p10(A.k)], mal: [B(A.m) + B(c) * p10(A.k), p10(A.k)] };
  },
  'redondea-truncando'([a, b, c]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k), S = B(A.m) * p10(k - A.k) + B(Bb.m) * p10(k - Bb.k);
    const dos = p10(k - c);
    return { bien: [cociente(S + dos / 2n, dos), p10(c)], mal: [cociente(S, dos), p10(c)] };
  },
  'redondea-en-cadena'([a, b, c]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k);
    let S = B(A.m) * p10(k - A.k) + B(Bb.m) * p10(k - Bb.k), kk = k;
    const bien = [cociente(S + p10(k - c) / 2n, p10(k - c)), p10(c)];
    while (kk > c) { S = cociente(S + 5n, 10n); kk--; }
    return { bien, mal: [S, p10(c)] };
  },
  'olvida-coma-cociente'([a, b]) {
    const A = D(a);
    return { bien: [B(A.m), B(b) * p10(A.k)], mal: [B(A.m) / B(b), 1n] };
  },
  'coma-solo-en-divisor'([a, b]) {
    const A = D(a), Bb = D(b);
    return { bien: [B(A.m) * p10(Bb.k), B(Bb.m) * p10(A.k)], mal: [B(A.m), B(Bb.m) * p10(A.k)] };
  },
  'resto-sin-deshacer'([a, b]) {
    const A = D(a), Bb = D(b);
    const Q = cociente(B(A.m) * p10(Bb.k) * 100n, B(Bb.m) * p10(A.k));       // cociente cortado, en centésimas
    const den = p10(A.k + Bb.k) * 100n;
    const resto = B(A.m) * p10(Bb.k) * 100n - B(Bb.m) * Q * p10(A.k);          // resto de la original · den
    return { bien: [resto, den], mal: [resto * p10(Bb.k), den] };
  },
  'fraccion-al-reves'([n, d]) { return { bien: [B(n), B(d)], mal: [cociente(B(d) * 100n, B(n)), 100n] }; },
  'periodico-por-redondeo'([n, d]) { return { bien: null, mal: [cociente(200n * B(n) + B(d), 2n * B(d)), 100n] }; },
  'compara-por-cifras'([a, b]) {
    const A = D(a), Bb = D(b);
    const bien = B(A.m) * p10(Bb.k) - B(Bb.m) * p10(A.k);
    const mal = (B(A.m) % p10(A.k)) - (B(Bb.m) % p10(Bb.k));
    const signo = x => (x > 0n ? 1n : x < 0n ? -1n : 0n);
    return { bien: signo(bien), mal: signo(mal) };
  },
};
const finalDe = (item, idioma = 'es') => L.textoLinea(item.lineas.at(-1), idioma);
/** El resultado de una línea: lo que sigue a «= » o «≈ » al principio, o al último « = » («2,12 · 0,9 = 1,908»). */
const resultado = t => (/^[=≈] /.test(t) ? t.slice(2) : t.includes(' = ') ? t.slice(t.lastIndexOf(' = ') + 3) : t);

test('hay una plantilla por cada error que enseña la práctica, con nombre y cálculo a mano', () => {
  assert.equal(L.PLANTILLAS.length, 11);
  for (const p of L.PLANTILLAS) {
    assert.ok(ERRORES_TIPICOS[p.id], p.id);
    assert.ok(MANO[p.id], `${p.id} sin comprobación a mano`);
    assert.equal(L.CLASE_DE[p.id], p.clase);
  }
  assert.equal(new Set(L.PLANTILLAS.map(p => p.id)).size, 11);
  const ficha = CATALOGO.find(c => c.slug === 'errores5');
  assert.equal(ficha.nEjercicios, 3);
});

test('cada plantilla: el valor bueno y el malo coinciden con el cálculo a mano y son distintos', () => {
  const rng = crearRng(3);
  for (const p of L.PLANTILLAS) {
    let n = 0;
    for (let i = 0; i < 600 && n < 150; i++) {
      const params = p.params(rng);
      if (!params) continue;
      n++;
      const { bien, mal } = MANO[p.id](params);
      if (p.id === 'compara-por-cifras') {
        assert.equal(B(p.bien(params)), bien, `${p.id} ${params}`);
        assert.equal(B(p.malFinal(params)), mal, `${p.id} ${params}`);
        assert.equal(bien, -mal, 'la comparación mala es la contraria');
        assert.notEqual(bien, 0n);
        continue;
      }
      assert.ok(igual(p.malFinal(params), mal), `${p.id} ${params}: malFinal ${p.malFinal(params)}`);
      assert.ok(igual(p.valorError(params).normalizar ? p.valorError(params) : p.malFinal(params), p.id === 'por-diez-anadiendo-cero' ? [mal[0] - B(params[2]) * p10(D(params[0]).k), mal[1]] : mal));
      if (bien) {
        assert.ok(igual(p.bien(params), bien), `${p.id} ${params}: bien ${p.bien(params)}`);
        assert.ok(bien[0] * mal[1] !== mal[0] * bien[1], `${p.id} ${params}: el malo vale lo mismo que el bueno`);
      } else {
        assert.equal(p.corrige, false);
        assert.equal(p.bien(params), null);
      }
    }
    assert.ok(n >= 20, `${p.id}: solo ${n} casos`);
  }
});

// ─── Ejercicio 1 en columnas (tarea 237, JL 22-11) ────────────────────────────────────────────

/** Un evaluador independiente (racionales con BigInt) para las líneas «= expr» y «a = b»: sin decimales.js. */
const mcd = (a, b) => (b === 0n ? (a < 0n ? -a : a) : mcd(b, a % b));
const racional = (n, d) => { const g = mcd(n, d) || 1n; return d < 0n ? [-n / g, -d / g] : [n / g, d / g]; };
const suma = ([a, b], [c, d]) => racional(a * d + c * b, b * d);
const prod = ([a, b], [c, d]) => racional(a * c, b * d);
const cociR = ([a, b], [c, d]) => racional(a * d, b * c);
const num = s => { const [e, f = ''] = s.split(','); return racional(B(e + f), p10(f.length)); };
function evalua(texto) {
  const toks = texto.match(/\d+(?:,\d+)?|[+−·:/]/g);
  if (!toks || toks.join('').length < texto.replace(/\s/g, '').length) return null;
  let i = 0;
  const termino = () => {
    let v = num(toks[i++]);
    while (i < toks.length && '·:/'.includes(toks[i])) { const o = toks[i++]; const w = num(toks[i++]); v = o === '·' ? prod(v, w) : cociR(v, w); }
    return v;
  };
  let v = termino();
  while (i < toks.length) { const o = toks[i++]; const w = termino(); v = o === '+' ? suma(v, w) : suma(v, [-w[0], w[1]]); }
  return v;
}
const iguales = (x, y) => x[0] * y[1] === y[0] * x[1];
const NO_EVALUABLE = /≈|<|>|resto|Resto|remainder|Remainder|Cifra|digit|Primera|First|cociente|quotient|…/;
/** Lo que dice una línea evaluable: { partes: [valores separados por « = »], desdeIgual } o null. */
function valoresDeLinea(texto) {
  if (NO_EVALUABLE.test(texto)) return null;
  const sinPrefijo = texto.replace(/^(Sin comas|Sin la coma|Without the points?): /, '');
  const desdeIgual = sinPrefijo.startsWith('= ');
  const partes = (desdeIgual ? sinPrefijo.slice(2) : sinPrefijo).split(' = ').map(evalua);
  return partes.includes(null) ? null : { partes, desdeIgual };
}
const lineaEsCierta = (texto, V0) => {
  const v = valoresDeLinea(texto);
  if (!v) return null;
  return v.partes.every(x => iguales(x, v.partes[0])) && (!v.desdeIgual || iguales(v.partes[0], V0));
};

test('ejercicio 1: de 2 a 4 columnas, 1 o 2 bien y 1 o 2 mal; cada línea cierta salvo la marcada de las malas', () => {
  const items = generar(L.generarDonde);
  const porColumnas = {}, combos = {}, familias = new Set(), ceros = { n: 0 };
  for (const item of items) {
    assert.equal(item.tipo, 'donde');
    const cols = item.columnas;
    assert.ok(cols.length >= 2 && cols.length <= 4, `${cols.length} columnas`);
    porColumnas[cols.length] = (porColumnas[cols.length] ?? 0) + 1;
    // El fallo de cuenta (sin nombre) no cuenta entre las malas con nombre: 1-2 con nombre y, como mucho, una de cuenta.
    const bien = cols.filter(c => !c.error), mal = cols.filter(c => c.error && c.error !== L.CUENTA);
    assert.ok(cols.filter(c => c.error === L.CUENTA).length <= 1);
    assert.ok(bien.length >= 1 && bien.length <= 2 && mal.length >= 1 && mal.length <= 2, `${bien.length}+${mal.length}`);
    combos[`${bien.length}+${mal.length}`] = (combos[`${bien.length}+${mal.length}`] ?? 0) + 1;
    familias.add(item.familia);
    assert.deepEqual(item.solucion, cols.map(c => c.falsa));
    assert.equal(new Set(cols.map(c => JSON.stringify(c.lineas))).size, cols.length, 'dos columnas iguales');
    assert.equal(new Set(mal.map(c => c.error)).size, mal.length, 'dos columnas con el mismo error');
    assert.equal(new Set(bien.map(c => c.ruta)).size, bien.length, 'dos columnas bien por el mismo camino');
    const V0 = evalua(L.textoLinea(item.enunciado, 'es'));
    assert.deepEqual(item.enunciado, L.PLANTILLA_POR_ID[item.plantilla].cadena(item.params, false).lineas[0]);
    for (const c of cols) {
      assert.deepEqual(c.lineas[0], item.enunciado, 'todas empiezan por el mismo enunciado');
      assert.ok(c.lineas.length >= 2 && c.lineas.length <= 5, 'de una a cuatro líneas de cálculo');
      if (c.error) {
        assert.ok(c.falsa >= 1 && c.falsa < c.lineas.length, 'la línea 0 es el enunciado y nunca está mal');
        assert.ok(c.error === L.CUENTA || L.CLASE_DE[c.error], c.error);
      } else {
        assert.equal(c.falsa, null);
        ceros.n += L.columnaConCeros(c) ? 1 : 0;
      }
      c.lineas.forEach((l, i) => {
        if (i === 0) return;
        const cierta = lineaEsCierta(L.textoLinea(l, 'es'), V0);
        if (c.error && i === c.falsa) assert.notEqual(cierta, true, `${c.ruta}: la línea marcada es cierta: ${L.textoLinea(l, 'es')}`);
        else if (!c.error || i < c.falsa) assert.notEqual(cierta, false, `${c.ruta}: línea falsa: ${L.textoLinea(l, 'es')} (${item.params})`);
      });
    }
    // Las malas con plantilla propia son exactamente su cadena con error, y lo correcto es su cadena buena.
    for (const c of mal) {
      const p = L.PLANTILLA_POR_ID[c.error];
      if (!p) continue;
      assert.deepEqual(c.lineas, p.cadena(item.params, true).lineas);
      assert.equal(c.falsa, p.cadena(item.params, true).falsa);
    }
    // Las dos preguntas: el nombre bueno y dos de otro tipo de cálculo.
    assert.equal(item.preguntas.length, mal.length);
    item.preguntas.forEach(q => {
      const c = cols[q.col];
      assert.equal(q.solucion, c.error);
      assert.equal(q.opciones.length, 3);
      assert.equal(new Set(q.opciones).size, 3);
      assert.ok(q.opciones.includes(q.solucion));
      for (const id of q.opciones) { assert.ok(ERRORES_TIPICOS[id], id); if (id !== q.solucion) assert.notEqual(L.CLASE_DE[id], L.CLASE_DE[c.error], `${id} es del mismo tipo que ${c.error}`); }
    });
  }
  const tantoPorCiento = x => (x ?? 0) / N;
  assert.ok(tantoPorCiento((porColumnas[3] ?? 0) + (porColumnas[4] ?? 0)) > 0.3, `3-4 columnas: ${JSON.stringify(porColumnas)}`);
  assert.ok(porColumnas[2] > N * 0.2 && porColumnas[4] > N * 0.02, JSON.stringify(porColumnas));
  for (const k of ['1+1', '1+2', '2+1', '2+2']) assert.ok(combos[k] > N * 0.02, `${k}: ${JSON.stringify(combos)}`);
  assert.equal(familias.size, L.FAMILIAS.length, 'salen todas las familias');
  assert.ok(ceros.n > 20, 'salen columnas buenas con ceros al final');
});

/** Los decimales de una línea como [m, 10^k] reducidos a un valor comparable. */
const valorDe = s => { const d = D(s); return `${B(d.m) * p10(15 - d.k)}`; };
const decimalesDe = l => l.filter(s => s && s.d !== undefined).map(s => D(s.d));

test('ejercicio 1: el fallo de cuenta (sin nombre), como mucho uno, en la última línea, con una cifra cambiada y nunca un error con nombre', () => {
  let conCuenta = 0;
  const familias = new Set();
  for (const item of generar(L.generarDonde, 31)) {
    const cuentas = item.columnas.filter(c => c.error === L.CUENTA);
    assert.ok(cuentas.length <= 1);
    if (!cuentas.length) continue;
    conCuenta++;
    familias.add(item.familia);
    const [c] = cuentas;
    assert.equal(c.falsa, c.lineas.length - 1, 'la última cuenta');
    // Siempre al menos un error con nombre, y entonces solo una columna mala con nombre.
    assert.equal(item.columnas.filter(o => o.error && o.error !== L.CUENTA).length, 1);
    const [bien] = decimalesDe(L.explicaColumna(item, c).corregida), [mal] = decimalesDe(c.lineas.at(-1));
    // Una cifra de diferencia (unidades o última decimal), con las mismas cifras decimales: la coma no se mueve.
    assert.equal(mal.k, bien.k, 'la coma no se mueve');
    assert.ok([1, pot(bien.k)].includes(Math.abs(mal.m - bien.m)), `${aTexto(bien, 'es')} → ${aTexto(mal, 'es')}`);
    assert.ok(mal.m > 0);
    assert.equal(c.cuenta.bien, aTexto(bien, 'es'));
    // No coincide con el resultado de ninguna otra columna ni de ningún error con nombre de la familia (por valor).
    const fa = L.FAMILIA_POR_ID[item.familia], posibles = L.columnasPosibles(fa, item.params);
    for (const o of [...posibles.bien, ...posibles.mal, ...item.columnas.filter(o => o !== c)]) {
      for (const d of decimalesDe(o.lineas.at(-1))) assert.ok(!mismoValor(d, mal), `${aTexto(mal, 'es')} = ${o.ruta ?? o.error}: ${item.params}`);
    }
    // Ni el bueno con la coma corrida: sus cifras no son las del bueno.
    assert.notEqual(valorDe(aTexto(mal.normalizar(), 'es')).replace(/0+$/, ''), valorDe(aTexto(bien.normalizar(), 'es')).replace(/0+$/, ''));
    // Sale de una ruta buena que no está en el ítem: no es un calco de otra columna.
    for (const o of item.columnas) if (o !== c) assert.notDeepEqual(o.lineas.slice(0, -1), c.lineas.slice(0, -1));
    assert.ok(!item.columnas.some(o => o !== c && o.ruta === c.ruta), 'la ruta no repite otra columna');
  }
  assert.ok(conCuenta > N * 0.08, `con fallo de cuenta: ${conCuenta} de ${N}`);
  // Salen en las familias con una última línea «= resultado» de números y dos rutas buenas.
  for (const f of ['suma', 'producto', 'por10', 'division-entera', 'division-decimal', 'fraccion']) assert.ok(familias.has(f), f);
});
const pot = k => 10 ** k;

test('ejercicio 1: las preguntas tipo test son solo de los errores con nombre; la del fallo de cuenta no la lleva', () => {
  for (const item of generar(L.generarDonde, 33)) {
    const nombradas = item.columnas.map((c, j) => (c.error && c.error !== L.CUENTA ? j : -1)).filter(j => j >= 0);
    assert.deepEqual(item.preguntas.map(q => q.col), nombradas);
    assert.ok(nombradas.length >= 1);
    assert.deepEqual(item.solucion, item.columnas.map(c => c.falsa), 'la solución incluye la columna de la cuenta');
  }
});

test('ejercicio 1: cada plantilla sale como error de alguna columna y las dos de catálogo sin plantilla también', () => {
  const errores = new Set();
  for (const item of generar(L.generarDonde, 29)) for (const c of item.columnas) if (c.error) errores.add(c.error);
  for (const p of L.PLANTILLAS) assert.ok(errores.has(p.id), `no sale ${p.id}`);
  assert.ok(errores.has('numerador-como-decimas') && errores.has('redondea-otro-orden'));
});

test('ejercicio 1: los dos errores de catálogo sin plantilla se recalculan a mano', () => {
  for (const item of generar(L.generarDonde, 37)) for (const c of item.columnas) {
    if (c.error === 'numerador-como-decimas') {
      const [n, d] = item.params;
      assert.equal(L.textoLinea(c.lineas[1], 'es'), `= 0,${n}${d}`);
    }
    if (c.error === 'redondea-otro-orden') {
      const [a, b, o] = item.params, A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k);
      const S = B(A.m) * p10(k - A.k) + B(Bb.m) * p10(k - Bb.k), dos = p10(k - o - 1);
      assert.ok(igual(D(resultado(L.textoLinea(c.lineas[2], 'es')).replace(/ \(.*\)$/, '')), [cociente(S + dos / 2n, dos), p10(o + 1)]));
    }
  }
});

test('el resultado malo que se ve es el del error de la plantilla (última línea o paso marcado)', () => {
  for (const item of generar(L.generarQue, 5)) {
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    const mal = L.textoLinea(item.lineas.at(-1), 'es');
    if (['por-diez-anadiendo-cero', 'coma-solo-en-divisor', 'fraccion-al-reves'].includes(p.id)) continue;   // el error está en la línea 2; la 3 sigue de él
    const texto = resultado(mal).replace(/ \(.*\)$/, '');
    if (p.id === 'compara-por-cifras') { assert.match(texto, /[<>]/); continue; }
    if (p.id === 'resto-sin-deshacer') { assert.ok(mismoValor(D(mal.split(': ')[1]), p.malFinal(item.params))); continue; }
    if (p.id === 'alinea-a-la-derecha' || p.id === 'olvida-coma-cociente') { assert.ok(mismoValor(D(texto), p.malFinal(item.params)), `${p.id}: ${mal}`); continue; }
    assert.ok(mismoValor(D(texto), p.malFinal(item.params)), `${p.id}: ${mal}`);
  }
});

test('ejercicio 2: cuatro nombres distintos, solo uno verdadero; los otros darían otro resultado', () => {
  const items = generar(L.generarQue);
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'que');
    assert.ok(item.falsa === 1 || item.falsa === 2);
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    vistas.add(p.id);
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4);
    assert.equal(item.solucion, p.id);
    assert.equal(item.opciones.filter(id => id === item.solucion).length, 1);
    for (const idioma of ['es', 'en']) assert.equal(new Set(item.opciones.map(id => ERRORES_TIPICOS[id].nombre[idioma])).size, 4);
    for (const id of item.opciones) {
      assert.ok(ERRORES_TIPICOS[id], `${id}: tiene que ser un error típico con nombre`);
      if (id === item.solucion) continue;
      // Un nombre falso o es de otro cálculo o, aplicado a estos números, da otro valor (o no se aplica).
      assert.equal(L.explica(p, id, item.params), false, `${id} también explica ${p.id} ${item.params}`);
      if (L.CLASE_DE[id] === p.clase) {
        for (const args of p.args(id, item.params)) {
          const r = ERRORES_TIPICOS[id].fn(...args);
          assert.ok(r === null || !mismoValor(r, p.valorError(item.params)), `${id} frente a ${p.id}`);
        }
      }
    }
  }
  assert.equal(vistas.size, L.PLANTILLAS.length);
});

test('ejercicio 3: la respuesta correcta por valor, con coma o punto y con o sin ceros finales', () => {
  const items = generar(L.generarCorrige);
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'corrige');
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    assert.ok(p.corrige, `${p.id} no se puede teclear`);
    vistas.add(p.id);
    const bien = L.resultadoBueno(item);
    for (const idioma of ['es', 'en']) {
      const escrito = deTexto(aTexto(bien, idioma));
      assert.equal(L.corregirCorrige(item, escrito).acierto, true, `${p.id}: ${aTexto(bien, idioma)}`);
    }
    if (item.cifras === null) {
      assert.equal(L.corregirCorrige(item, bien.conCifras(bien.k + 1)).acierto, true, 'los ceros finales no son un error');
    } else {
      // Redondeo: el valor bueno con otro número de cifras no vale (el enunciado dice cuántas).
      assert.equal(bien.k, item.cifras);
      const mas = L.corregirCorrige(item, bien.conCifras(bien.k + 1));
      assert.deepEqual([mas.acierto, mas.error], [false, 'cifras']);
    }
    const mal = L.corregirCorrige(item, p.malFinal(item.params));
    assert.deepEqual([mal.acierto, mal.error], [false, 'repite-el-error']);
    const otro = L.corregirCorrige(item, deTexto('123,456'));
    assert.deepEqual([otro.acierto, otro.error], [false, 'otro-resultado']);
    assert.equal(mismoValor(p.malFinal(item.params), bien), false);
  }
  assert.equal(vistas.size, L.PLANTILLAS.filter(p => p.corrige).length);
});

test('el redondeo dice a qué orden y el valor bueno lleva justo esas cifras', () => {
  const rng = crearRng(9);
  for (const id of ['redondea-truncando', 'redondea-en-cadena']) {
    const p = L.PLANTILLA_POR_ID[id];
    const ordenes = new Set();
    for (let i = 0; i < 200; i++) {
      const params = p.params(rng);
      if (!params) continue;
      assert.equal(p.bien(params).k, params[2]);
      const { lineas } = p.cadena(params, true);
      ordenes.add(params[2]);
      for (const idioma of ['es', 'en']) assert.match(L.textoLinea(lineas[2], idioma), /\(.+\)/);
    }
    assert.deepEqual([...ordenes].sort(), [0, 1, 2]);
  }
});

test('los casos de la hoja de la semana (en claro) y los del examen (por huella) no salen nunca', () => {
  // Que la comprobación existe y no depende del orden de los sumandos ni de los ceros finales.
  assert.ok(L.HOJA.has(L.claveCaso('suma+', ['1,25', '3,6'], true)));
  assert.ok(L.HOJA.has(L.claveCaso('suma+', ['3,60', '1,250'], true)));
  assert.ok(L.HOJA.has(L.claveCaso('redondeo', ['6,3490'])));
  assert.ok(L.HOJA.has(L.claveCaso('division', ['9', '2'])));
  assert.ok(!L.HOJA.has(L.claveCaso('suma−', ['3,6', '1,25'])));
  assert.ok(L.HUELLAS_EXAMEN instanceof Set);
  assert.equal(L.HUELLAS_EXAMEN.size, 146);
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 23)) {
      const clave = L.PLANTILLA_POR_ID[item.plantilla].caso(item.params);
      assert.ok(!L.HOJA.has(clave), `caso de la hoja: ${clave}`);
      assert.ok(!L.HUELLAS_EXAMEN.has(L.huella(clave)), `caso del examen: ${clave}`);
      const primera = L.PLANTILLA_POR_ID[item.plantilla].casoPrimera;
      if (primera) {
        const c2 = primera(item.params);
        assert.ok(!L.HOJA.has(c2) && !L.HUELLAS_EXAMEN.has(L.huella(c2)), `primera línea prohibida: ${c2}`);
      }
    }
  }
});

test('los ítems son JSON (la base los guarda) y se pintan igual después de ida y vuelta', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 41).slice(0, 300)) {
      const copia = JSON.parse(JSON.stringify(item));
      assert.deepEqual(copia, item);
      for (const idioma of ['es', 'en']) assert.deepEqual(lineasDe(copia).map(l => L.htmlLinea(l, idioma)), lineasDe(item).map(l => L.htmlLinea(l, idioma)));
      assert.equal(L.claveItem(copia), L.claveItem(item));
    }
  }
});

/** Todas las líneas de un ítem (el ej. 1 las tiene por columna). */
const lineasDe = item => item.lineas ?? item.columnas.flatMap(c => c.lineas);
// El numerador y el denominador de una fracción con raya son dos números (65 y 100, no 65100).
const sinHtml = s => s.replace(/<\/span><span>/g, ' ').replace(/<[^>]*>/g, '');
/** Las reglas de la unidad en un texto que lee el alumno. */
function reglasDeTexto(texto, idioma, donde) {
  const t = sinHtml(texto);
  assert.ok(!t.includes('×'), `${donde}: «×»: ${t}`);
  assert.ok(!t.includes('%'), `${donde}: porcentaje: ${t}`);
  assert.ok(!/(?<![\d,.])\d{5,}/.test(t), `${donde}: más de cuatro cifras enteras: ${t}`);
  assert.ok(!/\b[xz]\b/.test(t), `${donde}: letra de variable: ${t}`);
  assert.ok(!/\d\.\d{3}\.\d|\d,\d{3},\d/.test(t), `${donde}: separador de millares: ${t}`);
  if (idioma === 'en') assert.ok(!/\d,\d/.test(t), `${donde}: coma decimal en inglés: ${t}`);
  else assert.ok(!/\d\.\d/.test(t), `${donde}: punto decimal en español: ${t}`);
  assert.ok(!t.includes('÷'), `${donde}: «÷»`);
}

test('ningún texto de alumno con ×, porcentajes, millares, letras ni coma en inglés o punto en español', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 53).slice(0, 1200)) {
      const p = L.PLANTILLA_POR_ID[item.plantilla];
      for (const idioma of ['es', 'en']) {
        for (const l of lineasDe(item)) reglasDeTexto(L.textoLinea(l, idioma), idioma, `${p.id} línea`);
        reglasDeTexto(p.porque(item.params, idioma), idioma, `${p.id} porque`);
        for (const c of item.columnas ?? []) reglasDeTexto(L.explicaColumna(item, c).porque(idioma), idioma, `${c.ruta} porque`);
        if (item.falsa !== undefined) for (const l of p.cadena(item.params, false).lineas) reglasDeTexto(L.textoLinea(l, idioma), idioma, `${p.id} buena`);
      }
    }
  }
  for (const idioma of ['es', 'en']) {
    const textos = [];
    const recoger = o => { for (const v of Object.values(o)) { if (typeof v === 'string') textos.push(v); else if (v && typeof v === 'object' && !(idioma in v)) recoger(v); else if (v && typeof v[idioma] === 'string') textos.push(v[idioma]); } };
    recoger(TX);
    for (const t of textos) reglasDeTexto(t, idioma, 'TX');
    for (const e of Object.values(ERRORES_TIPICOS)) reglasDeTexto(e.nombre[idioma], idioma, 'nombre de error');
  }
});

test('los números son de hasta cuatro cifras enteras y el resto, sin contextos que acotar', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 61)) {
      for (const l of lineasDe(item)) for (const s of l) {
        if (s && s.d !== undefined) assert.ok(Math.abs(D(s.d).valor()) < 10000, `${item.plantilla}: ${s.d}`);
      }
      for (const x of item.params) if (typeof x === 'string' && /,/.test(x)) assert.ok(Math.abs(D(x).valor()) < 10000);
    }
  }
  assert.ok(MENOS === '−');
});

// ─── JL, 22-11: «2,12 · 0,9 = 212 · 9 = 1908 = 1,908» encadenaba igualdades falsas ────────────────

test('ninguna cadena iguala la cuenta con comas y la cuenta sin comas (ni en los ejemplos de la introducción)', async () => {
  const { TX } = await import('../practicas/errores5/textos.js');
  const falsa = /\d[,.]\d+ [·:] \d+([,.]\d+)?\s*(<br>)?\s*=\s*\d+ [·:]/;
  for (const gen of [L.generarDonde, L.generarQue, L.generarCorrige]) for (const item of generar(gen, 22)) {
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    for (const mal of [false, true]) {
      const lineas = p.cadena(item.params, mal).lineas;
      for (const idioma of ['es', 'en']) {
        const textos = lineas.map(l => L.textoLinea(l, idioma));
        assert.doesNotMatch(textos.join(' = '), /Sin (las )?comas?: .* = = |Without the points?: .* = = /, p.id);
        textos.forEach((t, i) => {
          if (i && /^(Sin|Without)/.test(textos[i - 1])) assert.doesNotMatch(t, /^= /, `${p.id}: «${textos[i - 1]}» seguida de «${t}»`);
          if (i === 1 && ['coma-mal-puesta', 'olvida-coma-cociente'].includes(p.id)) assert.doesNotMatch(t, /^= /, `${p.id}: ${t}`);
        });
      }
    }
  }
  for (const ej of Object.values(TX.introduccion)) for (const t of [ej.es, ej.en]) {
    assert.doesNotMatch(t.replace(/<br>/g, ' '), falsa, t);
    assert.doesNotMatch(t, /<br>\d\. |líneas numeradas|numbered lines/, 'sin números de línea');
  }
});

test('alinea-a-la-derecha: una sola línea mala (antes «3,81 + 7,9 = 381 + 79 = 4,60» tenía dos; JL, 23-11)', () => {
  const p = L.PLANTILLA_POR_ID['alinea-a-la-derecha'];
  const rng = crearRng(2311);
  for (let i = 0; i < 300; i++) {
    const params = p.params(rng);
    if (!params) continue;
    const { lineas, falsa } = p.cadena(params, true);
    assert.equal(falsa, 1);
    assert.equal(lineas.length, 2, 'el enunciado y el resultado equivocado');
    const resultado = L.textoLinea(lineas[1], 'es').replace(/^= /, '');
    assert.ok(mismoValor(D(resultado), p.malFinal(params)), resultado);
  }
});
