// Coloca los paréntesis. Con enteros (U3): los generadores. Lógica pura, sin DOM ni red.
// ESQUELETO de la tarea 199: cumple las cotas de la ficha 200 por `buscar`; la 200 lo rehace a su
// gusto (casos del papel fuera, variedad medida, cotas finas). Todo lo demás (árboles, pasos,
// escritura, pistas) es del motor común, `../_comun/parentesis-motor.js`.

import { crearMotor, aritmeticaEnteros } from '../_comun/parentesis-motor.js';

/** Todo valor, intermedio o final, entre −200 y 200 (como `parentesis-enteros`). */
export const TOPE = 200;
export const M = crearMotor(aritmeticaEnteros({ tope: TOPE }));

/** ¿Alguna agrupación válida eleva un negativo, como (−2)² o (3 − 5)³? (U3-3C-10) */
export function elevaNegativo(an) {
  return an.validos.some(({ r }) => r.pasos.some(sec => sec.some(x => typeof x !== 'string' && x.pot && x.base.v !== undefined && x.base.v < 0)));
}

const primero = (rng, hasta) => (rng.azar() < 0.5 ? -1 : 1) * rng.entero(1, hasta);

/** Ejercicio 1: a ∘ b ∘ c con + − ·; un · al menos, o − −, o − +; exactamente 2 resultados. */
function generar1(rng, anterior) {
  const hacer = () => ({
    numeros: [primero(rng, 9), rng.entero(2, 9), rng.entero(2, 9)],
    operaciones: rng.elegir([['+', '*'], ['*', '+'], ['-', '*'], ['*', '-'], ['*', '*'], ['-', '-'], ['-', '+']]),
    exponente: null,
  });
  return M.buscar(rng, hacer, an => an.valores.length === 2 && an.invalidos.length === 0,
    { numeros: [-4, 3, 7], operaciones: ['*', '+'], exponente: null }, { anterior });
}

/** Ejercicio 2: a ∘ b ∘ c² (³ en un 15 %); de 3 a 5 resultados; la mitad, con una base negativa. */
function generar2(rng, anterior) {
  const conNegativa = rng.azar() < 0.5;
  const hacer = () => ({
    numeros: [primero(rng, 9), rng.entero(2, 6), rng.entero(2, 5)],
    operaciones: [rng.elegir(['+', '-', '*']), rng.elegir(['+', '-', '*'])],
    exponente: rng.azar() < 0.15 ? 3 : 2,
  });
  return M.buscar(rng, hacer,
    an => an.valores.length >= 3 && an.valores.length <= 5 && an.invalidos.length === 0 && (!conNegativa || elevaNegativo(an)),
    { numeros: [-5, 2, 3], operaciones: ['+', '*'], exponente: 2 }, { anterior });
}

/** Ejercicio 3: cuatro números con un «:» al menos; de 3 a 6 resultados y alguna agrupación que no se puede. */
function generar3(rng, anterior) {
  const hacer = () => {
    const operaciones = [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/']));
    if (!operaciones.includes('/')) operaciones[rng.entero(0, 2)] = '/';
    return { numeros: [primero(rng, 12), rng.entero(2, 12), rng.entero(2, 12), rng.entero(2, 12)], operaciones, exponente: null };
  };
  return M.buscar(rng, hacer,
    an => an.valores.length >= 3 && an.valores.length <= 6 && an.invalidos.length >= 1 && !an.hayGrande,
    { numeros: [-12, 6, 2, 3], operaciones: ['+', '/', '-'], exponente: null }, { anterior });
}

/** El ítem del ejercicio `ejercicio` (1 a 3). */
export function generar(ejercicio, rng, sesion = {}) {
  const anterior = sesion.anterior ?? null;
  const e = [generar1, generar2, generar3][ejercicio - 1](rng, anterior);
  return M.itemDe('todos', e);
}
