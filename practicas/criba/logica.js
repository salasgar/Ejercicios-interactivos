// Práctica «Criba de Eratóstenes»: lógica pura (sin DOM ni red).
//
// Ejercicio 1 (secuencial): `generarCriba(rng, sesion)` usa `sesion.aciertos`
// para saber en qué paso va (tachar los múltiplos de 2, 3, 5, 7 y, al final,
// la pregunta sobre el 11). Un fallo no cambia `aciertos`, así que el mismo
// paso se repite hasta que se acierta: es la intención, no un error.
//
// Ejercicios 2 y 3: ítems independientes de verdad.

import { esPrimo, PRIMOS, raizEntera, divisores } from '../_comun/aritmetica.js';

// --- Ejercicio 1: la criba, paso a paso ------------------------------------------

export const PASOS = [2, 3, 5, 7];

/** Múltiplos de p mayores que p, hasta 100. */
function multiplosDe(p) {
  const r = [];
  for (let m = 2 * p; m <= 100; m += p) r.push(m);
  return r;
}

/** Celdas ya tachadas por los primos de `previos` (sus múltiplos mayores que ellos). */
export function tachadasPor(previos) {
  const s = new Set();
  for (const p of previos) for (const m of multiplosDe(p)) s.add(m);
  return s;
}

/** En qué paso va la criba: 0-3 tachar múltiplos de 2/3/5/7, 4 la pregunta final. */
export function pasoDe(sesion) {
  return Math.min(sesion?.aciertos ?? 0, PASOS.length);
}

/** Ítem: { tipo: 'tachar', primo, yaTachadas, objetivo } o { tipo: 'pregunta11', opciones }. */
export function generarCriba(rng, sesion) {
  const paso = pasoDe(sesion);
  if (paso < PASOS.length) {
    const primo = PASOS[paso];
    const yaTachadas = tachadasPor(PASOS.slice(0, paso));
    const objetivo = multiplosDe(primo).filter(m => !yaTachadas.has(m));
    return { tipo: 'tachar', primo, yaTachadas: [...yaTachadas].sort((a, b) => a - b), objetivo };
  }
  return { tipo: 'pregunta11', opciones: rng.barajar(['buena', 'impar', 'no_primo', 'por2']) };
}

/** ¿El conjunto tocado es exactamente el objetivo de ese paso? */
export function aciertaTachar(item, tocadas) {
  const a = new Set(tocadas), b = new Set(item.objetivo);
  return a.size === b.size && [...a].every(n => b.has(n));
}

/** Los primos menores que 100 (para pintar la criba completa al terminar). */
export const PRIMOS_HASTA_100 = PRIMOS.filter(p => p < 100);

// --- Ejercicio 2: ¿primo, compuesto o ninguno? (con tramposos) ------------------

/** Compuestos que «parecen primos»: impares que no acaban en 5. */
export const TRAMPOSOS = [51, 57, 87, 91, 119, 133, 143, 121, 111, 117, 123, 129, 141, 147];

const PRIMOS_3_150 = PRIMOS.filter(p => p >= 3 && p <= 150);
const COMPUESTOS_4_150 = Array.from({ length: 147 }, (_, i) => i + 4).filter(n => !esPrimo(n));

/** Ítem: { n }. 30 % tramposos, 5 % el 1, 5 % el 2, 30 % primos, 30 % compuestos. */
export function generarFlashcard(rng) {
  const r = rng.azar();
  if (r < 0.30) return { n: rng.elegir(TRAMPOSOS) };
  if (r < 0.35) return { n: 1 };
  if (r < 0.40) return { n: 2 };
  if (r < 0.70) return { n: rng.elegir(PRIMOS_3_150) };
  return { n: rng.elegir(COMPUESTOS_4_150) };
}

/** 'primo' | 'compuesto' | 'ninguno', por el número de divisores (1, 2 o más de 2). */
export function claseDe(n) {
  const d = divisores(n).length;
  if (d === 1) return 'ninguno';
  return d === 2 ? 'primo' : 'compuesto';
}

/** Para explicar por qué un número es primo: los primos p con p · p ≤ n, y el que ya se pasa. */
export function primosAProbar(n) {
  const hasta = PRIMOS.findIndex(p => p * p > n);
  return { probados: PRIMOS.slice(0, hasta), siguiente: PRIMOS[hasta] };
}

// --- Ejercicio 3: ¿hasta qué primo hay que probar? -------------------------------

const RANGO_RAIZ = Array.from({ length: 151 }, (_, i) => i + 50); // 50..200
const PRIMOS_RANGO = RANGO_RAIZ.filter(esPrimo);
const COMPUESTOS_RANGO = RANGO_RAIZ.filter(n => !esPrimo(n));

/** La lista correcta: los primos p con p · p ≤ n (equivalente a p ≤ raíz entera de n). */
export function listaHastaRaiz(n) {
  const r = raizEntera(n);
  return PRIMOS.filter(p => p <= r);
}

function opcionesDe(rng, n) {
  const correcta = listaHastaRaiz(n);
  const ultimo = correcta.at(-1);
  const siguiente = PRIMOS[PRIMOS.indexOf(ultimo) + 1];
  const masSiguiente = [...correcta, siguiente];
  const menosUltimo = correcta.slice(0, -1);
  return rng.barajar([
    { tipo: 'lista', lista: correcta, correcta: true },
    { tipo: 'lista', lista: masSiguiente, correcta: false },
    { tipo: 'lista', lista: menosUltimo, correcta: false },
    { tipo: 'mitad', correcta: false },
  ]);
}

/** Ítem: { n, compuesto, opciones }. 30 % de los n son compuestos. */
export function generarRaiz(rng) {
  const compuesto = rng.azar() < 0.3;
  const n = compuesto ? rng.elegir(COMPUESTOS_RANGO) : rng.elegir(PRIMOS_RANGO);
  return { n, compuesto, opciones: opcionesDe(rng, n) };
}

/** Los números de la explicación: raíz entera, el primo límite y el siguiente primo. */
export function datosExplicacionRaiz(n) {
  const r = raizEntera(n);
  const correcta = listaHastaRaiz(n);
  const ultimo = correcta.at(-1);
  const siguiente = PRIMOS[PRIMOS.indexOf(ultimo) + 1];
  return { r, ultimo, siguiente };
}
