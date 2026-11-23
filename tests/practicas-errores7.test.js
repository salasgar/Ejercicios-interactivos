// Práctica «Caza el error» de la unidad 7 (PU2, tarea 225): la lógica se prueba por fuerza bruta con semillas
// fijas (3000 ítems por ejercicio). La solución buena y la mala de cada plantilla se recalculan aquí a mano, con
// aritmética de números, sin pasar por ERRORES_TIPICOS ni por las funciones de proporcion.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, mismoValor, cantidad, huellaCaso } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/errores7/logica.js';
import * as X from '../practicas/errores7/textos.js';

const { TX } = X;

const N = 3000;
const generar = (fn, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const valor = c => c.valor.num / c.valor.den;
const casi = (a, b) => Math.abs(a - b) < 1e-9;
/** Los ejercicios de una sola resolución (el 1 va en columnas y tiene sus tests abajo). */
const GENERADORES = [['que', L.generarQue, 22], ['corrige', L.generarCorrige, 23]];
/** Todas las líneas que ve el alumno: las de la resolución (ej. 2 y 3) o las de todas las columnas (ej. 1). */
const lineasDe = item => (item.columnas ? item.columnas.flatMap(c => c.lineas) : item.lineas);

/** [bien, mal] de cada plantilla, calculados a mano a partir de los parámetros. */
const MANO = {
  'razonar-sumando': p => [p.a * p.u * p.k, p.a * p.u + (p.a * p.k - p.a)],
  'porcentaje-entre-mil': p => [p.p * p.c / 100, p.p * p.c / 1000],
  'porcentaje-entre-diez': p => [p.p * p.c / 100, p.p * p.c / 10],
  'dividir-entre-el-porcentaje': p => [p.p * p.c / 100, p.c / p.p],
  'restar-el-porcentaje-como-numero': p => [p.c * (100 - p.p) / 100, p.c - p.p],
  'descuento-por-precio-final': p => [p.c * (100 - p.p) / 100, p.c * p.p / 100],
  'escala-sin-cambio-de-unidad': p => [p.d * p.n / 100000, p.d * p.n],
};

test('el catálogo declara tres ejercicios y cada plantilla tiene su error con nombre', () => {
  const fila = CATALOGO.find(f => f.slug === 'errores7');
  assert.equal(fila.nEjercicios, 3);
  assert.equal(L.PLANTILLAS.length, 7);
  for (const pl of L.PLANTILLAS) {
    const e = ERRORES_TIPICOS[pl.id];
    assert.ok(e && e.nombre.es && e.nombre.en, pl.id);
    assert.ok(L.CLASE_DE[pl.id], `${pl.id} sin clase`);
    assert.ok(MANO[pl.id], `${pl.id} sin cálculo a mano`);
  }
});

test('la solución buena y la mala de cada plantilla coinciden con el cálculo a mano', () => {
  for (const [ej, fn, sem] of GENERADORES) {
    const vistas = new Set();
    for (const it of generar(fn, sem)) {
      vistas.add(it.plantilla);
      const [b, m] = MANO[it.plantilla](it.params);
      const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
      assert.ok(casi(valor(bien), b), `${ej} bien: ${L.claveItem(it)}`);
      assert.ok(casi(valor(mal), m), `${ej} mal: ${L.claveItem(it)}`);
      assert.ok(!casi(b, m), `bueno y malo iguales: ${L.claveItem(it)}`);
      assert.equal(bien.unidad, mal.unidad, `unidades distintas: ${L.claveItem(it)}`);
    }
    assert.equal(vistas.size, 7, `${ej}: faltan plantillas`);
  }
});

test('ejercicios 2 y 3: tres líneas, el error en una sola; las anteriores a la mala son las de la resolución buena', () => {
  for (const [, fn, sem] of GENERADORES) {
    for (const it of generar(fn, sem + 10)) {
      assert.equal(it.lineas.length, 3);
      assert.ok(it.falsa >= 1 && it.falsa <= 2, L.claveItem(it));
      assert.equal(it.error, it.plantilla);
      const buena = L.lineasBuenas(it);
      assert.notDeepEqual(buena[it.falsa], it.lineas[it.falsa], `la línea buena es la mala: ${L.claveItem(it)}`);
      for (let i = 0; i < it.falsa; i++) assert.deepEqual(buena[i], it.lineas[i], `una línea anterior a la mala cambia: ${L.claveItem(it)}`);
      assert.deepEqual(L.lineaBuena(it), buena[it.falsa]);
    }
  }
});

// ─── Ejercicio 1 en columnas (JL, 22-11) ────────────────────────────────────────
//
// Cada igualdad de las líneas en español se evalúa aquí, con un lector propio: «20 % de 150 = 150 : 100 · 20»,
// «150 000 cm = 1,5 km», «x = 6,00 € · 9 : 3 = 18,00 €». De cada lado del «=» se toma la expresión más larga que se
// pueda leer (números con su unidad, «·», «:», «+», «−» y «de» como producto); lo que no es una cuenta («x», una
// frase) no se evalúa.

const FACTOR = { '€': 1, '%': 0.01, cm: 1, m: 100, km: 100000 };
const normal = s => s.replace(/[   ]/g, ' ').replace(/(\d) (?=\d{3}(?!\d))/g, '$1');
function leer(ws) {
  let i = 0;
  const factor = () => {
    if (!/^\d+(,\d+)?$/.test(ws[i] ?? '')) return null;
    let v = Number(ws[i++].replace(',', '.'));
    if (Object.hasOwn(FACTOR, ws[i] ?? '')) v *= FACTOR[ws[i++]];
    return v;
  };
  const termino = () => {
    let v = factor();
    while (v !== null && ['·', ':', 'de'].includes(ws[i])) { const op = ws[i++], w = factor(); v = w === null ? null : op === ':' ? v / w : v * w; }
    return v;
  };
  let v = termino();
  while (v !== null && ['+', '−'].includes(ws[i])) { const op = ws[i++], w = termino(); v = w === null ? null : op === '+' ? v + w : v - w; }
  return v !== null && i === ws.length ? v : null;
}
const palabras = s => s.trim().split(/ +/).map(w => w.replace(/[.,]$/, ''));
/** Las igualdades de una línea: [[izquierda, derecha], …] con su valor (las que no se pueden leer, fuera). */
function igualdades(linea) {
  const trozos = normal(linea).split(' = ');
  const pares = [];
  for (let j = 0; j + 1 < trozos.length; j++) {
    const iz = palabras(trozos[j]), de = palabras(trozos[j + 1]);
    let a = null, b = null;
    for (let k = 0; k < iz.length && a === null; k++) a = leer(iz.slice(k));
    for (let k = de.length; k > 0 && b === null; k--) b = leer(de.slice(0, k));
    if (a !== null && b !== null) pares.push([a, b]);
  }
  return pares;
}
const iguales = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a));
/** El número con que acaba la línea (sin la unidad). */
const ultimoNumero = linea => Number([...normal(linea).matchAll(/\d+(?:,\d+)?/g)].at(-1)[0].replace(',', '.'));

/** El resultado bueno de cada familia y el de cada error, a mano a partir de los parámetros. */
const BIEN_COL = {
  directa: p => p.a * p.u * p.k, porcentaje: p => p.p * p.c / 100, descuento: p => p.c * (100 - p.p) / 100, escala: p => p.d * p.n / 100000,
};
const MAL_COL = {
  ...Object.fromEntries(Object.entries(MANO).map(([id, f]) => [id, p => f(p)[1]])),
  'inversa-en-directa': p => p.a * p.u / p.k,
  'contestar-otra-cosa': p => p.u,
  'porcentaje-sin-dividir': p => p.p * p.c,
  'aumento-por-descuento': p => p.c * (100 + p.p) / 100,
};
/** Errores cuya línea mala es una cuenta falsa (en los demás es una frase falsa: «así que cuestan 6,00 € más»). */
const CUENTA_FALSA = new Set(['porcentaje-entre-mil', 'porcentaje-entre-diez', 'dividir-entre-el-porcentaje', 'porcentaje-sin-dividir',
  'restar-el-porcentaje-como-numero', 'escala-sin-cambio-de-unidad', L.CUENTA]);

test('ejercicio 1: 2-4 columnas que empiezan por el enunciado; 1-2 bien (de formas distintas) y 1-2 con errores distintos', () => {
  const combinaciones = {}, familias = new Set(), rutas = new Set();
  for (const item of generar(L.generarDonde, 31)) {
    assert.equal(item.tipo, 'donde');
    familias.add(item.familia);
    const { columnas } = item;
    assert.ok(columnas.length >= 2 && columnas.length <= 4, columnas.length);
    const bien = columnas.filter(c => !c.error), mal = columnas.filter(c => c.error);
    assert.ok(bien.length >= 1 && bien.length <= 2 && mal.length >= 1 && mal.length <= 2, `${bien.length} bien, ${mal.length} mal`);
    combinaciones[`${bien.length}+${mal.length}`] = (combinaciones[`${bien.length}+${mal.length}`] ?? 0) + 1;
    assert.equal(new Set(mal.map(c => c.error)).size, mal.length, 'dos columnas con el mismo error');
    assert.equal(new Set(columnas.map(c => c.ruta)).size, columnas.length, 'dos columnas por el mismo camino');
    assert.equal(new Set(columnas.map(c => JSON.stringify(c.lineas))).size, columnas.length, 'dos columnas iguales');
    for (const c of columnas) {
      rutas.add(c.ruta);
      assert.deepEqual(c.lineas[0], item.enunciado, 'todas empiezan por el enunciado');
      assert.ok(c.lineas.length >= 3, c.lineas.map(l => l.es).join(' | '));
      if (c.error) {
        assert.ok(c.falsa >= 1 && c.falsa < c.lineas.length, 'el enunciado nunca es la línea mala');
        // El fallo de cuenta (JL, 23-11) no está en el catálogo ni tiene regla: tiene su test abajo.
        if (c.error !== L.CUENTA) {
          assert.ok(ERRORES_TIPICOS[c.error], `${c.error}: no está en el catálogo`);
          assert.ok(X.REGLAS[c.error], `${c.error}: sin regla`);
        }
        assert.notDeepEqual(c.corregida, c.lineas[c.falsa], `${c.ruta}: lo correcto es la línea mala`);
      } else assert.equal(c.falsa, null);
    }
    assert.deepEqual(item.solucion, columnas.map(c => c.falsa));
  }
  assert.equal(familias.size, L.FAMILIAS.length, 'salen todas las familias');
  const todas = L.FAMILIAS.flatMap(fa => [...fa.bien, ...fa.mal].map(r => r.id));
  assert.deepEqual([...rutas].sort(), [...todas].sort(), 'sale cada ruta');
  for (const k of ['1+1', '1+2', '2+1', '2+2']) assert.ok(combinaciones[k] > N * 0.02, `combinación ${k}: ${combinaciones[k]}`);
  assert.ok((N - combinaciones['1+1']) > N * 0.5, `con 3 o 4 columnas: ${N - combinaciones['1+1']} de ${N}`);
});

test('ejercicio 1: en las columnas buenas toda igualdad es verdad; en las malas, todas menos la de la línea mala', () => {
  for (const item of generar(L.generarDonde, 32)) {
    for (const c of item.columnas) {
      let vistas = 0;
      c.lineas.forEach((l, i) => {
        const pares = igualdades(l.es);
        vistas += pares.length;
        if (i === c.falsa) {
          if (CUENTA_FALSA.has(c.error)) assert.ok(pares.some(([a, b]) => !iguales(a, b)), `${c.ruta}: la línea mala no tiene ninguna cuenta falsa: ${l.es}`);
        } else for (const [a, b] of pares) assert.ok(iguales(a, b), `${c.ruta}: igualdad falsa en «${l.es}» (${a} ≠ ${b})`);
      });
      assert.ok(vistas >= 1, `${c.ruta}: ninguna igualdad que comprobar`);
      for (const [a, b] of igualdades(c.corregida?.es ?? '')) assert.ok(iguales(a, b), `${c.ruta}: lo correcto es falso: ${c.corregida.es}`);
    }
  }
});

test('ejercicio 1: las buenas acaban en el resultado bueno y cada mala en el de su error (calculados a mano)', () => {
  for (const item of generar(L.generarDonde, 33)) {
    const p = item.params, bueno = BIEN_COL[item.familia](p);
    for (const c of item.columnas) {
      const fin = ultimoNumero(c.lineas.at(-1).es);
      if (!c.error) assert.ok(iguales(fin, bueno), `${c.ruta}: acaba en ${fin} y no en ${bueno}`);
      else if (c.error === L.CUENTA) {
        assert.ok(iguales(c.cuenta.bien, bueno) && iguales(fin, c.cuenta.mal), `${c.ruta}: ${c.lineas.at(-1).es}`);
        assert.ok(!iguales(fin, bueno), `${c.ruta}: el fallo de cuenta acaba en el resultado bueno`);
      } else {
        assert.ok(MAL_COL[c.error], `${c.error} sin cálculo a mano`);
        assert.ok(iguales(fin, MAL_COL[c.error](p)), `${c.ruta}: acaba en ${fin} y no en ${MAL_COL[c.error](p)}`);
        assert.ok(!iguales(fin, bueno), `${c.ruta}: la columna mala acaba en el resultado bueno`);
      }
    }
  }
});

// ─── JL, 23-11: el fallo de cuenta ─────────────────────────────────────────────
//
// Todo se recalcula aquí a mano: lo que daría cada error con nombre de la familia, la última cuenta (leída del texto
// de la línea buena) con otra operación, y los números que ya salen en la columna.

/** Los errores con nombre de cada familia (sus resultados, en MAL_COL) y otros del catálogo con los mismos números. */
const ERRORES_FAMILIA = {
  directa: ['razonar-sumando', 'inversa-en-directa', 'contestar-otra-cosa'],
  porcentaje: ['porcentaje-entre-mil', 'porcentaje-entre-diez', 'dividir-entre-el-porcentaje', 'porcentaje-sin-dividir'],
  descuento: ['restar-el-porcentaje-como-numero', 'descuento-por-precio-final', 'aumento-por-descuento'],
  escala: ['escala-sin-cambio-de-unidad'],
};
const OTROS_A_MANO = { descuento: p => [p.c + p.p], escala: p => [p.d / p.n / 100000, p.d * p.n * 100000] };
/** Lo que se puede apartar del bueno: en euros, 10 céntimos o un euro; en alumnos, uno o dos; en km, una décima o uno. */
const SALTOS = { '€': [0.1, 1], alumnos: [1, 2], km: [0.1, 1] };
const unidadDe = item => (item.familia === 'escala' ? 'km' : item.familia === 'porcentaje' && item.params.ctx === 0 ? 'alumnos' : '€');
/** La última cuenta de una línea buena, «x = 15,00 € · 20 : 5 = 60,00 €» → [15, '·', 20, ':', 5] (sin unidades; % entre 100). */
function ultimaCuenta(linea) {
  const t = [];
  for (const w of palabras(normal(linea).split(' = ').at(-2))) {
    if (/^\d+(,\d+)?$/.test(w)) t.push(Number(w.replace(',', '.')));
    else if (w === '%') t[t.length - 1] /= 100;
    else if (['·', ':', '+', '−', 'de'].includes(w)) t.push(w === 'de' ? '·' : w);
  }
  return t;
}
const OP = { '+': (a, b) => a + b, '−': (a, b) => a - b, '·': (a, b) => a * b, ':': (a, b) => a / b };
function conOtraOperacion(t) {
  const evalua = u => {
    let v = u[0];
    for (let k = 1; k < u.length; k += 2) v = OP[u[k]](v, u[k + 1]);
    return u.length === 5 ? [v, OP[u[1]](u[0], OP[u[3]](u[2], u[4]))] : [v];
  };
  const r = [];
  for (let k = 1; k < t.length; k += 2) {
    for (const op of Object.keys(OP)) if (op !== t[k]) r.push(...evalua([...t.slice(0, k), op, ...t.slice(k + 1)]));
    if (t[k] === ':') r.push(...evalua([...t.slice(0, k - 1), t[k + 1], ':', t[k - 1], ...t.slice(k + 2)]));
  }
  return r;
}

test('ejercicio 1: el fallo de cuenta (sin nombre), como mucho uno por ítem, cerca del bueno y nunca un error con nombre', () => {
  let conCuenta = 0;
  const familias = new Set(), rutas = new Set();
  for (const item of generar(L.generarDonde, 31)) {
    const cuentas = item.columnas.filter(c => c.error === L.CUENTA);
    assert.ok(cuentas.length <= 1);
    if (!cuentas.length) continue;
    conCuenta++;
    familias.add(item.familia);
    const [c] = cuentas, p = item.params, otras = item.columnas.filter(o => o !== c), donde = c.lineas.map(l => l.es).join(' | ');
    assert.equal(otras.filter(o => o.error).length, 1, 'solo con una columna mala con nombre');
    rutas.add(c.ruta);
    // La última cuenta, cerca del bueno: un salto creíble en su unidad, y nunca la mitad o más.
    assert.equal(c.falsa, c.lineas.length - 1, 'la última cuenta');
    const bien = BIEN_COL[item.familia](p), mal = ultimoNumero(c.lineas.at(-1).es);
    assert.ok(iguales(mal, c.cuenta.mal) && iguales(bien, c.cuenta.bien), donde);
    const salto = Math.abs(mal - bien);
    assert.ok(SALTOS[unidadDe(item)].some(s => iguales(salto, s)), `${bien} → ${mal}: ${donde}`);
    assert.ok(mal > 0 && salto * 2 < bien, `demasiado lejos: ${bien} → ${mal}`);
    if (unidadDe(item) === 'alumnos') assert.ok(Number.isInteger(mal), `alumnos no enteros: ${mal}`);
    // Solo cambia el resultado: lo de antes es la ruta buena y la línea buena es «lo correcto».
    assert.deepEqual(c.lineas.slice(0, -1).concat([c.corregida]), L.columnasPosibles(L.FAMILIA_POR_ID[item.familia], p).bien.find(b => b.ruta === c.ruta).lineas);
    assert.equal(igualdades(c.corregida.es).length >= 1, true);
    // Ni el resultado de otra columna, ni el de un error con nombre de la familia, ni la última cuenta con otra
    // operación, ni un número que ya sale en la columna («ha contestado otra cosa»).
    for (const o of otras) assert.ok(!iguales(ultimoNumero(o.lineas.at(-1).es), mal), `igual que otra columna: ${donde}`);
    for (const id of ERRORES_FAMILIA[item.familia]) assert.ok(!iguales(MAL_COL[id](p), mal), `${id}: ${donde}`);
    for (const v of OTROS_A_MANO[item.familia]?.(p) ?? []) assert.ok(!iguales(v, mal), `${v}: ${donde}`);
    const t = ultimaCuenta(c.corregida.es);
    assert.ok(t.length >= 1 && t.every((x, k) => (k % 2 ? x in OP : Number.isFinite(x))), `no se lee la cuenta: ${c.corregida.es}`);
    for (const v of conOtraOperacion(t)) assert.ok(!iguales(v, mal), `${t.join(' ')} con otra operación da ${v}: ${donde}`);
    for (const l of c.lineas.slice(0, -1)) for (const m of normal(l.es).matchAll(/\d+(?:,\d+)?/g)) assert.ok(!iguales(Number(m[0].replace(',', '.')), mal), `${mal} ya sale: ${donde}`);
    // Sale de una ruta buena que no está en el ítem: no es un calco de otra columna.
    assert.ok(!otras.some(o => o.ruta === c.ruta), `la ruta ${c.ruta} ya sale`);
    // La explicación: la cuenta bien hecha, sin regla.
    assert.match(c.porque.es, /= .+, no .+\.$/, c.porque.es);
    assert.match(c.porque.en, /= .+, not .+\.$/, c.porque.en);
  }
  assert.ok(conCuenta > N * 0.08, `con fallo de cuenta: ${conCuenta} de ${N}`);
  assert.equal(familias.size, L.FAMILIAS.length, `sale en todas las familias: ${[...familias]}`);
  assert.equal(rutas.size, L.FAMILIAS.flatMap(fa => fa.bien).length, `sale de todas las rutas buenas: ${[...rutas]}`);
});

test('el fallo de cuenta: «5 · 1 km» nunca da 6 km (5 + 1) ni 4 km (5 − 1)', () => {
  const fa = L.FAMILIA_POR_ID.escala;
  for (let s = 0; s < 400; s++) {
    const item = L.generarDonde(crearRng(9000 + s));
    const c = item.columnas.find(x => x.error === L.CUENTA && x.ruta === 'escala-primero');
    if (!c || item.params.n !== 100000) continue;
    const d = item.params.d;
    assert.ok(!iguales(c.cuenta.mal, d + 1) && !iguales(c.cuenta.mal, d - 1), `${d} · 1 km = ${c.cuenta.mal} km`);
  }
  assert.ok(fa);
});

test('ejercicio 1: una pregunta por columna mala, con el nombre bueno y dos de otro tipo de problema (regla de oro)', () => {
  for (const item of generar(L.generarDonde, 34)) {
    // Solo las columnas con un error con nombre llevan pregunta; la del fallo de cuenta, no (JL, 23-11).
    const malas = item.columnas.map((c, j) => (c.error && c.error !== L.CUENTA ? j : -1)).filter(j => j >= 0);
    assert.deepEqual(item.preguntas.map(q => q.col), malas);
    assert.ok(malas.length >= 1, 'siempre hay al menos un error con nombre');
    for (const q of item.preguntas) {
      const c = item.columnas[q.col];
      assert.equal(q.solucion, c.error);
      assert.equal(q.opciones.length, 3);
      assert.equal(new Set(q.opciones).size, 3);
      assert.ok(q.opciones.includes(c.error));
      for (const o of q.opciones.filter(o => o !== c.error)) {
        assert.ok(ERRORES_TIPICOS[o], o);
        assert.notEqual(L.CLASE_COLUMNA[o], L.CLASE_COLUMNA[c.error], `${o} y ${c.error}, mismo tipo de problema`);
        assert.ok(!L.NUNCA_DISTRACTOR.has(o), `${o} es demasiado general para ser distractor`);
        assert.ok(!(c.error === 'aumento-por-descuento' && o === 'razonar-sumando'), 'en «100 % + 20 %» ha sumado');
        // «20 % de 50,00 € = 20,00 €» no puede salir de un porcentaje mal calculado.
        if (c.error === 'restar-el-porcentaje-como-numero' && L.CLASE_COLUMNA[o] === 'porcentaje') {
          const v = ERRORES_TIPICOS[o].fn(item.params.p, cantidad(item.params.c, '€'));
          assert.ok(v === null || !mismoValor(v, cantidad(item.params.p, '€')), `${o} daría la línea mala de ${c.ruta}`);
        }
      }
    }
  }
});

test('ejercicio 1: sin «Todo está bien» ni «k veces más»', () => {
  assert.equal(X.TX.todo_bien, undefined);
  assert.doesNotMatch(JSON.stringify([X.TX.instruccion.donde, X.TX.detalle.donde, X.TX.introduccion.donde]), /Todo está bien|All correct|veces más/);
  for (const item of generar(L.generarDonde, 35).slice(0, 1000)) {
    const texto = item.columnas.flatMap(c => [...c.lineas, c.porque, c.corregida ?? { es: '', en: '' }]).map(l => l.es).join(' ');
    assert.doesNotMatch(texto, /veces más/, texto);
  }
});

test('ejercicio 2: cuatro nombres, solo uno verdadero; ningún otro daría el mismo resultado ni es vecino', () => {
  for (const it of generar(L.generarQue, 41)) {
    assert.equal(it.opciones.length, 4, L.claveItem(it));
    assert.equal(new Set(it.opciones).size, 4);
    assert.equal(it.opciones.filter(id => id === it.solucion).length, 1);
    assert.equal(it.solucion, it.plantilla);
    assert.notEqual(it.falsa, null);
    const pl = L.PLANTILLA_POR_ID[it.plantilla];
    const mal = L.resultadoMalo(it);
    for (const id of it.opciones) {
      assert.ok(ERRORES_TIPICOS[id].nombre.es && ERRORES_TIPICOS[id].nombre.en, id);
      if (id === it.solucion) continue;
      assert.ok(!(it.plantilla.startsWith('porcentaje-entre') && id.startsWith('porcentaje-entre')), `vecinos: ${it.plantilla} y ${id}`);
      if (L.CLASE_DE[id] === L.CLASE_DE[it.plantilla] && L.CLASE_DE[id] !== 'otros') {
        const otro = ERRORES_TIPICOS[id].fn(...pl.args(it.params));
        assert.ok(otro === null || !mismoValor(otro, mal), `${id} daría lo mismo que ${L.claveItem(it)}`);
      }
    }
  }
});

test('ejercicio 3: el resultado bueno se acepta (con o sin unidad, con coma o punto); el malo se avisa', () => {
  for (const it of generar(L.generarCorrige, 51)) {
    const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
    assert.equal(L.corregirCorrige(it, bien).acierto, true);
    const texto = String(valor(bien));
    for (const t of [texto, texto.replace('.', ',')]) {
      const v = L.leerResultado(t, it, 'es');
      assert.ok(v, `no se lee ${t} en ${L.claveItem(it)}`);
      assert.equal(L.corregirCorrige(it, v).acierto, true, `${t} debería valer en ${L.claveItem(it)}`);
    }
    const rm = L.corregirCorrige(it, mal);
    assert.deepEqual([rm.acierto, rm.error], [false, 'repite-el-error']);
    const otro = L.corregirCorrige(it, cantidad(Math.round(valor(bien)) + (Math.round(valor(bien)) + 1 === valor(mal) ? 2 : 1), bien.unidad));
    assert.deepEqual([otro.acierto, otro.error], [false, 'otro-resultado']);
  }
  const it = generar(L.generarCorrige, 52)[0];
  assert.equal(L.leerResultado('abc', it), null);
  assert.equal(L.leerResultado('', it), null);
});

test('ningún texto del alumno lleva ×, ni el % mal escrito, ni undefined, en los dos idiomas', () => {
  const MALOS = [/×/, /\*/, /undefined|NaN|null/, /[+−-] [+−]/];
  const revisa = (texto, donde) => { for (const re of MALOS) assert.ok(!re.test(texto), `${donde}: «${texto}» casa con ${re}`); };
  for (const [, fn, sem] of [['donde', L.generarDonde, 71], ['que', L.generarQue, 72], ['corrige', L.generarCorrige, 73]]) {
    for (const it of generar(fn, sem)) {
      for (const l of [...lineasDe(it), ...(it.columnas ?? []).flatMap(c => [c.porque, c.corregida ?? c.porque])]) {
        for (const idioma of ['es', 'en']) revisa(l[idioma], L.claveItem(it));
        assert.ok(!/\d%/.test(l.es) && !/\d %/.test(l.es) && !/\d %/.test(l.en), `% mal escrito: ${l.es} | ${l.en}`);
        assert.ok(!/,\d/.test(l.en), `coma decimal en inglés: ${l.en}`);
        assert.ok(!/\d\.\d/.test(l.es), `punto decimal en español: ${l.es}`);
      }
      if (!it.columnas) for (const idioma of ['es', 'en']) revisa(L.porque(it, idioma), `porque ${it.plantilla}`);
    }
  }
  const recorre = (x, ruta) => {
    if (typeof x === 'string') return revisa(x.replace(/<[^>]*>/g, ''), ruta);
    if (typeof x === 'function') return revisa(x(3), ruta);
    if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) recorre(v, `${ruta}.${k}`);
  };
  recorre(TX, 'TX');
});

test('realismo: números creíbles en cada contexto', () => {
  for (const [, fn, sem] of GENERADORES) {
    for (const it of generar(fn, sem + 100)) {
      const p = it.params;
      switch (it.plantilla) {
        case 'razonar-sumando': assert.ok(p.a >= 2 && p.a <= 5 && p.u >= 2 && p.u <= 9 && p.a * p.k <= 30); break;
        case 'escala-sin-cambio-de-unidad': {
          const km = p.d * p.n / 100000;
          assert.ok(km >= 0.2 && km <= 30, `distancia real irreal: ${km} km`);
          assert.ok(p.d >= 2 && p.d <= 15);
          break;
        }
        case 'restar-el-porcentaje-como-numero': case 'descuento-por-precio-final':
          assert.ok(p.c >= 20 && p.c <= 150 && p.p <= 60); break;
        default: assert.ok(p.c >= 100 && p.c <= 800 && p.p >= 2 && p.p <= 80);
      }
    }
  }
});

test('realismo del ejercicio 1: todos los números que salen son creíbles en su contexto y el resultado es exacto', () => {
  const COSA_U = [[2, 5], [2, 4], [3, 9], [3, 6]];   // cuadernos, bolígrafos, entradas y bocadillos: euros por unidad
  for (const item of generar(L.generarDonde, 121)) {
    const p = item.params, bueno = BIEN_COL[item.familia](p);
    const centimos = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
    switch (item.familia) {
      case 'directa':
        assert.ok(p.a >= 2 && p.a <= 5 && p.k >= 2 && p.a * p.k <= 30, JSON.stringify(p));
        assert.ok(p.u >= COSA_U[p.cosa][0] && p.u <= COSA_U[p.cosa][1], `precio irreal: ${JSON.stringify(p)}`);
        break;
      case 'porcentaje':
        assert.ok(p.c >= 100 && p.c <= 800 && p.p >= 2 && p.p <= 80, JSON.stringify(p));
        // alumnos enteros; dinero al céntimo
        assert.ok(p.ctx === 0 ? Number.isInteger(bueno) : centimos(bueno), `resultado inexacto: ${bueno} (${JSON.stringify(p)})`);
        break;
      case 'descuento':
        assert.ok(p.c >= 20 && p.c <= 150 && p.p >= 10 && p.p <= 60 && centimos(bueno), JSON.stringify(p));
        break;
      case 'escala':
        // JL, 23-11: con escala de plano (hasta 1 : 25 000), el instituto y la biblioteca, de 0,2 a 4 km; con escala de
        // mapa, dos pueblos, de 1 a 30 km. Y el enunciado dice lo que toca.
        if (p.n <= 25000) assert.ok(bueno >= 0.2 && bueno <= 4, `el instituto y la biblioteca a ${bueno} km`);
        else assert.ok(bueno >= 1 && bueno <= 30, `dos pueblos a ${bueno} km`);
        assert.match(item.enunciado.es, p.n <= 25000 ? /plano de la ciudad.*instituto y la biblioteca/ : /mapa.*dos pueblos/, item.enunciado.es);
        assert.match(item.enunciado.en, p.n <= 25000 ? /school and the library/ : /two towns/, item.enunciado.en);
        assert.ok(p.d >= 2 && p.d <= 15);
        break;
      default: assert.fail(item.familia);
    }
    // Lo que acaba cada columna mala se puede escribir: dinero al céntimo, como mucho dos decimales.
    for (const c of item.columnas) assert.ok(centimos(ultimoNumero(c.lineas.at(-1).es)), c.lineas.at(-1).es);
  }
});

test('variedad del ejercicio 1: ningún ítem por encima del 2 % y ninguna familia por encima del 40 %', () => {
  const its = generar(L.generarDonde, 221), claves = new Map(), familias = new Map();
  for (const it of its) {
    claves.set(L.claveItem(it), (claves.get(L.claveItem(it)) ?? 0) + 1);
    familias.set(it.familia, (familias.get(it.familia) ?? 0) + 1);
  }
  assert.ok(Math.max(...claves.values()) <= N * 0.02, 'un ítem se repite demasiado');
  assert.ok(Math.max(...familias.values()) <= N * 0.4, `una familia domina: ${[...familias]}`);
  assert.ok(claves.size > 1000, `poca variedad: ${claves.size}`);
});

test('los nombres y los textos están en los dos idiomas', () => {
  const comprueba = (x, ruta) => {
    if (x && typeof x === 'object' && ('es' in x || 'en' in x)) {
      assert.ok(x.es !== undefined && x.en !== undefined && String(x.es).length && String(x.en).length, `falta un idioma en ${ruta}`);
    } else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) comprueba(v, `${ruta}.${k}`);
  };
  comprueba(TX, 'TX');
  for (const it of generar(L.generarQue, 81).slice(0, 300)) {
    for (const idioma of ['es', 'en']) assert.ok(L.porque(it, idioma).length > 10);
    for (const l of it.lineas) assert.ok(l.es && l.en);
  }
});

test('hoja y examen: las listas están vacías hasta que existan y el mecanismo de exclusión funciona', () => {
  assert.equal(L.CASOS_HOJA.size, 0);
  assert.equal(L.HUELLAS_EXAMEN.size, 0);
  const rng = crearRng(95);
  const primeros = Array.from({ length: 200 }, () => L.generarDonde(rng));
  const huellas = primeros.map(i => huellaCaso(...L.PLANTILLA_POR_ID[i.plantilla].caso(i.params)));
  huellas.forEach(h => L.CASOS_HOJA.add(h));
  try {
    const rng2 = crearRng(95);
    for (let i = 0; i < 400; i++) {
      const x = L.generarDonde(rng2);
      assert.ok(!L.CASOS_HOJA.has(huellaCaso(...L.PLANTILLA_POR_ID[x.plantilla].caso(x.params))), 'salió un caso reservado');
    }
  } finally { huellas.forEach(h => L.CASOS_HOJA.delete(h)); }
  const [tipo, datos] = L.PLANTILLA_POR_ID[primeros[0].plantilla].caso(primeros[0].params);
  assert.equal(L.esReservado(tipo, datos), false);
});

test('variedad: ningún ítem por encima del 10 % y ninguna plantilla por encima de un tercio', () => {
  for (const [, fn, sem] of GENERADORES) {
    const its = generar(fn, sem + 200);
    const claves = new Map(), plantillas = new Map();
    for (const it of its) {
      claves.set(L.claveItem(it), (claves.get(L.claveItem(it)) ?? 0) + 1);
      plantillas.set(it.plantilla, (plantillas.get(it.plantilla) ?? 0) + 1);
    }
    assert.ok(Math.max(...claves.values()) <= N * 0.1, 'un ítem se repite demasiado');
    assert.ok(Math.max(...plantillas.values()) <= N / 3, 'una plantilla domina');
    assert.ok(claves.size > 300, `poca variedad: ${claves.size}`);
  }
});

// ─── JL, 22-11: los bolígrafos ────────────────────────────────────────────────────────────────

test('razonar-sumando: la línea mala es falsa de verdad (no «9 − 3 = 6») y la tercera suma euros con euros', () => {
  const p = L.PLANTILLA_POR_ID['razonar-sumando'];
  const rng = crearRng(2211);
  for (let i = 0; i < 300; i++) {
    const params = p.params(rng);
    const mal = p.cadena(params, true), c = params.a * params.k;
    assert.equal(mal.falsa, 1);
    const [, l2, l3] = mal.lineas.map(f => f('es').replace(/\s/g, ' '));   // el € va tras un espacio duro
    // «Son 6 bolígrafos más, así que cuestan 6,00 € más»: falso, porque cada uno cuesta 2 € o más.
    assert.match(l2, new RegExp(`^Son ${c - params.a} .+ más, así que cuestan ${c - params.a},00 € más\\.$`), l2);
    assert.ok(params.u >= 2, 'con 1 € por unidad, la línea «mala» sería verdad');
    assert.match(l3, /^\d+,\d\d € \+ \d+,\d\d € = \d+,\d\d €$/, l3);
    assert.doesNotMatch(l2 + l3, /veces más|al doble le corresponde/, 'sin «k veces más» (ambiguo)');
    const bien = p.cadena(params, false).lineas.map(f => f('es'));
    assert.doesNotMatch(bien.join(' '), /veces más/, bien.join(' | '));
  }
  assert.doesNotMatch(ERRORES_TIPICOS['razonar-sumando'].nombre.es, /doble/);
});
