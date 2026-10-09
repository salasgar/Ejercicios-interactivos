// Práctica «Caza el error»: textos propios y el banco de procedimientos.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor», salvo en las plantillas de «lo que NO es un error»; producto con
// «·»; GCD/LCM en inglés, m.c.d./m.c.m. en español; inglés sencillo; sin
// letras como incógnita; el 0 es múltiplo de todo número y el 1 es divisor de
// todo número.
//
// Una plantilla es un procedimiento de alumno de 2 a 4 líneas:
//   { id, error, excluidos?, numeros(rng) → params, lineas(params) → [{ es, en }],
//     corregida(params) | porque(params) → { es, en } }
// `error` es null (el procedimiento está bien) o { linea (desde 0), nombre }.
// Los exponentes se escriben `2^3`; la interfaz los pinta con <sup>.
//
// NO hay plantilla «divisible between» (U2-1B-02): en español su texto sería
// «divisible entre», correcto, y `generar` no sabe en qué idioma se va a ver el
// ítem (la base lo sortea después y además deja ver el otro idioma al responder).
// Queda como propuesta en la terminada.

import { factorizar, valorDe, textoFact, mcd, mcm, divisores, parejasDivisores, esPrimo, PRIMOS, sumaCifras, cifras } from '../_comun/aritmetica.js';

// ─── Nombres de los errores (lista cerrada) ────────────────────────────────────

export const NOMBRES = {
  cruzado: { es: 'Ha cruzado las reglas del m.c.d. y el m.c.m.', en: 'Mixed up the rules for the GCD and the LCM.' },
  mcmComunes: { es: 'Ha calculado el m.c.m. solo con los primos comunes.', en: 'Found the LCM using only the common primes.' },
  potencia: { es: 'Ha tratado la potencia como un producto.', en: 'Treated a power as a product.' },
  ultimaCifra3: { es: 'Ha usado la última cifra para el criterio del 3.', en: 'Used the last digit for the rule for 3.' },
  tres9: { es: 'Ha confundido el criterio del 3 con el del 9.', en: 'Mixed up the rule for 3 with the rule for 9.' },
  sinTerminar: { es: 'Ha dejado un factor compuesto sin descomponer.', en: 'Left a composite factor without breaking it down.' },
  multiploDivisor: { es: 'Ha confundido múltiplo con divisor.', en: 'Mixed up multiple and divisor.' },
  mcdCero: { es: 'Ha dado 0 como m.c.d.', en: 'Gave 0 as the GCD.' },
  olvida1: { es: 'Ha olvidado el 1 o el propio número entre los divisores.', en: 'Forgot 1 or the number itself among the divisors.' },
  minutos: { es: 'Ha sumado los minutos de cien en cien.', en: 'Counted the minutes in hundreds instead of sixties.' },
  imparPrimo: { es: 'Ha dicho que un impar es primo.', en: 'Said an odd number is prime.' },
  trozos: { es: 'Ha dado el m.c.d. como número de trozos.', en: 'Gave the GCD as the number of pieces.' },
};
export const CLAVES_NOMBRES = Object.keys(NOMBRES);

/**
 * Pares de nombres que podrían confundirse sobre un mismo procedimiento: ninguno
 * sale como distractor del otro (regla de oro: todo distractor, inequívocamente falso).
 */
export const CONFUNDIBLES = [
  ['cruzado', 'mcmComunes'],
  ['cruzado', 'trozos'],
  ['mcdCero', 'olvida1'],
  ['potencia', 'sinTerminar'],
  ['tres9', 'ultimaCifra3'],
  // «242 = 2 · 121. Ya no puedo seguir»: 121, 143, 169, 9 y 25 son impares que se dan por primos.
  ['imparPrimo', 'sinTerminar'],
];

// ─── Textos de la interfaz ─────────────────────────────────────────────────────

export const TX = {
  nombre: {
    hay: { es: '¿Hay un error?', en: 'Is there a mistake?' },
    linea: { es: 'Señala el paso', en: 'Point to the step' },
    nombre: { es: 'Nombra el error', en: 'Name the mistake' },
  },
  detalle: {
    hay: { es: 'Un procedimiento de un alumno: ¿está bien o no?', en: 'A student\'s work: is it right or not?' },
    linea: { es: 'Este procedimiento tiene un error: toca la PRIMERA línea que está mal', en: 'This work has a mistake: tap the FIRST line that is wrong' },
    nombre: { es: 'Este procedimiento tiene un error: ¿cuál es?', en: 'This work has a mistake: which one is it?' },
  },
  instruccion: {
    hay: { es: 'Mira el procedimiento. ¿Está bien o hay un error?', en: 'Look at the work. Is it right or is there a mistake?' },
    linea: { es: 'Hay un error. Toca la PRIMERA línea que está mal.', en: 'There is a mistake. Tap the FIRST line that is wrong.' },
    nombre: { es: 'Hay un error. ¿Qué error ha cometido?', en: 'There is a mistake. What mistake was made?' },
  },
  introduccion: {
    es: '<p>Cada ejercicio te enseña el trabajo de un alumno, con las líneas numeradas. Hay trabajos con <strong>un solo error</strong> y trabajos <strong>sin error</strong>.</p><p>Ojo: hay cosas que parecen un error y no lo son (por ejemplo, el orden de los factores no importa).</p>',
    en: '<p>Each exercise shows a student\'s work, with numbered lines. Some work has <strong>exactly one mistake</strong> and some has <strong>no mistake</strong>.</p><p>Careful: some things look like a mistake and are not (for example, the order of the factors does not matter).</p>',
  },
  bien: { es: 'Está bien', en: 'It is right' },
  error: { es: 'Hay un error', en: 'There is a mistake' },
  linea: { es: 'Línea', en: 'Line' },
  esta_bien: { es: 'Está bien: no hay ningún error.', en: 'It is right: there is no mistake.' },
  hay_error_en: { es: n => `Hay un error, en la línea ${n}.`, en: n => `There is a mistake, in line ${n}.` },
  la_linea_es: { es: n => `El error está en la línea ${n}.`, en: n => `The mistake is in line ${n}.` },
  era: { es: 'Era:', en: 'It was:' },
  correcta: { es: 'Bien hecho sería:', en: 'The right way is:' },
};

// ─── Ayudas aritméticas del banco ──────────────────────────────────────────────

const F = n => textoFact(factorizar(n));
const mapa = n => new Map(factorizar(n));
const L = (es, en) => ({ es, en });
const DIV = { es: ':', en: '÷' };

function mcdF(a, b) {
  const A = mapa(a), B = mapa(b);
  return [...A].filter(([p]) => B.has(p)).map(([p, e]) => [p, Math.min(e, B.get(p))]);
}
function mcmF(a, b) {
  const A = mapa(a), B = mapa(b);
  const primos = [...new Set([...A.keys(), ...B.keys()])].sort((x, y) => x - y);
  return primos.map(p => [p, Math.max(A.get(p) ?? 0, B.get(p) ?? 0)]);
}
function comunesMaxF(a, b) {
  const A = mapa(a), B = mapa(b);
  return [...A].filter(([p]) => B.has(p)).map(([p, e]) => [p, Math.max(e, B.get(p))]);
}
const expandir = n => factorizar(n).flatMap(([p, e]) => Array(e).fill(p));
const hm = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const suma = ns => ns.join(' + ');

// Pares de números con todos los primos comunes y exponentes distintos, para que
// «mayor exponente» y «menor exponente» den resultados distintos.
const PARES_COMUNES = [[24, 36], [12, 18], [72, 48], [20, 50], [45, 75], [28, 98], [44, 242], [52, 338]];
// Pares con algún primo que no es común (el m.c.m. necesita todos).
const PARES_NO_COMUNES = [[12, 10], [18, 15], [20, 14], [28, 10], [44, 10], [75, 30]];
const PARES_MIXTOS = [...PARES_COMUNES, ...PARES_NO_COMUNES];
const PARES_SIN_COMUN = [[8, 9], [14, 15], [10, 21], [16, 25], [9, 28], [22, 15], [13, 20], [11, 18]];
const PARES_MULTIPLOS = [[4, 6], [6, 8], [10, 15], [9, 12], [8, 12], [12, 16], [5, 7], [6, 9]];
const PARES_CUERDAS = [[24, 36], [18, 30], [20, 45], [36, 60], [28, 42], [40, 56]];
const IMPARES_COMPUESTOS = [9, 15, 21, 27, 33, 35, 39, 51, 57, 77, 87, 91, 119, 143, 161, 169];
const MULT3_NO9 = [21, 24, 30, 33, 39, 42, 48, 51, 57, 60, 66, 69, 75, 78, 84, 87, 93, 96, 111, 114, 123, 141];
const NO_MULT3_ACABA_3_6_9 = Array.from({ length: 187 }, (_, i) => i + 13)
  .filter(n => [3, 6, 9].includes(n % 10) && sumaCifras(n) % 3 !== 0);
const DIVISORES_DE = [12, 18, 20, 24, 30, 36, 40];
const FACTORIZADOS = [60, 90, 120, 126, 150, 180, 252, 300, 242, 286, 338, 363];
const PRIMOS_PEQUENOS = PRIMOS.filter(p => p >= 11);

/** Una hora de salida y una duración con 120 ≤ m + d < 160 (hacen falta dos horas y pico). */
function numerosMinutos(rng) {
  for (;;) {
    const h = rng.entero(8, 15), m = rng.elegir([40, 45, 50, 55]), d = rng.elegir([80, 85, 90, 95, 100, 105]);
    if (m + d >= 120 && m + d < 160) return { h, m, d };
  }
}

// ─── El banco: 29 plantillas (14 con error, 15 sin error) ───────────────────────

export const PLANTILLAS = [
  // ── Con error ──
  {
    id: 'e-cruzado',
    error: { linea: 1, nombre: 'cruzado' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_COMUNES); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.d. cojo los primos comunes con el mayor exponente: ${textoFact(comunesMaxF(a, b))}`, `For the GCD I take the common primes with the biggest exponent: ${textoFact(comunesMaxF(a, b))}`),
      L(`m.c.d.(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`, `GCD(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`),
    ],
    corregida: ({ a, b }) => L(
      `El m.c.d. coge los primos comunes con el menor exponente: ${textoFact(mcdF(a, b))}. m.c.d.(${a}, ${b}) = ${mcd(a, b)}.`,
      `The GCD takes the common primes with the smallest exponent: ${textoFact(mcdF(a, b))}. GCD(${a}, ${b}) = ${mcd(a, b)}.`),
  },
  {
    id: 'e-mcm-comunes',
    error: { linea: 1, nombre: 'mcmComunes' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_NO_COMUNES); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.m. cojo solo los primos comunes, con el mayor exponente: ${textoFact(comunesMaxF(a, b))}`, `For the LCM I take only the common primes, with the biggest exponent: ${textoFact(comunesMaxF(a, b))}`),
      L(`m.c.m.(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`, `LCM(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`),
    ],
    corregida: ({ a, b }) => L(
      `El m.c.m. coge todos los primos, con el mayor exponente: ${textoFact(mcmF(a, b))}. m.c.m.(${a}, ${b}) = ${mcm(a, b)}.`,
      `The LCM takes all the primes, with the biggest exponent: ${textoFact(mcmF(a, b))}. LCM(${a}, ${b}) = ${mcm(a, b)}.`),
  },
  {
    id: 'e-potencia',
    error: { linea: 1, nombre: 'potencia' },
    numeros: rng => ({ b: rng.elegir([2, 3, 5]), e: rng.elegir([3, 4]), k: rng.elegir([3, 5, 7]) }),
    lineas: ({ b, e, k }) => [
      L(`Calculo ${b}^${e} · ${k}.`, `I work out ${b}^${e} · ${k}.`),
      L(`${b}^${e} = ${b} · ${e} = ${b * e}`, `${b}^${e} = ${b} · ${e} = ${b * e}`),
      L(`${b * e} · ${k} = ${b * e * k}`, `${b * e} · ${k} = ${b * e * k}`),
    ],
    corregida: ({ b, e, k }) => L(
      `${b}^${e} = ${Array(e).fill(b).join(' · ')} = ${b ** e}, y ${b ** e} · ${k} = ${b ** e * k}.`,
      `${b}^${e} = ${Array(e).fill(b).join(' · ')} = ${b ** e}, and ${b ** e} · ${k} = ${b ** e * k}.`),
  },
  {
    id: 'e-ultima-cifra-3',
    error: { linea: 0, nombre: 'ultimaCifra3' },
    numeros: rng => ({ n: rng.elegir(NO_MULT3_ACABA_3_6_9) }),
    lineas: ({ n }) => [
      L(`Criterio del 3: miro la última cifra de ${n}.`, `Rule for 3: I look at the last digit of ${n}.`),
      L(`La última cifra es ${n % 10} y ${n % 10} es divisible entre 3.`, `The last digit is ${n % 10} and ${n % 10} is divisible by 3.`),
      L(`Luego ${n} es divisible entre 3.`, `So ${n} is divisible by 3.`),
    ],
    corregida: ({ n }) => L(
      `El criterio del 3 usa la suma de las cifras: ${suma(cifras(n))} = ${sumaCifras(n)}, y ${sumaCifras(n)} no es divisible entre 3: ${n} no es divisible entre 3.`,
      `The rule for 3 uses the sum of the digits: ${suma(cifras(n))} = ${sumaCifras(n)}, and ${sumaCifras(n)} is not divisible by 3: ${n} is not divisible by 3.`),
  },
  {
    id: 'e-tres-nueve',
    error: { linea: 2, nombre: 'tres9' },
    numeros: rng => ({ n: rng.elegir(MULT3_NO9) }),
    lineas: ({ n }) => [
      L(`Suma de las cifras de ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`, `Sum of the digits of ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`),
      L(`${sumaCifras(n)} es divisible entre 3.`, `${sumaCifras(n)} is divisible by 3.`),
      L(`Luego ${n} es divisible entre 9.`, `So ${n} is divisible by 9.`),
    ],
    corregida: ({ n }) => L(
      `${sumaCifras(n)} no es divisible entre 9, así que ${n} no es divisible entre 9 (sí entre 3).`,
      `${sumaCifras(n)} is not divisible by 9, so ${n} is not divisible by 9 (it is divisible by 3).`),
  },
  {
    id: 'e-sin-terminar',
    error: { linea: 1, nombre: 'sinTerminar' },
    numeros: rng => { const [n, a, b] = rng.elegir([[60, 6, 10], [36, 4, 9], [72, 8, 9], [90, 9, 10], [100, 4, 25], [242, 2, 121], [286, 2, 143], [338, 2, 169], [363, 3, 121]]); return { n, a, b }; },
    lineas: ({ n, a, b }) => [
      L(`${n} = ${a} · ${b}`, `${n} = ${a} · ${b}`),
      L(`Ya no puedo seguir: esa es la factorización en factores primos.`, `I cannot go on: that is the factorisation into prime factors.`),
    ],
    corregida: ({ n, a, b }) => {
      const comp = [a, b].filter(x => !esPrimo(x));
      return L(
        `${comp.join(' y ')} no ${comp.length > 1 ? 'son primos' : 'es primo'}. La factorización en primos es ${n} = ${F(n)}.`,
        `${comp.join(' and ')} ${comp.length > 1 ? 'are' : 'is'} not prime. The factorisation into primes is ${n} = ${F(n)}.`);
    },
  },
  {
    id: 'e-multiplo-divisor-a',
    error: { linea: 1, nombre: 'multiploDivisor' },
    numeros: rng => { const b = rng.entero(2, 13), k = rng.entero(2, 9); return { a: b * k, b, k }; },
    lineas: ({ a, b, k }) => [
      L(`${a} = ${b} · ${k}`, `${a} = ${b} · ${k}`),
      L(`Luego ${b} es múltiplo de ${a}.`, `So ${b} is a multiple of ${a}.`),
    ],
    corregida: ({ a, b }) => L(`${a} es múltiplo de ${b}, y ${b} es divisor de ${a}.`, `${a} is a multiple of ${b}, and ${b} is a divisor of ${a}.`),
  },
  {
    id: 'e-multiplo-divisor-b',
    error: { linea: 1, nombre: 'multiploDivisor' },
    numeros: rng => { const b = rng.entero(2, 13), k = rng.entero(2, 9); return { a: b * k, b, k }; },
    lineas: ({ a, b, k }) => [
      L(`${a} = ${b} · ${k}`, `${a} = ${b} · ${k}`),
      L(`Luego ${a} es divisor de ${b}.`, `So ${a} is a divisor of ${b}.`),
    ],
    corregida: ({ a, b }) => L(`${b} es divisor de ${a}, y ${a} es múltiplo de ${b}.`, `${b} is a divisor of ${a}, and ${a} is a multiple of ${b}.`),
  },
  {
    id: 'e-mcd-cero',
    error: { linea: 2, nombre: 'mcdCero' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_SIN_COMUN); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`Divisores de ${a}: ${divisores(a).join(', ')}`, `Divisors of ${a}: ${divisores(a).join(', ')}`),
      L(`Divisores de ${b}: ${divisores(b).join(', ')}`, `Divisors of ${b}: ${divisores(b).join(', ')}`),
      L(`m.c.d.(${a}, ${b}) = 0`, `GCD(${a}, ${b}) = 0`),
    ],
    corregida: ({ a, b }) => L(
      `El 1 es divisor de los dos números, así que m.c.d.(${a}, ${b}) = 1. El m.c.d. nunca es 0.`,
      `1 is a divisor of both numbers, so GCD(${a}, ${b}) = 1. The GCD is never 0.`),
  },
  {
    id: 'e-olvida-1-n',
    error: { linea: 1, nombre: 'olvida1' },
    numeros: rng => ({ n: rng.elegir(DIVISORES_DE) }),
    lineas: ({ n }) => [
      L(`Parejas: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`, `Pairs: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`),
      L(`Divisores de ${n}: ${divisores(n).slice(1, -1).join(', ')}`, `Divisors of ${n}: ${divisores(n).slice(1, -1).join(', ')}`),
    ],
    corregida: ({ n }) => L(
      `Faltan el 1 y el ${n}: divisores de ${n}: ${divisores(n).join(', ')}.`,
      `1 and ${n} are missing: divisors of ${n}: ${divisores(n).join(', ')}.`),
  },
  {
    id: 'e-olvida-n',
    error: { linea: 1, nombre: 'olvida1' },
    numeros: rng => ({ n: rng.elegir(DIVISORES_DE) }),
    lineas: ({ n }) => [
      L(`Parejas: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`, `Pairs: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`),
      L(`Divisores de ${n}: ${divisores(n).slice(0, -1).join(', ')}`, `Divisors of ${n}: ${divisores(n).slice(0, -1).join(', ')}`),
    ],
    corregida: ({ n }) => L(
      `Falta el propio ${n}: ${n} = 1 · ${n}. Divisores de ${n}: ${divisores(n).join(', ')}.`,
      `${n} itself is missing: ${n} = 1 · ${n}. Divisors of ${n}: ${divisores(n).join(', ')}.`),
  },
  {
    id: 'e-minutos',
    error: { linea: 2, nombre: 'minutos' },
    numeros: numerosMinutos,
    lineas: ({ h, m, d }) => [
      L(`Sale a las ${hm(h, m)} y tarda ${d} minutos.`, `It leaves at ${hm(h, m)} and takes ${d} minutes.`),
      L(`${m} + ${d} = ${m + d} minutos.`, `${m} + ${d} = ${m + d} minutes.`),
      L(`${m + d} minutos son 1 hora y ${m + d - 100} minutos.`, `${m + d} minutes are 1 hour and ${m + d - 100} minutes.`),
      L(`${h} + 1 = ${h + 1}: llega a las ${hm(h + 1, m + d - 100)}.`, `${h} + 1 = ${h + 1}: it arrives at ${hm(h + 1, m + d - 100)}.`),
    ],
    corregida: ({ h, m, d }) => L(
      `${m + d} minutos son 2 horas y ${m + d - 120} minutos (una hora son 60 minutos). Llega a las ${hm(h + 2, m + d - 120)}.`,
      `${m + d} minutes are 2 hours and ${m + d - 120} minutes (one hour is 60 minutes). It arrives at ${hm(h + 2, m + d - 120)}.`),
  },
  {
    id: 'e-impar-primo',
    error: { linea: 1, nombre: 'imparPrimo' },
    numeros: rng => ({ n: rng.elegir(IMPARES_COMPUESTOS) }),
    lineas: ({ n }) => [
      L(`${n} es impar.`, `${n} is odd.`),
      L(`Todo número impar es primo.`, `Every odd number is prime.`),
      L(`Luego ${n} es primo.`, `So ${n} is prime.`),
    ],
    corregida: ({ n }) => {
      const p = factorizar(n)[0][0];
      return L(`Hay impares que no son primos: ${n} = ${p} · ${n / p}.`, `Some odd numbers are not prime: ${n} = ${p} · ${n / p}.`);
    },
  },
  {
    id: 'e-trozos',
    error: { linea: 3, nombre: 'trozos' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_CUERDAS); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`Hay que cortar dos cuerdas, de ${a} m y de ${b} m, en trozos iguales y lo más largos posible. ¿Cuántos trozos salen?`, `Two ropes, ${a} m and ${b} m long, are cut into equal pieces, as long as possible. How many pieces are there?`),
      L(`m.c.d.(${a}, ${b}) = ${mcd(a, b)}`, `GCD(${a}, ${b}) = ${mcd(a, b)}`),
      L(`Cada trozo mide ${mcd(a, b)} m.`, `Each piece is ${mcd(a, b)} m long.`),
      L(`Salen ${mcd(a, b)} trozos.`, `There are ${mcd(a, b)} pieces.`),
    ],
    corregida: ({ a, b }) => {
      const g = mcd(a, b);
      return L(
        `${g} es lo que mide cada trozo, no cuántos salen. Trozos: ${a} ${DIV.es} ${g} + ${b} ${DIV.es} ${g} = ${a / g} + ${b / g} = ${a / g + b / g}.`,
        `${g} is the length of each piece, not how many there are. Pieces: ${a} ${DIV.en} ${g} + ${b} ${DIV.en} ${g} = ${a / g} + ${b / g} = ${a / g + b / g}.`);
    },
  },

  // ── Sin error (incluidos los «no errores» de U2-4C-02) ──
  {
    id: 'b-orden-factores',
    error: null,
    numeros: rng => {
      const n = rng.elegir(FACTORIZADOS), f = factorizar(n);
      let orden = rng.barajar(f);
      while (orden.every(([p], i) => i === 0 || orden[i - 1][0] < p)) orden = rng.barajar(f);
      return { n, orden };
    },
    lineas: ({ n, orden }) => [
      L(`${n} = ${textoFact(orden)}`, `${n} = ${textoFact(orden)}`),
      L(`Compruebo: ${orden.map(([p, e]) => p ** e).join(' · ')} = ${n}`, `I check: ${orden.map(([p, e]) => p ** e).join(' · ')} = ${n}`),
    ],
    porque: ({ n }) => L(
      `El orden de los factores no importa: ${n} = ${F(n)} es lo mismo con los factores en otro orden.`,
      `The order of the factors does not matter: ${n} = ${F(n)} is the same with the factors in another order.`),
  },
  {
    id: 'b-dos-arboles',
    error: null,
    numeros: rng => { const [n, a, b, c, d] = rng.elegir([[36, 4, 9, 6, 6], [60, 6, 10, 4, 15], [72, 8, 9, 6, 12], [90, 9, 10, 6, 15], [48, 6, 8, 4, 12]]); return { n, a, b, c, d }; },
    lineas: ({ n, a, b, c, d }) => [
      L(`Árbol 1: ${n} = ${a} · ${b} = ${[...expandir(a), ...expandir(b)].join(' · ')}`, `Tree 1: ${n} = ${a} · ${b} = ${[...expandir(a), ...expandir(b)].join(' · ')}`),
      L(`Árbol 2: ${n} = ${c} · ${d} = ${[...expandir(c), ...expandir(d)].join(' · ')}`, `Tree 2: ${n} = ${c} · ${d} = ${[...expandir(c), ...expandir(d)].join(' · ')}`),
      L(`Los dos dan ${n} = ${F(n)}.`, `Both give ${n} = ${F(n)}.`),
    ],
    porque: ({ n }) => L(
      `Dos árboles distintos pueden llegar a la misma factorización (${F(n)}): los dos están bien.`,
      `Two different trees can reach the same factorisation (${F(n)}): both are right.`),
  },
  {
    id: 'b-mcd-hcf',
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_MIXTOS); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`m.c.d.(${a}, ${b}) = ${mcd(a, b)}`, `GCD(${a}, ${b}) = ${mcd(a, b)}`),
      L(`En inglés: GCD(${a}, ${b}) = ${mcd(a, b)} o HCF(${a}, ${b}) = ${mcd(a, b)}.`, `Also: HCF(${a}, ${b}) = ${mcd(a, b)}.`),
    ],
    porque: () => L(
      'GCD y HCF son dos nombres de lo mismo (el m.c.d. en inglés): las dos formas están bien.',
      'GCD and HCF are two names for the same thing: both are right.'),
  },
  {
    id: 'b-lcm-nombres',
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_MULTIPLOS); return { a, b }; },
    lineas: ({ a, b }) => {
      const l = mcm(a, b);
      const lista = x => Array.from({ length: l / x }, (_, i) => x * (i + 1)).join(', ');
      return [
        L(`Múltiplos de ${a}: ${lista(a)}`, `Multiples of ${a}: ${lista(a)}`),
        L(`Múltiplos de ${b}: ${lista(b)}`, `Multiples of ${b}: ${lista(b)}`),
        L(`El menor múltiplo común distinto de cero es ${l}: m.c.m.(${a}, ${b}) = ${l}.`, `The smallest common multiple other than zero is ${l}: LCM(${a}, ${b}) = ${l}.`),
        L(`En inglés se dice «lowest common multiple» o «least common multiple».`, `We say 'lowest common multiple' or 'least common multiple'.`),
      ];
    },
    porque: () => L(
      '«Lowest» y «least» common multiple son dos nombres de lo mismo (el m.c.m. en inglés): las dos están bien.',
      '"Lowest" and "least" common multiple are two names for the same thing (the LCM): both are right.'),
  },
  {
    id: 'b-divisible-por',
    error: null,
    numeros: rng => ({ n: rng.elegir(MULT3_NO9) }),
    lineas: ({ n }) => [
      L(`Suma de las cifras de ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`, `Sum of the digits of ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`),
      L(`${sumaCifras(n)} es divisible entre 3, luego ${n} es divisible por 3.`, `${sumaCifras(n)} is divisible by 3, so ${n} is divisible by 3.`),
    ],
    porque: ({ n }) => L(
      `En español, «divisible entre» y «divisible por» valen las dos: ${n} es divisible por 3.`,
      `${n} is divisible by 3: the sum of its digits is ${sumaCifras(n)}.`),
  },
  {
    id: 'b-criterio-3-no-9',
    error: null,
    numeros: rng => ({ n: rng.elegir(MULT3_NO9) }),
    lineas: ({ n }) => [
      L(`Suma de las cifras de ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`, `Sum of the digits of ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`),
      L(`${sumaCifras(n)} es divisible entre 3, pero no entre 9.`, `${sumaCifras(n)} is divisible by 3, but not by 9.`),
      L(`Luego ${n} es divisible entre 3 y no es divisible entre 9.`, `So ${n} is divisible by 3 and it is not divisible by 9.`),
    ],
    porque: ({ n }) => L(
      `Está bien: la suma de las cifras es ${sumaCifras(n)}, múltiplo de 3 y no de 9.`,
      `It is right: the sum of the digits is ${sumaCifras(n)}, a multiple of 3 and not of 9.`),
  },
  {
    id: 'b-factores-11-13',
    error: null,
    numeros: rng => ({ n: rng.elegir([242, 286, 338, 363]) }),
    lineas: ({ n }) => {
      const f = factorizar(n), p = f[0][0], m = n / p;
      return [
        L(`${n} = ${p} · ${m}`, `${n} = ${p} · ${m}`),
        L(`${m} = ${expandir(m).join(' · ')}`, `${m} = ${expandir(m).join(' · ')}`),
        L(`${n} = ${F(n)}`, `${n} = ${F(n)}`),
      ];
    },
    porque: ({ n }) => {
      const grandes = factorizar(n).map(([p]) => p).filter(p => p >= 11);
      const varios = grandes.length > 1;
      return L(
        `Está bien: ${grandes.join(' y ')} ${varios ? 'son primos' : 'es primo'}, así que ${n} = ${F(n)} ya está terminada.`,
        `It is right: ${grandes.join(' and ')} ${varios ? 'are' : 'is'} prime, so ${n} = ${F(n)} is finished.`);
    },
  },
  {
    id: 'b-mcm-ok',
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_NO_COMUNES); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.m. cojo todos los primos, con el mayor exponente: ${textoFact(mcmF(a, b))}`, `For the LCM I take all the primes, with the biggest exponent: ${textoFact(mcmF(a, b))}`),
      L(`m.c.m.(${a}, ${b}) = ${mcm(a, b)}`, `LCM(${a}, ${b}) = ${mcm(a, b)}`),
    ],
    porque: ({ a, b }) => L(
      `Está bien: el m.c.m. coge todos los primos con el mayor exponente, y ${textoFact(mcmF(a, b))} = ${mcm(a, b)}.`,
      `It is right: the LCM takes all the primes with the biggest exponent, and ${textoFact(mcmF(a, b))} = ${mcm(a, b)}.`),
  },
  {
    id: 'b-mcd-ok',
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_MIXTOS); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.d. cojo los primos comunes, con el menor exponente: ${textoFact(mcdF(a, b))}`, `For the GCD I take the common primes, with the smallest exponent: ${textoFact(mcdF(a, b))}`),
      L(`m.c.d.(${a}, ${b}) = ${mcd(a, b)}`, `GCD(${a}, ${b}) = ${mcd(a, b)}`),
    ],
    porque: ({ a, b }) => L(
      `Está bien: el m.c.d. coge los primos comunes con el menor exponente, y ${textoFact(mcdF(a, b))} = ${mcd(a, b)}.`,
      `It is right: the GCD takes the common primes with the smallest exponent, and ${textoFact(mcdF(a, b))} = ${mcd(a, b)}.`),
  },
  {
    id: 'b-divisores-ok',
    error: null,
    numeros: rng => ({ n: rng.elegir(DIVISORES_DE) }),
    lineas: ({ n }) => [
      L(`Parejas: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`, `Pairs: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`),
      L(`Divisores de ${n}: ${divisores(n).join(', ')}`, `Divisors of ${n}: ${divisores(n).join(', ')}`),
    ],
    porque: ({ n }) => L(
      `Está bien: están todas las parejas, con el 1 y el ${n}.`,
      `It is right: all the pairs are there, with 1 and ${n}.`),
  },
  {
    id: 'b-impar-no-primo',
    error: null,
    numeros: rng => ({ n: rng.elegir(IMPARES_COMPUESTOS) }),
    lineas: ({ n }) => {
      const p = factorizar(n)[0][0];
      return [
        L(`${n} es impar, pero ${n} = ${p} · ${n / p}.`, `${n} is odd, but ${n} = ${p} · ${n / p}.`),
        L(`Luego ${n} no es primo.`, `So ${n} is not prime.`),
      ];
    },
    porque: ({ n }) => L(
      `Está bien: impar no quiere decir primo, y ${n} tiene más divisores que el 1 y él mismo.`,
      `It is right: odd does not mean prime, and ${n} has more divisors than 1 and itself.`),
  },
  {
    id: 'b-primo-ok',
    error: null,
    numeros: rng => ({ n: rng.elegir(PRIMOS_PEQUENOS) }),
    lineas: ({ n }) => {
      const probados = PRIMOS.filter(p => p * p <= n), q = PRIMOS.find(p => p * p > n);
      return [
        L(`Pruebo los primos cuyo cuadrado no pasa de ${n}: ${probados.join(', ')}. Ninguno divide a ${n}.`, `I try the primes whose square is not more than ${n}: ${probados.join(', ')}. None of them divides ${n}.`),
        L(`El siguiente es ${q} y ${q} · ${q} = ${q * q}, que ya pasa de ${n}.`, `The next one is ${q} and ${q} · ${q} = ${q * q}, which is already more than ${n}.`),
        L(`Luego ${n} es primo.`, `So ${n} is prime.`),
      ];
    },
    porque: ({ n }) => L(
      `Está bien: basta probar los primos cuyo cuadrado no pasa de ${n}.`,
      `It is right: it is enough to try the primes whose square is not more than ${n}.`),
  },
  {
    id: 'b-razonable',
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_MIXTOS); return { a, b, cantidad: rng.elegir(['mcd', 'mcm']) }; },
    lineas: ({ a, b, cantidad }) => cantidad === 'mcd'
      ? [
        L(`m.c.d.(${a}, ${b}) = ${mcd(a, b)}`, `GCD(${a}, ${b}) = ${mcd(a, b)}`),
        L(`${mcd(a, b)} no pasa de ${Math.min(a, b)}, el menor de los datos: el resultado es razonable.`, `${mcd(a, b)} is not more than ${Math.min(a, b)}, the smaller of the numbers: the answer makes sense.`),
      ]
      : [
        L(`m.c.m.(${a}, ${b}) = ${mcm(a, b)}`, `LCM(${a}, ${b}) = ${mcm(a, b)}`),
        L(`${mcm(a, b)} no es menor que ${Math.max(a, b)}, el mayor de los datos: el resultado es razonable.`, `${mcm(a, b)} is not less than ${Math.max(a, b)}, the bigger of the numbers: the answer makes sense.`),
      ],
    porque: ({ cantidad }) => cantidad === 'mcd'
      ? L('Está bien: el m.c.d. es un divisor de los dos datos, así que no pasa del menor.', 'It is right: the GCD is a divisor of both numbers, so it is not more than the smaller one.')
      : L('Está bien: el m.c.m. es un múltiplo de los dos datos, así que no es menor que el mayor.', 'It is right: the LCM is a multiple of both numbers, so it is not less than the bigger one.'),
  },
  {
    id: 'b-minutos-ok',
    error: null,
    numeros: numerosMinutos,
    lineas: ({ h, m, d }) => [
      L(`Sale a las ${hm(h, m)} y tarda ${d} minutos.`, `It leaves at ${hm(h, m)} and takes ${d} minutes.`),
      L(`${m} + ${d} = ${m + d} minutos.`, `${m} + ${d} = ${m + d} minutes.`),
      L(`${m + d} minutos son 2 horas y ${m + d - 120} minutos.`, `${m + d} minutes are 2 hours and ${m + d - 120} minutes.`),
      L(`${h} + 2 = ${h + 2}: llega a las ${hm(h + 2, m + d - 120)}.`, `${h} + 2 = ${h + 2}: it arrives at ${hm(h + 2, m + d - 120)}.`),
    ],
    porque: ({ m, d }) => L(
      `Está bien: ${m + d} = 60 + 60 + ${m + d - 120}, y una hora son 60 minutos.`,
      `It is right: ${m + d} = 60 + 60 + ${m + d - 120}, and one hour is 60 minutes.`),
  },
];

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));
