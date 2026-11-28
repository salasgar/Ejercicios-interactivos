// «Porcentaje, fracción y decimal» (PU2 tarea 218): 3000 ítems por ejercicio contra una segunda vía de
// cálculo con enteros (BigInt), distractores y señuelos siempre de otro valor, variedad y textos en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import * as L from '../practicas/tres-escrituras/logica.js';
import * as X from '../practicas/tres-escrituras/textos.js';

const IDIOMAS = ['es', 'en'];
const N = 3000;
const textosDe = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'tres-escrituras'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla, n = N) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

// Segunda vía: el valor de una escritura como par de BigInt irreducible (nada de L.valorDe).
const mcdB = (a, b) => (b === 0n ? a : mcdB(b, a % b));
const par = (n, d) => { const g = mcdB(n, d); return `${n / g}/${d / g}`; };
const valor = e => {
  if (e.t === 'f') return par(BigInt(e.num), BigInt(e.den));
  const base = 10n ** BigInt(e.k);
  return e.t === 'd' ? par(BigInt(e.m), base) : par(BigInt(e.m), 100n * base);
};
const pEntero = e => { const [n, d] = valor(e).split('/').map(BigInt); return (100n * n) % d === 0n ? (100n * n) / d : null; };
const sana = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(plano(html), /undefined|NaN|\[object|null|×|0\.3000|de una cantidad|of a quantity/, `${donde}: ${plano(html)}`);
};

test('tres-escrituras: cuatro ejercicios y «No lo sé» solo en el 2', () => {
  assert.equal(practica.ejercicios.length, 4);
  assert.ok(ej2.noLoSe && !ej1.noLoSe && !ej3.noLoSe && !ej4.noLoSe);
  for (const e of practica.ejercicios) { assert.equal(typeof e.explicacion, 'function'); assert.ok(!e.sinAyuda); }
});

test('tres-escrituras: las escrituras de p (1 a 99) valen lo mismo por dos vías', () => {
  for (let p = 1; p <= 99; p++) {
    const e = L.escrituras(p);
    assert.equal(valor(e.p), par(BigInt(p), 100n));
    assert.equal(valor(e.d), par(BigInt(p), 100n));
    assert.equal(valor(e.f), par(BigInt(p), 100n));
    assert.equal(String(L.valorDe(e.f).den), valor(e.f).split('/')[1]);
    assert.ok(100 % e.f.den === 0);
  }
});

test('tres-escrituras · ej. 1: cuatro opciones de la misma escritura y de valores distintos, una correcta e irreducible', () => {
  const vistos = new Set(), sentidos = new Set();
  for (const item of items(ej1, 1)) {
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(item.opciones.map(o => valor(o.e))).size, 4, 'cuatro valores distintos');
    assert.equal(new Set(item.opciones.map(o => o.e.t)).size, 1, 'misma escritura');
    assert.equal(item.opciones[0].e.t === 'f' ? 'f' : 'p', item.sentido === 'pf' ? 'f' : 'p');
    const buena = item.opciones.find(o => o.correcta).e;
    assert.equal(valor(buena), par(BigInt(item.p), 100n));
    assert.equal(valor(item.dado), valor(buena), 'lo dado y la correcta valen lo mismo');
    if (buena.t === 'f') assert.equal(mcdB(BigInt(buena.num), BigInt(buena.den)), 1n);
    for (const o of item.opciones.filter(x => !x.correcta)) {
      assert.ok(o.error, 'cada distractor lleva su error');
      assert.notEqual(valor(o.e), valor(buena));
      if (o.e.t === 'p') assert.ok(pEntero(o.e) === null || pEntero(o.e) < 100n);
      if (o.e.t === 'f') assert.ok(o.e.den > 1);
    }
    vistos.add(item.p); sentidos.add(item.sentido);
  }
  assert.deepEqual([...vistos].sort((a, b) => a - b), [1, 10, 20, 25, 50, 75]);
  assert.equal(sentidos.size, 2);
});

test('tres-escrituras · ej. 1: el pool se baraja (todos los motivos salen alguna vez)', () => {
  const motivos = new Set();
  for (const item of items(ej1, 11)) item.opciones.forEach(o => o.error && motivos.add(o.error));
  for (const m of ['porcentaje-al-denominador', 'invertida', 'entre-diez', 'vecina', 'cifras-pegadas', 'denominador-como-porcentaje', 'coma-mal', 'decimal-con-signo']) assert.ok(motivos.has(m), m);
});

test('tres-escrituras · ej. 2: acepta toda escritura válida y rechaza los errores con nombre', () => {
  const tipos = new Set(), unaCifra = { n: 0 };
  for (const item of items(ej2, 2)) {
    const p = item.p;
    tipos.add(item.tipo);
    if (p < 10) unaCifra.n++;
    assert.ok(p >= 1 && p <= 99);
    const sep = x => String(x);
    if (item.a === 'd') {
      const buenas = [`0,${String(p).padStart(2, '0')}`, `0.${String(p).padStart(2, '0')}`, `0,${String(p).padStart(2, '0')}0`];
      for (const b of buenas) assert.equal(L.evaluarOtraForma(item, b).acierto, true, b);
      assert.equal(L.evaluarOtraForma(item, `0,${String(p).padStart(3, '0')}`).error, 'coma-de-mas');
      assert.equal(L.evaluarOtraForma(item, sep(p)).error, 'numero-tal-cual');
      if (p < 10) assert.equal(L.evaluarOtraForma(item, `0,${p}`).acierto, false);
    } else if (item.a === 'p') {
      for (const b of [`${p}`, `${p} %`, `${p}%`, `${p} %`, `${p},0`]) assert.equal(L.evaluarOtraForma(item, b).acierto, true, b);
      assert.equal(L.evaluarOtraForma(item, `${p + 1}`).acierto, false);
      if (item.tipo === 'd-p') assert.equal(L.evaluarOtraForma(item, `${p * 10}`).error, 'por-diez');
    } else {
      const g = Number(mcdB(BigInt(p), 100n)), nu = p / g, de = 100 / g;
      assert.equal(L.evaluarOtraForma(item, { num: nu, den: de }).acierto, true);
      assert.equal(L.evaluarOtraForma(item, { num: de, den: nu }).acierto, false);
      if (g > 1) assert.equal(L.evaluarOtraForma(item, { num: p, den: 100 }).error, 'sin-simplificar');
      assert.equal(L.evaluarOtraForma(item, { num: nu + 1, den: de }).acierto, false);
    }
    assert.equal(L.evaluarOtraForma(item, 'abc') ?? null, item.a === 'f' ? L.evaluarOtraForma(item, 'abc') : null);
  }
  assert.equal(tipos.size, 4);
  assert.ok(unaCifra.n > N / 6 && unaCifra.n < N / 2, `de una cifra: ${unaCifra.n}`);
});

test('tres-escrituras · ej. 3: tres fracciones distintas, un decimal y un porcentaje por fracción y señuelos de otro valor', () => {
  let confusos = 0;
  for (const item of items(ej3, 3)) {
    assert.equal(item.fracciones.length, 3);
    assert.equal(item.decimales.length, 4);
    assert.equal(item.porcentajes.length, 4);
    const vf = item.fracciones.map(valor);
    assert.equal(new Set(vf).size, 3);
    item.fracciones.forEach((f, i) => {
      assert.equal(valor(item.decimales[item.solD[i]]), vf[i]);
      assert.equal(valor(item.porcentajes[item.solP[i]]), vf[i]);
      assert.equal(item.decimales.filter(d => valor(d) === vf[i]).length, 1, 'un solo decimal por fracción');
      assert.equal(item.porcentajes.filter(d => valor(d) === vf[i]).length, 1, 'un solo porcentaje por fracción');
    });
    assert.equal(new Set(item.decimales.map(valor)).size, 4);
    assert.equal(new Set(item.porcentajes.map(valor)).size, 4);
    for (const e of [...item.decimales, ...item.porcentajes]) {
      const [n, d] = valor(e).split('/').map(BigInt);
      assert.ok(n <= d, 'nunca por encima del 100 %');
    }
    const ps = [...item.ps].sort((a, b) => a - b);
    if ([[5, 20], [4, 25], [5, 50], [1, 10]].some(([a, b]) => ps.includes(a) && ps.includes(b))) confusos++;
    // la solución completa es correcta y cualquier otra colocación falla
    assert.equal(L.evaluarUne(item, item.solD, item.solP).acierto, true);
    const mal = [...item.solD]; [mal[0], mal[1]] = [mal[1], mal[0]];
    const r = L.evaluarUne(item, mal, item.solP);
    assert.equal(r.acierto, false);
    assert.ok(r.error);
  }
  assert.ok(confusos > N / 3, `parejas confusas: ${confusos}`);
});

test('tres-escrituras · ej. 4: cuatro valores distintos, al menos dos escrituras, orden bien calculado y trampas en la mitad', () => {
  let trampas = 0;
  for (const item of items(ej4, 4)) {
    assert.equal(item.numeros.length, 4);
    const vs = item.numeros.map(e => pEntero(e));
    assert.ok(vs.every(v => v !== null && v >= 1n && v <= 99n));
    assert.equal(new Set(vs).size, 4);
    assert.ok(new Set(item.numeros.map(e => e.t)).size >= 2);
    const esperado = vs.map((v, i) => [v, i]).sort((a, b) => (a[0] < b[0] ? -1 : 1) * (item.orden === 'menor-mayor' ? 1 : -1)).map(x => x[1]);
    assert.deepEqual(item.solucion, esperado);
    if (item.trampa) trampas++;
    assert.equal(L.evaluarOrdena(item, item.solucion).acierto, true);
    assert.equal(L.evaluarOrdena(item, [...item.solucion].reverse()).error, 'orden-al-reves');
  }
  assert.ok(trampas > N * 0.4 && trampas < N * 0.6, `trampas: ${trampas}`);
});

test('tres-escrituras: ningún ejercicio repite una clave en más del 10 % de sus ítems', () => {
  for (const [def, semilla] of [[ej1, 21], [ej2, 22], [ej3, 23], [ej4, 24]]) {
    const cuenta = new Map();
    for (const item of items(def, semilla)) cuenta.set(L.claveDe(item), (cuenta.get(L.claveDe(item)) ?? 0) + 1);
    const max = Math.max(...cuenta.values());
    assert.ok(max / N <= 0.1, `${def.nombre.es}: clave más repetida ${(100 * max / N).toFixed(1)} %`);
  }
});

test('tres-escrituras: los textos de enunciado, opciones y explicaciones en los dos idiomas', () => {
  for (const idioma of IDIOMAS) {
    const ctx = textosDe(idioma);
    for (const [def, semilla] of [[ej1, 31], [ej2, 32], [ej3, 33], [ej4, 34]]) {
      for (const item of items(def, semilla, 500)) {
        const html = def.enunciado(item, ctx) + (item.opciones ?? []).map(o => L.txt(o.e, idioma)).join(' ');
        sana(html, `${def.nombre[idioma]}`);
        const crudo = (html + def.explicacion(item, ctx)).replace(/<[^>]+>/g, ' ');
        const t = plano(crudo);
        if (idioma === 'es') assert.doesNotMatch(crudo, /\d%|\d %/, `es: ${t}`);
        else assert.doesNotMatch(crudo, /\d[ \u00a0]%/, `en: ${t}`);
        assert.doesNotMatch(t, /(?:1[0-9]{2}|[2-9][0-9]{2})(?:\s| )?%/, 'ningún porcentaje por encima de 100');
        if (idioma === 'es') assert.doesNotMatch(t, /\d\.\d/);
        else assert.doesNotMatch(t, /\d,\d/);
      }
    }
    for (const clave of Object.values(X.TX.porQue)) assert.ok(clave[idioma] && clave[idioma].length > 5);
  }
});

test('tres-escrituras: el español usa el espacio duro antes de «%»', () => {
  assert.equal(L.txt(L.pctE(75), 'es'), '75 %');
  assert.equal(L.txt(L.pctE(75), 'en'), '75%');
  assert.equal(L.txt(L.decE(75, 2), 'es'), '0,75');
  assert.equal(L.txt(L.decE(75, 2), 'en'), '0.75');
});

test('tres-escrituras: el ej. 2 no saca casos de la hoja 3 ni del examen 3, y las introducciones tampoco', () => {
  for (const def of practica.ejercicios) for (const it of items(def, 2180, N)) assert.ok(!L.esReservado(it), JSON.stringify(it));
  for (const p of [35, 4, 85, 26, 5, 15, 40, 30, 70]) assert.ok(L.esReservado({ ejercicio: 2, p }), `${p} %`);
  for (const p of [55, 6, 2, 12, 65]) assert.ok(!L.esReservado({ ejercicio: 2, p }), `${p} %`);
  assert.deepEqual(L.huellasDe({ ejercicio: 1, sentido: 'pf', p: 50 }), []);
  for (const id of ['ej2', 'ej4']) for (const idioma of IDIOMAS) {
    const intro = plano(X.TX[id].introduccion[idioma]);
    for (const caso of idioma === 'es' ? ['35 %', '0,35', '0,08', '8 %', '0,05', '5 %'] : ['35%', '0.35', '0.08', '8%', '0.05', '5%'])
      assert.ok(!new RegExp(`(?<![\\d,.])${caso.replace('.', '\\.').replace(' ', '\\s')}`).test(intro), `${id} ${idioma}: ${caso}`);
  }
});
