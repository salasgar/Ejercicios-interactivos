// Coloca los paréntesis. Con fracciones (U4): los generadores. Lógica pura, sin DOM ni red.
// Los casos del papel no salen (`papel.js`). Todo lo demás (árboles, pasos, escritura con raya,
// pistas, un chip por valor) es del motor común, `../_comun/parentesis-motor.js`.

import { crearMotor, aritmeticaFracciones } from '../_comun/parentesis-motor.js';
import { fraccion } from '../_comun/fracciones.js';
import { esCasoReservado } from '../combinadas-fracciones/logica.js';
import { delPapel } from './papel.js';

const SIMBOLO = { '+': '+', '-': '−', '*': '·', '/': ':' };

/** ¿La cuenta sin paréntesis es un caso del papel? Por su clave en orden y, además, en cualquier orden de sumandos y factores. */
export function esCasoDelPapel(e) {
  if (delPapel(M.claveExpresion(e))) return true;
  const texto = e.numeros.reduce((t, n, i) => (i === 0 ? M.clave(n) : `${t} ${SIMBOLO[e.operaciones[i - 1]]} ${M.clave(n)}`), '');
  return esCasoReservado(texto);
}

/** Todo valor, intermedio o final, irreducible con denominador ≤ 36 y numerador entre −60 y 60. */
export const TOPE_NUM = 60;
export const TOPE_DEN = 36;
export const M = crearMotor(aritmeticaFracciones({ topeNum: TOPE_NUM, topeDen: TOPE_DEN }));

/** Una fracción que no es un entero, ya irreducible: denominador de 2 a 6 (y 8, 10 o 12 de vez en cuando). */
function unaFraccion(rng) {
  for (;;) {
    const den = rng.azar() < 0.85 ? rng.entero(2, 6) : rng.elegir([8, 10, 12]);
    const num = rng.entero(1, 2 * den - 1);
    if (num % den === 0) continue;
    return fraccion(num, den).simplificar();
  }
}

/**
 * `cuantos` operandos con `naturales` naturales de 2 a 5 como mucho (al menos dos fracciones);
 * el primero, negativo en un 30 % de los ítems (solo el primero).
 */
function operandos(rng, cuantos, naturales) {
  const k = rng.entero(0, naturales);
  const sitios = new Set(rng.barajar([...Array(cuantos).keys()]).slice(0, k));
  const lista = Array.from({ length: cuantos }, (_, i) => (sitios.has(i) ? fraccion(rng.entero(2, 5), 1) : unaFraccion(rng)));
  if (rng.azar() < 0.3) lista[0] = lista[0].opuesta();
  return lista;
}

/** Ejercicio 1: tres operandos con + − ·, un · al menos; exactamente 2 resultados. */
function generar1(rng, anterior) {
  const hacer = () => {
    const operaciones = [rng.elegir(['+', '-', '*']), rng.elegir(['+', '-', '*'])];
    if (!operaciones.includes('*')) operaciones[rng.entero(0, 1)] = '*';
    return { numeros: operandos(rng, 3, 1), operaciones, exponente: null };
  };
  return M.buscar(rng, hacer, (an, e) => an.valores.length === 2 && an.invalidos.length === 0 && !esCasoDelPapel(e),
    { numeros: [fraccion(3, 4), fraccion(1, 2), fraccion(3, 1)], operaciones: ['-', '*'], exponente: null }, { anterior });
}

/** Ejercicio 2: cuatro operandos con + − · :, un «:» al menos; de 3 a 5 resultados; ninguna agrupación imposible. */
function generar2(rng, anterior) {
  const hacer = () => {
    const operaciones = [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/']));
    if (!operaciones.includes('/')) operaciones[rng.entero(0, 2)] = '/';
    return { numeros: operandos(rng, 4, 2), operaciones, exponente: null };
  };
  return M.buscar(rng, hacer, (an, e) => an.valores.length >= 3 && an.valores.length <= 5 && an.invalidos.length === 0 && !esCasoDelPapel(e),
    { numeros: [fraccion(3, 4), fraccion(1, 2), fraccion(2, 3), fraccion(1, 6)], operaciones: ['-', '*', '/'], exponente: null }, { anterior });
}

/** Ejercicio 3: la diana. Cuatro operandos con + − · :; al menos 3 resultados y ninguna agrupación imposible. */
function generar3(rng, anterior) {
  const hacer = () => ({
    numeros: operandos(rng, 4, 2),
    operaciones: [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/'])),
    exponente: null,
  });
  return M.buscar(rng, hacer, (an, e) => an.valores.length >= 3 && an.invalidos.length === 0 && !esCasoDelPapel(e),
    { numeros: [fraccion(1, 2), fraccion(1, 3), fraccion(2, 1), fraccion(1, 4)], operaciones: ['+', '*', '-'], exponente: null }, { anterior });
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
