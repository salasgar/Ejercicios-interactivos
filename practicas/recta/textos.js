// Práctica «Múltiplos y divisores en la recta»: textos propios, { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

export const TX = {
  ej1: {
    nombre: { es: 'Marca los múltiplos', en: 'Mark the multiples' },
    detalle: { es: 'Toca los múltiplos en la recta del 0 al 60', en: 'Tap the multiples on the 0 to 60 number line' },
    pregunta: { es: n => `Marca los <strong>múltiplos de ${n}</strong> que ves en la recta.`, en: n => `Mark the <strong>multiples of ${n}</strong> on the number line.` },
  },
  ej2: {
    nombre: { es: 'Marca los divisores', en: 'Mark the divisors' },
    detalle: { es: 'Toca los divisores en la recta', en: 'Tap the divisors on the number line' },
    pregunta: { es: n => `Marca los <strong>divisores de ${n}</strong>.`, en: n => `Mark the <strong>divisors of ${n}</strong>.` },
  },
  ej3: {
    nombre: { es: '¿Verdadero o falso?', en: 'True or false?' },
    detalle: { es: 'Frases sobre múltiplos y divisores', en: 'Statements about multiples and divisors' },
    frase: {
      uno_divisor: { es: n => `1 es divisor de ${n}.`, en: n => `1 is a divisor of ${n}.` },
      uno_multiplo: { es: n => `1 es múltiplo de ${n}.`, en: n => `1 is a multiple of ${n}.` },
      cero_multiplo: { es: n => `0 es múltiplo de ${n}.`, en: n => `0 is a multiple of ${n}.` },
      cero_divisor: { es: n => `0 es divisor de ${n}.`, en: n => `0 is a divisor of ${n}.` },
      mult_si_mismo: { es: n => `${n} es múltiplo de ${n}.`, en: n => `${n} is a multiple of ${n}.` },
      div_si_mismo: { es: n => `${n} es divisor de ${n}.`, en: n => `${n} is a divisor of ${n}.` },
      multiplos_se_acaban: { es: n => `Los múltiplos de ${n} se acaban.`, en: n => `The multiples of ${n} eventually run out.` },
      divisores_se_acaban: { es: n => `Los divisores de ${n} se acaban.`, en: n => `The divisors of ${n} eventually run out.` },
      multiplo: { es: (a, b) => `${a} es múltiplo de ${b}.`, en: (a, b) => `${a} is a multiple of ${b}.` },
      divisor: { es: (a, b) => `${a} es divisor de ${b}.`, en: (a, b) => `${a} is a divisor of ${b}.` },
      divisible: { es: (a, b) => `${a} es divisible entre ${b}.`, en: (a, b) => `${a} is divisible by ${b}.` },
    },
  },
};

// ─── «No lo sé» (tarea 183): la explicación de cada ejercicio ─────────────────────────────────────

import { parejasDivisores } from '../_comun/aritmetica.js';
import { explicar } from './logica.js';

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const cuenta = texto => `<span class="cuenta">${texto}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;

/** Ejercicio 1: la tabla del n (empezando en el 0) hasta el final de la recta. */
export function explicaMultiplos(item, { idioma }) {
  const es = idioma === 'es';
  const n = item.n;
  const regla = es
    ? `Los múltiplos de ${n} son los números de su tabla: se empieza en el 0 y se va de ${n} en ${n}.`
    : `The multiples of ${n} are the numbers in its times table: start at 0 and go up in ${n}s.`;
  const salto = `${cuenta(item.correctos.slice(1, 4).map((v, k) => `${n} · ${k + 1} = ${v}`).join('; '))}…`;
  const cero = es ? `El 0 también es múltiplo de ${n}: ${cuenta(`0 = ${n} · 0`)}.` : `0 is also a multiple of ${n}: ${cuenta(`0 = ${n} · 0`)}.`;
  const fin = es
    ? `La respuesta, hasta el ${item.hasta}, es: ${item.correctos.join(', ')}.`
    : `The answer, up to ${item.hasta}, is: ${item.correctos.join(', ')}.`;
  return `${pasos([regla, salto, cero])}${fin}`;
}

/** Ejercicio 2: los divisores salen por parejas, y no pasan del propio número. */
export function explicaDivisores(item, { idioma }) {
  const es = idioma === 'es';
  const n = item.n;
  const parejas = parejasDivisores(n).map(([a, b]) => cuenta(`${a} · ${b} = ${n}`)).join('; ');
  const regla = es
    ? `Un divisor de ${n} es un número entre el que puedes dividir ${n} sin resto. Se buscan por parejas: ${parejas}.`
    : `A divisor of ${n} is a number you can divide ${n} by with no remainder. You find them in pairs: ${parejas}.`;
  const limite = es
    ? `Los divisores no pasan de ${n}: los números de la tabla del ${n}, como ${2 * n} y ${3 * n}, son múltiplos, no divisores. El 0 tampoco: no se puede dividir entre 0.`
    : `Divisors are never bigger than ${n}: the numbers in the ${n} times table, like ${2 * n} and ${3 * n}, are multiples, not divisors. 0 is not one either: you cannot divide by 0.`;
  const fin = es ? `La respuesta es: ${item.correctos.join(', ')}.` : `The answer is: ${item.correctos.join(', ')}.`;
  return `${pasos([regla, limite])}${fin}`;
}

/** Ejercicio 3: la explicación que ya da el feedback, y la respuesta al final. */
export function explicaVF(item, { idioma, t }) {
  const es = idioma === 'es';
  const respuesta = item.verdad ? t.verdadero : t.falso;
  const fin = es ? `La respuesta es «${respuesta}».` : `The answer is “${respuesta}”.`;
  return `<p>${explicar(item, null, idioma)}</p><p>${fin}</p>`;
}
