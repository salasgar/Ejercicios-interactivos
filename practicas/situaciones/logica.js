// «Enteros en la vida real» (PU2, tarea 82): lógica pura (sin DOM ni red).
//
// Seis contextos, cada uno con su cota creíble (`min`–`max`): ningún generador saca un
// número que no pueda darse en esa situación (una ciudad no llega a −40 °C, un edificio
// no tiene 30 sótanos, un alumno no debe 200 €). Los ítems son DATOS; las frases (en los
// dos idiomas) salen de `textos.js` con el contexto y el entero del ítem.
//
//   1. generarEntero    { ctx, n }                         una situación → el entero (U3-1C-01)
//   2. generarSituacion { ctx, n, opciones }               un entero y su contexto → la frase (U3-1C-01)
//   3. generarPaso      { ctx, s, dir, m, r, invertir }    un paso con sube/baja, ingresa/saca (U3-1C-16)
//
// Los distractores salen de errores típicos con nombre: `signo-cambiado` (el sentido
// contrario, de `_comun/enteros.js`) y `contexto-equivocado` (la misma cantidad pero de
// otro tema, propio de esta práctica). Nunca dos frases que digan lo mismo: cada opción
// es un par distinto (contexto, valor) y solo uno es el del ítem.

import { MENOS, distractores } from '../_comun/enteros.js';

/**
 * Cota de cada contexto y qué valores saca el ejercicio 1 y el 2.
 * `neg` y `pos`: magnitudes [mínimo, máximo] y `paso` (los metros sobre el nivel del mar,
 * de 10 en 10). `cero`: si el 0 es una situación posible («planta baja», «0 grados»).
 */
export const CONTEXTOS = {
  temperatura: { min: -30, max: 45, cero: true, neg: [1, 20], pos: [1, 40], paso: 1 },
  planta: { min: -5, max: 20, cero: true, neg: [1, 5], pos: [1, 20], paso: 1 },
  saldo: { min: -50, max: 300, cero: false, neg: [1, 50], pos: [1, 300], paso: 1 },
  mar: { min: -400, max: 4000, cero: false, neg: [10, 400], pos: [10, 3000], paso: 10 },
  buceo: { min: -40, max: 30, cero: false, neg: [1, 40], pos: [1, 30], paso: 1 },
  anios: { min: -3000, max: 2026, cero: false, neg: [2, 2700], pos: [1, 2026], paso: 1 },
};
export const IDS = Object.keys(CONTEXTOS);

/** ¿Es `v` un valor creíble en ese contexto? */
export function enCota(ctx, v) {
  const c = CONTEXTOS[ctx];
  return Number.isInteger(v) && v >= c.min && v <= c.max && (c.cero || v !== 0);
}

/** Errores típicos propios de la práctica (los demás vienen de `_comun/enteros.js`). */
export const ERRORES_PROPIOS = {
  'contexto-equivocado': {
    nombre: { es: 'Ha elegido una frase de otro tema', en: 'Chose a sentence about a different topic' },
  },
  'otro-error': {
    nombre: { es: 'Otro error', en: 'Another mistake' },
  },
};

const magnitud = (rng, [lo, hi], paso) => paso * rng.entero(Math.ceil(lo / paso), Math.floor(hi / paso));

/** Un valor del contexto: negativo o positivo; con `cero`, a veces el 0. */
function valorDe(ctx, rng, { negativo = rng.azar() < 0.5, conCero = true } = {}) {
  const c = CONTEXTOS[ctx];
  if (conCero && c.cero && rng.azar() < 0.08) return 0;
  return negativo ? -magnitud(rng, c.neg, c.paso) : magnitud(rng, c.pos, c.paso);
}

// --- Ejercicio 1: ¿qué entero es? ----------------------------------------------------

/** Ítem: { ctx, n }. */
export function generarEntero(rng) {
  const ctx = rng.elegir(IDS);
  return { ctx, n: valorDe(ctx, rng) };
}

// --- Ejercicio 2: ¿qué situación es? -------------------------------------------------

/**
 * Ítem: { ctx, n, opciones: [{ ctx, v, error }] } con n ≠ 0 y tres opciones barajadas: la
 * buena (error null), el sentido contrario del mismo contexto (−n) y la frase de otro
 * contexto con −n. Todas dentro de su cota: si −n no cabe en el contexto del ítem o en
 * ningún otro, se saca otro ítem.
 */
export function generarSituacion(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const ctx = rng.elegir(IDS);
    const n = valorDe(ctx, rng, { conCero: false });
    if (!enCota(ctx, -n)) continue;
    const otros = IDS.filter(c => c !== ctx && enCota(c, -n));
    if (!otros.length) continue;
    const opciones = rng.barajar([
      { ctx, v: n, error: null },
      { ctx, v: -n, error: 'signo-cambiado' },
      { ctx: rng.elegir(otros), v: -n, error: 'contexto-equivocado' },
    ]);
    return { ctx, n, opciones };
  }
  throw new Error('generarSituacion: no encuentro un ítem');
}

/** La opción buena de un ítem del ejercicio 2. */
export const opcionBuena = item => item.opciones.find(o => o.error === null);

// --- Ejercicio 3: un paso --------------------------------------------------------------

/** Contextos del ejercicio 3 y qué valores saca: inicio `s` y cambio `m` (siempre positivo; `dir` da el sentido). */
export const PASOS = {
  temperatura: { s: [-20, 35], m: [1, 20], paso: 1 },
  planta: { s: [-5, 10], m: [1, 10], paso: 1 },
  saldo: { s: [-40, 100], m: [5, 100], paso: 5 },
};
const signo = v => Math.sign(v);

/**
 * Ítem: { ctx, s, dir, m, r, invertir }. `s` es el valor de partida, `dir` +1 (sube, ingresa)
 * o −1 (baja, saca), `m` cuánto, `r = s + dir · m` el resultado. El resultado no es 0 y ni
 * `r` ni `−r` se salen de la cota (la frase equivocada, «Debes 40 €» o «40 grados bajo
 * cero», también tiene que poder darse). `invertir`: el orden de las dos frases.
 */
export function generarPaso(rng) {
  for (let intento = 0; intento < 1000; intento++) {
    const ctx = rng.elegir(Object.keys(PASOS));
    const p = PASOS[ctx];
    const objetivo = rng.azar() < 0.5 ? -1 : 1;
    const s = magnitud(rng, [Math.min(p.s[0], p.s[1]), Math.max(p.s[0], p.s[1])], p.paso);
    const dir = rng.azar() < 0.5 ? -1 : 1;
    const m = magnitud(rng, p.m, p.paso);
    const r = s + dir * m;
    if (!enCota(ctx, s) || !enCota(ctx, r) || !enCota(ctx, -r) || signo(r) !== objetivo) continue;
    return { ctx, s, dir, m, r, invertir: rng.azar() < 0.5 };
  }
  throw new Error('generarPaso: no encuentro un ítem');
}

/** Los dos términos con su signo, para los errores típicos: −3 + 5 → [−3, 5]; 2 − 7 → [2, −7]. */
export const terminosPaso = item => [item.s, item.dir * item.m];

/** La cuenta del ítem, sin paréntesis: «−3 + 5», «2 − 7». */
export function cuentaPaso(item) {
  const inicio = item.s < 0 ? `${MENOS}${-item.s}` : `${item.s}`;
  return `${inicio} ${item.dir > 0 ? '+' : MENOS} ${item.m}`;
}

/** Las dos frases del resultado: la buena (error null) y la del signo contrario. */
export function frasesPaso(item) {
  const lista = [{ v: item.r, error: null }, { v: -item.r, error: 'signo-cambiado' }];
  return item.invertir ? lista.reverse() : lista;
}

/** Correcto: el entero y la frase del signo que toca. `signoFrase` es el valor v de la frase elegida. */
export const esCorrectoPaso = (item, valor, vFrase) => valor === item.r && vFrase === item.r;

/** Qué error típico explica un resultado equivocado (o 'otro-error'). */
export function errorDePaso(item, valor) {
  const [a, b] = terminosPaso(item);
  const candidatos = [
    ['regla-signos-en-suma', a, b], ['suma-valores-absolutos', a, b], ['olvida-el-signo', a, b],
    ['signo-del-primero', a, b], ['signo-cambiado', item.r],
  ];
  const encontrado = distractores(candidatos, item.r).find(d => d.valor === valor);
  return encontrado ? encontrado.error : 'otro-error';
}

/**
 * Qué se ve en la recta o el termómetro: temperatura y plantas, en el termómetro (vertical);
 * el saldo, en la recta. De 0 a los extremos, con marcas de 1, 2, 5, 10… hasta que no pasen
 * de 30 (termómetro) o 21 (recta).
 */
export function vistaPaso(item) {
  const tipo = item.ctx === 'saldo' ? 'recta' : 'termometro';
  const limite = tipo === 'recta' ? 21 : 30;
  const lo = Math.min(item.s, item.r, 0), hi = Math.max(item.s, item.r, 0);
  // Los euros son múltiplos de 5: las marcas, de 5 en 5 como mínimo.
  for (const paso of item.ctx === 'saldo' ? [5, 10, 20, 25, 50, 100] : [1, 2, 5, 10, 20]) {
    const min = Math.floor(lo / paso) * paso, max = Math.ceil(hi / paso) * paso;
    if ((max - min) / paso + 1 <= limite) return { tipo, min, max, paso };
  }
  throw new Error('vistaPaso: rango demasiado grande');
}
