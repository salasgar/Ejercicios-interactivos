// Práctica «Caza el error»: textos propios y el banco de procedimientos.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor», salvo en las plantillas de «lo que NO es un error»; producto con
// «·»; GCD/LCM en inglés, m.c.d./m.c.m. en español; inglés sencillo; sin
// letras como incógnita; el 0 es múltiplo de todo número y el 1 es divisor de
// todo número.
//
// Una plantilla es un procedimiento de alumno de 2 a 4 líneas:
//   { id, error, excluidos?, enunciado?(params) → { es, en }, numeros(rng) → params, lineas(params) → [{ es, en }],
//     corregida(params) | porque(params) → { es, en } }
// `error` es null (el procedimiento está bien) o { linea (desde 0, en `lineas`), nombre }.
// `enunciado` (22-11): lo que se pide, que el ítem pone delante como primera línea y que NO se puede pulsar.
// Las plantillas sin él ya empiezan por el enunciado («Calcula 2^3 · 5.», «Sale a las…»).
// Los exponentes se escriben `2^3`; la interfaz los pinta con <sup>.
//
// NO hay plantilla «divisible between» (U2-1B-02): en español su texto sería
// «divisible entre», correcto, y `generar` no sabe en qué idioma se va a ver el
// ítem (la base lo sortea después y además deja ver el otro idioma al responder).
// Queda como propuesta en la terminada.

import { esc } from '../_comun/textos.js';
import { errorEnLinea, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';
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

/** La regla que rompe cada error, para recordarla en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  cruzado: { es: 'El m.c.d. coge los primos comunes con el menor exponente, y el m.c.m., todos los primos con el mayor.', en: 'The GCD takes the common primes with the smallest exponent, and the LCM takes all the primes with the biggest one.' },
  mcmComunes: { es: 'El m.c.m. coge todos los primos, comunes y no comunes, con el mayor exponente.', en: 'The LCM takes all the primes, common or not, with the biggest exponent.' },
  potencia: { es: 'Una potencia es un producto de factores iguales: el exponente dice cuántas veces se multiplica la base.', en: 'A power is a product of equal factors: the exponent says how many times you multiply the base.' },
  ultimaCifra3: { es: 'Un número es divisible entre 3 si la suma de sus cifras es múltiplo de 3.', en: 'A number is divisible by 3 if the sum of its digits is a multiple of 3.' },
  tres9: { es: 'Para el 9, la suma de las cifras tiene que ser múltiplo de 9, no de 3.', en: 'For 9, the sum of the digits has to be a multiple of 9, not of 3.' },
  sinTerminar: { es: 'La descomposición en factores primos no termina hasta que todos los factores son primos.', en: 'The factorisation is not finished until all the factors are prime.' },
  multiploDivisor: { es: 'El número grande es múltiplo del pequeño, y el pequeño es divisor del grande.', en: 'The bigger number is a multiple of the smaller one, and the smaller one is a divisor of the bigger one.' },
  mcdCero: { es: 'El 1 es divisor de todos los números, así que el m.c.d. nunca es 0.', en: '1 is a divisor of every number, so the GCD is never 0.' },
  olvida1: { es: 'El 1 y el propio número son siempre divisores de un número.', en: '1 and the number itself are always divisors of a number.' },
  minutos: { es: 'Una hora son 60 minutos, no 100.', en: 'One hour is 60 minutes, not 100.' },
  imparPrimo: { es: 'Un número es primo si solo tiene dos divisores: el 1 y él mismo. Ser impar no basta.', en: 'A number is prime if it has only two divisors: 1 and itself. Being odd is not enough.' },
  trozos: { es: 'El m.c.d. dice cuánto mide cada trozo; para saber cuántos trozos salen, se divide cada cuerda entre el m.c.d.', en: 'The GCD says how long each piece is; to know how many pieces there are, divide each rope by the GCD.' },
};

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
    linea: { es: 'El mismo ejercicio hecho por varios alumnos: toca la PRIMERA línea mala de cada columna con error y di qué error es', en: 'The same exercise done by several students: tap the FIRST wrong line in each column with a mistake and say what it is' },
    nombre: { es: 'Este procedimiento tiene un error: ¿cuál es?', en: 'This work has a mistake: which one is it?' },
  },
  instruccion: {
    hay: { es: 'Mira el procedimiento. ¿Está bien o hay un error?', en: 'Look at the work. Is it right or is there a mistake?' },
    linea: { es: 'Varios alumnos han hecho el mismo ejercicio, cada uno en una columna. Algunas columnas tienen un error. En cada columna que esté mal, toca la <strong>PRIMERA línea</strong> que está mal y pulsa «Comprobar».', en: 'Some students did the same exercise, one in each column. Some columns have a mistake. In each column with a mistake, tap the <strong>FIRST line</strong> that is wrong and press “Check”.' },
    nombre: { es: 'Hay un error. ¿Qué error ha cometido?', en: 'There is a mistake. What mistake was made?' },
  },
  introduccion: {
    es: '<p>Cada ejercicio te enseña el trabajo de un alumno, línea a línea. La primera línea es lo que se pide. Hay trabajos con <strong>un solo error</strong> y trabajos <strong>sin error</strong>.</p><p>Ojo: hay cosas que parecen un error y no lo son (por ejemplo, el orden de los factores no importa).</p>',
    en: '<p>Each exercise shows a student\'s work, line by line. The first line is the question. Some work has <strong>exactly one mistake</strong> and some has <strong>no mistake</strong>.</p><p>Careful: some things look like a mistake and are not (for example, the order of the factors does not matter).</p>',
  },
  // Ejercicio 2 en columnas (JL, 22-11).
  introduccion_columnas: {
    es: '<p>Verás el mismo ejercicio hecho por varios alumnos, cada uno en una columna. Unas columnas están bien y otras tienen <strong>un error</strong>; no se dice cuántas.</p><p><strong>Ejemplo:</strong> Calcula el m.c.d. de 12 y 18.<br>A: 12 = 2<sup>2</sup> · 3 y 18 = 2 · 3<sup>2</sup>. Para el m.c.d. cojo los primos comunes, con el menor exponente: 2 · 3. m.c.d.(12, 18) = 6<br>B: Divisores de 12: 1, 2, 3, 4, 6, 12. Divisores de 18: 1, 2, 3, 6, 9, 18. Divisores comunes: 1, 2, 3, 6. El mayor es 6.<br>C: 12 = 2<sup>2</sup> · 3 y 18 = 2 · 3<sup>2</sup>. Para el m.c.d. cojo los primos comunes con el mayor exponente: 2<sup>2</sup> · 3<sup>2</sup>. m.c.d.(12, 18) = 36</p><p>A y B están bien: hay más de una forma de hacerlo. C está mal en «con el mayor exponente»: para el m.c.d. se coge el menor.</p><p>En cada columna que esté mal, toca la primera línea mala; deja sin tocar las que estén bien y pulsa «Comprobar». Después dirás qué error es.</p>',
    en: '<p>You will see the same exercise done by several students, one in each column. Some columns are right and some have <strong>a mistake</strong>; you are not told how many.</p><p><strong>Example:</strong> Find the GCD of 12 and 18.<br>A: 12 = 2<sup>2</sup> · 3 and 18 = 2 · 3<sup>2</sup>. For the GCD I take the common primes, with the smallest exponent: 2 · 3. GCD(12, 18) = 6<br>B: Divisors of 12: 1, 2, 3, 4, 6, 12. Divisors of 18: 1, 2, 3, 6, 9, 18. Common divisors: 1, 2, 3, 6. The greatest is 6.<br>C: 12 = 2<sup>2</sup> · 3 and 18 = 2 · 3<sup>2</sup>. For the GCD I take the common primes with the biggest exponent: 2<sup>2</sup> · 3<sup>2</sup>. GCD(12, 18) = 36</p><p>A and B are right: there is more than one way to do it. C is wrong in “with the biggest exponent”: for the GCD you take the smallest one.</p><p>In each column with a mistake, tap the first wrong line; leave the right ones alone and press “Check”. Then you will say what the mistake is.</p>',
  },
  bien: { es: 'Está bien', en: 'It is right' },
  error: { es: 'Hay un error', en: 'There is a mistake' },
  esta_bien: { es: 'Está bien: no hay ningún error.', en: 'It is right: there is no mistake.' },
  la_linea_es: { es: 'El error está en esta línea:', en: 'The mistake is in this line:' },
  comprobar: { es: 'Comprobar', en: 'Check' },
  col_bien: { es: 'bien', en: 'right' },
  col_mal: { es: 'error', en: 'mistake' },
  columna: { es: 'Columna', en: 'Column' },
  pregunta_col: { es: l => `¿Qué error hay en la columna ${l}?`, en: l => `What is the mistake in column ${l}?` },
  fallo_cuenta: { es: 'Se ha equivocado al hacer la cuenta.', en: 'Made a mistake in the calculation.' },
};

/** Las letras de las columnas del ejercicio 2. */
export const LETRAS = ['A', 'B', 'C', 'D'];

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

// ─── El banco: 28 plantillas (14 con error, 14 sin error; lo comprueba el test) ───────────────────────

export const PLANTILLAS = [
  // ── Con error ──
  {
    id: 'e-cruzado',
    enunciado: ({ a, b }) => L(`Calcula el m.c.d. de ${a} y ${b}.`, `Find the GCD of ${a} and ${b}.`),
    error: { linea: 1, nombre: 'cruzado' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_COMUNES); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.d. cojo los primos comunes con el mayor exponente: ${textoFact(comunesMaxF(a, b))}`, `For the GCD I take the common primes with the biggest exponent: ${textoFact(comunesMaxF(a, b))}`),
      L(`m.c.d.(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`, `GCD(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`),
    ],
    corregida: ({ a, b }) => L(
      `${textoFact(mcdF(a, b))} = ${mcd(a, b)}, así que m.c.d.(${a}, ${b}) = ${mcd(a, b)}.`,
      `${textoFact(mcdF(a, b))} = ${mcd(a, b)}, so GCD(${a}, ${b}) = ${mcd(a, b)}.`),
  },
  {
    id: 'e-mcm-comunes',
    enunciado: ({ a, b }) => L(`Calcula el m.c.m. de ${a} y ${b}.`, `Find the LCM of ${a} and ${b}.`),
    error: { linea: 1, nombre: 'mcmComunes' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_NO_COMUNES); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`),
      L(`Para el m.c.m. cojo solo los primos comunes, con el mayor exponente: ${textoFact(comunesMaxF(a, b))}`, `For the LCM I take only the common primes, with the biggest exponent: ${textoFact(comunesMaxF(a, b))}`),
      L(`m.c.m.(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`, `LCM(${a}, ${b}) = ${valorDe(comunesMaxF(a, b))}`),
    ],
    corregida: ({ a, b }) => L(
      `${textoFact(mcmF(a, b))} = ${mcm(a, b)}, así que m.c.m.(${a}, ${b}) = ${mcm(a, b)}.`,
      `${textoFact(mcmF(a, b))} = ${mcm(a, b)}, so LCM(${a}, ${b}) = ${mcm(a, b)}.`),
  },
  {
    id: 'e-potencia',
    error: { linea: 1, nombre: 'potencia' },
    numeros: rng => ({ b: rng.elegir([2, 3, 5]), e: rng.elegir([3, 4]), k: rng.elegir([3, 5, 7]) }),
    lineas: ({ b, e, k }) => [
      L(`Calcula ${b}^${e} · ${k}.`, `Work out ${b}^${e} · ${k}.`),
      L(`${b}^${e} = ${b} · ${e} = ${b * e}`, `${b}^${e} = ${b} · ${e} = ${b * e}`),
      L(`${b * e} · ${k} = ${b * e * k}`, `${b * e} · ${k} = ${b * e * k}`),
    ],
    corregida: ({ b, e, k }) => L(
      `${b}^${e} = ${Array(e).fill(b).join(' · ')} = ${b ** e}, y ${b ** e} · ${k} = ${b ** e * k}.`,
      `${b}^${e} = ${Array(e).fill(b).join(' · ')} = ${b ** e}, and ${b ** e} · ${k} = ${b ** e * k}.`),
  },
  {
    id: 'e-ultima-cifra-3',
    enunciado: ({ n }) => L(`¿Es ${n} divisible entre 3?`, `Is ${n} divisible by 3?`),
    error: { linea: 0, nombre: 'ultimaCifra3' },
    numeros: rng => ({ n: rng.elegir(NO_MULT3_ACABA_3_6_9) }),
    lineas: ({ n }) => [
      L(`Criterio del 3: miro la última cifra de ${n}.`, `Rule for 3: I look at the last digit of ${n}.`),
      L(`La última cifra es ${n % 10} y ${n % 10} es divisible entre 3.`, `The last digit is ${n % 10} and ${n % 10} is divisible by 3.`),
      L(`Luego ${n} es divisible entre 3.`, `So ${n} is divisible by 3.`),
    ],
    corregida: ({ n }) => L(
      `${suma(cifras(n))} = ${sumaCifras(n)}, que no es múltiplo de 3, así que ${n} no es divisible entre 3.`,
      `${suma(cifras(n))} = ${sumaCifras(n)}, which is not a multiple of 3, so ${n} is not divisible by 3.`),
  },
  {
    id: 'e-tres-nueve',
    enunciado: ({ n }) => L(`¿Es ${n} divisible entre 9?`, `Is ${n} divisible by 9?`),
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
    enunciado: ({ n }) => L(`Descompón ${n} en factores primos.`, `Write ${n} as a product of prime factors.`),
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
    enunciado: ({ a, b }) => L(`¿Qué relación hay entre ${a} y ${b}?`, `How are ${a} and ${b} related?`),
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
    enunciado: ({ a, b }) => L(`¿Qué relación hay entre ${a} y ${b}?`, `How are ${a} and ${b} related?`),
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
    enunciado: ({ a, b }) => L(`Calcula el m.c.d. de ${a} y ${b}.`, `Find the GCD of ${a} and ${b}.`),
    error: { linea: 2, nombre: 'mcdCero' },
    numeros: rng => { const [a, b] = rng.elegir(PARES_SIN_COMUN); return { a, b }; },
    lineas: ({ a, b }) => [
      L(`Divisores de ${a}: ${divisores(a).join(', ')}`, `Divisors of ${a}: ${divisores(a).join(', ')}`),
      L(`Divisores de ${b}: ${divisores(b).join(', ')}`, `Divisors of ${b}: ${divisores(b).join(', ')}`),
      L(`m.c.d.(${a}, ${b}) = 0`, `GCD(${a}, ${b}) = 0`),
    ],
    corregida: ({ a, b }) => L(
      `El único divisor que tienen en común ${a} y ${b} es el 1, así que m.c.d.(${a}, ${b}) = 1.`,
      `The only divisor that ${a} and ${b} have in common is 1, so GCD(${a}, ${b}) = 1.`),
  },
  {
    id: 'e-olvida-1-n',
    enunciado: ({ n }) => L(`Escribe todos los divisores de ${n}.`, `Write all the divisors of ${n}.`),
    error: { linea: 1, nombre: 'olvida1' },
    numeros: rng => ({ n: rng.elegir(DIVISORES_DE) }),
    lineas: ({ n }) => [
      L(`Parejas: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`, `Pairs: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`),
      L(`Divisores de ${n}: ${divisores(n).slice(1, -1).join(', ')}`, `Divisors of ${n}: ${divisores(n).slice(1, -1).join(', ')}`),
    ],
    corregida: ({ n }) => L(
      `Divisores de ${n}: ${divisores(n).join(', ')}.`,
      `Divisors of ${n}: ${divisores(n).join(', ')}.`),
  },
  {
    id: 'e-olvida-n',
    enunciado: ({ n }) => L(`Escribe todos los divisores de ${n}.`, `Write all the divisors of ${n}.`),
    error: { linea: 1, nombre: 'olvida1' },
    numeros: rng => ({ n: rng.elegir(DIVISORES_DE) }),
    lineas: ({ n }) => [
      L(`Parejas: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`, `Pairs: ${parejasDivisores(n).map(([x, y]) => `${n} = ${x} · ${y}`).join('; ')}`),
      L(`Divisores de ${n}: ${divisores(n).slice(0, -1).join(', ')}`, `Divisors of ${n}: ${divisores(n).slice(0, -1).join(', ')}`),
    ],
    corregida: ({ n }) => L(
      `${n} = 1 · ${n}, así que el ${n} también es divisor. Divisores de ${n}: ${divisores(n).join(', ')}.`,
      `${n} = 1 · ${n}, so ${n} is a divisor too. Divisors of ${n}: ${divisores(n).join(', ')}.`),
  },
  {
    id: 'e-minutos',
    error: { linea: 2, nombre: 'minutos' },
    numeros: numerosMinutos,
    lineas: ({ h, m, d }) => [
      L(`Sale a las ${hm(h, m)} y tarda ${d} minutos. ¿A qué hora llega?`, `It leaves at ${hm(h, m)} and takes ${d} minutes. What time does it arrive?`),
      L(`${m} + ${d} = ${m + d} minutos.`, `${m} + ${d} = ${m + d} minutes.`),
      L(`${m + d} minutos son 1 hora y ${m + d - 100} minutos.`, `${m + d} minutes are 1 hour and ${m + d - 100} minutes.`),
      L(`${h} + 1 = ${h + 1}: llega a las ${hm(h + 1, m + d - 100)}.`, `${h} + 1 = ${h + 1}: it arrives at ${hm(h + 1, m + d - 100)}.`),
    ],
    corregida: ({ h, m, d }) => L(
      `${m + d} minutos son 2 horas y ${m + d - 120} minutos, así que llega a las ${hm(h + 2, m + d - 120)}.`,
      `${m + d} minutes are 2 hours and ${m + d - 120} minutes, so it arrives at ${hm(h + 2, m + d - 120)}.`),
  },
  {
    id: 'e-impar-primo',
    enunciado: ({ n }) => L(`¿Es ${n} un número primo?`, `Is ${n} a prime number?`),
    error: { linea: 1, nombre: 'imparPrimo' },
    numeros: rng => ({ n: rng.elegir(IMPARES_COMPUESTOS) }),
    lineas: ({ n }) => [
      L(`${n} es impar.`, `${n} is odd.`),
      L(`Todo número impar es primo.`, `Every odd number is prime.`),
      L(`Luego ${n} es primo.`, `So ${n} is prime.`),
    ],
    corregida: ({ n }) => {
      const p = factorizar(n)[0][0];
      return L(`${n} = ${p} · ${n / p}, así que ${n} no es primo.`, `${n} = ${p} · ${n / p}, so ${n} is not prime.`);
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
        `Cada trozo mide ${g} m, y salen ${a} ${DIV.es} ${g} + ${b} ${DIV.es} ${g} = ${a / g} + ${b / g} = ${a / g + b / g} trozos.`,
        `Each piece is ${g} m long, and there are ${a} ${DIV.en} ${g} + ${b} ${DIV.en} ${g} = ${a / g} + ${b / g} = ${a / g + b / g} pieces.`);
    },
  },

  // ── Sin error (incluidos los «no errores» de U2-4C-02) ──
  {
    id: 'b-orden-factores',
    enunciado: ({ n }) => L(`Descompón ${n} en factores primos.`, `Write ${n} as a product of prime factors.`),
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
    enunciado: ({ n }) => L(`Descompón ${n} en factores primos.`, `Write ${n} as a product of prime factors.`),
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
    enunciado: ({ a, b }) => L(`Calcula el m.c.d. de ${a} y ${b}.`, `Find the GCD of ${a} and ${b}.`),
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
    enunciado: ({ a, b }) => L(`Calcula el m.c.m. de ${a} y ${b}.`, `Find the LCM of ${a} and ${b}.`),
    error: null,
    numeros: rng => { const [a, b] = rng.elegir(PARES_MULTIPLOS); return { a, b }; },
    lineas: ({ a, b }) => {
      const l = mcm(a, b);
      const lista = x => Array.from({ length: l / x }, (_, i) => x * (i + 1)).join(', ');
      return [
        L(`Múltiplos de ${a}: ${lista(a)}`, `Multiples of ${a}: ${lista(a)}`),
        L(`Múltiplos de ${b}: ${lista(b)}`, `Multiples of ${b}: ${lista(b)}`),
        L(`El menor múltiplo común distinto de cero es ${l}: m.c.m.(${a}, ${b}) = ${l}.`, `The smallest common multiple other than zero is ${l}: LCM(${a}, ${b}) = ${l}.`),
        L(`En inglés se dice «lowest common multiple» o «least common multiple».`, `We say “lowest common multiple” or “least common multiple”.`),
      ];
    },
    porque: () => L(
      '«Lowest» y «least» common multiple son dos nombres de lo mismo (el m.c.m. en inglés): las dos están bien.',
      '“Lowest” and “least” common multiple are two names for the same thing (the LCM): both are right.'),
  },
  {
    id: 'b-divisible-por',
    enunciado: ({ n }) => L(`¿Es ${n} divisible entre 3?`, `Is ${n} divisible by 3?`),
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
    enunciado: ({ n }) => L(`¿Es ${n} divisible entre 3? ¿Y entre 9?`, `Is ${n} divisible by 3? And by 9?`),
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
    enunciado: ({ n }) => L(`Descompón ${n} en factores primos.`, `Write ${n} as a product of prime factors.`),
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
    enunciado: ({ a, b }) => L(`Calcula el m.c.m. de ${a} y ${b}.`, `Find the LCM of ${a} and ${b}.`),
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
    enunciado: ({ a, b }) => L(`Calcula el m.c.d. de ${a} y ${b}.`, `Find the GCD of ${a} and ${b}.`),
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
    enunciado: ({ n }) => L(`Escribe todos los divisores de ${n}.`, `Write all the divisors of ${n}.`),
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
    enunciado: ({ n }) => L(`¿Es ${n} un número primo?`, `Is ${n} a prime number?`),
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
    enunciado: ({ n }) => L(`¿Es ${n} un número primo?`, `Is ${n} a prime number?`),
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
    enunciado: ({ a, b, cantidad }) => (cantidad === 'mcd' ? L(`Calcula el m.c.d. de ${a} y ${b}.`, `Find the GCD of ${a} and ${b}.`) : L(`Calcula el m.c.m. de ${a} y ${b}.`, `Find the LCM of ${a} and ${b}.`)),
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
      L(`Sale a las ${hm(h, m)} y tarda ${d} minutos. ¿A qué hora llega?`, `It leaves at ${hm(h, m)} and takes ${d} minutes. What time does it arrive?`),
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

// ─── Ejercicio 2 en columnas (JL, 22-11): las rutas propias ────────────────────
//
// El mismo enunciado, resuelto por varios alumnos, uno por columna. Las columnas salen de plantillas de arriba
// (sus pasos, sin el enunciado) y de estas rutas, que solo se ven en el ejercicio 2: no cuentan en el banco de
// los ejercicios 1 y 3. Tienen la forma de una plantilla, sin `enunciado` ni `numeros` (los pone la familia, en
// logica.js), y con `vale(params)` si solo tienen sentido con algunos números. Las buenas son OTRA forma correcta
// de hacerlo (no la misma con otras palabras); las malas, un error de NOMBRES con otro procedimiento.
// Ningún paso bueno escribe una igualdad falsa: una división con resto se dice con palabras («el cociente es 47
// y el resto es 2»), no «143 : 3 = 47».

const coma = ns => ns.join(', ');
const yLista = (ns, y) => (ns.length === 1 ? String(ns[0]) : `${ns.slice(0, -1).join(', ')} ${y} ${ns.at(-1)}`);
const comunes = (a, b) => divisores(a).filter(d => b % d === 0);
const multiplosHasta = (x, l) => Array.from({ length: l / x }, (_, i) => x * (i + 1));
const descompone = (a, b) => L(`${a} = ${F(a)} y ${b} = ${F(b)}`, `${a} = ${F(a)} and ${b} = ${F(b)}`);
const listaDivisores = n => L(`Divisores de ${n}: ${coma(divisores(n))}`, `Divisors of ${n}: ${coma(divisores(n))}`);
const sumaDeCifras = n => L(`Suma de las cifras de ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`, `Sum of the digits of ${n}: ${suma(cifras(n))} = ${sumaCifras(n)}.`);
const divido = (n, d) => L(`Divido ${n} entre ${d}: el cociente es ${Math.floor(n / d)} y el resto es ${n % d}.`, `I divide ${n} by ${d}: the quotient is ${Math.floor(n / d)} and the remainder is ${n % d}.`);

/** Un árbol de factores en una columna: «60 = 6 · 10», «6 = 2 · 3 y 10 = 2 · 5», «60 = 2^2 · 3 · 5». */
function arbol(k) {
  const parte = x => (esPrimo(x) ? L(`${x} es primo`, `${x} is prime`) : L(`${x} = ${expandir(x).join(' · ')}`, `${x} = ${expandir(x).join(' · ')}`));
  return {
    id: `c-arbol-${k + 1}`,
    error: null,
    lineas: ({ n, arboles }) => {
      const [c, d] = arboles[k], pc = parte(c), pd = parte(d);
      return [
        L(`${n} = ${c} · ${d}`, `${n} = ${c} · ${d}`),
        L(`${pc.es} y ${pd.es}`, `${pc.en} and ${pd.en}`),
        L(`${n} = ${F(n)}`, `${n} = ${F(n)}`),
      ];
    },
    porque: ({ n, arboles }) => L(
      `Está bien: empezar por ${arboles[k].join(' · ')} es una forma de hacer el árbol, y se sigue hasta que todos los factores son primos: ${n} = ${F(n)}.`,
      `It is right: starting with ${arboles[k].join(' · ')} is one way to make the tree, and it goes on until all the factors are prime: ${n} = ${F(n)}.`),
  };
}

export const RUTAS = [
  // ── m.c.d. (pares con todos los primos comunes) ──
  {
    id: 'c-mcd-divisores',
    error: null,
    lineas: ({ a, b }) => [
      listaDivisores(a),
      listaDivisores(b),
      L(`Divisores comunes: ${coma(comunes(a, b))}. El mayor es ${mcd(a, b)}: m.c.d.(${a}, ${b}) = ${mcd(a, b)}`,
        `Common divisors: ${coma(comunes(a, b))}. The greatest is ${mcd(a, b)}: GCD(${a}, ${b}) = ${mcd(a, b)}`),
    ],
    porque: ({ a, b }) => L(
      `Está bien: ${mcd(a, b)} es el mayor de los divisores comunes (${coma(comunes(a, b))}).`,
      `It is right: ${mcd(a, b)} is the greatest of the common divisors (${coma(comunes(a, b))}).`),
  },
  // ── m.c.d. de dos números sin primos comunes ──
  {
    id: 'c-mcd-1-divisores',
    error: null,
    lineas: ({ a, b }) => [
      listaDivisores(a),
      listaDivisores(b),
      L(`El único divisor común es el 1: m.c.d.(${a}, ${b}) = 1`, `The only common divisor is 1: GCD(${a}, ${b}) = 1`),
    ],
    porque: ({ a, b }) => L(
      `Está bien: el 1 es el único divisor que tienen en común ${a} y ${b}.`,
      `It is right: 1 is the only divisor that ${a} and ${b} have in common.`),
  },
  {
    id: 'c-mcd-1-primos',
    error: null,
    lineas: ({ a, b }) => [
      descompone(a, b),
      L('No tienen ningún primo común.', 'They have no prime in common.'),
      L(`m.c.d.(${a}, ${b}) = 1`, `GCD(${a}, ${b}) = 1`),
    ],
    porque: ({ a, b }) => L(
      `Está bien: ${a} y ${b} no tienen primos comunes, así que su único divisor común es el 1.`,
      `It is right: ${a} and ${b} have no common primes, so their only common divisor is 1.`),
  },
  // ── m.c.m. (pares con algún primo no común) ──
  {
    id: 'c-mcm-multiplos',
    error: null,
    // Las listas, cortas: el m.c.m. es como mucho 7 veces el menor (12 y 10, 18 y 15, 75 y 30).
    vale: ({ a, b }) => mcm(a, b) / Math.min(a, b) <= 7,
    lineas: ({ a, b }) => {
      const l = mcm(a, b);
      return [
        L(`Múltiplos de ${a}: ${coma(multiplosHasta(a, l))}`, `Multiples of ${a}: ${coma(multiplosHasta(a, l))}`),
        L(`Múltiplos de ${b}: ${coma(multiplosHasta(b, l))}`, `Multiples of ${b}: ${coma(multiplosHasta(b, l))}`),
        L(`El menor múltiplo común distinto de cero es ${l}: m.c.m.(${a}, ${b}) = ${l}`, `The smallest common multiple other than zero is ${l}: LCM(${a}, ${b}) = ${l}`),
      ];
    },
    porque: ({ a, b }) => L(
      `Está bien: ${mcm(a, b)} es el primer número que sale en las dos listas.`,
      `It is right: ${mcm(a, b)} is the first number that is in both lists.`),
  },
  {
    id: 'c-mcm-cruzado',
    error: { linea: 1, nombre: 'cruzado' },
    lineas: ({ a, b }) => [
      descompone(a, b),
      L(`Para el m.c.m. cojo los primos comunes, con el menor exponente: ${textoFact(mcdF(a, b))}`, `For the LCM I take the common primes, with the smallest exponent: ${textoFact(mcdF(a, b))}`),
      L(`m.c.m.(${a}, ${b}) = ${mcd(a, b)}`, `LCM(${a}, ${b}) = ${mcd(a, b)}`),
    ],
    corregida: ({ a, b }) => L(
      `${textoFact(mcmF(a, b))} = ${mcm(a, b)}, así que m.c.m.(${a}, ${b}) = ${mcm(a, b)}.`,
      `${textoFact(mcmF(a, b))} = ${mcm(a, b)}, so LCM(${a}, ${b}) = ${mcm(a, b)}.`),
  },
  // ── Descomposición en factores primos: dos árboles distintos son dos columnas buenas ──
  arbol(0),
  arbol(1),
  {
    id: 'c-divisiones',
    error: null,
    lineas: ({ n }) => {
      const pasos = [];
      let x = n;
      for (const p of expandir(n)) { pasos.push([x, p, x / p]); x /= p; }
      const cadena = div => pasos.map(([y, p, z]) => `${y} ${div} ${p} = ${z}`).join('; ');
      return [L(cadena(DIV.es), cadena(DIV.en)), L(`${n} = ${F(n)}`, `${n} = ${F(n)}`)];
    },
    porque: ({ n }) => L(
      `Está bien: ha dividido entre primos hasta llegar a 1, y esos primos son los factores: ${n} = ${F(n)}.`,
      `It is right: dividing by primes until you get 1 gives the factors: ${n} = ${F(n)}.`),
  },
  // ── ¿Es divisible entre 3? (números que no lo son) ──
  {
    id: 'c-div3-suma',
    error: null,
    lineas: ({ n }) => [
      sumaDeCifras(n),
      L(`${sumaCifras(n)} no es múltiplo de 3.`, `${sumaCifras(n)} is not a multiple of 3.`),
      L(`Luego ${n} no es divisible entre 3.`, `So ${n} is not divisible by 3.`),
    ],
    porque: ({ n }) => L(
      `Está bien: la suma de las cifras es ${sumaCifras(n)}, que no es múltiplo de 3.`,
      `It is right: the sum of the digits is ${sumaCifras(n)}, which is not a multiple of 3.`),
  },
  {
    id: 'c-div3-division',
    error: null,
    lineas: ({ n }) => [
      divido(n, 3),
      L(`El resto no es 0, luego ${n} no es divisible entre 3.`, `The remainder is not 0, so ${n} is not divisible by 3.`),
    ],
    porque: ({ n }) => L(
      `Está bien: al dividir ${n} entre 3 sobra ${n % 3}, así que la división no es exacta.`,
      `It is right: when you divide ${n} by 3, ${n % 3} is left over, so the division is not exact.`),
  },
  // ── ¿Es divisible entre 3? ¿Y entre 9? (múltiplos de 3 que no lo son de 9) ──
  {
    id: 'c-3y9-division',
    error: null,
    lineas: ({ n }) => [
      divido(n, 3),
      divido(n, 9),
      L(`Luego ${n} es divisible entre 3 y no es divisible entre 9.`, `So ${n} is divisible by 3 and it is not divisible by 9.`),
    ],
    porque: ({ n }) => L(
      `Está bien: la división entre 3 es exacta, y al dividir entre 9 sobra ${n % 9}.`,
      `It is right: the division by 3 is exact, and when you divide by 9, ${n % 9} is left over.`),
  },
  {
    id: 'c-3y9-tres-nueve',
    error: { linea: 2, nombre: 'tres9' },
    lineas: ({ n }) => [
      sumaDeCifras(n),
      L(`${sumaCifras(n)} es divisible entre 3: ${n} es divisible entre 3.`, `${sumaCifras(n)} is divisible by 3: ${n} is divisible by 3.`),
      L(`Como ${sumaCifras(n)} es divisible entre 3, ${n} también es divisible entre 9.`, `As ${sumaCifras(n)} is divisible by 3, ${n} is divisible by 9 too.`),
    ],
    corregida: ({ n }) => L(
      `${sumaCifras(n)} no es divisible entre 9, así que ${n} es divisible entre 3, pero no entre 9.`,
      `${sumaCifras(n)} is not divisible by 9, so ${n} is divisible by 3, but not by 9.`),
  },
  {
    id: 'c-3y9-ultima-cifra',
    error: { linea: 0, nombre: 'ultimaCifra3' },
    // Solo si la última cifra da la respuesta equivocada (21, 24, 57…): con 33 o 30 acertaría por casualidad.
    vale: ({ n }) => (n % 10) % 3 !== 0,
    lineas: ({ n }) => [
      L(`Criterio del 3: miro la última cifra de ${n}.`, `Rule for 3: I look at the last digit of ${n}.`),
      L(`La última cifra es ${n % 10} y ${n % 10} no es divisible entre 3.`, `The last digit is ${n % 10} and ${n % 10} is not divisible by 3.`),
      L(`Luego ${n} no es divisible entre 3 ni entre 9.`, `So ${n} is not divisible by 3 or by 9.`),
    ],
    corregida: ({ n }) => L(
      `${suma(cifras(n))} = ${sumaCifras(n)}, que es múltiplo de 3 y no de 9, así que ${n} es divisible entre 3 y no entre 9.`,
      `${suma(cifras(n))} = ${sumaCifras(n)}, which is a multiple of 3 and not of 9, so ${n} is divisible by 3 and not by 9.`),
  },
  // ── Todos los divisores ──
  {
    id: 'c-divisores-probando',
    error: null,
    lineas: ({ n }) => [
      L(`Divido ${n} entre 1, 2, 3… hasta ${n}. Son exactas las divisiones entre ${yLista(divisores(n), 'y')}.`,
        `I divide ${n} by 1, 2, 3… up to ${n}. There is no remainder when I divide by ${yLista(divisores(n), 'and')}.`),
      listaDivisores(n),
    ],
    porque: ({ n }) => L(
      `Está bien: ha probado todos los números del 1 al ${n}.`,
      `It is right: all the numbers from 1 to ${n} were tried.`),
  },
  // ── ¿Es primo? (impares compuestos) ──
  {
    id: 'c-primo-divisores',
    error: null,
    lineas: ({ n }) => [
      listaDivisores(n),
      L(`Tiene más de dos divisores, luego ${n} no es primo.`, `It has more than two divisors, so ${n} is not prime.`),
    ],
    porque: ({ n }) => L(
      `Está bien: ${n} tiene ${divisores(n).length} divisores.`,
      `It is right: ${n} has ${divisores(n).length} divisors.`),
  },
  // ── Las horas ──
  {
    id: 'c-minutos-horas-primero',
    error: null,
    lineas: ({ h, m, d }) => [
      L(`${d} minutos son 1 hora y ${d - 60} minutos.`, `${d} minutes are 1 hour and ${d - 60} minutes.`),
      L(`Una hora después de las ${hm(h, m)} son las ${hm(h + 1, m)}.`, `One hour after ${hm(h, m)} it is ${hm(h + 1, m)}.`),
      L(`Llega ${d - 60} minutos después de las ${hm(h + 1, m)}: a las ${hm(h + 2, m + d - 120)}.`, `It arrives ${d - 60} minutes after ${hm(h + 1, m)}: at ${hm(h + 2, m + d - 120)}.`),
    ],
    porque: ({ d }) => L(
      `Está bien: primero ha pasado los ${d} minutos a 1 hora y ${d - 60} minutos, y después los ha sumado.`,
      `It is right: first the ${d} minutes were changed into 1 hour and ${d - 60} minutes, and then they were added.`),
  },
  {
    id: 'c-minutos-hasta-la-hora',
    error: null,
    lineas: ({ h, m, d }) => [
      L(`De las ${hm(h, m)} a las ${hm(h + 1, 0)} hay ${60 - m} minutos.`, `From ${hm(h, m)} to ${hm(h + 1, 0)} there are ${60 - m} minutes.`),
      L(`Quedan ${d} − ${60 - m} = ${m + d - 60} minutos, que son 1 hora y ${m + d - 120} minutos.`, `There are ${d} − ${60 - m} = ${m + d - 60} minutes left, which are 1 hour and ${m + d - 120} minutes.`),
      L(`Llega a las ${hm(h + 2, m + d - 120)}.`, `It arrives at ${hm(h + 2, m + d - 120)}.`),
    ],
    porque: ({ h, m }) => L(
      `Está bien: primero ha llegado hasta las ${hm(h + 1, 0)} (${60 - m} minutos) y después ha sumado lo que queda.`,
      `It is right: first it went up to ${hm(h + 1, 0)} (${60 - m} minutes) and then it added the rest.`),
  },
  // ── Múltiplo y divisor ──
  {
    id: 'c-relacion-multiplo',
    error: null,
    lineas: ({ a, b, k }) => [
      L(`${a} = ${b} · ${k}`, `${a} = ${b} · ${k}`),
      L(`Luego ${a} es múltiplo de ${b}.`, `So ${a} is a multiple of ${b}.`),
    ],
    porque: ({ a, b, k }) => L(`Está bien: ${a} es ${b} multiplicado por ${k}.`, `It is right: ${a} is ${b} times ${k}.`),
  },
  {
    id: 'c-relacion-divisor',
    error: null,
    lineas: ({ a, b }) => [
      divido(a, b),
      L(`Luego ${b} es divisor de ${a}.`, `So ${b} is a divisor of ${a}.`),
    ],
    porque: ({ a, b }) => L(`Está bien: la división de ${a} entre ${b} es exacta.`, `It is right: the division of ${a} by ${b} is exact.`),
  },
];
export const RUTA_POR_ID = Object.fromEntries(RUTAS.map(r => [r.id, r]));
/** Una ruta de columna: una plantilla del banco o una ruta propia. */
export const rutaDe = id => PLANTILLA_POR_ID[id] ?? RUTA_POR_ID[id];

// ─── El fallo de cuenta en las columnas (JL, 23-11) ────────────────────────────
//
// Un error que no está en NOMBRES: aplica bien el método y se equivoca en la última cuenta. Su columna no lleva
// pregunta tipo test ni regla en negrita. Solo sale de las rutas buenas cuya última línea es una cuenta: el producto
// de potencias del m.c.d. y del m.c.m. y la suma de las horas. No de una lista de divisores o de múltiplos (quitar
// un divisor es «ha olvidado el 1 o el propio número»), ni de una factorización, ni de un sí/no de divisibilidad.
//
// Por ruta: la cuenta (lo que se opera), su valor bueno, la última línea con un valor cualquiera, los valores
// cercanos que puede dar el despiste y los que NO puede dar porque son los de un error con nombre aplicado a esa
// cuenta (o el resultado de otra columna de la familia): con ellos la columna se leería como otro error.

export const CUENTA = 'fallo-de-cuenta';

/** «2^3 · 3» como si la potencia fuera un producto (2 · 3 · 3 = 18): lo que da el error «potencia». */
const comoProducto = f => f.reduce((v, [p, e]) => v * (e > 1 ? p * e : p), 1);
/** ±1 y ±2, y ±10 si el resultado tiene ya dos cifras (2 · 3 = 16 no es un despiste creíble). */
const cercanos = n => [1, -1, 2, -2, ...(n >= 20 ? [10, -10] : [])].map(d => n + d).filter(x => x >= 2);

export const CUENTAS = {
  'b-mcd-ok': {
    cuenta: ({ a, b }) => textoFact(mcdF(a, b)),
    bien: ({ a, b }) => mcd(a, b),
    ultima: ({ a, b }, x) => L(`m.c.d.(${a}, ${b}) = ${x}`, `GCD(${a}, ${b}) = ${x}`),
    cercanos: ({ a, b }) => cercanos(mcd(a, b)),
    // Cruzado (los comunes con el mayor exponente, o el m.c.m.), la potencia como producto, el m.c.d. 0, y ni el 1
    // (parecería que no tienen primos comunes) ni uno de los datos.
    conNombre: ({ a, b }) => [valorDe(comunesMaxF(a, b)), mcm(a, b), comoProducto(mcdF(a, b)), 0, 1, a, b],
  },
  'b-mcm-ok': {
    cuenta: ({ a, b }) => textoFact(mcmF(a, b)),
    bien: ({ a, b }) => mcm(a, b),
    ultima: ({ a, b }, x) => L(`m.c.m.(${a}, ${b}) = ${x}`, `LCM(${a}, ${b}) = ${x}`),
    cercanos: ({ a, b }) => cercanos(mcm(a, b)),
    // Cruzado (el m.c.d.), solo los comunes, la potencia como producto, y ni el producto de los datos ni uno de ellos.
    conNombre: ({ a, b }) => [mcd(a, b), valorDe(comunesMaxF(a, b)), comoProducto(mcmF(a, b)), a * b, a, b],
  },
  'b-minutos-ok': {
    cuenta: ({ h }) => `${h} + 2`,
    bien: ({ h }) => h + 2,
    ultima: ({ h, m, d }, x) => L(`${h} + 2 = ${x}: llega a las ${hm(x, m + d - 120)}.`, `${h} + 2 = ${x}: it arrives at ${hm(x, m + d - 120)}.`),
    cercanos: ({ h }) => [1, -1, 2, -2].map(dif => h + 2 + dif),
    // h + 1 es la hora del error «de cien en cien» (e-minutos), y h, no haber sumado nada.
    conNombre: ({ h }) => [h + 1, h],
  },
};

/** «2^2 · 3 = 12, no 13.»: la cuenta de la columna bien hecha. */
export const porqueCuenta = (c, params) => {
  const k = CUENTAS[c.ruta], op = k.cuenta(params);
  return L(`${op} = ${c.cuenta.bien}, no ${c.cuenta.mal}.`, `${op} = ${c.cuenta.bien}, not ${c.cuenta.mal}.`);
};

// ─── La explicación del ítem (feedback de acierto/fallo y botón «No lo sé») ────
//
// Con error (JL, 22-11): la línea con ordinal y sin su número delante («El error está en la tercera línea:»), el
// error como frase, la regla rota en negrita y lo correcto. Sin «Se llama:» ni números de línea.

/** Texto de una línea a HTML seguro, con los exponentes `2^3` como <sup>. */
export const html = texto => esc(texto).replace(/\^(\d+)/g, '<sup>$1</sup>');

/** Minúscula tras dos puntos, sin tocar siglas (GCD, LCM). */
const minuscula = txt => (/^[A-ZÁÉÍÓÚ][a-záéíóúñ]/.test(txt) ? txt[0].toLowerCase() + txt.slice(1) : txt);
/** Comillas inglesas “” en lugar de las rectas que traen algunos `porque`. */
const comillasIn = txt => txt.replace(/"([^"]+)"/g, '“$1”');

/** La línea mala del ítem, en un <span>, sin número. */
const lineaMala = (item, tt) => `<span class="linea-mala">${html(tt(item.lineas[item.error.linea]))}</span>`;
/** «Lo correcto es: …» con la cuenta bien hecha de la plantilla. */
const loCorrecto = (item, tt) => `${tt(LO_CORRECTO)} ${html(minuscula(tt(PLANTILLA_POR_ID[item.plantilla].corregida(item.params))))}`;
const regla = (item, tt) => reglaEnNegrita(esc(tt(REGLAS[item.error.nombre])));
const nombre = (item, tt) => esc(tt(NOMBRES[item.error.nombre]));

/** La explicación del ítem, con sus números: dónde está el error y cómo se hace bien, o por qué no era error. */
export function explicaItem(item, { tt, idioma }) {
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  if (!item.error) {
    // Los `porque` ya empiezan por «Está bien: …»: no se repite el arranque.
    const porque = tt(plantilla.porque(item.params));
    return /^(Está bien|It is right)/.test(porque) ? html(porque) : `${tt(TX.esta_bien)} ${html(porque)}`;
  }
  return `${errorEnLinea(item.error.linea, idioma)} ${lineaMala(item, tt)}<br>${nombre(item, tt)}${regla(item, tt)}${loCorrecto(item, tt)}`;
}

// ─── «No lo sé»: la regla del ejercicio, la línea mala y cómo se hace bien, y la respuesta (tarea 193) ───
//
// La tarjeta lleva delante cómo se busca el error y al final la respuesta, una sola vez. En el ej. 3 la respuesta es
// el nombre del error, así que en el cuerpo no sale. La del ej. 2 (columnas) está al final del fichero.

const REGLA = {
  hay: { es: 'Repasa cada línea: sus cuentas y la regla que usa. Si alguna falla, hay un error.', en: 'Check each line: its calculations and the rule it uses. If one of them fails, there is a mistake.' },
  nombre: { es: 'Busca la línea mala y compárala con cómo se hace bien: lo que cambia da el nombre del error.', en: 'Find the wrong line and compare it with the right way: what is different gives the name of the mistake.' },
  columnas: { es: 'Repasa cada columna en orden y para en la primera línea cuya cuenta o regla falla. Una columna puede estar bien aunque lo haga de otra forma.', en: 'Check each column in order and stop at the first line with a wrong calculation or a wrong rule. A column can be right even if it does it another way.' },
};
const RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cierre = (idioma, txt) => `<br>${RESPUESTA[idioma]} <strong>${txt}</strong>.`;
const entreComillas = (idioma, txt) => (idioma === 'es' ? `«${txt}»` : `“${txt}”`);
/** «Ha tratado la potencia como un producto.» → sin el punto final (sí el de «m.c.m.»), que va fuera de las comillas. */
const sinPunto = txt => txt.replace(/(?<!m\.c\.[dm])\.$/, '');

/** Sin error: el porqué de la plantilla sin su «Está bien:» (la respuesta ya lo dice al final). */
function porQueEstaBien(item, { tt }) {
  const porque = comillasIn(tt(PLANTILLA_POR_ID[item.plantilla].porque(item.params))).replace(/^(Está bien|It is right): /, '');
  return html(porque[0].toUpperCase() + porque.slice(1));
}

/** Ejercicio 1: ¿está bien o hay un error? */
export function explicaHay(item, ctx) {
  const { tt, idioma } = ctx;
  const cuerpo = item.error
    ? `${errorEnLinea(item.error.linea, idioma)} ${lineaMala(item, tt)}<br>${nombre(item, tt)}${regla(item, tt)}${loCorrecto(item, tt)}`
    : porQueEstaBien(item, ctx);
  return `${tt(REGLA.hay)}<br>${cuerpo}${cierre(idioma, entreComillas(idioma, esc(tt(item.error ? TX.error : TX.bien))))}`;
}

/** Ejercicio 3: el nombre del error. */
export function explicaNombre(item, ctx) {
  const { tt, idioma } = ctx;
  const resp = entreComillas(idioma, esc(sinPunto(tt(NOMBRES[item.solucion]))));
  return `${tt(REGLA.nombre)}<br>${errorEnLinea(item.error.linea, idioma)} ${lineaMala(item, tt)}${regla(item, tt)}${loCorrecto(item, tt)}${cierre(idioma, resp)}`;
}

// ─── Ejercicio 2 en columnas: la explicación columna a columna ─────────────────
//
// La línea mala se cita, sin ordinal: en una columna, «la segunda línea» contaría el enunciado, que va arriba.

/**
 * El feedback del ejercicio 2: cada columna, si está bien (y por qué) o su línea mala, el error, la regla rota en
 * negrita y lo correcto.
 */
export function explicacionColumnas(item, { tt }) {
  return item.columnas.map((c, j) => {
    const r = rutaDe(c.ruta);
    const cabeza = `<strong>${tt(TX.columna)} ${LETRAS[j]}.</strong>`;
    if (!c.error) {
      const porque = comillasIn(tt(r.porque(item.params)));
      const txt = /^(Está bien|It is right)/.test(porque) ? html(porque) : `${tt(TX.esta_bien)} ${html(porque)}`;
      return `<p class="columna-explica">${cabeza} ${txt}</p>`;
    }
    const mala = `<p class="columna-explica">${cabeza} ${tt(TX.la_linea_es)} <span class="linea-mala">${html(tt(c.lineas[c.falsa]))}</span>`;
    // El fallo de cuenta no tiene nombre en el catálogo ni regla rota: solo la cuenta bien hecha (JL, 23-11).
    if (c.error === CUENTA) {
      const correcta = tt(CUENTAS[c.ruta].ultima(item.params, c.cuenta.bien)).replace(/([^.])$/, '$1.');
      return `${mala}<br>${esc(tt(TX.fallo_cuenta))}<br>${html(tt(porqueCuenta(c, item.params)))}`
        + `<br>${tt(LO_CORRECTO)} ${html(minuscula(correcta))}</p>`;
    }
    return `${mala}<br>${esc(tt(NOMBRES[c.error]))}${reglaEnNegrita(esc(tt(REGLAS[c.error])))}`
      + `${tt(LO_CORRECTO)} ${html(minuscula(tt(r.corregida(item.params))))}</p>`;
  }).join('');
}

/** Las columnas malas: «la columna B» / «las columnas B y D» (en inglés, «column B» / «columns B and D»). */
function columnasMalas(item, idioma) {
  const l = item.columnas.map((c, j) => (c.error ? LETRAS[j] : null)).filter(Boolean);
  const lista = yLista(l, idioma === 'en' ? 'and' : 'y');
  return idioma === 'en' ? `${l.length > 1 ? 'columns' : 'column'} ${lista}` : `${l.length > 1 ? 'las columnas' : 'la columna'} ${lista}`;
}

/** Ejercicio 2, tarjeta del «No lo sé»: cómo se busca, cada columna y, al final, dónde está el error. */
export function explicaColumnas(item, ctx) {
  const { tt, idioma } = ctx;
  return `${tt(REGLA.columnas)}${explicacionColumnas(item, ctx)}${tt({ es: 'El error está en', en: 'The mistake is in' })} <strong>${columnasMalas(item, idioma)}</strong>.`;
}
