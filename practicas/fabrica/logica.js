// Práctica «Fábrica de divisores»: lógica pura (sin DOM ni red).
// Una factorización es una máquina de fabricar divisores: cada divisor es una
// elección de exponentes (0 ≤ exponente elegido ≤ exponente de n).

import { factorizar, valorDe, divisores, esMultiploFact } from '../_comun/aritmetica.js';

// Números con 2 o 3 primos (bases de menor a mayor), exponentes ≤ 3, incluidos
// casos con 11 y 13 y no solo 2, 3, 5 y 7.
const NUMEROS = [
  12, 18, 20, 24, 28, 36, 40, 45, 48, 50, 54, 56, 60, 63, 72, 75, 84, 90, 98, 99, 100, 108,
  120, 126, 132, 140, 150, 156, 180, 198, 242, 286, 338, 363,
];

export { factorizar, valorDe, divisores };

// ─── Ejercicio 1: construye el divisor ─────────────────────────────────────

/** Ítem: { n, fact, expObjetivo, objetivo }. Un 20 % pide el 1 o el propio n. */
export function generarConstruir(rng) {
  const n = rng.elegir(NUMEROS);
  const fact = factorizar(n);
  const r = rng.azar();
  let expObjetivo;
  if (r < 0.1) expObjetivo = fact.map(() => 0);
  else if (r < 0.2) expObjetivo = fact.map(([, e]) => e);
  else expObjetivo = fact.map(([, e]) => rng.entero(0, e));
  const objetivo = valorDe(fact.map(([p], i) => [p, expObjetivo[i]]));
  return { tipo: 'construir', n, fact, expObjetivo, objetivo };
}

/** La factorización que ha construido el alumno (exponentes en el orden de `fact`). */
export function factDeConstruido(fact, exponentes) {
  return fact.map(([p], i) => [p, exponentes[i]]).filter(([, e]) => e > 0);
}

export function esConstruccionCorrecta(item, exponentes) {
  return valorDe(factDeConstruido(item.fact, exponentes)) === item.objetivo;
}

// ─── Ejercicio 2: ¿cuántos divisores tiene? ────────────────────────────────

/** Ítem: { n, fact, solucion, premio }. `premio`: si acierta, mostrar la lista. */
export function generarContar(rng) {
  const n = rng.elegir(NUMEROS);
  const fact = factorizar(n);
  const solucion = fact.reduce((v, [, e]) => v * (e + 1), 1);
  return { tipo: 'contar', n, fact, solucion, premio: rng.azar() < 0.5 };
}

/** El error típico: multiplicar los exponentes sin sumar 1 a ninguno. */
export function olvidoSumarUno(item) {
  return item.fact.reduce((v, [, e]) => v * e, 1);
}

// ─── Ejercicio 3: sin dividir, ¿es divisible? ──────────────────────────────

const PRIMOS_POSIBLES = [2, 3, 5, 7, 11, 13];

/** Ítem: { n, fact, d, factD, divisible }. El divisor siempre es menor que n (¿es 90 divisible entre 110? no se pregunta). */
export function generarDivisible(rng) {
  const n = rng.elegir(NUMEROS);
  const fact = factorizar(n);
  // El tipo se elige una vez (50 % sí, 25 % exponente de más, 25 % primo que falta) y se
  // reintenta dentro del tipo: así el filtro d < n no desequilibra los sí y los no.
  const r = rng.azar();
  const tipo = r < 0.5 ? 'si' : r < 0.75 ? 'exponente' : 'primo';
  for (let intento = 0; intento < 100; intento++) {
    const factD = candidatoDivisor(rng, fact, tipo);
    const d = valorDe(factD);
    if (d < n) return { tipo: 'divisible', n, fact, d, factD, divisible: esMultiploFact(fact, factD) };
  }
  // Salvaguarda (no debería llegar): el primer primo, que siempre es divisor y menor que n.
  const factD = [[fact[0][0], 1]];
  return { tipo: 'divisible', n, fact, d: fact[0][0], factD, divisible: true };
}

/** Un posible divisor, dado como factorización: bien (divisor de n) o mal (exponente de más / primo que falta). */
function candidatoDivisor(rng, fact, tipo) {
  let factD;
  if (tipo === 'si') {
    factD = fact.map(([p, e]) => [p, rng.entero(0, e)]).filter(([, e]) => e > 0);
    if (!factD.length) factD = [[fact[0][0], 1]];
  } else if (tipo === 'exponente') {
    const i = rng.entero(0, fact.length - 1);
    factD = fact
      .map(([p, e], j) => (j === i ? [p, e + rng.entero(1, 2)] : [p, rng.entero(0, e)]))
      .filter(([, e]) => e > 0);
  } else {
    const candidatos = PRIMOS_POSIBLES.filter(p => !fact.some(([q]) => q === p));
    const p = rng.elegir(candidatos);
    factD = [...fact.map(([q, e]) => [q, rng.entero(0, e)]).filter(([, e]) => e > 0), [p, 1]].sort((a, b) => a[0] - b[0]);
  }
  return factD;
}
