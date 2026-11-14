// Práctica «Semáforo de divisibilidad»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

export const TX = {
  ninguno: { es: 'Ninguno', en: 'None' },
  ej1: {
    nombre: { es: 'Semáforo básico', en: 'Basic traffic light' },
    detalle: { es: 'Enciende, entre 2, 3, 5, 9 y 10, los que son divisores del número', en: 'Switch on the divisors among 2, 3, 5, 9 and 10' },
    pregunta: { es: n => `¿Entre qué números <strong>es divisible el ${n}</strong>?`, en: n => `Which of these is <strong>${n} divisible by</strong>?` },
  },
  ej2: {
    nombre: { es: 'Con el 11', en: 'With 11' },
    detalle: { es: 'Lo mismo, con el criterio del 11', en: 'The same, with the rule for 11' },
    pregunta: { es: n => `¿Entre qué números <strong>es divisible el ${n}</strong>?`, en: n => `Which of these is <strong>${n} divisible by</strong>?` },
  },
  ej3: {
    nombre: { es: 'Criterios compuestos', en: 'Combined rules' },
    detalle: { es: '¿Es divisible entre 6, 15, 22, 30 o 33?', en: 'Is it divisible by 6, 15, 22, 30 or 33?' },
    pregunta_sino: { es: n => `¿Es <strong>${n} divisible entre __D__</strong>?`, en: n => `Is <strong>${n} divisible by __D__</strong>?` },
    pregunta_trampa: { es: n => `${n} es divisible entre 4 y entre 6. ¿<strong>Es divisible entre 24</strong>?`, en: n => `${n} is divisible by 4 and by 6. <strong>Is it divisible by 24</strong>?` },
  },
  ej4: {
    nombre: { es: 'La cifra que falta', en: 'The missing digit' },
    detalle: { es: 'Encuentra la cifra oculta', en: 'Find the hidden digit' },
    pregunta_uno: { es: d => `es divisible entre ${d}.`, en: d => `is divisible by ${d}.` },
    pregunta_dos: { es: (a, b) => `es divisible entre ${a} y entre ${b}.`, en: (a, b) => `is divisible by ${a} and by ${b}.` },
    instruccion: { es: '¿Qué cifra falta?', en: 'What digit is missing?' },
  },
};

// ─── «No lo sé» (tarea 183): la explicación de cada ejercicio ─────────────────────────────────────
// Reutiliza el paso a paso que ya da el feedback (`explicar`, de `logica.js`) y le pone delante la regla
// y detrás la respuesta, tal como la da por buena el ejercicio.

import { explicar, primosDe } from './logica.js';

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const lista = (valores, idioma) => {
  const y = idioma === 'es' ? ' y ' : ' and ';
  return valores.length < 2 ? valores.join('') : `${valores.slice(0, -1).join(', ')}${y}${valores.at(-1)}`;
};

/** Ejercicios 1 y 2: cada botón con su criterio, y la lista de los que dividen al número. */
export function explicaSemaforo(item, { idioma }) {
  const es = idioma === 'es';
  const regla = es
    ? `Mira cada botón con su criterio de divisibilidad (2, 5 y 10: la última cifra; 3 y 9: la suma de las cifras${item.divisores.includes(11) ? '; 11: las cifras de lugar impar y de lugar par' : ''}):`
    : `Check each button with its divisibility rule (2, 5 and 10: the last digit; 3 and 9: the sum of the digits${item.divisores.includes(11) ? '; 11: the digits in odd and even places' : ''}):`;
  const buenos = item.correctos.length ? lista(item.correctos, idioma) : TX.ninguno[idioma];
  const fin = es ? `La respuesta es: ${buenos}.` : `The answer is: ${buenos}.`;
  return `<p>${regla}</p>${explicar(item, null, idioma)}<p>${fin}</p>`;
}

/** Ejercicio 3: un compuesto se comprueba con sus primos; la trampa del 24, dividiendo. */
export function explicaSino(item, { idioma }) {
  const es = idioma === 'es';
  const respuesta = item.correctos === 'si' ? (es ? 'Sí' : 'Yes') : 'No';
  const regla = item.tipo === 'trampa'
    ? (es ? 'Ser divisible entre 4 y entre 6 no basta para el 24: hay que hacer la división.' : 'Being divisible by 4 and by 6 is not enough for 24: you have to do the division.')
    : (es
      ? `Para el ${item.d} se miran sus primos (${lista(primosDe(item.d), idioma)}): tiene que ser divisible entre todos.`
      : `For ${item.d}, look at its primes (${lista(primosDe(item.d), idioma)}): it has to be divisible by all of them.`);
  const fin = es ? `La respuesta es «${respuesta}».` : `The answer is “${respuesta}”.`;
  return `<p>${regla}</p><p>${explicar(item, item.correctos, idioma)}</p><p>${fin}</p>`;
}

const CRITERIO_CIFRA = {
  es: { 2: 'acabar en cifra par', 5: 'acabar en 0 o en 5', 3: 'que las cifras sumen un múltiplo de 3', 9: 'que las cifras sumen un múltiplo de 9', 11: 'que las cifras de lugar impar y de lugar par se diferencien en un múltiplo de 11' },
  en: { 2: 'ending in an even digit', 5: 'ending in 0 or 5', 3: 'the digits adding up to a multiple of 3', 9: 'the digits adding up to a multiple of 9', 11: 'the digits in odd and even places differing by a multiple of 11' },
};

/** Ejercicio 4: el criterio de cada divisor, la cifra y la comprobación con el número completo. */
export function explicaCifra(item, { idioma }) {
  const es = idioma === 'es';
  const criterios = item.divisores.map(d => `${d}: ${CRITERIO_CIFRA[idioma][d]}`).join('; ');
  const regla = es
    ? `Prueba cifras en el hueco hasta que se cumpla lo que pide cada divisor (${criterios}).`
    : `Try digits in the gap until each divisor’s rule is true (${criterios}).`;
  return `<p>${regla}</p><p>${explicar(item, item.solucion, idioma)}</p>`;
}
