// Práctica «Criba de Eratóstenes»: textos propios, siempre { es, en }. Los
// comunes (Comprobar, Siguiente, ¡Bien!…) están en `../_comun/textos.js` y
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·», nunca «×»; inglés sencillo; el feedback dice
// qué pasa con los números de ese ítem; el 1 no es primo ni compuesto.

import { factorizar, criterio, CRITERIOS } from '../_comun/aritmetica.js';
import { claseDe, primosAProbar, listaHastaRaiz, datosExplicacionRaiz } from './logica.js';

export const TX = {
  criba: {
    nombre: { es: 'La criba de Eratóstenes', en: 'The sieve of Eratosthenes' },
    detalle: { es: 'Tacha los compuestos hasta encontrar los primos', en: 'Cross out the composite numbers to find the primes' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Vas a construir la criba de Eratóstenes: una tabla del 1 al 100 en la que se tachan los números compuestos hasta que solo quedan los primos.</p>
        <p>En cada paso tachas los múltiplos de un primo (menos él mismo, que no se tacha). Puedes tocar las celdas una a una o arrastrar el dedo por varias seguidas, y después pulsar «Comprobar».</p>`,
      en: `<h2>How it works</h2>
        <p>You are going to build the sieve of Eratosthenes: a 1-to-100 table where composite numbers get crossed out until only the primes are left.</p>
        <p>In each step you cross out the multiples of one prime (not the prime itself). You can tap the cells one by one or drag your finger across several of them, and then press "Check".</p>`,
    },
    ni_primo_ni_compuesto: { es: '1 no es primo ni compuesto', en: '1 is neither prime nor composite' },
    tachar: {
      es: p => `Tacha los <strong>múltiplos de ${p}</strong> que quedan (el ${p} no, que es primo).`,
      en: p => `Cross out the remaining <strong>multiples of ${p}</strong> (not ${p} itself, which is prime).`,
    },
    bien: { es: p => `Esos eran los múltiplos de ${p} que quedaban por tachar.`, en: p => `Those were the remaining multiples of ${p}.` },
    // `ej` = { n, p }: la primera celda que falta, con su cuenta n = p · (n : p).
    mal_faltan: {
      es: (k, ej) => {
        const cuenta = `<span class="cuenta">${ej.n} = ${ej.p} · ${ej.n / ej.p}</span>`;
        return k === 1 ? `Te falta por tachar el ${cuenta}.` : `Te faltan ${k} celdas por tachar, por ejemplo el ${cuenta}.`;
      },
      en: (k, ej) => {
        const cuenta = `<span class="cuenta">${ej.n} = ${ej.p} · ${ej.n / ej.p}</span>`;
        return k === 1 ? `You are missing ${cuenta}.` : `You are missing ${k} cells, for example ${cuenta}.`;
      },
    },
    // `ej` = { n, primo, p }: la primera celda de más y por qué no se tacha.
    mal_sobran: {
      es: (k, ej) => {
        const razon = ej.primo ? 'es primo' : `no es múltiplo de ${ej.p}`;
        return k === 1 ? `Has tachado 1 celda de más: el ${ej.n} ${razon}.` : `Has tachado ${k} celdas de más; por ejemplo, el ${ej.n} ${razon}.`;
      },
      en: (k, ej) => {
        const razon = ej.primo ? 'is prime' : `is not a multiple of ${ej.p}`;
        return k === 1 ? `You crossed out 1 extra cell: ${ej.n} ${razon}.` : `You crossed out ${k} extra cells; for example, ${ej.n} ${razon}.`;
      },
    },
  },
  pregunta11: {
    instruccion: {
      es: 'Después del 7, ¿por qué no hace falta tachar los múltiplos del 11?',
      en: 'After 7, why is there no need to cross out the multiples of 11?',
    },
    opcion: {
      buena: {
        es: 'porque 11 · 11 = 121 ya pasa de 100: sus múltiplos menores ya estaban tachados',
        en: 'because 11 · 11 = 121 is already more than 100: its smaller multiples were already crossed out',
      },
      impar: { es: 'porque el 11 es impar', en: 'because 11 is odd' },
      no_primo: { es: 'porque el 11 no es primo', en: 'because 11 is not prime' },
      por2: { es: 'porque 11 · 2 = 22 ya pasa de 100', en: 'because 11 · 2 = 22 is already more than 100' },
    },
    bien: {
      es: '11 · 11 = 121 ya pasa de 100, así que todos sus múltiplos menores que 100 son también múltiplos de un primo más pequeño, y ya estaban tachados.',
      en: '11 · 11 = 121 is already more than 100, so all its multiples under 100 are also multiples of a smaller prime, and were already crossed out.',
    },
    mal: {
      es: 'Fíjate: 11 · 11 = 121 ya pasa de 100, así que sus múltiplos menores ya estaban tachados por un primo más pequeño.',
      en: 'Look: 11 · 11 = 121 is already more than 100, so its smaller multiples were already crossed out by a smaller prime.',
    },
    final: { es: 'La criba está completa: hay 25 primos menores que 100.', en: 'The sieve is complete: there are 25 primes less than 100.' },
  },
  flash: {
    nombre: { es: '¿Primo o compuesto?', en: 'Prime or composite?' },
    detalle: { es: 'Fichas con números del 1 al 150', en: 'Flashcards with numbers from 1 to 150' },
    pregunta: { es: n => `¿Qué es el ${n}?`, en: n => `What is ${n}?` },
    opcion: {
      primo: { es: 'Primo', en: 'Prime' },
      compuesto: { es: 'Compuesto', en: 'Composite' },
      ninguno: { es: 'Ni primo ni compuesto', en: 'Neither prime nor composite' },
    },
    uno: { es: 'El 1 tiene un solo divisor (él mismo): no es primo ni compuesto.', en: '1 has only one divisor (itself): it is neither prime nor composite.' },
    dos: { es: 'El 2 es primo: es el único primo que es par.', en: '2 is prime: it is the only even prime.' },
    es_primo: { es: n => `${n} es primo`, en: n => `${n} is prime` },
    es_compuesto: { es: n => `${n} es compuesto`, en: n => `${n} is composite` },
    // `lista`: array de primos como texto. «entre 2 ni 3» / «by 2 or 3».
    no_divisible: {
      es: lista => `no es divisible entre ${lista.length > 1 ? `${lista.slice(0, -1).join(', ')} ni ${lista.at(-1)}` : lista[0]}`,
      en: lista => `it is not divisible by ${lista.length > 1 ? `${lista.slice(0, -1).join(', ')} or ${lista.at(-1)}` : lista[0]}`,
    },
    se_pasa: {
      es: (n, p) => `y <span class="cuenta">${p} · ${p} = ${p * p}</span> ya se pasa de ${n}`,
      en: (n, p) => `and <span class="cuenta">${p} · ${p} = ${p * p}</span> is already greater than ${n}`,
    },
    solo_dos: { es: n => `sus únicos divisores son 1 y ${n}`, en: n => `its only divisors are 1 and ${n}` },
  },
  raiz: {
    nombre: { es: '¿Hasta qué primo hay que probar?', en: 'Which primes do you need to try?' },
    detalle: { es: 'Para ver si un número es primo no hace falta probarlos todos', en: 'To check if a number is prime you do not need to try them all' },
    instruccion: {
      es: n => `Para saber si ${n} es primo, ¿cuál es la lista <strong>más corta</strong> de primos que basta probar?`,
      en: n => `To find out if ${n} is prime, which is the <strong>shortest</strong> list of primes that is enough to try?`,
    },
    mitad: { es: n => `todos los primos hasta la mitad de ${n}`, en: n => `all the primes up to half of ${n}` },
    primo_pregunta: { es: '¿Y <strong>es primo</strong>?', en: 'And <strong>is it prime</strong>?' },
    explicacion: {
      es: (n, r, s, ultimo) => `${r} · ${r} = ${r * r} ≤ ${n} < ${s} · ${s} = ${s * s}, así que basta probar hasta el ${ultimo}.`,
      en: (n, r, s, ultimo) => `${r} · ${r} = ${r * r} ≤ ${n} < ${s} · ${s} = ${s * s}, so it is enough to try up to ${ultimo}.`,
    },
  },
};

// ─── Explicaciones del botón «No lo sé» (tarea 184) ─────────────────────────────

const RESPUESTA = {
  es: x => `La respuesta es <strong>${x}</strong>.`,
  en: x => `The answer is <strong>${x}</strong>.`,
};
const REGLA_PRIMO = {
  es: 'Para ver si un número es primo, pruébalo con los primos 2, 3, 5, 7… y para cuando <span class="cuenta">p · p</span> pase de ese número.',
  en: 'To check if a number is prime, try the primes 2, 3, 5, 7… and stop when <span class="cuenta">p · p</span> is more than that number.',
};

/** Por qué un número es primo, compuesto o ninguno (lo usan el feedback y la explicación). */
export function explicarClase(n, clase, { tt, t }) {
  if (clase === 'ninguno') return tt(TX.flash.uno);
  if (clase === 'compuesto') {
    const p = factorizar(n)[0][0];
    const cuenta = `<span class="cuenta">${n} = ${p} · ${n / p}</span>`;
    const pista = CRITERIOS.includes(p) ? ` ${t.fijate} ${tt(criterio(n, p).razon)}.` : '';
    return `${tt(TX.flash.es_compuesto)(n)}: ${cuenta}.${pista}`;
  }
  if (n === 2) return tt(TX.flash.dos);
  const { probados, siguiente } = primosAProbar(n);
  if (!probados.length) return `${tt(TX.flash.es_primo)(n)}: ${tt(TX.flash.solo_dos)(n)}.`;
  return `${tt(TX.flash.es_primo)(n)}: ${tt(TX.flash.no_divisible)(probados.map(String))}, ${tt(TX.flash.se_pasa)(n, siguiente)}.`;
}

/** Ejercicio 2: la regla, el caso del ítem y la clase que el ejercicio da por buena. */
export function explicaFlashcard(item, ctx) {
  const { tt } = ctx;
  const clase = claseDe(item.n);
  const regla = clase === 'ninguno' ? '' : `<p>${tt(REGLA_PRIMO)}</p>`;
  return `${regla}<p>${explicarClase(item.n, clase, ctx)}</p><p>${tt(RESPUESTA)(tt(TX.flash.opcion[clase]))}</p>`;
}

/** Ejercicio 3: por qué basta llegar a la raíz, la lista buena y, si el número es compuesto, su divisor. */
export function explicaRaiz(item, ctx) {
  const { tt } = ctx;
  const { r, ultimo, siguiente } = datosExplicacionRaiz(item.n);
  const lista = listaHastaRaiz(item.n).join(', ');
  const paso1 = `<p>${tt(REGLA_PRIMO)} ${tt(TX.raiz.explicacion)(item.n, r, siguiente, ultimo)}</p>`;
  const segundo = item.compuesto
    ? `<p>${tt(TX.raiz.primo_pregunta)} ${explicarClase(item.n, 'compuesto', ctx)} ${tt({ es: 'No es primo.', en: 'It is not prime.' })}</p>`
    : '';
  return `${paso1}${segundo}<p>${tt(RESPUESTA)(lista)}</p>`;
}
