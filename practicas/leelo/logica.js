// Práctica «Léelo en inglés»: lógica pura (sin DOM ni red). Tres ejercicios:
// escuchar una frase y elegir su notación, leer una notación y elegir su
// lectura en inglés, y completar una frase con la preposición o el nombre
// correcto. Todo lo que se oye o se lee está siempre en inglés (ver textos.js).

import {
  factorizar, valorDe, htmlFact, mcd, mcm, esPrimo,
} from '../_comun/aritmetica.js';
import { numeroAIngles } from '../../src/ejercicios/palabras.js';

// Re-exportado para que practica.js no importe directamente de src/ejercicios/.
export { numeroAIngles };

// ─── Números de las expresiones ────────────────────────────────────────────

/** Números a factorizar: los mismos que en la plantilla, con casos de 11 y 13. */
export const NUMEROS_FACT = [
  12, 18, 20, 24, 28, 36, 40, 45, 48, 50, 54, 56, 60, 63, 72, 75, 84, 90, 98, 99, 100, 108,
  120, 126, 132, 140, 150, 156, 180, 198, 242, 286, 338, 363,
];

/** Pareja de números para GCD/LCM, pequeños para que la lectura sea corta. */
export function generarPar(rng) {
  const a = rng.entero(4, 48);
  let b = rng.entero(4, 48);
  while (b === a) b = rng.entero(4, 48);
  return [a, b];
}

// ─── Lectura en inglés ──────────────────────────────────────────────────────

/** Estilos de lectura, todos válidos y nunca enfrentados entre sí como distractores. */
export const ESTILOS = [
  { verboFact: 'equals', veces: 'times', gcd: 'GCD', lcm: 'LCM', verboPred: 'is' },
  { verboFact: 'is equal to', veces: 'multiplied by', gcd: 'greatest common divisor', lcm: 'lowest common multiple', verboPred: 'equals' },
  { verboFact: 'equals', veces: 'times', gcd: 'greatest common divisor', lcm: 'least common multiple', verboPred: 'is equal to' },
];

/** 2² → «two squared»; 2³ → «two cubed»; 2⁴ → «two to the power of four»; 2¹ → «two». */
export function leerExponente(p, e) {
  const base = numeroAIngles(p);
  if (e === 1) return base;
  if (e === 2) return `${base} squared`;
  if (e === 3) return `${base} cubed`;
  return `${base} to the power of ${numeroAIngles(e)}`;
}

function leerFactConEstilo(f, estilo) {
  return f.length ? f.map(([p, e]) => leerExponente(p, e)).join(` ${estilo.veces} `) : numeroAIngles(1);
}

/** La lectura en inglés de una expresión, con un estilo dado (por defecto el primero). */
export function leer(expresion, estilo = ESTILOS[0]) {
  const { clase } = expresion;
  if (clase === 'fact') return `${numeroAIngles(expresion.n)} ${estilo.verboFact} ${leerFactConEstilo(expresion.f, estilo)}`;
  if (clase === 'gcd' || clase === 'lcm') {
    const nombre = clase === 'gcd' ? estilo.gcd : estilo.lcm;
    return `the ${nombre} of ${numeroAIngles(expresion.a)} and ${numeroAIngles(expresion.b)} ${estilo.verboPred} ${numeroAIngles(expresion.valor)}`;
  }
  if (clase === 'primo') return `${numeroAIngles(expresion.n)} is a prime number`;
  return `${numeroAIngles(expresion.n)} is a composite number`;
}

// ─── Notación (para el ejercicio 1: elegir la notación que se ha oído) ─────

export function notacion(expresion) {
  const { clase } = expresion;
  if (clase === 'fact') return `${expresion.n} = ${htmlFact(expresion.f)}`;
  if (clase === 'gcd') return `GCD(${expresion.a}, ${expresion.b}) = ${expresion.valor}`;
  return `LCM(${expresion.a}, ${expresion.b}) = ${expresion.valor}`;
}

// ─── Variantes (distractores que fallan solo en una potencia o en un número) ──

const PRIMOS_MUTACION = [2, 3, 5, 7, 11, 13];

/** Factorizaciones «parecidas» a `f`: un exponente ±1, o un primo cambiado por otro. */
function variantesFact(f) {
  const variantes = [];
  f.forEach(([p, e], i) => {
    if (e + 1 <= 6) variantes.push(f.map((x, j) => (j === i ? [x[0], x[1] + 1] : x)));
    if (e - 1 >= 1) variantes.push(f.map((x, j) => (j === i ? [x[0], x[1] - 1] : x)));
    PRIMOS_MUTACION.filter(q => q !== p && !f.some(([pp]) => pp === q)).forEach(q => {
      variantes.push(f.map((x, j) => (j === i ? [q, x[1]] : x)).sort((a, b) => a[0] - b[0]));
    });
  });
  return variantes;
}

/** Parejas (a, b, valor) «parecidas»: el valor cambiado, o `a`/`b` cambiados en 1. */
function variantesGcdLcm(a, b, valor, clase) {
  const op = clase === 'gcd' ? mcd : mcm;
  const variantes = [];
  [valor - 2, valor - 1, valor + 1, valor + 2].filter(v => v > 0 && v !== valor).forEach(v => variantes.push({ a, b, valor: v }));
  [a - 1, a + 1].filter(na => na >= 2 && na !== b).forEach(na => variantes.push({ a: na, b, valor: op(na, b) }));
  [b - 1, b + 1].filter(nb => nb >= 2 && nb !== a).forEach(nb => variantes.push({ a, b: nb, valor: op(a, nb) }));
  return variantes;
}

/** Expresiones «parecidas» a la dada, para construir las opciones falsas de los ejercicios 1 y 2. */
export function variantesDe(expresion) {
  if (expresion.clase === 'fact') {
    return variantesFact(expresion.f)
      .filter(f => valorDe(f) !== expresion.n)
      .map(f => ({ clase: 'fact', n: expresion.n, f }));
  }
  return variantesGcdLcm(expresion.a, expresion.b, expresion.valor, expresion.clase)
    .map(v => ({ clase: expresion.clase, a: v.a, b: v.b, valor: v.valor }));
}

/** Textos únicos (quitando repetidos y la propia correcta) de una lista de expresiones, con una función de texto. */
function textosUnicos(expresiones, textoCorrecta, aTexto) {
  const vistos = new Set([textoCorrecta]);
  const salida = [];
  for (const e of expresiones) {
    const texto = aTexto(e);
    if (!vistos.has(texto)) { vistos.add(texto); salida.push(texto); }
  }
  return salida;
}

// ─── Ejercicio 1: Escúchalo (oír la frase, elegir la notación) ─────────────

const CLASES_ESCUCHAR = ['fact', 'fact', 'gcd', 'lcm'];

/** Ítem: { clase, n, f } o { clase, a, b, valor }. */
export function generarEscuchar(rng) {
  const clase = rng.elegir(CLASES_ESCUCHAR);
  if (clase === 'fact') {
    const n = rng.elegir(NUMEROS_FACT);
    return { clase, n, f: factorizar(n) };
  }
  const [a, b] = generarPar(rng);
  const valor = clase === 'gcd' ? mcd(a, b) : mcm(a, b);
  return { clase, a, b, valor };
}

/** Las opciones del ejercicio 1: la correcta (en notación) y el resto de un pool falso. */
export function opcionesEscuchar(item) {
  const correcta = notacion(item);
  const pool = textosUnicos(variantesDe(item), correcta, notacion);
  return { correcta, pool };
}

// ─── Ejercicio 2: ¿Cómo se lee? (ver la notación, elegir la lectura) ───────

/** Ítem: igual que el del ejercicio 1, más el estilo de lectura elegido para este ítem. */
export function generarLeer(rng) {
  const item = generarEscuchar(rng);
  item.estilo = rng.elegir(ESTILOS);
  return item;
}

/** Las opciones del ejercicio 2: la lectura correcta y el resto de un pool falso,
 * todas en el mismo estilo (nunca se enfrentan dos formas válidas entre sí). */
export function opcionesLeer(item) {
  const correcta = leer(item, item.estilo);
  const pool = textosUnicos(variantesDe(item), correcta, e => leer(e, item.estilo));
  return { correcta, pool };
}

// ─── Ejercicio 3: Completa la frase ────────────────────────────────────────

/** Una plantilla: `generar(rng)` → { frase, correcta, falsas }. `falsas` son siempre
 * inequívocamente falsas (ninguna es una variante válida de la correcta). */
const PLANTILLAS = [
  {
    id: 'divisible_by',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${a} is divisible ___ ${b}`, correcta: 'by', falsas: ['between', 'of'], datos: { a, b } };
    },
  },
  {
    id: 'divisor_of',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${b} is a divisor ___ ${a}`, correcta: 'of', falsas: ['by', 'in'], datos: { a, b } };
    },
  },
  {
    id: 'multiple_of',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${a} is a multiple ___ ${b}`, correcta: 'of', falsas: ['by', 'for'], datos: { a, b } };
    },
  },
  {
    id: 'goes_into',
    generar(rng) {
      const b = rng.entero(2, 12), k = rng.entero(2, 9), a = b * k;
      return { frase: `${b} ___ ${a} ${k === 2 ? 'twice' : `${numeroAIngles(k)} times`}`, correcta: 'goes into', falsas: ['goes between', 'divides for'], datos: { a, b } };
    },
  },
  {
    id: 'gcd_stands_for',
    generar() {
      return { frase: 'GCD stands for ___', correcta: 'greatest common divisor', falsas: ['greatest common multiple', 'general common divisor'], datos: {} };
    },
  },
  {
    id: 'lcm_stands_for',
    generar() {
      return { frase: 'LCM stands for ___', correcta: 'lowest common multiple', falsas: ['lowest common divisor', 'largest common multiple'], datos: {} };
    },
  },
  {
    id: 'one_is',
    generar() {
      return { frase: '1 is ___', correcta: 'neither prime nor composite', falsas: ['prime', 'composite'], datos: {} };
    },
  },
  {
    id: 'divisor_pair',
    generar(rng) {
      const x = rng.entero(2, 9), y = rng.entero(2, 9), a = x * y;
      return { frase: `${x} · ${y} is a ___ pair of ${a}`, correcta: 'divisor', falsas: ['remainder', 'quotient'], datos: { x, y, a } };
    },
  },
  {
    id: 'sieve_composite',
    generar(rng) {
      const n = rng.elegir(NUMEROS_FACT);
      return { frase: `${n} is crossed out in the sieve of Eratosthenes, so ${n} is ___`, correcta: 'composite', falsas: ['prime', 'a factor'], datos: { n } };
    },
  },
  {
    id: 'zero_multiple',
    generar(rng) {
      const n = rng.entero(2, 99);
      return { frase: `0 is a ___ of ${n}`, correcta: 'multiple', falsas: ['divisor', 'prime'], datos: { n } };
    },
  },
  {
    id: 'smallest_prime',
    generar() {
      return { frase: 'The smallest prime number is ___', correcta: '2', falsas: ['1', '3'], datos: {} };
    },
  },
];

/** Comprobación independiente (fuerza bruta) de que la plantilla dio una frase verdadera. */
export function comprobarCompletar(item) {
  const { plantilla, datos, solucion } = item;
  if (plantilla === 'divisible_by') return datos.a % datos.b === 0 && solucion === 'by';
  if (plantilla === 'divisor_of') return datos.a % datos.b === 0 && solucion === 'of';
  if (plantilla === 'multiple_of') return datos.a % datos.b === 0 && solucion === 'of';
  if (plantilla === 'goes_into') return datos.a % datos.b === 0 && solucion === 'goes into';
  if (plantilla === 'divisor_pair') return datos.x * datos.y === datos.a && solucion === 'divisor';
  if (plantilla === 'sieve_composite') return !esPrimo(datos.n) && solucion === 'composite';
  if (plantilla === 'zero_multiple') return solucion === 'multiple';
  if (plantilla === 'gcd_stands_for') return solucion === 'greatest common divisor';
  if (plantilla === 'lcm_stands_for') return solucion === 'lowest common multiple';
  if (plantilla === 'one_is') return solucion === 'neither prime nor composite';
  if (plantilla === 'smallest_prime') return solucion === '2' && esPrimo(2);
  throw new Error(`Plantilla desconocida: ${plantilla}`);
}

/** Ítem: { plantilla, datos, frase, opciones: [string, string, string], solucion }. */
export function generarCompletar(rng) {
  const plantilla = rng.elegir(PLANTILLAS);
  const { frase, correcta, falsas, datos } = plantilla.generar(rng);
  const opciones = rng.barajar([correcta, ...falsas]);
  return { tipo: 'completar', plantilla: plantilla.id, datos, frase, opciones, solucion: correcta };
}
