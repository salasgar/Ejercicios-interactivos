// Práctica «Subidas, bajadas y diferencias» de la unidad 3 (PU2, tarea 90): lógica pura (sin DOM ni red).
// Los ítems son DATOS; las frases salen de textos.js con el contexto y los números del ítem.
//
//   1. generarCambio     { ctx, i, f, v, opciones: [{ dir, k, error }], solucion }   ¿cuánto ha cambiado? (U3-4C-02, 4C-07)
//   2. generarDiferencia { par, lo, hi, d }                                          la diferencia entre dos valores (U3-4C-03)
//   3. generarFalta      { ctx, tipo: 'final' | 'inicial', x, dir, k, r }            el dato que falta (U3-4C-04)
//   4. generarAnios      { era: 'aC' | 'dC', a, b, d }                               años entre dos años de la misma era (U3-4C-05)
//   5. generarCuenta     { tipo: 'cadena' | 'producto' | 'cociente', ctx, … , opciones, solucion, r }   (U3-4C-01, 4C-10, 3C-21)
//
// Cada contexto lleva su cota creíble; el test comprueba los 3000 ítems de cada ejercicio. Los distractores
// salen de errores típicos con nombre (los de `_comun/enteros.js` y los propios de abajo).

import { fmt, fmtPar, ERRORES_TIPICOS } from '../_comun/enteros.js';

/**
 * Cota de cada contexto: `min`–`max` (valores que puede tomar), `maxVar` (cuánto puede cambiar de una vez),
 * `paso` (múltiplo con el que se generan los cambios). Temperatura de una ciudad, planta de un edificio,
 * saldo de un alumno y profundidad de un buceador (siempre bajo el agua: de −40 a −1 m).
 */
export const CONTEXTOS = {
  temperatura: { min: -20, max: 40, maxVar: 20, paso: 1 },
  planta: { min: -5, max: 20, maxVar: 12, paso: 1 },
  saldo: { min: -50, max: 300, maxVar: 120, paso: 5 },
  buceo: { min: -40, max: -1, maxVar: 25, paso: 1 },
};
export const IDS = Object.keys(CONTEXTOS);
export const enCota = (ctx, v) => Number.isInteger(v) && v >= CONTEXTOS[ctx].min && v <= CONTEXTOS[ctx].max;

/** Errores típicos propios de la práctica (los demás vienen de `ERRORES_TIPICOS`). */
export const ERRORES_PROPIOS = {
  'suma-sin-signo': { nombre: { es: 'Ha sumado los números sin tener en cuenta su signo', en: 'Added the numbers without looking at their signs' } },
  'resta-en-vez-de-suma': { nombre: { es: 'Ha restado la variación en vez de sumarla (o al revés)', en: 'Subtracted the change instead of adding it (or the other way round)' } },
  'verbo-equivocado': { nombre: { es: 'Ha puesto el signo contrario a uno de los verbos', en: 'Used the opposite sign for one of the verbs' } },
  'operacion-equivocada': { nombre: { es: 'Ha elegido otra operación', en: 'Chose a different operation' } },
};
/** Nombre { es, en } de cualquier error de la práctica. */
export const nombreError = id => (ERRORES_TIPICOS[id] ?? ERRORES_PROPIOS[id]).nombre;

const abs = Math.abs;
const mult = (rng, min, max, paso) => paso * rng.entero(Math.ceil(min / paso), Math.floor(max / paso));
const signado = (rng, min, max, paso = 1) => rng.elegir([-1, 1]) * mult(rng, min, max, paso);

/** `20 − 35 + 10` a partir de los términos con su signo. */
export function terminos(lista) {
  return lista.map((t, i) => (i === 0 ? fmt(t) : t < 0 ? `− ${-t}` : `+ ${t}`)).join(' ');
}
export const valorTerminos = lista => lista.reduce((s, t) => s + t, 0);

// ─── Ejercicio 1: ¿cuánto ha cambiado? ─────────────────────────────────────────

export function generarCambio(rng) {
  const ctx = rng.elegir(IDS), c = CONTEXTOS[ctx];
  let i, f;
  do {
    i = mult(rng, c.min, c.max, c.paso); f = mult(rng, c.min, c.max, c.paso);
  } while (!i || !f || i === f || i === -f || abs(f - i) > c.maxVar);   // i = −f: no hay tercera frase distinta
  const v = f - i, dir = v > 0 ? 'sube' : 'baja', k = abs(v);
  const otra = dir === 'sube' ? 'baja' : 'sube';
  // Con los dos del mismo signo falla `suma-sin-signo`; con signos distintos, `diferencia-sin-signo`: siempre hay uno.
  const dif = abs(abs(i) - abs(f)), suma = abs(i) + abs(f);
  const tercera = dif > 0 && dif !== k ? { dir, k: dif, error: 'diferencia-sin-signo' } : { dir, k: suma, error: 'suma-sin-signo' };
  const opciones = rng.barajar([{ dir, k, error: null }, { dir: otra, k, error: 'inicial-menos-final' }, tercera]);
  return { tipo: 'cambio', ctx, i, f, v, opciones, solucion: opciones.findIndex(o => o.error === null) };
}

// ─── Ejercicio 2: la diferencia ────────────────────────────────────────────────

/** Pares de valores: un `bajo` y un `alto` con rangos que no se solapan, para que «cuánto más» sea siempre positivo. */
export const PARES = {
  'burgos-malaga': { tipo: 'temperatura', bajo: { es: 'Burgos', en: 'Burgos', rango: [-12, 8] }, alto: { es: 'Málaga', en: 'Málaga', rango: [10, 30] } },
  'moscu-murcia': { tipo: 'temperatura', bajo: { es: 'Moscú', en: 'Moscow', rango: [-25, 3] }, alto: { es: 'Murcia', en: 'Murcia', rango: [8, 35] } },
  planta: { tipo: 'planta', bajo: { rango: [-4, 6] }, alto: { rango: [7, 18] } },
  altura: { tipo: 'altura', bajo: { rango: [-400, 300], paso: 10 }, alto: { rango: [400, 3000], paso: 10 } },
};
const CLAVES_PARES = Object.keys(PARES);

export function generarDiferencia(rng) {
  const par = rng.elegir(CLAVES_PARES), p = PARES[par];
  let lo;
  do { lo = mult(rng, ...p.bajo.rango, p.bajo.paso ?? 1); } while (lo === 0);
  const hi = mult(rng, ...p.alto.rango, p.alto.paso ?? 1);
  return { tipo: 'diferencia', par, lo, hi, d: hi - lo };
}

/** El error típico de lo que escribió el alumno en el ejercicio 2, o null. */
export function errorDiferencia({ lo, hi, d }, escrito) {
  if (escrito === -d) return 'inicial-menos-final';
  const dif = abs(abs(lo) - abs(hi)), suma = abs(lo) + abs(hi);
  if (escrito === dif && dif !== d) return 'diferencia-sin-signo';
  if (escrito === suma && suma !== d) return 'suma-sin-signo';
  return null;
}

// ─── Ejercicio 3: el dato que falta ────────────────────────────────────────────

export function generarFalta(rng) {
  const ctx = rng.elegir(IDS), c = CONTEXTOS[ctx];
  const tipo = rng.azar() < 0.5 ? 'final' : 'inicial';
  for (;;) {
    const x = mult(rng, c.min, c.max, c.paso), dir = rng.elegir([-1, 1]), k = mult(rng, 1, c.maxVar, c.paso);
    const r = tipo === 'final' ? x + dir * k : x - dir * k;
    if (x && r && enCota(ctx, x) && enCota(ctx, r)) return { tipo: 'falta', ctx, subtipo: tipo, x, dir, k, r };
  }
}

export function errorFalta({ subtipo, x, dir, k, r }, escrito) {
  if (escrito === -r) return 'signo-cambiado';
  const mal = subtipo === 'final' ? x - dir * k : x + dir * k;
  return escrito === mal && mal !== r ? 'resta-en-vez-de-suma' : null;
}

// ─── Ejercicio 4: antes y después de Cristo ────────────────────────────────────

/** Años de la misma era: ningún ítem cruza el cambio de era (no hubo año 0; ver la terminada de la 90). */
export function generarAnios(rng) {
  const era = rng.azar() < 0.5 ? 'aC' : 'dC';
  const max = era === 'aC' ? 2700 : 2026;
  for (;;) {
    const x = rng.entero(50, max), y = rng.entero(50, max);
    if (abs(x - y) < 20 || abs(x - y) === 1229 || [x, y].some(n => n === 753 || n === 476)) continue;
    // `a` es el año más antiguo: en a. C. el número mayor, en d. C. el menor.
    const [a, b] = era === 'aC' ? [Math.max(x, y), Math.min(x, y)] : [Math.min(x, y), Math.max(x, y)];
    return { tipo: 'anios', era, a, b, d: abs(a - b) };
  }
}

export function errorAnios({ a, b, d }, escrito) {
  return escrito === a + b && a + b !== d ? 'suma-sin-signo' : null;
}

// ─── Ejercicio 5: del enunciado a la cuenta ────────────────────────────────────

/** Contextos de los problemas de producto y cociente: `d` (cambio por unidad), `n` (cuántas) y tope del total. */
export const PRODUCTO = {
  temperatura: { d: [1, 5], n: [2, 6], total: 20 },
  saldo: { d: [2, 20], n: [2, 7], total: 120 },
  buceo: { d: [2, 8], n: [2, 5], total: 40 },
};
const CLAVES_PRODUCTO = Object.keys(PRODUCTO);

function cadena(rng) {
  const ctx = rng.elegir(IDS), c = CONTEXTOS[ctx];
  const tope = ctx === 'saldo' ? 100 : ctx === 'planta' ? 8 : 15;
  for (;;) {
    const s = mult(rng, c.min, c.max, c.paso);
    const t2 = signado(rng, 1, tope, c.paso), t3 = signado(rng, 1, tope, c.paso);
    const parcial = s + t2, r = parcial + t3;
    if (!s || !r || ![s, parcial, r].every(v => enCota(ctx, v))) continue;
    const lista = [s, t2, t3];
    const candidatas = [[s, -t2, t3], [s, t2, -t3], [s, -t2, -t3]].filter(l => valorTerminos(l) !== r);
    const malas = rng.barajar(candidatas).slice(0, 2).map(l => ({ texto: terminos(l), error: 'verbo-equivocado' }));
    const opciones = rng.barajar([{ texto: terminos(lista), error: null }, ...malas]);
    return { tipo: 'cadena', ctx, terminos: lista, opciones, solucion: opciones.findIndex(o => o.error === null), r };
  }
}

function producto(rng) {
  const ctx = rng.elegir(CLAVES_PRODUCTO), p = PRODUCTO[ctx];
  for (;;) {
    const m = rng.entero(...p.d), n = rng.entero(...p.n);
    if (m * n > p.total) continue;
    const c = rng.azar() < 0.7 ? -m : m, r = n * c;
    const suma = n + c !== r ? `${n} + ${fmtPar(c)}` : `${n} − ${fmtPar(c)}`;
    const opciones = rng.barajar([
      { texto: `${n} · ${fmtPar(c)}`, error: null },
      { texto: `${n} · ${fmtPar(-c)}`, error: 'signo-cambiado' },
      { texto: suma, error: 'operacion-equivocada' },
    ]);
    return { tipo: 'producto', ctx, n, c, opciones, solucion: opciones.findIndex(o => o.error === null), r };
  }
}

function cociente(rng) {
  const ctx = rng.elegir(CLAVES_PRODUCTO), p = PRODUCTO[ctx];
  for (;;) {
    const m = rng.entero(...p.d), n = rng.entero(...p.n);
    if (m * n > p.total) continue;
    const total = -m * n, c = -m;
    const opciones = rng.barajar([
      { texto: `${fmt(total)} : ${n}`, error: null },
      { texto: `${fmt(-total)} : ${n}`, error: 'signo-cambiado' },
      { texto: `${fmt(total)} · ${n}`, error: 'operacion-equivocada' },
    ]);
    return { tipo: 'cociente', ctx, n, total, c, opciones, solucion: opciones.findIndex(o => o.error === null), r: c };
  }
}

/** Un tercio de los ítems es un problema de producto o cociente (U3-3C-21). */
export function generarCuenta(rng) {
  const q = rng.azar();
  const base = q < 2 / 3 ? cadena(rng) : q < 0.9 ? producto(rng) : cociente(rng);
  return { ...base, signo: base.r > 0 ? 'positivo' : 'negativo' };
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = ({ opciones, solucion, signo, ...resto }) => JSON.stringify(resto);
