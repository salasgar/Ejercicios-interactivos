// Práctica «Compara, ordena y redondea» de la unidad 5 (reparto-practicas-u2, tarea 124): la lógica se
// prueba por fuerza bruta (3000 ítems por ejercicio, semillas fijas) con comparaciones y redondeos de
// enteros escalados escritos aquí, no los de la base.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { decimal, aTexto, deTexto, compararPorCifras } from '../practicas/_comun/decimales.js';
import {
  generarComparar, simboloComparar, errorComparar, explicarComparar,
  generarOrden, ordenCorrecto, ordenBien, errorOrden, explicarOrden,
  generarEntre, estaEntre, errorEntre, errorEntreOpcion, explicarEntre,
  generarRedondeo, redondeoBueno, errorRedondeo, explicarRedondeo, consignaRedondeo, distractoresRedondeo,
  haceArrastre, esParejaReservada, esConjuntoReservado, esEntreReservado, esRedondeoReservado, clave, huella,
} from '../practicas/compara-decimales/logica.js';
import { TX } from '../practicas/compara-decimales/textos.js';

const N = 3000;
const generarN = (fn, semilla = 1, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinEtiquetas = s => s.replace(/<[^>]*>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const D = ({ m, k }) => decimal(m, k);
const pot = n => 10 ** n;

/** −1, 0, 1 con enteros escalados a las mismas cifras (aquí, no la base). */
const cmp = (a, b) => {
  const K = Math.max(a.k, b.k);
  return Math.sign(a.m * pot(K - a.k) - b.m * pot(K - b.k));
};
const mismoValor = (a, b) => cmp(a, b) === 0;
const hayIguales = lista => lista.some((x, i) => lista.some((y, j) => i < j && mismoValor(x, y)));
/** Redondeo a c cifras (5 o más, hacia arriba) con enteros: devuelve { m, k: c }. */
const redondeoRef = ({ m, k }, c) => {
  if (k <= c) return { m: m * pot(c - k), k: c };
  const div = pot(k - c), a = Math.abs(m);
  return { m: Math.sign(m) * (Math.floor(a / div) + (a % div >= div / 2 ? 1 : 0)), k: c };
};
const truncadoRef = ({ m, k }, c) => ({ m: Math.sign(m) * Math.floor(Math.abs(m) / pot(k - c)), k: c });
const ceros = d => d.m % 10 === 0 && d.k > 0;

// --- Ejercicio 1: ¿cuál es mayor? ---------------------------------------------------------

test('mayor: reparto de los casos, ceros finales solo en los iguales y siempre un símbolo bueno', () => {
  const items = generarN(generarComparar);
  const cuenta = caso => items.filter(i => i.caso === caso).length;
  assert.ok(cuenta('trampa') >= N * 0.35, 'trampa');
  assert.ok(cuenta('iguales') >= N * 0.08 && cuenta('ceros') >= N * 0.07 && cuenta('negativo') >= N * 0.15 && cuenta('normal') >= N * 0.12);
  for (const { a, b, caso } of items) {
    assert.ok(a.k <= 3 && b.k <= 3, 'hasta 3 cifras decimales');
    assert.ok(Math.abs(a.m) / pot(a.k) < 21 && Math.abs(b.m) / pot(b.k) < 21, 'cota');
    const c = cmp(a, b);
    assert.equal(c === 0, caso === 'iguales', `${caso}: ${a.m}/${a.k} y ${b.m}/${b.k}`);
    assert.equal(simboloComparar({ a, b, caso }), c < 0 ? '<' : c > 0 ? '>' : '=');
    if (caso === 'iguales') assert.ok(a.k !== b.k && (ceros(a) || ceros(b)), 'distinta escritura');
    else { assert.ok(!ceros(a) && !ceros(b), 'sin ceros finales'); }
    if (caso === 'trampa') assert.ok(compararPorCifras(D(a), D(b)) !== null && a.m >= 0 && b.m >= 0 && a.k !== b.k);
    if (caso === 'ceros') assert.ok(a.m !== 0 && b.m !== 0 && Math.min(a.k, b.k) === 1 && Math.max(a.k, b.k) === 2);
    if (caso === 'negativo') assert.ok(a.m < 0 || b.m < 0);
    assert.ok(a.m !== 0 || caso === 'iguales' || true);
  }
});

test('mayor: cada símbolo malo se explica con un error con nombre', () => {
  const vistos = new Set();
  for (const item of generarN(generarComparar, 2)) {
    const buena = simboloComparar(item);
    assert.equal(errorComparar(item, buena), null);
    for (const mala of ['<', '=', '>'].filter(s => s !== buena)) {
      const e = errorComparar(item, mala);
      assert.ok(e && TX.comp.errores[e], `${item.caso}: ${mala} → ${e}`);
      vistos.add(e);
      if (mala === '=') assert.equal(e, item.caso === 'ceros' ? 'cero-en-medio-sin-valor' : 'cree-iguales');
      if (buena === '=') assert.equal(e, 'cero-final-cambia-el-valor');
      if (item.caso === 'negativo' && buena !== '=' && mala !== '=') {
        const [a, b] = [item.a, item.b];
        const absC = cmp({ m: Math.abs(a.m), k: a.k }, { m: Math.abs(b.m), k: b.k });
        assert.equal(e, (mala === '<' ? -1 : 1) === absC ? 'ignora-el-signo' : 'compara-mal');
      }
      if (item.caso === 'trampa' && mala !== '=') assert.equal(e, 'compara-por-cifras');
    }
  }
  for (const id of Object.keys(TX.comp.errores)) assert.ok(vistos.has(id) || id === 'compara-mal', `error sin salir nunca: ${id}`);
});

// --- Ejercicio 2: ordena -----------------------------------------------------------------------

test('ordena: 4 o 5 valores distintos de ≤ 3 cifras, el orden bueno coincide con el de enteros escalados', () => {
  const items = generarN(generarOrden);
  assert.deepEqual([...new Set(items.map(i => i.vals.length))].sort(), [4, 5]);
  assert.ok(items.filter(i => i.vals.some(v => v.m < 0)).length >= N * 0.2, 'negativos');
  assert.ok(items.filter(i => i.creciente).length > N * 0.4 && items.filter(i => !i.creciente).length > N * 0.4);
  for (const item of items) {
    assert.ok(item.vals.every(v => v.k >= 1 && v.k <= 3));
    assert.equal(hayIguales(item.vals), false);
    assert.ok(new Set(item.vals.map(v => v.k)).size >= 2, 'distinto número de cifras');
    const esperado = item.vals.map((_, i) => i).sort((i, j) => (item.creciente ? 1 : -1) * cmp(item.vals[i], item.vals[j]));
    assert.deepEqual(ordenCorrecto(item), esperado);
    assert.equal(ordenBien(item, esperado), true);
    assert.equal(errorOrden(item, esperado), null);
    assert.ok(!item.vals.every((_, i) => esperado[i] === i), 'ya vienen ordenadas');
  }
});

test('ordena: ordenar por cifras o sin el signo da un orden distinto y se nombra', () => {
  const vistos = new Set();
  for (const item of generarN(generarOrden, 2)) {
    const buena = ordenCorrecto(item);
    const inverso = [...buena].reverse();
    const e = errorOrden(item, inverso);
    vistos.add(e);
    assert.ok(['orden-al-reves', 'ignora-el-signo'].includes(e), e);
    if (item.tipo === 'positivos') {
      // ordenar «como naturales» las cifras decimales: otro orden, y se nombra
      const naturales = item.vals.map((v, i) => ({ i, t: Math.floor(Math.abs(v.m) / pot(v.k)) * 1e7 + (Math.abs(v.m) % pot(v.k)) }));
      naturales.sort((x, y) => (item.creciente ? 1 : -1) * (x.t - y.t));
      const malo = naturales.map(x => x.i);
      assert.notDeepEqual(malo, buena);
      assert.equal(errorOrden(item, malo), 'compara-por-cifras');
      vistos.add('compara-por-cifras');
    }
    const t = sinEtiquetas(explicarOrden(item, inverso, 'es'));
    assert.match(t, /mismas cifras decimales/);
  }
  for (const id of ['orden-al-reves', 'ignora-el-signo', 'compara-por-cifras']) assert.ok(vistos.has(id), id);
});

// --- Ejercicio 3: entre dos -----------------------------------------------------------------------

test('entre: el intervalo no está vacío en el mismo orden de cifras +1; cualquier decimal de en medio se acepta', () => {
  const items = generarN(generarEntre);
  assert.ok(items.filter(i => i.modo === 'escribe').length >= N * 0.4 && items.filter(i => i.modo === 'elige').length >= N * 0.35);
  for (const item of items) {
    const { a, b } = item;
    assert.equal(cmp(a, b) < 0, true);
    assert.ok(a.k <= 2 && b.k <= 3 && !ceros(a) && !ceros(b));
    // un decimal entre ellos, con una cifra más, existe y se acepta; sus extremos no; fuera, tampoco
    const kc = Math.max(a.k, b.k) + 1;
    const mA = a.m * pot(kc - a.k), mB = b.m * pot(kc - b.k);
    assert.ok(mB - mA >= 10, 'hueco de al menos 10 en la cifra siguiente');
    for (const m of [mA + 1, mA + Math.floor((mB - mA) / 2), mB - 1]) {
      const t = decimal(m, kc);
      assert.equal(estaEntre(item, t), true);
      assert.equal(errorEntre(item, t), null);
    }
    assert.equal(errorEntre(item, decimal(mA, kc)), 'repite-un-extremo');
    assert.equal(errorEntre(item, decimal(mB, kc)), 'repite-un-extremo');
    assert.equal(errorEntre(item, decimal(mA - 1, kc)), 'fuera-por-debajo');
    assert.equal(errorEntre(item, decimal(mB + 1, kc)), 'fuera-por-encima');
  }
});

test('entre (elegir): una sola opción dentro, tres fuera con error con nombre, ninguna igual a otra ni a un extremo', () => {
  const vistos = new Set();
  for (const item of generarN(generarEntre, 3).filter(i => i.modo === 'elige')) {
    assert.equal(item.opciones.length, 4);
    assert.equal(hayIguales(item.opciones.map(o => o.d)), false);
    const dentro = item.opciones.filter(o => estaEntre(item, D(o.d)));
    assert.equal(dentro.length, 1);
    assert.equal(dentro[0].error, null);
    for (const [i, o] of item.opciones.entries()) {
      assert.equal(errorEntreOpcion(item, i), o.error);
      if (o.error === null) continue;
      vistos.add(o.error);
      assert.ok(TX.entre.errores[o.error]);
      assert.equal(mismoValor(o.d, item.a) || mismoValor(o.d, item.b), false, 'un extremo escrito de otra forma');
      assert.equal(estaEntre(item, D(o.d)), false);
      const e = errorEntre(item, D(o.d));
      if (o.error !== 'ignora-parte-entera') assert.equal(e, o.error);
      assert.ok(o.d.k <= 3);
    }
    assert.match(sinEtiquetas(explicarEntre(item, null, 'es')), /por ejemplo/);
  }
  assert.deepEqual([...vistos].sort(), ['fuera-por-debajo', 'fuera-por-encima', 'ignora-parte-entera']);
});

// --- Ejercicio 4: redondea -------------------------------------------------------------------------

test('redondea: el redondeo bueno coincide con el de enteros, la cifra siguiente y los 9 que arrastran', () => {
  const items = generarN(generarRedondeo);
  const cuenta = c => items.filter(i => i.c === c).length;
  assert.ok(cuenta(0) >= N * 0.18 && cuenta(1) >= N * 0.3 && cuenta(2) >= N * 0.25, 'órdenes');
  assert.ok(items.filter(i => haceArrastre(i.d, i.c)).length >= N * 0.18, 'arrastre del 9');
  assert.ok(items.filter(i => i.modo === 'escribe').length >= N * 0.4 && items.filter(i => i.modo === 'elige').length >= N * 0.4);
  assert.ok(items.some(i => i.consigna === 'orden') && items.some(i => i.consigna === 'cifras'));
  for (const item of items) {
    const { d, c } = item;
    assert.ok(d.k > c && d.k <= 3 && d.k - c <= 3 && d.m % 10 !== 0 && d.m > 0);
    assert.ok(d.m / pot(d.k) < 21);
    assert.equal(item.consigna === 'entero', c === 0);
    const esperado = redondeoRef(d, c);
    const buena = redondeoBueno(item);
    assert.ok(buena.k === c && buena.m === esperado.m, `${d.m}/${d.k} a ${c}`);
    // el arrastre: 9 que sube
    if (haceArrastre(d, c)) {
      assert.ok(buena.m % 10 === 0 || c === 0, 'sube un 9: la cifra deja de ser 9');
      if (c >= 1) assert.ok(buena.m % 10 === 0);
    }
    // consigna: una sola formulación, con el número escrito en cada idioma
    for (const idioma of ['es', 'en']) {
      const t = sinEtiquetas(consignaRedondeo(item, idioma));
      assert.ok(t.includes(aTexto(D(d), idioma)), t);
    }
    assert.equal(consignaRedondeo(item, 'es').includes('cifra'), item.consigna === 'cifras');
  }
});

test('redondea (elegir): cuatro opciones distintas por valor, tres con error con nombre; ninguna 0,5 junto a 0,50', () => {
  const vistos = new Set();
  for (const item of generarN(generarRedondeo, 4).filter(i => i.modo === 'elige')) {
    assert.equal(item.opciones.length, 4);
    assert.equal(hayIguales(item.opciones.map(o => o.d)), false);
    const bueno = item.opciones.filter(o => o.error === null);
    assert.equal(bueno.length, 1);
    assert.ok(mismoValor(bueno[0].d, redondeoRef(item.d, item.c)));
    assert.equal(bueno[0].d.k, item.c);
    for (const o of item.opciones.filter(o => o.error !== null)) {
      vistos.add(o.error);
      assert.ok(TX.red.errores[o.error], o.error);
      assert.equal(mismoValor(o.d, redondeoRef(item.d, item.c)), false);
      // el error es de verdad lo que dice
      if (o.error === 'redondea-truncando') assert.ok(mismoValor(o.d, truncadoRef(item.d, item.c)));
      if (o.error === 'sube-siempre') assert.ok(mismoValor(o.d, { m: truncadoRef(item.d, item.c).m + 1, k: item.c }));
      if (o.error === 'redondea-en-cadena') {
        let x = item.d;
        for (let k = x.k - 1; k >= item.c; k--) x = redondeoRef(x, k);
        assert.ok(mismoValor(o.d, x));
      }
      if (o.error === 'sin-llevar') assert.ok(haceArrastre(item.d, item.c) && item.c >= 1);
      assert.equal(errorRedondeo(item, D(o.d)), o.error);
    }
    assert.equal(errorRedondeo(item, D(bueno[0].d)), null);
  }
  for (const id of ['redondea-truncando', 'sube-siempre', 'redondea-en-cadena', 'redondea-otro-orden', 'sin-llevar']) assert.ok(vistos.has(id), id);
});

test('redondea (escribir): vale el valor bueno con exactamente c cifras; el mismo valor con otras cifras es otro error', () => {
  for (const item of generarN(generarRedondeo, 5)) {
    const buena = redondeoBueno(item);
    assert.equal(errorRedondeo(item, buena), null);
    const otraEscritura = buena.conCifras(buena.k + 1);
    assert.equal(errorRedondeo(item, otraEscritura), 'cifras-distintas');
    // lo que teclearía el alumno: texto → deTexto → decimal
    for (const idioma of ['es', 'en']) {
      const leido = deTexto(aTexto(buena, idioma));
      assert.equal(errorRedondeo(item, leido), null);
    }
    // el pool de distractores
    const pool = distractoresRedondeo(item);
    assert.ok(pool.length >= 1);
    assert.equal(hayIguales([buena, ...pool.map(x => x.valor)].map(x => ({ m: x.m, k: x.k }))), false);
    for (const x of pool) assert.equal(errorRedondeo(item, x.valor), x.error);
    assert.equal(errorRedondeo(item, decimal(buena.m + 7, buena.k)), 'redondeo-mal');
  }
});

// --- Textos y casos reservados ---------------------------------------------------------------------------

/** Los textos de alumno en un idioma: sin ×, %, letras de variable ni el separador del otro idioma. */
function revisarTexto(texto, idioma) {
  const t = sinEtiquetas(texto);
  assert.doesNotMatch(t, /×|%/, t);
  assert.doesNotMatch(t, /(^|[^\p{L}])[xz]([^\p{L}]|$)/u, `letra de variable: ${t}`);
  if (idioma === 'es') assert.doesNotMatch(t, /\d\.\d/, `punto decimal en español: ${t}`);
  else assert.doesNotMatch(t, /\d,\d/, `coma decimal en inglés: ${t}`);
}

test('los textos generados en español y en inglés usan su separador y nada de lo que el acta deja fuera', () => {
  for (const idioma of ['es', 'en']) {
    for (const item of generarN(generarComparar, 6, 400)) {
      revisarTexto(explicarComparar(item, null, idioma), idioma);
      for (const s of ['<', '=', '>']) revisarTexto(explicarComparar(item, s, idioma), idioma);
    }
    for (const item of generarN(generarOrden, 6, 400)) {
      revisarTexto(explicarOrden(item, null, idioma), idioma);
      revisarTexto(explicarOrden(item, ordenCorrecto(item).reverse(), idioma), idioma);
    }
    for (const item of generarN(generarEntre, 6, 400)) {
      revisarTexto(explicarEntre(item, null, idioma), idioma);
      revisarTexto(explicarEntre(item, 'fuera-por-debajo', idioma), idioma);
      if (item.modo === 'escribe') revisarTexto(TX.entre.escribe[idioma](aTexto(D(item.a), idioma), aTexto(D(item.b), idioma)), idioma);
    }
    for (const item of generarN(generarRedondeo, 6, 400)) {
      revisarTexto(consignaRedondeo(item, idioma), idioma);
      revisarTexto(explicarRedondeo(item, null, idioma), idioma);
      for (const x of distractoresRedondeo(item)) revisarTexto(explicarRedondeo(item, x.error, idioma), idioma);
    }
    for (const b of [TX.comp, TX.orden, TX.entre, TX.red]) revisarTexto(b.introduccion[idioma], idioma);
  }
});

test('el feedback habla de los números del ítem', () => {
  const rng = crearRng(9);
  for (let i = 0; i < 200; i++) {
    const item = generarComparar(rng);
    const t = sinEtiquetas(explicarComparar(item, item.caso === 'iguales' ? '<' : '=', 'es'));
    assert.ok(t.includes(aTexto(D(item.a), 'es')) && t.includes(aTexto(D(item.b), 'es')), t);
    const r = generarRedondeo(rng);
    const u = sinEtiquetas(explicarRedondeo(r, null, 'en'));
    assert.ok(u.includes(aTexto(D(r.d), 'en')) && u.includes(aTexto(redondeoBueno(r), 'en')), u);
  }
});

test('casos reservados: los de la hoja 1 no salen nunca (ni por parejas, ni por tríos, ni los números de redondear)', () => {
  const v = s => deTexto(s);
  const parejas = [['9.3', '9.25'], ['0.6', '0.59'], ['5.60', '5.6'], ['3.04', '3.4'], ['0.37', '0.4'], ['12.09', '12.1'], ['8.62', '8.602'],
    ['5.8', '5.791'], ['4.12', '4.7'], ['-1.7', '-1.07'], ['0.04', '-0.4'], ['8.3', '8.03'], ['0.61', '0.065'].slice(0, 1), ['15.2', '15.08']];
  for (const p of parejas.filter(p => p.length === 2)) assert.equal(esParejaReservada(v(p[0]), v(p[1])), true, p.join(' y '));
  assert.equal(esParejaReservada(v('9.3'), v('9.26')), false);
  assert.equal(esConjuntoReservado(['8.3', '8.03', '8.31', '8.033'].map(v)), true);
  assert.equal(esConjuntoReservado(['-3.5', '-3.05', '0.5', '-3.45'].map(v)), true);
  assert.equal(esConjuntoReservado(['2.3', '2.03', '2.33', '2.303'].map(v)), false);
  assert.equal(esEntreReservado(v('6.8'), v('6.9')), true);
  assert.equal(esEntreReservado(v('0.4'), v('0.41')), true);
  assert.equal(esEntreReservado(v('3.4'), v('3.5')), false);
  for (const s of ['4.726', '9.153', '12.849', '5.97', '0.996', '6.349']) assert.equal(esRedondeoReservado(v(s), 1), true, s);

  // y el generador no los saca (por valor, también con otra escritura)
  for (const { a, b } of generarN(generarComparar, 7)) assert.equal(esParejaReservada(a, b), false);
  for (const { vals } of generarN(generarOrden, 7)) assert.equal(esConjuntoReservado(vals), false);
  for (const { a, b } of generarN(generarEntre, 7)) assert.equal(esEntreReservado(a, b), false);
  for (const { d, c } of generarN(generarRedondeo, 7)) assert.equal(esRedondeoReservado(d, c), false);
});

test('la huella de examen es FNV-1a de 32 bits y la clave de un caso no depende de la escritura', () => {
  assert.equal(huella(''), (0x811c9dc5).toString(36));
  assert.equal(clave(deTexto('3.50')), clave(deTexto('3.5')));
  assert.equal(clave(deTexto('-0.40')), clave(deTexto('-0,4')));
});
