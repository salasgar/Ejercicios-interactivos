// Práctica «Potencias especiales, verdadero o falso» (repaso de la unidad 1):
// lógica, pura (sin DOM ni red). La verdad de cada igualdad se calcula
// evaluando los dos lados con los números concretos del ítem: nunca se
// declara a mano si una plantilla es verdadera o falsa.

import { renderPlantilla } from './textos.js';

function rango(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

// --- Las catorce plantillas ------------------------------------------------------
//
// Cada plantilla: { id, tipo: 'V' | 'F' (para repartir el peso y escoger en el
// ejercicio 2, NO para decidir la verdad: eso lo hace lado1 === lado2),
// peso, generar(rng) -> vars, lado1(vars), lado2(vars) }.

const PLANTILLAS = {
  // a⁰ = 1
  1: { tipo: 'V', peso: 1, generar: rng => ({ a: rng.entero(2, 20) }), lado1: v => v.a ** 0, lado2: () => 1 },
  // a⁰ = 0
  2: { tipo: 'F', peso: 1, generar: rng => ({ a: rng.entero(2, 20) }), lado1: v => v.a ** 0, lado2: () => 0 },
  // a⁰ = a (a ≠ 1, o sería verdadera)
  3: { tipo: 'F', peso: 1, generar: rng => ({ a: rng.entero(2, 20) }), lado1: v => v.a ** 0, lado2: v => v.a },
  // 0ⁿ = 0 (n ≥ 1: el 0⁰ no aparece nunca)
  4: { tipo: 'V', peso: 1, generar: rng => ({ n: rng.entero(1, 6) }), lado1: v => 0 ** v.n, lado2: () => 0 },
  // 1ⁿ = 1
  5: { tipo: 'V', peso: 1, generar: rng => ({ n: rng.entero(1, 6) }), lado1: v => 1 ** v.n, lado2: () => 1 },
  // 1ⁿ = n (n ≠ 1, o sería verdadera)
  6: { tipo: 'F', peso: 1, generar: rng => ({ n: rng.entero(2, 6) }), lado1: v => 1 ** v.n, lado2: v => v.n },
  // a¹ = a
  7: { tipo: 'V', peso: 1, generar: rng => ({ a: rng.entero(2, 20) }), lado1: v => v.a ** 1, lado2: v => v.a },
  // a¹ = 1 (a ≠ 1, o sería verdadera)
  8: { tipo: 'F', peso: 1, generar: rng => ({ a: rng.entero(2, 20) }), lado1: v => v.a ** 1, lado2: () => 1 },
  // 10ⁿ = 1 seguido de n ceros
  9: { tipo: 'V', peso: 1, generar: rng => ({ n: rng.entero(1, 6) }), lado1: v => 10 ** v.n, lado2: v => Number(`1${'0'.repeat(v.n)}`) },
  // 10ⁿ = 10 · n (n ≠ 1, o sería verdadera)
  10: { tipo: 'F', peso: 1, generar: rng => ({ n: rng.entero(2, 6) }), lado1: v => 10 ** v.n, lado2: v => 10 * v.n },
  // aⁿ = a · n (se evita a=2,n=2, donde coincide por casualidad)
  11: {
    tipo: 'F', peso: 1,
    generar(rng) {
      let a, n;
      do { a = rng.entero(2, 9); n = rng.entero(2, 5); } while (a === 2 && n === 2);
      return { a, n };
    },
    lado1: v => v.a ** v.n, lado2: v => v.a * v.n,
  },
  // a³ = (a+1)² (nunca coinciden para a entero ≥ 2)
  12: { tipo: 'F', peso: 1, generar: rng => ({ a: rng.entero(2, 6) }), lado1: v => v.a ** 3, lado2: v => (v.a + 1) ** 2 },
  // 2⁴ = 4² (la excepción famosa: pesa poco para que no se generalice)
  13: { tipo: 'V', peso: 0.3, generar: () => ({}), lado1: () => 2 ** 4, lado2: () => 4 ** 2 },
  // aⁿ = a · a · … · a (n veces): la propia definición
  14: { tipo: 'V', peso: 1, generar: rng => ({ a: rng.entero(2, 9), n: rng.entero(2, 5) }), lado1: v => v.a ** v.n, lado2: v => Array(v.n).fill(v.a).reduce((p, x) => p * x, 1) },
};

const IDS = Object.keys(PLANTILLAS).map(Number);
export const IDS_VERDADERAS = IDS.filter(id => PLANTILLAS[id].tipo === 'V');
export const IDS_FALSAS = IDS.filter(id => PLANTILLAS[id].tipo === 'F');

/** Evalúa una plantilla con sus variables: { lado1, lado2, verdad }. */
export function evaluar(id, vars) {
  const p = PLANTILLAS[id];
  const lado1 = p.lado1(vars), lado2 = p.lado2(vars);
  return { lado1, lado2, verdad: lado1 === lado2 };
}

function generarVars(id, rng) {
  return PLANTILLAS[id].generar(rng);
}

// --- Ejercicio 1: ¿verdadero o falso? -------------------------------------------

/** Ítem: { tipo: 'vf', id, vars, verdad }. La plantilla se elige con el peso de cada una. */
export function generarVF(rng) {
  const total = IDS.reduce((s, id) => s + PLANTILLAS[id].peso, 0);
  let r = rng.azar() * total;
  let id = IDS[0];
  for (const candidato of IDS) {
    if (r < PLANTILLAS[candidato].peso) { id = candidato; break; }
    r -= PLANTILLAS[candidato].peso;
  }
  const vars = generarVars(id, rng);
  const { verdad } = evaluar(id, vars);
  return { tipo: 'vf', id, vars, verdad };
}

// --- Ejercicio 2: ¿cuál es la falsa? --------------------------------------------

/** Ítem: { tipo: 'falsa', items: [{ id, vars, verdad }, …] (4), solucion: índice de la falsa }. */
export function generarFalsa(rng) {
  const idFalsa = rng.elegir(IDS_FALSAS);
  const items = [];
  const vistos = new Set();
  const poner = id => {
    const vars = generarVars(id, rng);
    const texto = renderPlantilla(id, vars);
    if (vistos.has(texto)) return false;       // dos plantillas distintas pueden pintar la misma igualdad (10¹ = 10)
    vistos.add(texto);
    items.push({ id, vars, verdad: evaluar(id, vars).verdad });
    return true;
  };
  while (!poner(idFalsa));
  // Tres verdaderas distintas, elegidas con el peso de cada plantilla. 2⁴ = 4² (13) se queda solo en el
  // ejercicio 1: es una casualidad (en general aᵇ ≠ bᵃ) y vista a menudo invita a generalizarla.
  const pool = IDS_VERDADERAS.filter(id => id !== 13);
  for (let k = 0; k < 3; k++) {
    for (;;) {
      let r = rng.azar() * pool.reduce((t, id) => t + PLANTILLAS[id].peso, 0);
      let i = 0;
      while (i < pool.length - 1 && r >= PLANTILLAS[pool[i]].peso) { r -= PLANTILLAS[pool[i]].peso; i++; }
      if (poner(pool[i])) { pool.splice(i, 1); break; }
    }
  }
  const orden = rng.barajar([0, 1, 2, 3]);
  const itemsFinal = orden.map(i => items[i]);
  const solucion = itemsFinal.findIndex(it => !it.verdad);
  return { tipo: 'falsa', items: itemsFinal, solucion };
}

export { rango };
