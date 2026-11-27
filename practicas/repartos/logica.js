// Práctica «Repartos proporcionales» (unidad 7, sesión 7; PU2, tarea 217): puro, sin DOM.
// Ejercicios: 1 cuenta las partes, 2 reparte, 3 ¿está bien repartido?, 4 caza el error.
// Aritmética entera: dinero en céntimos, mL y unidades. Una parte `u` se elige primero y T = u · (a + b), así
// que el reparto bueno siempre es exacto. Los repartos con error se descartan (null) si no salen exactos.
// Razón siempre a : b irreducible, a ≠ b, entre dos personas o dos ingredientes. Producto con «·», división con «:» (la razón y una división nunca van en la misma línea).

import { cantidad, deTexto, mismoValor, huellaCaso, NOMBRES } from '../_comun/proporcion.js';
import { HUELLAS_RESERVADAS } from './reserva.js';
import { Fraccion } from '../_comun/fracciones.js';

const NBSP = ' ';

// ─── Números en pantalla ─────────────────────────────────────────────────────────────────────────

/** Céntimos → «7,50» / «7.50» (sin símbolo). */
export function dineroCelda(c, idioma = 'es') {
  const e = Math.trunc(c / 100), cc = String(c % 100).padStart(2, '0');
  return `${e}${idioma === 'es' ? ',' : '.'}${cc}`;
}
export const dinero = (c, idioma = 'es') => (idioma === 'es' ? `${dineroCelda(c, 'es')}${NBSP}€` : `€${dineroCelda(c, 'en')}`);

// ─── Contextos ───────────────────────────────────────────────────────────────────────────────────
// `u`: valor de una parte (céntimos / mL / cromos). `total`: cota creíble de T. `max`: partes por lado.
// Cotas en la propia ficha (tarea-217): paga 4-12 €/h y 12-108 €; refresco 50-400 mL y 500-2000 mL; cromos 4-8 y 12-108.

export const CONTEXTOS = {
  paga: { unidad: '€', din: true, us: Array.from({ length: 17 }, (_, i) => 400 + 50 * i), totalMin: 1200, totalMax: 10800 },
  refresco: { unidad: 'mL', din: false, us: [50, 100, 150, 200, 250, 300, 350, 400], totalMin: 500, totalMax: 2000 },
  cromos: { unidad: null, din: false, us: [4, 5, 6, 7, 8], totalMin: 12, totalMax: 108 },
};
export const IDS_CONTEXTO = Object.keys(CONTEXTOS);

export const RAZONES = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]
  .flatMap(([a, b]) => [[a, b], [b, a]]);

/** Parejas de ingredientes. `art`: con artículo (para las frases). `pequeno`: el ingrediente que lleva siempre la parte pequeña. */
export const INGREDIENTES = [
  { es: ['zumo', 'agua'], en: ['juice', 'water'], art: { es: ['el zumo', 'el agua'], en: ['the juice', 'the water'] }, pequeno: null },
  { es: ['sirope', 'agua'], en: ['syrup', 'water'], art: { es: ['el sirope', 'el agua'], en: ['the syrup', 'the water'] }, pequeno: 0 },
  { es: ['leche', 'café'], en: ['milk', 'coffee'], art: { es: ['la leche', 'el café'], en: ['the milk', 'the coffee'] }, pequeno: 1 },
];

const mcd = (x, y) => (y === 0 ? x : mcd(y, x % y));

// ─── Generación ──────────────────────────────────────────────────────────────────────────────────

/** Un reparto: { ctx, a, b, u, T, dueños: [i0, i1] }. `dueños` son nombres (paga, cromos) o el índice de la pareja (refresco). */
export function generarReparto(rng, ctxId = null) {
  for (let intento = 0; intento < 400; intento++) {
    const ctx = ctxId ?? rng.elegir(IDS_CONTEXTO), c = CONTEXTOS[ctx];
    let [a, b] = rng.elegir(RAZONES);
    const u = rng.elegir(c.us), T = u * (a + b);
    if (T < c.totalMin || T > c.totalMax || mcd(a, b) !== 1 || a === b) continue;
    if (esReservado({ ctx, a, b, T })) continue;
    let duenos;
    if (ctx === 'refresco') {
      duenos = [rng.entero(0, INGREDIENTES.length - 1)];
      const pq = INGREDIENTES[duenos[0]].pequeno;
      if (pq !== null && (pq === 0 ? a > b : b > a)) [a, b] = [b, a];
    } else duenos = rng.barajar(NOMBRES).slice(0, 2);
    return { ctx, a, b, u, T, duenos };
  }
  throw new Error('generarReparto: sin datos dentro de la cota');
}

// ─── Casos reservados (la hoja 2 y el examen 2 de la unidad 7) ───────────────────────────────────

/** El caso por valor: el total (euros, mL o cromos) y la razón irreducible de menor a mayor; sin contexto ni unidades. */
export function huellasDe(it) {
  const g = mcd(it.a, it.b), T = CONTEXTOS[it.ctx].din ? new Fraccion(it.T, 100) : new Fraccion(it.T, 1);
  return [huellaCaso('reparto', [T, ...[it.a / g, it.b / g].sort((p, q) => p - q).map(v => new Fraccion(v, 1))])];
}
export const esReservado = it => huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h));

/** Los dos dueños como { es: [..], en: [..] } (los nombres son iguales en los dos idiomas). */
export function nombresDe(item) {
  if (item.ctx === 'refresco') return INGREDIENTES[item.duenos[0]];
  return { es: item.duenos, en: item.duenos };
}

// ─── Leer lo que teclea el alumno ────────────────────────────────────────────────────────────────

export function leerNumero(texto, unidad, idioma) {
  try { return deTexto(texto, { unidad: unidad ?? undefined, idioma }); } catch (e) { return null; }
}
const valida = v => v !== null && v !== undefined && v !== false;
const unidadDe = ctx => CONTEXTOS[ctx].unidad;
/** Un valor entero del contexto como Cantidad (los céntimos pasan a euros). */
const comoCantidad = (ctx, v) => cantidad(CONTEXTOS[ctx].din ? new Fraccion(v, 100) : new Fraccion(v, 1), unidadDe(ctx));
const esExacto = (ctx, v) => Number.isInteger(v) && v > 0;

/** Primer id cuyo valor coincide con lo leído; null si lo leído es la solución; 'otra-respuesta' si no. */
function clasificar(ctx, leido, solucion, candidatos, unidad = unidadDe(ctx), comoVal = v => comoCantidad(ctx, v)) {
  if (!valida(leido)) return 'otra-respuesta';
  if (mismoValor(leido, comoVal(solucion))) return null;
  for (const [id, v] of candidatos) if (v !== null && Number.isFinite(v) && mismoValor(leido, comoVal(v))) return id;
  return 'otra-respuesta';
}

// ─── Ejercicio 1: cuenta las partes ──────────────────────────────────────────────────────────────

export const generarCuenta = rng => generarReparto(rng);
export const claveCuenta = it => `${it.ctx}|${it.a}:${it.b}`;
const numPartes = v => cantidad(new Fraccion(v, 1), null);

/** Errores de cada campo: [errorPartes, errorUnaParte], null si está bien. */
export function erroresDeCuenta(it, textoPartes, textoParte, idioma = 'es') {
  const p = leerNumero(textoPartes, null, idioma), v = leerNumero(textoParte, unidadDe(it.ctx), idioma);
  const S = it.a + it.b;
  const ep = clasificar(it.ctx, p, S, [['partes-multiplicadas', it.a * it.b], ['contar-personas', 2]], null, numPartes);
  const T = it.T;
  const cand = [['partes-iguales', T % 2 === 0 ? T / 2 : null]];
  if (T % it.a === 0) cand.push(['dividir-entre-un-termino', T / it.a]);
  if (T % it.b === 0) cand.push(['dividir-entre-un-termino', T / it.b]);
  const ev = clasificar(it.ctx, v, it.u, cand);
  return [ep, ev];
}
export const errorDeCuenta = (it, tp, tv, idioma) => erroresDeCuenta(it, tp, tv, idioma).find(e => e !== null) ?? null;

// ─── Ejercicio 2: reparte ────────────────────────────────────────────────────────────────────────

export const generarReparte = rng => generarReparto(rng);
export const claveReparte = it => `${it.ctx}|${it.a}:${it.b}`;

/** Errores de cada campo [A, B]; null si está bien. */
export function erroresDeReparte(it, textoA, textoB, idioma = 'es') {
  const un = unidadDe(it.ctx), { a, b, u, T } = it;
  const lA = leerNumero(textoA, un, idioma), lB = leerNumero(textoB, un, idioma);
  const candA = [['partes-iguales', T % 2 === 0 ? T / 2 : null], ['intercambiadas', b * u],
    ['dividir-entre-cada-termino', T % a === 0 ? T / a : null], ['quedarse-en-una-parte', u]];
  const candB = [['partes-iguales', T % 2 === 0 ? T / 2 : null], ['intercambiadas', a * u],
    ['dividir-entre-cada-termino', T % b === 0 ? T / b : null], ['quedarse-en-una-parte', u]];
  return [clasificar(it.ctx, lA, a * u, candA), clasificar(it.ctx, lB, b * u, candB)];
}
export const errorDeReparte = (it, ta, tb, idioma) => erroresDeReparte(it, ta, tb, idioma).find(e => e !== null) ?? null;
/** Si no es ningún error conocido: la suma de lo escrito como Cantidad, o null. */
export function sumaEscrita(it, ta, tb, idioma) {
  const un = unidadDe(it.ctx), lA = leerNumero(ta, un, idioma), lB = leerNumero(tb, un, idioma);
  if (!valida(lA) || !valida(lB)) return null;
  try { return cantidad(lA.valor.sumar(lB.valor).simplificar(), un); } catch (e) { return null; }
}

// ─── Reparto con error (ejercicios 3 y 4) ────────────────────────────────────────────────────────

/** Reparto equivocado [x, y] por error típico, o null si no sale entero, no es distinto del bueno o no se puede. */
export function repartoMalo(it, error) {
  const { a, b, u, T, ctx } = it, bueno = [a * u, b * u];
  let r = null;
  const parte = div => (T % div === 0 ? T / div : null);
  if (error === 'partes-iguales') r = T % 2 === 0 ? [T / 2, T / 2] : null;
  else if (error === 'intercambiadas') r = [b * u, a * u];
  else if (error === 'dividir-entre-cada-termino') r = T % a === 0 && T % b === 0 ? [T / a, T / b] : null;
  else if (error === 'partes-multiplicadas') { const p = parte(a * b); r = p === null ? null : [a * p, b * p]; }
  else if (error === 'razonar-sumando') {
    if (ctx === 'refresco') return null;
    const d = (ctx === 'paga' ? 100 : 1) * Math.abs(b - a);
    r = (T - d) % 2 === 0 && T - d > 0 ? (a < b ? [(T - d) / 2, (T + d) / 2] : [(T + d) / 2, (T - d) / 2]) : null;
  }
  if (r === null || r.some(v => !esExacto(ctx, v))) return null;
  return r[0] === bueno[0] && r[1] === bueno[1] ? null : r;
}

// ─── Ejercicio 3: ¿está bien repartido? ──────────────────────────────────────────────────────────

export const TIPOS3 = ['bien', 'no-suman', 'no-razon'];
const MALOS_NO_SUMAN = ['dividir-entre-cada-termino', 'partes-multiplicadas'];
const MALOS_NO_RAZON = ['partes-iguales', 'intercambiadas', 'razonar-sumando'];

export function generarEstaBien(rng) {
  const tipo = rng.elegir(TIPOS3);
  for (let intento = 0; intento < 300; intento++) {
    const it = generarReparto(rng);
    if (tipo === 'bien') return { ...it, tipo, error: null, dado: [it.a * it.u, it.b * it.u] };
    const error = rng.elegir(tipo === 'no-suman' ? MALOS_NO_SUMAN : MALOS_NO_RAZON), dado = repartoMalo(it, error);
    if (dado !== null) return { ...it, tipo, error, dado };
  }
  throw new Error('generarEstaBien: sin datos');
}
export const claveEstaBien = it => `${it.tipo}|${it.error}|${it.ctx}|${it.a}:${it.b}`;
/** Lo que opina el alumno ('bien' | 'no-suman' | 'no-razon') → null si acierta, o el error del reparto o 'otra-respuesta'. */
export const errorDeEstaBien = (it, opinion) => (opinion === it.tipo ? null : (it.error ?? 've-un-error-donde-no-lo-hay'));
export const sumaDado = it => it.dado[0] + it.dado[1];

// ─── Ejercicio 4: caza el error ──────────────────────────────────────────────────────────────────
// Tres líneas (las partes; lo que vale una; lo de cada uno) con una mala, repartida entre las tres. Las siguientes
// arrastran el error bien calculado. `mala` es el índice de la línea mala (0-2); `mult` lo que multiplica cada uno.

export const ERRORES4_POR_LINEA = [['partes-iguales', 'partes-multiplicadas'], ['dividir-entre-un-termino', 'dividir-entre-dos'],
  ['sumar-en-vez-de-multiplicar', 'intercambiadas']];
export const ERRORES4 = ERRORES4_POR_LINEA.flat();

function caza(it, error) {
  const { a, b, u, T } = it, S = a + b;
  const base = { ...it, error, partes: S, tipoPartes: 'suma', divisor: S, una: u, mult: [a, b], suma: false };
  if (error === 'partes-iguales') return T % 2 === 0 ? { ...base, mala: 0, partes: 2, tipoPartes: 'dos', divisor: 2, una: T / 2, mult: [1, 1] } : null;
  if (error === 'partes-multiplicadas') return T % (a * b) === 0 ? { ...base, mala: 0, partes: a * b, tipoPartes: 'producto', divisor: a * b, una: T / (a * b) } : null;
  if (error === 'dividir-entre-un-termino') {
    const t = T % a === 0 ? a : (T % b === 0 ? b : null);
    return t === null ? null : { ...base, mala: 1, divisor: t, una: T / t };
  }
  if (error === 'dividir-entre-dos') return T % 2 === 0 ? { ...base, mala: 1, divisor: 2, una: T / 2 } : null;
  if (error === 'sumar-en-vez-de-multiplicar') return { ...base, mala: 2, suma: true };
  return { ...base, mala: 2, mult: [b, a] };
}

/** Las dos partes que resultan de la resolución (con el error arrastrado). */
export const cadaDe = item => (item.suma
  ? [item.u + item.a * (item.ctx === 'paga' ? 100 : 1), item.u + item.b * (item.ctx === 'paga' ? 100 : 1)]
  : [item.mult[0] * item.una, item.mult[1] * item.una]);

export function generarCaza(rng) {
  for (let ronda = 0; ronda < 50; ronda++) {
    const r = rng.azar(), mala = r < 0.36 ? 0 : (r < 0.68 ? 1 : 2);
    const error = mala === 0 ? (rng.azar() < 0.7 ? 'partes-iguales' : 'partes-multiplicadas') : rng.elegir(ERRORES4_POR_LINEA[mala]);
    for (let intento = 0; intento < 300; intento++) {
      const item = caza(generarReparto(rng), error);
      if (item === null) continue;
      item.cada = cadaDe(item);
      if (item.cada.every(v => esExacto(item.ctx, v)) && !(item.cada[0] === item.a * item.u && item.cada[1] === item.b * item.u)) return item;
    }
  }
  throw new Error('generarCaza: sin datos');
}
export const claveCaza = it => `${it.error}|${it.ctx}|${it.a}:${it.b}`;
