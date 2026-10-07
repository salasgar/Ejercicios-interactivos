// Práctica «Divisores por parejas con rectángulos»: lógica, pura (sin DOM ni
// red). Un rectángulo de área n y ancho w cierra exactamente cuando w divide
// a n, y entonces la pareja de divisores es (w, n/w).

import { esPrimo, parejasDivisores, divisores, raizEntera, PRIMOS } from '../_comun/aritmetica.js';

function rango(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

// --- Ejercicio 1: descubre los rectángulos --------------------------------------

const CUADRADOS_PERFECTOS = [16, 25, 36, 49];
const COMPUESTOS_RECT = rango(12, 60).filter(n => !esPrimo(n) && !CUADRADOS_PERFECTOS.includes(n));

/** Ítem: { tipo: 'rectangulos', n }. n entre 12 y 60, nunca primo; un 20 % cuadrado perfecto. */
export function generarRectangulos(rng) {
  if (rng.azar() < 0.2) return { tipo: 'rectangulos', n: rng.elegir(CUADRADOS_PERFECTOS) };
  return { tipo: 'rectangulos', n: rng.elegir(COMPUESTOS_RECT) };
}

/** Pareja (ordenada menor-mayor) si w divide a n, o null si no. */
export function parPara(w, n) {
  if (n % w !== 0) return null;
  const h = n / w;
  return w <= h ? [w, h] : [h, w];
}

/** Clave textual de una pareja, para no contarla dos veces. */
export function clavePar([a, b]) {
  return `${a}x${b}`;
}

/** Las claves de todas las parejas de divisores de n. */
export function todasLasClaves(n) {
  return parejasDivisores(n).map(clavePar);
}

/** ¿El conjunto de claves encontradas es exactamente el de todas las parejas de n? */
export function sonTodasLasParejas(clavesEncontradas, n) {
  const todas = todasLasClaves(n);
  if (clavesEncontradas.length !== todas.length) return false;
  const propias = new Set(clavesEncontradas);
  return todas.every(c => propias.has(c));
}

// --- Ejercicio 2: banco de divisores --------------------------------------------

const COMPUESTOS_BANCO = rango(20, 120).filter(n => !esPrimo(n));
const TAMANO_BANCO = 12;

/** Ítem: { tipo: 'banco', n, banco, divisoresN }. banco: 12 números distintos barajados. */
export function generarBanco(rng) {
  let n, divs, intentos = 0;
  do {
    n = rng.elegir(COMPUESTOS_BANCO);
    divs = divisores(n);
    intentos++;
  } while ((divs.length > TAMANO_BANCO - 2 || divs.length < 2) && intentos < 50);
  const necesarios = TAMANO_BANCO - divs.length;
  const noDivisores = rango(2, n - 1).filter(x => n % x !== 0);
  const distractores = rng.barajar(noDivisores).slice(0, necesarios);
  const banco = rng.barajar([...divs, ...distractores]);
  return { tipo: 'banco', n, banco, divisoresN: divs };
}

// --- Ejercicio 3: ¿dónde se para? ------------------------------------------------

/** El primero de los primos conocidos que no divide a n. */
function menorPrimoNoDivide(n) {
  return PRIMOS.find(p => n % p !== 0);
}

/** Ítem: { tipo: 'parar', n, opciones, solucion }. opciones: 4 enteros distintos, barajados. */
export function generarParar(rng) {
  const n = rng.elegir(rango(20, 150));
  const r = raizEntera(n);
  const mitad = Math.floor(n / 2);
  const primo = menorPrimoNoDivide(n);
  const opciones = [...new Set([r, mitad, primo])];
  let delta = 1;
  while (opciones.length < 4) {
    for (const candidato of [r + delta, Math.max(1, r - delta)]) {
      if (opciones.length >= 4) break;
      if (candidato !== n && !opciones.includes(candidato)) opciones.push(candidato);
    }
    delta++;
  }
  return { tipo: 'parar', n, opciones: rng.barajar(opciones), solucion: r };
}

/** Ítem: { tipo: 'cuadrado', n, r, opciones, solucion: 1 }. n = r·r, r entre 4 y 12. */
export function generarCuadrado(rng) {
  const r = rng.entero(4, 12);
  const n = r * r;
  return { tipo: 'cuadrado', n, r, opciones: rng.barajar([1, 2, 0, r]), solucion: 1 };
}

/** Mitad y mitad entre los dos tipos del ejercicio 3. */
export function generarParte3(rng) {
  return rng.azar() < 0.5 ? generarParar(rng) : generarCuadrado(rng);
}

export { raizEntera };
