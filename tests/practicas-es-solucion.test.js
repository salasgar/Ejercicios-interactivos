// Práctica «¿Es solución?» de la unidad 6 (PU2, tarea 148): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador: un evaluador propio (BigInt, racionales) lee
// las ecuaciones tal como se muestran. En cada ítem la opción buena se cumple, cada falsa no, las falsas
// nacen de un error con nombre, ningún caso reservado sale y ningún texto lleva ×, %, 1x, «+ −», x²
// ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/algebra.js';
import { TX, cuentaMiembro } from '../practicas/es-solucion/textos.js';
import {
  F, ecuacionDe, textoDe, valorMiembro, solucionDe, ERRORES_PROPIOS, nombreError, HUELLAS_RESERVADAS, esReservado,
  generarComprueba, generarQueEcuacion, generarIdentidad, generarInventa, errorDeComprueba, errorDeIdentidad,
  errorDeInventa, validar, ecuacion3, claveDe, ecuacionesConSolucion,
} from '../practicas/es-solucion/logica.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Un evaluador propio: racionales con BigInt, leyendo el texto tal como se ve ──────────────

const mcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; };
const R = (n, d = 1n) => { if (d < 0n) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const suma = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const resta = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const por = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const igualR = (a, b) => a[0] === b[0] && a[1] === b[1];
const entero = n => R(BigInt(n));

function evaluar(texto, x) {
  const toks = texto.replace(/−/g, '-').replace(/·/g, '*').match(/\d+(?:[.,]\d+)?|x|[()+\-*]/g);
  let i = 0;
  const expr = () => {
    let v = term();
    while (toks[i] === '+' || toks[i] === '-') { const op = toks[i++]; const t = term(); v = op === '+' ? suma(v, t) : resta(v, t); }
    return v;
  };
  const term = () => {
    let v = factor();
    while (i < toks.length && !['+', '-', ')'].includes(toks[i])) { if (toks[i] === '*') i++; v = por(v, factor()); }
    return v;
  };
  const factor = () => {
    const t = toks[i++];
    if (t === '-') { const f = factor(); return R(-f[0], f[1]); }
    if (t === '(') { const v = expr(); assert.equal(toks[i++], ')'); return v; }
    if (t === 'x') return x;
    assert.match(t, /^\d+([.,]\d+)?$/);
    const [e, f = ''] = t.replace(',', '.').split('.');
    return R(BigInt(e + f), 10n ** BigInt(f.length));
  };
  const v = expr();
  assert.equal(i, toks.length, `sobran símbolos en «${texto}»`);
  return v;
}

/** (izquierda, derecha) de «a = b» con x = v, leyendo el texto mostrado. */
function lados(texto, v) {
  const [a, b] = sinHtml(texto).split('=').map(p => p.trim());
  return [evaluar(a, entero(v)), evaluar(b, entero(v))];
}
const seCumple = (texto, v) => { const [a, b] = lados(texto, v); return igualR(a, b); };

const NOMBRADOS = new Set([...Object.keys(ERRORES_TIPICOS), ...Object.keys(ERRORES_PROPIOS)].filter(k => k !== 'otra-respuesta'));

function textosProhibidos(t, idioma, donde) {
  const s = sinHtml(t);
  assert.ok(!/×/.test(s), `× en ${donde}: ${s}`);
  assert.ok(!/%/.test(s), `% en ${donde}: ${s}`);
  assert.ok(!/(^|[^\d.,])1x/.test(s), `1x en ${donde}: ${s}`);
  assert.ok(!/[+−-] ?[−-]\d/.test(s.replace(/\(−/g, '(')), `signo doble en ${donde}: ${s}`);
  assert.ok(!/(^|[\s(=:])-\d/.test(s), `guion en vez de signo menos en ${donde}: ${s}`);
  assert.ok(!/x²|x\^2|\^/.test(s), `x² en ${donde}: ${s}`);
  if (idioma === 'en') assert.ok(!/\d,\d/.test(s), `coma decimal en inglés en ${donde}: ${s}`);
  else assert.ok(!/\d\.\d/.test(s), `punto decimal en español en ${donde}: ${s}`);
  assert.ok(!/undefined|NaN|\[object/.test(s), `basura en ${donde}: ${s}`);
}

const ambos = f => ['es', 'en'].forEach(f);
const tt = (x, i) => (typeof x === 'object' && 'es' in x ? x[i] : x);

test('los errores propios y los textos del reparto no están vacíos', () => {
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.es && e.en, id);
  assert.equal(HUELLAS_RESERVADAS.size, 0);
});

// ─── Ejercicio 1 ──────────────────────────────────────────────────────────────────────────────

test('ej1: la ecuación se cumple si y solo si v es solución; las falsas nacen de un error con nombre', () => {
  const lista = lote(generarComprueba, 101);
  let si = 0, no = 0;
  const vistos = new Set();
  for (const it of lista) {
    const texto = textoDe(it);
    assert.equal(seCumple(texto, it.v), it.esSolucion, `${texto} con x = ${it.v}`);
    assert.ok(seCumple(texto, it.s), `${texto}: s no es solución`);
    assert.equal(solucionDe(it).num, it.s);
    assert.ok(Math.abs(it.c) <= 60 && Math.abs(it.v) <= 60);
    assert.ok(!esReservado(it));
    if (it.esSolucion) { si++; assert.equal(it.error, null); assert.equal(it.v, it.s); } else {
      no++;
      assert.notEqual(it.v, it.s);
      assert.ok(NOMBRADOS.has(it.error), it.error);
      assert.ok(nombreError(it.error).es && nombreError(it.error).en);
    }
    assert.equal(errorDeComprueba(it, 'si'), it.esSolucion ? null : it.error);
    assert.equal(errorDeComprueba(it, 'no'), it.esSolucion ? 'dice-que-no-es-solucion' : null);
    vistos.add(claveDe(it));
  }
  assert.ok(si > 1200 && no > 1200, `${si}/${no}`);
  assert.ok(vistos.size > 300, `solo ${vistos.size} ítems distintos`);
});

test('ej1: las ecuaciones solo tienen la x en un miembro, sin paréntesis ni fracciones', () => {
  for (const it of lote(generarComprueba, 102)) {
    const t = sinHtml(textoDe(it));
    assert.match(t, /^[0-9x −+·]+ = −?\d+$/, t);
    assert.ok(!/\(/.test(t));
  }
});

test('ej1: las cuentas de los miembros se evalúan igual que el valor que dicen', () => {
  const rng = crearRng(103);
  for (let n = 0; n < N; n++) {
    const it = generarComprueba(rng), q = ecuacionDe(it);
    for (const idioma of ['es', 'en']) {
      for (const ts of [q.terminosIzq, q.terminosDer]) {
        const cad = sinHtml(cuentaMiembro(ts, it.v, idioma));
        const valores = cad.split('=').map(p => evaluar(p.trim(), entero(it.v)));
        const real = valorMiembro(ts, it.v);
        for (const v of valores) assert.ok(igualR(v, R(BigInt(real.num), BigInt(real.den))), `${cad}`);
        textosProhibidos(cad, idioma, 'cuenta');
      }
    }
  }
});

test('ej1: los textos de ayuda no llevan nada prohibido', () => {
  const rng = crearRng(104);
  for (let n = 0; n < 600; n++) {
    const it = generarComprueba(rng);
    ambos(i => {
      textosProhibidos(tt(TX.ej1.instruccion, i)(it), i, 'ej1.instruccion');
      textosProhibidos(TX.ej1.correcto[i](it), i, 'ej1.correcto');
      const err = errorDeComprueba(it, it.esSolucion ? 'no' : 'si');
      textosProhibidos(TX.ej1.por_que[i](it, err), i, 'ej1.por_que');
      textosProhibidos(TX.ej1.introduccion[i], i, 'ej1.introduccion');
    });
  }
});

// ─── Ejercicio 2 ──────────────────────────────────────────────────────────────────────────────

test('ej2: una sola ecuación se cumple con s; las otras tres no, con soluciones distintas y error con nombre', () => {
  const lista = lote(generarQueEcuacion, 201);
  const sols = new Set();
  for (const it of lista) {
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const textos = it.opciones.map(o => textoDe(o.e));
    assert.equal(new Set(textos).size, 4, textos.join(' | '));
    const soluciones = new Set();
    for (const o of it.opciones) {
      const t = textoDe(o.e);
      assert.equal(seCumple(t, it.s), o.correcta, `${t} con x = ${it.s}`);
      assert.ok(!esReservado(o.e));
      const sol = solucionDe(o.e);
      assert.equal(sol.den, 1);
      soluciones.add(sol.num);
      if (o.correcta) { assert.equal(o.error, null); assert.equal(sol.num, it.s); } else {
        assert.ok(NOMBRADOS.has(o.error), o.error);
        assert.notEqual(sol.num, it.s);
      }
    }
    assert.equal(soluciones.size, 4, 'dos opciones con la misma solución');
    sols.add(it.s);
  }
  assert.ok(sols.size >= 8, `solo ${sols.size} soluciones distintas`);
});

test('ej2: la posición de la buena está repartida y los textos no llevan nada prohibido', () => {
  const rng = crearRng(202);
  const pos = [0, 0, 0, 0];
  for (let n = 0; n < 1200; n++) {
    const it = generarQueEcuacion(rng);
    pos[it.opciones.findIndex(o => o.correcta)]++;
    const mala = it.opciones.find(o => !o.correcta);
    ambos(i => {
      textosProhibidos(tt(TX.ej2.instruccion, i)(it), i, 'ej2.instruccion');
      textosProhibidos(TX.ej2.correcto[i](it), i, 'ej2.correcto');
      textosProhibidos(TX.ej2.por_que[i](it, mala), i, 'ej2.por_que');
    });
  }
  for (const p of pos) assert.ok(p > 200, pos.join('/'));
});

// ─── Ejercicio 3 ──────────────────────────────────────────────────────────────────────────────

test('ej3: las identidades se cumplen con todos los números; las ecuaciones, con uno solo', () => {
  const lista = lote(generarIdentidad, 301);
  let id = 0, ec = 0;
  for (const it of lista) {
    const q = ecuacion3(it), t = q.aTexto();
    const cumplen = [];
    for (let v = -20; v <= 30; v++) if (seCumple(t, v)) cumplen.push(v);
    if (it.tipo === 'identidad') { id++; assert.equal(cumplen.length, 51, t); assert.equal(it.error, 'identidad-como-ecuacion'); } else {
      ec++;
      assert.deepEqual(cumplen, [it.solucion], t);
      assert.ok(NOMBRADOS.has(it.error), it.error);
    }
    assert.ok(seCumple(t, it.valores[0]));
    assert.equal(seCumple(t, it.valores[1]), it.tipo === 'identidad');
    assert.equal(errorDeIdentidad(it, it.tipo), null);
    assert.equal(errorDeIdentidad(it, it.tipo === 'identidad' ? 'ecuacion' : 'identidad'), it.error);
    assert.ok(!/\(/.test(t));
  }
  assert.ok(id > 1200 && ec > 1200, `${id}/${ec}`);
});

test('ej3: los textos no llevan nada prohibido', () => {
  const rng = crearRng(302);
  for (let n = 0; n < 600; n++) {
    const it = generarIdentidad(rng);
    ambos(i => {
      textosProhibidos(TX.ej3.correcto[i](it), i, 'ej3.correcto');
      textosProhibidos(TX.ej3.por_que[i](it), i, 'ej3.por_que');
      textosProhibidos(ecuacion3(it).aHtml(), i, 'ej3.ecuación');
    });
  }
});

// ─── Ejercicio 4 ──────────────────────────────────────────────────────────────────────────────

test('ej4: validar y corregir lo que escribe el alumno', () => {
  const it = { s: 5, requisito: 'libre' };
  const bien = validar('3x + 2 = 17', it);
  assert.ok(bien.ok);
  assert.equal(errorDeInventa(bien.q, it), null);
  assert.equal(errorDeInventa(validar('x + 7 = 12', it).q, it), null);
  assert.equal(errorDeInventa(validar('17 = 3x + 2', it).q, it), null);
  assert.equal(errorDeInventa(validar('2x = 11', it).q, it), 'solucion-distinta');
  assert.equal(errorDeInventa(validar('x + 7 = 11', it).q, it), 'solucion-distinta');
  assert.equal(errorDeInventa(validar('x + 2 = x + 2', it).q, it), 'ecuacion-sin-una-solucion');
  assert.equal(errorDeInventa(validar('x + 2 = x + 3', it).q, it), 'ecuacion-sin-una-solucion');
  assert.equal(validar('x = 5', it).ok, false);
  assert.equal(validar('5 = x', it).motivo, 'talcual');
  assert.equal(validar('x + 7', it).ok, false);
  assert.equal(validar('', it).ok, false);
  assert.equal(validar('y + 7 = 12', it).ok, false);
  const c = { s: 5, requisito: 'coeficiente' };
  assert.equal(validar('x + 7 = 12', c).motivo, 'sin-coeficiente');
  assert.ok(validar('2x + 1 = 11', c).ok);
});

test('ej4: los ítems tienen solución creíble y los textos no llevan nada prohibido', () => {
  const rng = crearRng(401);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const it = generarInventa(rng);
    assert.ok(Number.isInteger(it.s) && it.s !== 0 && it.s >= -9 && it.s <= 12);
    assert.ok(['libre', 'coeficiente'].includes(it.requisito));
    vistos.add(claveDe(it));
    if (n < 400) {
      const q = validar('2x + 3 = ' + (2 * it.s + 3), it).q ?? validar('2x + 3 = ' + (2 * it.s + 3), { ...it, requisito: 'libre' }).q;
      ambos(i => {
        textosProhibidos(tt(TX.ej4.instruccion, i)(it), i, 'ej4.instruccion');
        textosProhibidos(TX.ej4.correcto[i](it, q), i, 'ej4.correcto');
        textosProhibidos(TX.ej4.por_que[i](it, q, 'solucion-distinta'), i, 'ej4.por_que');
        textosProhibidos(TX.ej4.por_que[i](it, q, 'ecuacion-sin-una-solucion'), i, 'ej4.por_que');
        textosProhibidos(TX.ej4.ejemplo[i](it), i, 'ej4.ejemplo');
      });
    }
  }
  assert.ok(vistos.size >= 40, `solo ${vistos.size}`);
});

test('el pool de ecuaciones con cada solución es suficiente y todas las ecuaciones son de la sesión', () => {
  for (const s of [-6, -3, -1, 1, 2, 5, 9, 12]) {
    const lista = ecuacionesConSolucion(s);
    assert.ok(lista.length > 50, `s = ${s}: ${lista.length}`);
    for (const e of lista) assert.ok(seCumple(textoDe(e), s));
  }
});
