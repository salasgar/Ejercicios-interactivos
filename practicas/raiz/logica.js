// Práctica «Raíz cuadrada con cuadrados» (repaso de la unidad 1): lógica. Todo
// puro (sin DOM ni red). Los generadores devuelven DATOS, nunca HTML.
//
// Idea: con n fichas, el cuadrado más grande que se puede formar tiene de lado
// la raíz entera (el mayor k con k² ≤ n) y lo que sobra es el resto n − k².
// El resto nunca llega a 2k + 1, porque entonces cabría un cuadrado de lado k + 1.

import { raizEntera } from '../_comun/aritmetica.js';

export const MAX_FICHAS = 150;
export const LADO_MAXIMO = 13;

/** { raiz, resto } de n ≥ 0. */
export function cuadradoMasGrande(n) {
  const raiz = raizEntera(n);
  return { raiz, resto: n - raiz * raiz };
}

/** Con n fichas y un cuadrado de lado s: cuántas caben dentro, cuántas sobran y si se completa. */
export function fichasEnLado(n, s) {
  const dentro = Math.min(n, s * s);
  return { dentro, sobran: n - dentro, completo: n >= s * s };
}

/** ¿Puede ser «raíz entera k, resto r»? Sí exactamente cuando 0 ≤ r ≤ 2k. */
export function esPosible(k, r) {
  return r >= 0 && r <= 2 * k;
}

const item = (tipo, k, r, extra = {}) => ({ tipo, n: k * k + r, raiz: k, resto: r, ...extra });

// --- Ejercicio 1: forma el cuadrado ----------------------------------------------

/** Ítem: { tipo: 'forma', n, raiz, resto }. El 40 % son cuadrados perfectos. n ≤ 150. */
export function generarForma(rng) {
  if (rng.azar() < 0.4) return item('forma', rng.entero(2, 12), 0);
  const k = rng.entero(2, 12);
  return item('forma', k, rng.entero(1, Math.min(2 * k, MAX_FICHAS - k * k)));
}

// --- Ejercicio 2: sin dibujo --------------------------------------------------------

/** Ítem: { tipo: 'exacta', n, raiz, resto: 0 }. Cuadrados perfectos hasta 400. */
export function generarExacta(rng) {
  return item('exacta', rng.entero(2, 20), 0);
}

/** Ítem: { tipo: 'entera', n, raiz, resto }. n ≤ 400; el 15 % son exactos (resto 0). */
export function generarEntera(rng) {
  const k = rng.entero(3, 19);
  return item('entera', k, rng.azar() < 0.15 ? 0 : rng.entero(1, 2 * k));
}

/** Ítem: { tipo: 'puede', raiz, resto, puede }. Mitad Sí y mitad No; los casos del borde (2k y 2k + 1) salen a menudo. */
export function generarPuede(rng) {
  const k = rng.entero(2, 14);
  let r;
  if (rng.azar() < 0.5) r = rng.azar() < 0.3 ? 2 * k : rng.entero(0, 2 * k);
  else r = rng.azar() < 0.3 ? 2 * k + 1 : rng.entero(2 * k + 1, 3 * k + 1);
  return item('puede', k, r, { puede: esPosible(k, r) });
}

/** Mezcla del ejercicio 2: 30 % raíz exacta, 40 % raíz entera y resto, 30 % «¿puede ser?». */
export function generarSinDibujo(rng) {
  const x = rng.azar();
  if (x < 0.3) return generarExacta(rng);
  if (x < 0.7) return generarEntera(rng);
  return generarPuede(rng);
}

// --- Ejercicio 3: problemas -----------------------------------------------------------

export const PLANTILLAS = ['lado', 'sillas', 'fichas'];

/**
 * Ítem: { tipo: 'problema', plantilla, n, raiz, resto, dosCampos, variante }.
 * «lado»: n es un cuadrado perfecto y se pide el lado (un campo); «sillas» y
 * «fichas»: sobra algo y se piden el lado y lo que sobra (dos campos).
 */
export function generarProblema(rng) {
  const plantilla = rng.elegir(PLANTILLAS);
  const variante = rng.entero(0, 1);
  if (plantilla === 'lado') return item('problema', rng.entero(5, 20), 0, { plantilla, dosCampos: false, variante });
  const k = rng.entero(3, 15);
  return item('problema', k, rng.entero(1, 2 * k), { plantilla, dosCampos: true, variante });
}
