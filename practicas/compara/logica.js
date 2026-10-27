// Práctica «Compara y ordena» (PU2, tarea 102): lógica pura (sin DOM ni red), probada en
// `tests/practicas-compara.test.js`. Los generadores devuelven DATOS ({ num, den } con el
// signo en el numerador), nunca HTML. Las fracciones no se simplifican solas (`fracciones.js`).
//
// Cotas (sin contexto: solo números): denominadores de 2 a 12 (ej. 3: hasta 36 antes de simplificar,
// con un común denominador de a lo sumo 72); en la recta, de 2 a 12 en la de 0 a 1 y de 2 a 6 en las
// de 0 a 2 y de −1 a 1 (13 marcas como mucho: zonas de toque de unos 20 px en el móvil).
//
// Errores que pueden salir (ids de ERRORES_TIPICOS de la 98): compara-solo-numeradores ·
// compara-solo-denominadores · ignora-el-signo · contar-marcas · contar-desde-menos-uno; y propios:
// compara-mal, caja-mal, ordena-por-denominadores, ordena-por-numeradores, orden-al-reves,
// orden-mal, toca-el-simetrico, marca-mal.

import {
  fraccion, comparar, comunDenominador, htmlFraccion, htmlCuenta,
  compararSoloNumeradores, compararSoloDenominadores, ignoraElSigno, contarMarcas, contarDesdeMenosUno,
} from '../_comun/fracciones.js';
import { TX } from './textos.js';

const abs = Math.abs;
const H = f => htmlFraccion(f, { compacta: true });
const SIGNO = c => (c < 0 ? '&lt;' : '&gt;');
const aFr = ({ num, den }) => fraccion(num, den);
const par = (num, den) => ({ num, den });

// --- Ejercicio 1: mayor o menor ---------------------------------------------------

const CASOS = ['mismo-den', 'mismo-num', 'distinto'];

/**
 * Ítem: { a, b, caso } con a, b = { num, den }. Un tercio por caso; un 28 % con una negativa o las dos.
 * Siempre distintas por valor. Se regenera si el error típico del caso daría la respuesta buena por
 * casualidad (solo numeradores en «distinto», solo denominadores en «mismo numerador», sin signo
 * en las negativas).
 */
export function generarComparar(rng) {
  const caso = rng.elegir(CASOS);
  for (;;) {
    let a, b;
    if (caso === 'mismo-den') {
      const d = rng.entero(3, 12);
      a = par(rng.entero(1, d + 2), d); b = par(rng.entero(1, d + 2), d);
    } else if (caso === 'mismo-num') {
      const n = rng.entero(1, 9);
      a = par(n, rng.entero(2, 12)); b = par(n, rng.entero(2, 12));
    } else {
      a = par(rng.entero(1, 13), rng.entero(2, 12)); b = par(rng.entero(1, 13), rng.entero(2, 12));
      if (a.den === b.den || a.num === b.num) continue;
    }
    const x = aFr(a), y = aFr(b);
    if (comparar(x, y) === 0 || x.num === y.num && caso !== 'mismo-num' || x.den === y.den && caso !== 'mismo-den') continue;
    const negativa = rng.azar() < 0.28;
    if (negativa) {
      const cual = rng.entero(0, 2);
      if (cual !== 1) a = par(-a.num, a.den);
      if (cual !== 0) b = par(-b.num, b.den);
      if (ignoraElSigno(aFr(a), aFr(b)) === null) continue;
    } else if (caso === 'distinto' && compararSoloNumeradores(x, y) === null) continue;
    else if (caso === 'mismo-num' && compararSoloDenominadores(x, y) === null) continue;
    return { a, b, caso };
  }
}

/** La respuesta buena: '<' o '>'. */
export const simboloComparar = item => (comparar(aFr(item.a), aFr(item.b)) < 0 ? '<' : '>');

/** El error típico que explica el símbolo elegido mal (o 'compara-mal'); null si acertó. */
export function errorComparar(item, elegido) {
  const c = elegido === '<' ? -1 : 1;
  const x = aFr(item.a), y = aFr(item.b);
  if (c === comparar(x, y)) return null;
  for (const [id, fn] of [['ignora-el-signo', ignoraElSigno], ['compara-solo-numeradores', compararSoloNumeradores], ['compara-solo-denominadores', compararSoloDenominadores]]) {
    if (fn(x, y) === c) return id;
  }
  return 'compara-mal';
}

/** Feedback del ejercicio 1: el método que tocaba con los números del ítem (y qué error se cometió). */
export function explicarComparar(item, elegido, idioma) {
  const x = aFr(item.a), y = aFr(item.b);
  const c = comparar(x, y);
  const s = SIGNO(c);
  const A = H(x), B = H(y);
  const m = TX.comp.metodo;
  let metodo;
  if (x.num < 0 !== y.num < 0) {
    const [neg, pos] = x.num < 0 ? [A, B] : [B, A];
    metodo = m.mixto[idioma](neg, pos, A, s, B);
  } else if (x.num < 0) {
    const ax = x.opuesta(), ay = y.opuesta();
    const com = comunDenominador(ax, ay);
    const s2 = SIGNO(comparar(ax, ay));
    metodo = m.negativas[idioma](H(ax), s2, H(ay), A, s, B, ax.den === ay.den ? '' : com.mcm);
  } else if (item.caso === 'mismo-den') {
    metodo = m.mismoDen[idioma](x.num, s, y.num, A, B);
  } else if (item.caso === 'mismo-num') {
    metodo = m.mismoNum[idioma](x.den, SIGNO(x.den < y.den ? -1 : 1), y.den, A, s, B);
  } else {
    const com = comunDenominador(x, y);
    const [x2, y2] = com.fracciones;
    metodo = m.distinto[idioma](A, H(x2), B, H(y2), com.mcm, abs(x2.num), s, abs(y2.num));
  }
  const error = elegido ? errorComparar(item, elegido) : null;
  return error ? `${TX.comp.errores[error][idioma]} ${metodo}` : metodo;
}

// --- Ejercicio 2: frente a 1 y a 1/2 ----------------------------------------------

export const CAJAS = ['menor', 'entre', 'mayor'];

/** En qué caja va n/d (nunca vale 1/2 ni 1 en lo que genera esta práctica). */
export function cajaDe({ num, den }) {
  if (2 * num < den) return 'menor';
  if (2 * num === den) return 'medio';
  return num < den ? 'entre' : (num === den ? 'uno' : 'mayor');
}

const sumas6 = [];
for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) { const c = 6 - a - b; if (c >= 1 && c <= 4) sumas6.push([a, b, c]); }

/** Ítem: { fracs: [{ num, den } × 6] }: de cada caja al menos una; sin negativas, sin 1/2 ni 1, sin equivalentes. */
export function generarCajas(rng) {
  for (;;) {
    const cuantas = rng.elegir(sumas6);
    const lista = [];
    for (let k = 0; k < cuantas[0]; k++) { const d = rng.entero(3, 12); lista.push(par(rng.entero(1, Math.floor((d - 1) / 2)), d)); }
    for (let k = 0; k < cuantas[1]; k++) {
      const d = rng.entero(3, 12);
      lista.push(par(rng.entero(Math.floor(d / 2) + 1, d - 1), d));
    }
    for (let k = 0; k < cuantas[2]; k++) { const d = rng.entero(2, 8); lista.push(par(rng.entero(d + 1, 2 * d), d)); }
    if (lista.some(f => f.num < 1 || cajaDe(f) === 'medio')) continue;
    if (new Set(lista.map(f => aFr(f).clave())).size < 6) continue;
    return { fracs: rng.barajar(lista) };
  }
}

/** Los fallos de una colocación (una caja por fracción): [{ i, puesto, correcta }]. */
export function fallosCajas(item, puestas) {
  return item.fracs.flatMap((f, i) => (puestas[i] === cajaDe(f) ? [] : [{ i, puesto: puestas[i], correcta: cajaDe(f) }]));
}

/** 'compara-solo-numeradores' si alguna fracción mal puesta engaña por el numerador (4/9 «es mayor que 1/2 porque 4 > 1»); si no, 'caja-mal'. */
export function errorCajas(item, fallos) {
  const mitad = fraccion(1, 2);
  const engana = fallos.some(({ i, correcta }) => correcta === 'menor' && compararSoloNumeradores(aFr(item.fracs[i]), mitad) !== null);
  return engana ? 'compara-solo-numeradores' : 'caja-mal';
}

/** Feedback del ejercicio 2: una línea por fracción mal colocada, con sus números. */
export function explicarCajas(item, fallos, idioma) {
  if (!fallos.length) return TX.cajas.bien[idioma];
  const lineas = fallos.map(({ i, correcta }) => TX.cajas.razon[correcta][idioma](H(aFr(item.fracs[i])), item.fracs[i].num, item.fracs[i].den));
  if (errorCajas(item, fallos) === 'compara-solo-numeradores') lineas.push(TX.cajas.solo_num[idioma]);
  return lineas.join('<br>');
}

// --- Ejercicio 3: ordena ----------------------------------------------------------

const DENOMINADORES = [12, 18, 20, 24, 30, 36];

/**
 * Ítem: { fracs: [{ num, den } × 3-5], creciente }. Parecidas (números cercanos entre 0 y 1, como
 * 11/18, 7/12, 2/3 y 5/9), sin equivalentes, con al menos dos denominadores distintos y un común
 * denominador de a lo sumo 72. En un 25 % de los ítems, una o dos negativas.
 */
export function generarOrden(rng) {
  for (;;) {
    const D = rng.elegir(DENOMINADORES);
    const k = rng.elegir([3, 3, 4, 4, 5]);
    const base = rng.entero(Math.ceil(D * 0.3), Math.floor(D * 0.55));
    const ancho = Math.max(k + 2, Math.floor(D * 0.35));
    const ms = new Set();
    while (ms.size < k) ms.add(base + rng.entero(0, ancho));
    if ([...ms].some(m => m >= D)) continue;
    const fracs = [...ms].map(m => fraccion(m, D).simplificar());
    if (new Set(fracs.map(f => f.den)).size < 2) continue;
    if (comunDenominador(fracs).mcm > 72) continue;
    const lista = fracs.map(f => par(f.num, f.den));
    if (rng.azar() < 0.25) {
      const cuantas = rng.elegir([1, 1, 2]);
      for (const i of rng.barajar(lista.map((_, j) => j)).slice(0, cuantas)) lista[i] = par(-lista[i].num, lista[i].den);
    }
    return { fracs: rng.barajar(lista), creciente: rng.azar() < 0.5 };
  }
}

/** Los índices de las tarjetas en el orden correcto. */
export function ordenCorrecto(item) {
  const idx = item.fracs.map((_, i) => i);
  idx.sort((i, j) => comparar(aFr(item.fracs[i]), aFr(item.fracs[j])));
  return item.creciente ? idx : idx.reverse();
}

export const ordenBien = (item, idx) => idx.length === item.fracs.length && idx.join() === ordenCorrecto(item).join();

const monotona = (valores, creciente) => valores.every((v, i) => i === 0 || (creciente ? valores[i - 1] <= v : valores[i - 1] >= v));

/** Error típico del orden elegido (null si es el bueno). */
export function errorOrden(item, idx) {
  if (ordenBien(item, idx)) return null;
  const fr = idx.map(i => item.fracs[i]);
  if (monotona(fr.map(f => f.den), item.creciente)) return 'ordena-por-denominadores';
  if (monotona(fr.map(f => f.num), item.creciente)) return 'ordena-por-numeradores';
  if (item.fracs.some(f => f.num < 0) && monotona(fr.map(f => abs(f.num) / f.den), item.creciente)) return 'ignora-el-signo';
  if (idx.join() === [...ordenCorrecto(item)].reverse().join()) return 'orden-al-reves';
  return 'orden-mal';
}

/** Feedback del ejercicio 3: el común denominador de todas y el orden. */
export function explicarOrden(item, idx, idioma) {
  const x = TX.orden;
  const fs = item.fracs.map(aFr);
  const com = comunDenominador(fs);
  const lista = fs.map((f, i) => `${H(f)} = ${H(com.fracciones[i])}`).join('; ');
  const orden = ordenCorrecto(item);
  const partes = orden.flatMap((i, k) => (k ? [item.creciente ? '<' : '>', fs[i]] : [fs[i]]));
  const cadena = htmlCuenta(partes, { compacta: true });
  const error = idx ? errorOrden(item, idx) : null;
  const linea = [
    error ? x.errores[error][idioma] : '',
    x.comun[idioma](com.mcm, lista),
    fs.some(f => f.num < 0) ? x.negativas[idioma] : '',
    x.resultado[idioma](cadena),
  ].filter(Boolean);
  return linea.join(' ');
}

// --- Ejercicio 4: en la recta -----------------------------------------------------

export const RECTAS = [
  { min: 0, max: 1, den: [2, 12], peso: 4 },
  { min: 0, max: 2, den: [2, 6], peso: 3.5 },
  { min: -1, max: 1, den: [2, 6], peso: 2.5 },
];

/** Ítem: { min, max, den, num }: se pide num/den (sin simplificar); en la recta de −1 a 1, siempre negativa. */
export function generarRecta(rng) {
  const r = rng.azar() * 10;
  const recta = r < 4 ? RECTAS[0] : r < 7.5 ? RECTAS[1] : RECTAS[2];
  const den = rng.entero(recta.den[0], recta.den[1]);
  let num;
  if (recta.min < 0) num = -rng.entero(1, den - 1);
  else do { num = rng.entero(1, recta.max * den - 1); } while (num % den === 0);
  return { min: recta.min, max: recta.max, den, num };
}

export const fraccionRecta = item => fraccion(item.num, item.den);

/** Error típico de la marca tocada (una Fraccion k/den); null si es la buena. */
export function errorRecta(item, toque) {
  const f = fraccionRecta(item);
  if (toque.equals(f)) return null;
  if (toque.equals(f.opuesta())) return 'toca-el-simetrico';
  const m = contarMarcas(f);
  if (m && toque.equals(m)) return 'contar-marcas';
  const v = contarDesdeMenosUno(f);
  if (v && toque.equals(v)) return 'contar-desde-menos-uno';
  return 'marca-mal';
}

/** Feedback del ejercicio 4: cuántos huecos desde el 0 (y el error cometido). */
export function explicarRecta(item, toque, idioma) {
  const f = fraccionRecta(item);
  const x = TX.recta;
  const bien = x.bien[idioma](H(f), item.den, abs(item.num), item.num < 0);
  const error = toque ? errorRecta(item, toque) : null;
  if (!error) return bien;
  const arg = error === 'marca-mal' ? H(toque) : H(f);
  return `${x.errores[error][idioma](arg)} ${bien}`;
}

