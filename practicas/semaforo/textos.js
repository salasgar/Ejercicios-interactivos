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
import { criterio } from '../_comun/aritmetica.js';

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
  // Revisión 193: sin dos puntos entre «es» y la respuesta; «Ninguno», entre comillas, como el botón.
  const buenos = item.correctos.length ? lista(item.correctos, idioma) : (es ? `«${TX.ninguno.es}»` : `“${TX.ninguno.en}”`);
  const fin = es ? `La respuesta es ${buenos}.` : `The answer is ${buenos}.`;
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

const sumar = valores => valores.reduce((s, v) => s + v, 0);
const cuenta = texto => `<span class="cuenta">${texto}</span>`;

/**
 * Ejercicio 4: el criterio de cada divisor aplicado con el hueco dentro, como en los apuntes
 * («4□7 divisible entre 9 → 11 + □ múltiplo de 9 → □ = 7»), y la respuesta al final.
 * Revisión 193: antes decía «prueba cifras hasta que se cumpla», daba la cifra al principio (el feedback empieza
 * por «La cifra que falta es…») y no cerraba con «La respuesta es»; el criterio del 11 hablaba de «las cifras» que
 * se diferencian, no de sus sumas. Que la cifra sea «la única» lo garantiza `generarCifra` (y lo comprueba el test).
 */
export function explicaCifra(item, { idioma }) {
  const es = idioma === 'es';
  const s = item.solucion;
  const completas = item.cifras.map((c, i) => (i === item.hueco ? s : c));
  const n = Number(completas.join(''));
  const ultima = item.hueco === item.cifras.length - 1;
  const conocidas = item.cifras.filter((_, i) => i !== item.hueco);
  let filtro = null; // el 2 o el 5 con el hueco al final: ya solo valen unas cifras
  const pasos = item.divisores.map(d => {
    if (d === 2 || d === 5) {
      if (ultima) {
        filtro = d;
        return es
          ? `Para el ${d}, el hueco es la última cifra: tiene que ser ${d === 2 ? 'par (0, 2, 4, 6 u 8)' : '0 o 5'}.`
          : `For ${d}, the gap is the last digit: it has to be ${d === 2 ? 'even (0, 2, 4, 6 or 8)' : '0 or 5'}.`;
      }
      return es ? `Para el ${d}: ${criterio(n, d).razon.es}; eso ya se cumple.` : `For ${d}: ${criterio(n, d).razon.en}; that is already true.`;
    }
    if (d === 3 || d === 9) {
      const suma = sumar(conocidas);
      const cual = es
        ? { 2: 'la única cifra par que', 5: 'de las dos, la única que' }[filtro] ?? 'la única cifra que'
        : { 2: 'the only even digit that', 5: 'of the two, the only one that' }[filtro] ?? 'the only digit that';
      return es
        ? `Para el ${d}, suma las cifras que ves: ${cuenta(`${conocidas.join(' + ')} = ${suma}`)}. Con el hueco, la suma tiene que ser múltiplo de ${d}, y ${cual} lo consigue es ${s}: ${cuenta(`${suma} + ${s} = ${suma + s}`)}.`
        : `For ${d}, add the digits you can see: ${cuenta(`${conocidas.join(' + ')} = ${suma}`)}. With the gap, the sum has to be a multiple of ${d}, and ${cual} does it is ${s}: ${cuenta(`${suma} + ${s} = ${suma + s}`)}.`;
    }
    // 11: lugar impar = 1.ª, 3.ª… cifra desde la izquierda, como en `criterio`.
    const lugar = p => (p === 0 ? (es ? 'de lugar impar' : 'in odd places') : (es ? 'de lugar par' : 'in even places'));
    const conHueco = item.hueco % 2, sinHueco = 1 - conHueco;
    const terminos = p => item.cifras.map((c, i) => (i === item.hueco ? '□' : String(c))).filter((_, i) => i % 2 === p);
    const sumaDe = p => sumar(completas.filter((_, i) => i % 2 === p));
    const otra = sumaDe(sinHueco), esta = sumaDe(conHueco);
    const resta = `${Math.max(otra, esta)} − ${Math.min(otra, esta)} = ${Math.abs(otra - esta)}`;
    // Con una sola cifra en el grupo (números de tres cifras), «la cifra … es 5», no «las cifras … suman 5».
    const grupo = (p, texto) => (terminos(p).length > 1
      ? (es ? `las cifras ${lugar(p)} suman ${texto}` : `the digits ${lugar(p)} add up to ${texto}`)
      : (es ? `la cifra ${lugar(p)} es ${texto}` : `the digit ${lugar(p)} is ${texto}`));
    const textoOtra = terminos(sinHueco).length > 1 ? `${terminos(sinHueco).join(' + ')} = ${otra}` : `${otra}`;
    return es
      ? `Para el 11: ${grupo(sinHueco, cuenta(textoOtra))}, y ${grupo(conHueco, cuenta(terminos(conHueco).join(' + ')))}. La diferencia tiene que ser múltiplo de 11 (0, 11, 22…), y la única cifra que lo consigue es ${s}: entonces ${grupo(conHueco, esta)}, y ${cuenta(resta)}.`
      : `For 11: ${grupo(sinHueco, cuenta(textoOtra))}, and ${grupo(conHueco, cuenta(terminos(conHueco).join(' + ')))}. The difference has to be a multiple of 11 (0, 11, 22…), and the only digit that does it is ${s}: then ${grupo(conHueco, esta)}, and ${cuenta(resta)}.`;
  });
  const regla = item.divisores.length === 1
    ? (es ? `La cifra del hueco tiene que cumplir el criterio del ${item.divisores[0]}:` : `The digit in the gap has to pass the rule for ${item.divisores[0]}:`)
    : (es ? `La cifra del hueco tiene que cumplir el criterio del ${item.divisores[0]} y el del ${item.divisores[1]}:` : `The digit in the gap has to pass the rules for ${item.divisores[0]} and for ${item.divisores[1]}:`);
  const fin = es ? `La respuesta es ${s} (el número es ${n}).` : `The answer is ${s} (the number is ${n}).`;
  return `<p>${regla}</p><ol class="pasos-ayuda">${pasos.map(p => `<li>${p}</li>`).join('')}</ol><p>${fin}</p>`;
}
