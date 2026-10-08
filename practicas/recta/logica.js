// Práctica «Múltiplos y divisores en la recta numérica»: lógica pura (sin DOM
// ni red).
//
// Tres ejercicios, con el mismo campo `tipo`:
//   'multiplos'  ejercicio 1: { tipo, n, hasta: 60, correctos }  (correctos incluye el 0)
//   'divisores'  ejercicio 2: { tipo, n, hasta, correctos }      (correctos sin el 0)
//   'vf'         ejercicio 3: { tipo, plantilla, n } o { tipo, plantilla, a, b, verdad }

import { divisores as divisoresDe } from '../_comun/aritmetica.js';

// --- Ejercicio 1: marca los múltiplos --------------------------------------------

const HASTA_MULTIPLOS = 60;

/** Los múltiplos de n entre 0 y 60, con el 0 (nunca se acaban: hay más después de 60). */
function multiplosHasta(n, hasta) {
  const lista = [];
  for (let k = 0; k * n <= hasta; k++) lista.push(k * n);
  return lista;
}

/** Ítem del ejercicio 1: n entre 3 y 12. */
export function generarMultiplos(rng) {
  const n = rng.entero(3, 12);
  return { tipo: 'multiplos', n, hasta: HASTA_MULTIPLOS, correctos: multiplosHasta(n, HASTA_MULTIPLOS) };
}

// --- Ejercicio 2: marca los divisores --------------------------------------------

export const NUMEROS_DIVISORES = [12, 16, 18, 20, 24, 28, 30];

/** Ítem del ejercicio 2: n de la lista fija, recta hasta n + 4. */
export function generarDivisores(rng) {
  const n = rng.elegir(NUMEROS_DIVISORES);
  return { tipo: 'divisores', n, hasta: n + 4, correctos: divisoresDe(n) };
}

// --- Ejercicio 3: verdadero o falso -----------------------------------------------

/** Las ocho frases fijas y si son verdaderas. Ninguna necesita más que `n`. */
const FIJAS = {
  uno_divisor: true, // «1 es divisor de n»
  uno_multiplo: false, // «1 es múltiplo de n» (n > 1)
  cero_multiplo: true, // «0 es múltiplo de n»
  cero_divisor: false, // «0 es divisor de n»: no se puede dividir entre 0
  mult_si_mismo: true, // «n es múltiplo de n»
  div_si_mismo: true, // «n es divisor de n»
  multiplos_se_acaban: false, // «los múltiplos de n se acaban»: no se acaban
  divisores_se_acaban: true, // «los divisores de n se acaban»: sí se acaban
};

function generarFija(rng) {
  const n = rng.entero(2, 30);
  const plantilla = rng.elegir(Object.keys(FIJAS));
  return { tipo: 'vf', plantilla, n, verdad: FIJAS[plantilla] };
}

/**
 * Ítem con dos números y una relación («múltiplo», «divisor» o «divisible»),
 * en los dos órdenes posibles (U2-1C-02: «4 es múltiplo de 12» es falso).
 */
function generarRelacion(rng) {
  let a, b;
  if (rng.azar() < 0.5) {
    const base = rng.entero(2, 12);
    const k = rng.entero(2, 6);
    a = base * k; b = base; // a es múltiplo de b
  } else {
    do {
      a = rng.entero(2, 99);
      b = rng.entero(2, 99);
    } while (a === b || a % b === 0 || b % a === 0); // sin relación en ningún sentido
  }
  if (rng.azar() < 0.5) [a, b] = [b, a]; // el par al revés
  const plantilla = rng.elegir(['multiplo', 'divisor', 'divisible']);
  const verdad = plantilla === 'divisor' ? b % a === 0 : a % b === 0;
  return { tipo: 'vf', plantilla, a, b, verdad };
}

/** Ítem del ejercicio 3: un 60 % con dos números relacionados, el resto, las ocho frases fijas. */
export function generarVF(rng) {
  return rng.azar() < 0.6 ? generarRelacion(rng) : generarFija(rng);
}

// --- Funciones comunes a los tres ejercicios -------------------------------------

/** `generar(ejercicio, rng)`: ejercicio es 1, 2 o 3. */
export function generar(ejercicio, rng) {
  if (ejercicio === 1) return generarMultiplos(rng);
  if (ejercicio === 2) return generarDivisores(rng);
  if (ejercicio === 3) return generarVF(rng);
  throw new Error(`Ejercicio desconocido: ${ejercicio}`);
}

/** `esCorrecta(item, respuesta)`: un array de números marcados (multiplos, divisores) o un booleano (vf). */
export function esCorrecta(item, respuesta) {
  if (item.tipo === 'multiplos' || item.tipo === 'divisores') {
    const marcados = [...respuesta].sort((x, y) => x - y);
    const buenos = [...item.correctos].sort((x, y) => x - y);
    return marcados.length === buenos.length && marcados.every((v, i) => v === buenos[i]);
  }
  if (item.tipo === 'vf') return Boolean(respuesta) === item.verdad;
  throw new Error(`Tipo de ítem desconocido: ${item.tipo}`);
}

function explicarMultiplos(item, respuesta, idioma) {
  const marcados = new Set(respuesta);
  const faltaCero = !marcados.has(0);
  const ultimo = item.correctos.at(-1);
  const siguientes = [ultimo + item.n, ultimo + 2 * item.n, ultimo + 3 * item.n].join(', ');
  const lista = item.correctos.join(', ');
  const sobran = [...marcados].filter(x => x !== 0 && !item.correctos.includes(x)).sort((x, y) => x - y)
    .map(x => (idioma === 'es'
      ? `${x} no es múltiplo de ${item.n}: <span class="cuenta">${x} : ${item.n}</span> no es exacta. `
      : `${x} is not a multiple of ${item.n}: <span class="cuenta">${x} : ${item.n}</span> is not exact. `)).join('');
  if (idioma === 'es') {
    const cero = faltaCero ? `<span class="cuenta">0 = ${item.n} · 0</span>: el 0 es múltiplo de ${item.n} (y de todos los números). ` : '';
    return `${sobran}${cero}Los múltiplos de ${item.n} hasta ${item.hasta} son ${lista}. Y siguen: ${siguientes}… los múltiplos no se acaban.`;
  }
  const cero = faltaCero ? `<span class="cuenta">0 = ${item.n} · 0</span>: 0 is a multiple of ${item.n} (and of every number). ` : '';
  return `${sobran}${cero}The multiples of ${item.n} up to ${item.hasta} are ${lista}. And they carry on: ${siguientes}… multiples never end.`;
}

function explicarDivisores(item, respuesta, idioma) {
  const marcados = new Set(respuesta);
  const lista = item.correctos.join(', ');
  const avisos = [];
  for (const x of [...marcados].filter(v => v !== 0 && !item.correctos.includes(v)).sort((a, b) => a - b)) {
    avisos.push(idioma === 'es'
      ? `${x} no es divisor de ${item.n}: <span class="cuenta">${item.n} : ${x}</span> no es exacta.`
      : `${x} is not a divisor of ${item.n}: <span class="cuenta">${item.n} : ${x}</span> is not exact.`);
  }
  if (marcados.has(0)) {
    avisos.push(idioma === 'es' ? '0 no es divisor de nada: no se puede dividir entre 0.' : '0 is not a divisor of anything: you cannot divide by 0.');
  }
  if (!marcados.has(1)) {
    avisos.push(idioma === 'es' ? `falta el 1: 1 es divisor de ${item.n} (y de todos los números).` : `1 is missing: 1 is a divisor of ${item.n} (and of every number).`);
  }
  if (!marcados.has(item.n)) {
    avisos.push(idioma === 'es' ? `falta el ${item.n}: todo número es divisor de sí mismo.` : `${item.n} is missing: every number is a divisor of itself.`);
  }
  const base = idioma === 'es'
    ? `Los divisores de ${item.n} son ${lista}. Después del ${item.n} ya no hay más: los divisores se acaban.`
    : `The divisors of ${item.n} are ${lista}. After ${item.n} there are no more: divisors run out.`;
  const mayus = a => a.charAt(0).toUpperCase() + a.slice(1);
  return `${avisos.length ? `${avisos.map(mayus).join(' ')} ` : ''}${base}`;
}

const EXPLICACION_FIJA = {
  uno_divisor: { es: n => `1 es divisor de todos los números, también de ${n}: ${n} : 1 = ${n} exacta.`, en: n => `1 is a divisor of every number, including ${n}: ${n} : 1 = ${n} exactly.` },
  uno_multiplo: { es: n => `1 solo es múltiplo de 1, no de ${n}: los múltiplos de ${n} son 0, ${n}, ${2 * n}…, y el 1 no está.`, en: n => `1 is only a multiple of 1, not of ${n}: the multiples of ${n} are 0, ${n}, ${2 * n}…, and 1 is not there.` },
  cero_multiplo: { es: n => `<span class="cuenta">0 = ${n} · 0</span>: el 0 es múltiplo de ${n} (y de todos los números).`, en: n => `<span class="cuenta">0 = ${n} · 0</span>: 0 is a multiple of ${n} (and of every number).` },
  cero_divisor: { es: n => `No se puede dividir ${n} entre 0: el 0 no es divisor de ${n} (ni de ningún número).`, en: n => `You cannot divide ${n} by 0: 0 is not a divisor of ${n} (nor of any number).` },
  mult_si_mismo: { es: n => `<span class="cuenta">${n} = ${n} · 1</span>: todo número es múltiplo de sí mismo.`, en: n => `<span class="cuenta">${n} = ${n} · 1</span>: every number is a multiple of itself.` },
  div_si_mismo: { es: n => `<span class="cuenta">${n} : ${n} = 1</span> exacta: todo número es divisor de sí mismo.`, en: n => `<span class="cuenta">${n} : ${n} = 1</span> exactly: every number is a divisor of itself.` },
  multiplos_se_acaban: { es: n => `Los múltiplos de ${n} no se acaban nunca: siempre hay uno más grande.`, en: n => `The multiples of ${n} never end: there is always a bigger one.` },
  divisores_se_acaban: { es: n => `Los divisores de ${n} son un número limitado: el mayor es ${n} mismo.`, en: n => `The divisors of ${n} are a limited set: the biggest one is ${n} itself.` },
};

function explicarVF(item, idioma) {
  if (item.plantilla in EXPLICACION_FIJA) return EXPLICACION_FIJA[item.plantilla][idioma](item.n);
  const { a, b, plantilla, verdad } = item;
  if (plantilla === 'divisor') {
    return verdad
      ? (idioma === 'es' ? `<span class="cuenta">${b} : ${a} = ${b / a}</span> exacta: ${a} es divisor de ${b}.` : `<span class="cuenta">${b} : ${a} = ${b / a}</span> exactly: ${a} is a divisor of ${b}.`)
      : (idioma === 'es' ? `<span class="cuenta">${b} : ${a}</span> no es exacta: ${a} no es divisor de ${b}.` : `<span class="cuenta">${b} : ${a}</span> is not exact: ${a} is not a divisor of ${b}.`);
  }
  // 'multiplo' y 'divisible' comparten la misma cuenta: a : b.
  return verdad
    ? (idioma === 'es' ? `<span class="cuenta">${a} : ${b} = ${a / b}</span> exacta: ${a} es múltiplo de ${b} (y divisible entre ${b}).` : `<span class="cuenta">${a} : ${b} = ${a / b}</span> exactly: ${a} is a multiple of ${b} (and divisible by ${b}).`)
    : (idioma === 'es' ? `<span class="cuenta">${a} : ${b}</span> no es exacta: ${a} no es múltiplo de ${b} (ni divisible entre ${b}).` : `<span class="cuenta">${a} : ${b}</span> is not exact: ${a} is not a multiple of ${b} (nor divisible by ${b}).`);
}

/** `explicar(item, respuesta, idioma)`: el HTML de la explicación, con los números del ítem. */
export function explicar(item, respuesta, idioma) {
  if (item.tipo === 'multiplos') return explicarMultiplos(item, respuesta, idioma);
  if (item.tipo === 'divisores') return explicarDivisores(item, respuesta, idioma);
  if (item.tipo === 'vf') return explicarVF(item, idioma);
  throw new Error(`Tipo de ítem desconocido: ${item.tipo}`);
}
