// Práctica de plantilla: lógica. Todo puro (sin DOM ni red), para probarlo con
// `npm test`: los generadores devuelven DATOS (números, listas, textos), nunca
// HTML ni funciones, porque la base vuelve a montar el mismo ítem al cambiar de
// idioma y lo compara con el anterior para no repetirlo.

import { esPrimo, factorizar, valorDe, PRIMOS } from '../_comun/aritmetica.js';

// --- Ejercicio 1: ¿primo o compuesto? -------------------------------------------

const MAXIMO = 150;
const LOS_PRIMOS = PRIMOS.filter(p => p <= MAXIMO);
const COMPUESTOS = Array.from({ length: MAXIMO - 3 }, (_, i) => i + 4).filter(n => !esPrimo(n));
/** Compuestos que «parecen primos»: impares y que no acaban en 5 (51, 57, 87, 91, 119…). */
const ENGANOSOS = COMPUESTOS.filter(n => n % 2 === 1 && n % 5 !== 0);

/** Ítem: { n }. Mitad primos y mitad compuestos; de estos, la mayoría engañosos. */
export function generarPrimo(rng) {
  if (rng.azar() < 0.5) return { n: rng.elegir(LOS_PRIMOS) };
  return { n: rng.elegir(rng.azar() < 0.7 ? ENGANOSOS : COMPUESTOS) };
}

/** La respuesta buena de un ítem del ejercicio 1: 'primo' o 'compuesto'. */
export function clasePrimo(item) {
  return esPrimo(item.n) ? 'primo' : 'compuesto';
}

/** Para explicar por qué un número es primo: los primos p con p · p ≤ n, y el siguiente. */
export function primosAProbar(n) {
  const hasta = PRIMOS.findIndex(p => p * p > n);
  return { probados: PRIMOS.slice(0, hasta), siguiente: PRIMOS[hasta] };
}

// --- Ejercicio 2: escribir un número como producto de potencias de primos --------

/** Los primos que se ofrecen: también el 11 y el 13, no solo 2, 3, 5 y 7. */
export const BASES = [2, 3, 5, 7, 11, 13];
export const EXPONENTE_MAXIMO = 6;

export const NUMEROS = [
  12, 18, 20, 24, 28, 36, 40, 45, 48, 50, 54, 56, 60, 63, 72, 75, 84, 90, 98, 99, 100, 108,
  120, 126, 132, 140, 150, 156, 180, 198, 242, 286, 338, 363,
];

/** Ítem: { n }. */
export function generarFactorizacion(rng) {
  return { n: rng.elegir(NUMEROS) };
}

/** Factorización que ha construido el alumno: exponentes en el orden de BASES → [[p, e], …]. */
export function factDe(exponentes) {
  return BASES.map((p, i) => [p, exponentes[i]]).filter(([, e]) => e > 0);
}

/** ¿Es correcta? La factorización en primos es única: basta con que el producto dé n. */
export function esFactorizacionDe(item, exponentes) {
  return valorDe(factDe(exponentes)) === item.n;
}

export { factorizar, valorDe };
