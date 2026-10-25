// Práctica «Productos y potencias con signo»: lógica pura (sin DOM ni red), probada
// por fuerza bruta en `tests/practicas-potencias-enteros.test.js`. Los generadores
// devuelven DATOS, nunca HTML ni funciones (la base vuelve a montar el mismo ítem
// al cambiar de idioma).
//
// Cotas de realismo (no hay contexto: son cotas de tamaño, para que las cuentas se
// hagan de cabeza): productos de 3 a 5 factores con |factor| ≤ 5 y |producto| ≤ 500;
// potencias y cuadrados con |valor| ≤ 1000; cuadrados perfectos de 1 a 144.

import {
  MENOS, fmt, fmtPar, evaluar, analizar, aTexto, nodoEn,
  potenciaParNegativa, potenciaImparPositiva, basePorExponente,
  menosEnLaBase, signosAntesDeLaPotencia,
} from '../_comun/enteros.js';

export const MAX_VALOR = 1000;
export const MAX_PRODUCTO = 500;

const SUPERINDICE = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };

// --- Ejercicio 1: cuenta los negativos -------------------------------------------

/** Ítem: { factores: [enteros] }, de 3 a 5 factores. En uno de cada cinco, un 0 o un −1. */
export function generarProducto(rng) {
  for (;;) {
    const n = rng.entero(3, 5);
    const k = rng.entero(0, n);
    const negativos = new Set(rng.barajar([...Array(n).keys()]).slice(0, k));
    const factores = Array.from({ length: n }, (_, i) => (negativos.has(i) ? -1 : 1) * rng.entero(1, 5));
    if (rng.azar() < 0.2) factores[rng.entero(0, n - 1)] = rng.azar() < 0.5 ? 0 : -1;
    if (Math.abs(producto({ factores })) <= MAX_PRODUCTO) return { factores };
  }
}

export const producto = item => item.factores.reduce((p, f) => p * f, 1) || 0;

/** Posiciones de los factores negativos. */
export const posicionesNegativas = item => item.factores.flatMap((f, i) => (f < 0 ? [i] : []));

/** La expresión del ítem: (−2) · 3 · (−1) · (−5). */
export const expresionProducto = item => item.factores.map(fmtPar).join(' · ');

/** Los factores en valor absoluto: 2 · 3 · 1 · 5. */
export const absolutosProducto = item => item.factores.map(Math.abs).join(' · ');

/** Id del error de quien ha fallado el ejercicio 1: `tocados` (posiciones) y `valor` (lo que escribió). */
export function errorProducto(item, tocados, valor) {
  const buenos = posicionesNegativas(item);
  const igual = tocados.length === buenos.length && buenos.every(i => tocados.includes(i));
  if (!igual) return 'cuenta-mal-los-negativos';
  const p = producto(item);
  if (valor === -p && p !== 0) return 'signo-cambiado';
  return 'producto-mal-calculado';
}

// --- Ejercicio 2: potencia de base negativa --------------------------------------

/** Todas las potencias que salen: base de −1 a −10, exponente 2-4 (el 5 solo con −1 y −2), |valor| ≤ 1000. */
export const POTENCIAS = [];
for (let b = -10; b <= -1; b++) {
  for (let n = 2; n <= 5; n++) {
    if (n === 5 && b < -2) continue;
    if (Math.abs(b ** n) <= MAX_VALOR) POTENCIAS.push({ base: b, exp: n });
  }
}

/** Ítem: { base, exp }. La base −1 sale poco: la mitad de las veces se vuelve a sortear. */
export function generarPotencia(rng) {
  let p = rng.elegir(POTENCIAS);
  if (p.base === -1 && rng.azar() < 0.5) p = rng.elegir(POTENCIAS);
  return { ...p };
}

export const valorPotencia = item => item.base ** item.exp;
export const signoPotencia = item => (item.exp % 2 === 0 ? '+' : '−');

/** La potencia como HTML ya construido por quien llama con `html`: texto analizable «(−2)^3». */
export const textoPotencia = (base, exp) => `(${fmt(base)})^${exp}`;

/** Id del error típico que explica lo que escribió el alumno (o 'otro-error-potencia'). */
export function errorPotencia(item, valor) {
  const { base, exp } = item;
  if (valor === potenciaParNegativa(base, exp)) return 'potencia-par-negativa';
  if (valor === potenciaImparPositiva(base, exp)) return 'potencia-impar-positiva';
  if (valor === basePorExponente(base, exp)) return 'base-por-exponente';
  return 'otro-error-potencia';
}

// --- Ejercicio 3: ¿cuál es la base? ----------------------------------------------

/** tipo 'a': (−a)ⁿ · tipo 'b': −aⁿ · tipo 'c': −(−a)ⁿ. */
export const TIPOS_BASE = ['a', 'b', 'c'];

const CASOS_BASE = [];
for (const tipo of TIPOS_BASE) {
  for (let a = 2; a <= 10; a++) {
    for (let n = 2; n <= 4; n++) if (a ** n <= MAX_VALOR) CASOS_BASE.push({ tipo, a, exp: n });
  }
}

/** Ítem: { tipo, a, exp }. */
export function generarBase(rng) {
  return { ...rng.elegir(CASOS_BASE) };
}

/** El texto de la expresión, que `analizar` entiende: «(−3)²», «−3²», «−(−3)²». */
export function textoBase(item) {
  const sup = SUPERINDICE[item.exp];
  if (item.tipo === 'a') return `(${fmt(-item.a)})${sup}`;
  if (item.tipo === 'b') return `${fmt(-item.a)}${sup}`;
  return `${MENOS}(${fmt(-item.a)})${sup}`;
}

export const arbolBase = item => analizar(textoBase(item));
export const valorBase = item => evaluar(arbolBase(item));

/** Ruta de la base dentro del árbol: en (−a)ⁿ es 'base'; con un menos delante, 'arg.base'. */
export const rutaBase = item => (item.tipo === 'a' ? 'base' : 'arg.base');

/** Lo que vale la base: −a en 'a' y 'c', a en 'b'. */
export const baseDeItem = item => evaluar(nodoEn(arbolBase(item), rutaBase(item)));

/** Id del error típico que explica lo que escribió el alumno (o 'otro-error-base'). */
export function errorBase(item, valor) {
  const { tipo, a, exp } = item;
  if (tipo === 'b' && valor === menosEnLaBase(a, exp)) return 'menos-en-la-base';
  if (tipo === 'c' && valor === signosAntesDeLaPotencia(-a, exp)) return 'signos-antes-de-la-potencia';
  if (tipo === 'a') {
    if (valor === potenciaParNegativa(-a, exp)) return 'potencia-par-negativa';
    if (valor === potenciaImparPositiva(-a, exp)) return 'potencia-impar-positiva';
  }
  return 'otro-error-base';
}

// --- Ejercicio 4: cuadrados y raíces ---------------------------------------------

/** Ítem 'cuadrados': { tipo, r, opciones: [enteros ordenados], falsas: [{ valor, error }] }.
 *  Ítem 'raiz' (√r² = □, respuesta r) o 'negativa' (√(−r²), no existe): { tipo, r }. */
export function generarRaiz(rng) {
  const r = rng.entero(1, 12);
  const azar = rng.azar();
  if (azar >= 0.5) return { tipo: azar < 0.85 ? 'raiz' : 'negativa', r };
  const n = r * r;
  // Cada falsa sale de un error: doble de la raíz (base por exponente), el propio
  // cuadrado, o la mitad. Ninguna puede elevar al cuadrado a n.
  const pool = [
    { valor: 2 * r, error: 'base-por-exponente' },
    { valor: -2 * r, error: 'base-por-exponente' },
    { valor: n, error: 'cuadrado-por-raiz' },
    ...(n % 2 === 0 ? [{ valor: n / 2, error: 'mitad-por-raiz' }] : []),
  ].filter(f => f.valor * f.valor !== n);
  const unicas = [...new Map(pool.map(f => [f.valor, f])).values()];
  const falsas = rng.barajar(unicas).slice(0, 3);
  const opciones = [r, -r, ...falsas.map(f => f.valor)].sort((x, y) => x - y);
  return { tipo: 'cuadrados', r, opciones, falsas };
}

/** Las dos respuestas buenas de un ítem 'cuadrados', de menor a mayor. */
export const buenasCuadrados = item => [-item.r, item.r];

export const cuadrado = item => item.r * item.r;

/** Id del error de un ítem 'cuadrados': solo un signo, o la falsa que eligió. */
export function errorCuadrados(item, elegidas) {
  const falsa = item.falsas.find(f => elegidas.includes(f.valor));
  if (falsa) return falsa.error;
  return 'solo-un-signo';
}

/** Id del error de un ítem 'raiz' o 'negativa'. `valor` es el entero escrito, o 'no-existe'. */
export function errorRaiz(item, valor) {
  if (item.tipo === 'raiz') {
    if (valor === 'no-existe') return 'raiz-no-existe';
    if (valor === -item.r) return 'raiz-negativa';
    return 'raiz-mal-calculada';
  }
  if (valor === -item.r) return 'raiz-de-negativo-negativa';
  return 'raiz-de-negativo-positiva';
}

export const esAciertoRaiz = (item, valor) => (item.tipo === 'raiz' ? valor === item.r : valor === 'no-existe');

export { aTexto };
