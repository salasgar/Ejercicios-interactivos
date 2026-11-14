// Coloca los paréntesis. Con decimales (U5): los generadores. Lógica pura, sin DOM ni red.
// ESQUELETO de la tarea 199: cumple las cotas de la ficha 202 por `buscar`; la 202 lo rehace a su
// gusto (divisores de la U5, casos del papel fuera, variedad medida). Todo lo demás (árboles, pasos,
// coma o punto según el idioma, pistas, un chip por valor) es del motor común,
// `../_comun/parentesis-motor.js`, con enteros escalados (nunca coma flotante).

import { crearMotor, aritmeticaDecimales } from '../_comun/parentesis-motor.js';
import { decimal } from '../_comun/decimales.js';

/** Todo valor, intermedio o final: no negativo, con tres cifras decimales como mucho, divisiones exactas, hasta 500. */
export const CIFRAS = 3;
export const TOPE = 500;
export const M = crearMotor(aritmeticaDecimales({ cifras: CIFRAS, tope: TOPE, negativos: false }));

/** Un decimal con una o dos cifras decimales, de 0,1 a 9,99, sin ceros de más. */
function unDecimal(rng) {
  for (;;) {
    const d = rng.azar() < 0.5 ? decimal(rng.entero(1, 99), 1) : decimal(rng.entero(1, 999), 2);
    const n = d.normalizar();
    if (n.k > 0) return n;
  }
}

/** `cuantos` operandos: decimales y naturales de 2 a 10, con al menos un decimal (lo normal, dos). */
function operandos(rng, cuantos) {
  const decimales = Math.min(cuantos, rng.azar() < 0.2 ? 1 : 2 + (cuantos > 3 && rng.azar() < 0.3 ? 1 : 0));
  const sitios = new Set(rng.barajar([...Array(cuantos).keys()]).slice(0, decimales));
  return Array.from({ length: cuantos }, (_, i) => (sitios.has(i) ? unDecimal(rng) : decimal(rng.entero(2, 10), 0)));
}

const sinImposibles = an => an.invalidos.length === 0;

/** Ejercicio 1: a ∘ b ∘ c, una operación de + − y otra de · :; exactamente 2 resultados. */
function generar1(rng, anterior) {
  const hacer = () => {
    const ops = [rng.elegir(['+', '-']), rng.elegir(['*', '/'])];
    return { numeros: operandos(rng, 3), operaciones: rng.azar() < 0.5 ? ops : ops.reverse(), exponente: null };
  };
  return M.buscar(rng, hacer, an => an.valores.length === 2 && sinImposibles(an),
    { numeros: [decimal(15, 1), decimal(5, 1), 2], operaciones: ['+', '*'], exponente: null }, { anterior });
}

/** Ejercicio 2: a ∘ b ∘ c² (³ en un 15 %), con + − ·; de 3 a 5 resultados. */
function generar2(rng, anterior) {
  const hacer = () => ({
    numeros: operandos(rng, 3),
    operaciones: [rng.elegir(['+', '-', '*']), rng.elegir(['+', '-', '*'])],
    exponente: rng.azar() < 0.15 ? 3 : 2,
  });
  return M.buscar(rng, hacer, an => an.valores.length >= 3 && an.valores.length <= 5 && sinImposibles(an),
    { numeros: [decimal(5, 1), 2, 3], operaciones: ['+', '*'], exponente: 2 }, { anterior });
}

/** Ejercicio 3: la diana. Cuatro números con + − · :; al menos 3 resultados. */
function generar3(rng, anterior) {
  const hacer = () => ({
    numeros: operandos(rng, 4),
    operaciones: [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/'])),
    exponente: null,
  });
  return M.buscar(rng, hacer, an => an.valores.length >= 3 && sinImposibles(an),
    { numeros: [decimal(25, 1), 2, decimal(5, 1), 4], operaciones: ['+', '*', '+'], exponente: null }, { anterior });
}

/** El ítem del ejercicio `ejercicio` (1 a 3). En la diana, el objetivo no es el de sin paréntesis. */
export function generar(ejercicio, rng, sesion = {}) {
  const anterior = sesion.anterior ?? null;
  if (ejercicio === 1) return M.itemDe('todos', generar1(rng, anterior));
  if (ejercicio === 2) return M.itemDe('todos', generar2(rng, anterior));
  const item = M.itemDe('diana', generar3(rng, anterior));
  const otros = item.resultados.filter(v => !M.mismoValor(v, item.sinParentesis));
  return { ...item, objetivo: rng.elegir(otros) };
}
