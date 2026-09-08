// Múltiplos, divisores, criterios de divisibilidad y números primos.
// Aquí las opciones son números y el enunciado es una pregunta.

import { construirOpciones, conReintentos, tex } from './index.js';

const E = {
  multiploDivisor: {
    id: 'confundir_multiplo_divisor',
    concepto: 'divisibilidad',
    feedback: 'Un múltiplo de un número se obtiene multiplicándolo; un divisor es el que lo divide exactamente. No los confundas.',
  },
  unSoloFactor: {
    id: 'un_solo_factor',
    concepto: 'divisibilidad',
    feedback: 'Para ser múltiplo de un número compuesto hay que serlo de todos sus factores a la vez (de 6: de 2 y de 3).',
  },
  criterioTresNueve: {
    id: 'criterio_3_vs_9',
    concepto: 'divisibilidad',
    feedback: 'Que la suma de las cifras sea múltiplo de 3 no basta: para ser múltiplo de 9, la suma de las cifras debe ser múltiplo de 9.',
  },
  imparNoPrimo: {
    id: 'impar_no_es_primo',
    concepto: 'divisibilidad',
    feedback: 'Ser impar no significa ser primo: un primo solo tiene dos divisores, 1 y él mismo.',
  },
  parNoPrimo: {
    id: 'par_no_es_primo',
    concepto: 'divisibilidad',
    feedback: 'Todos los pares mayores que 2 son divisibles por 2, así que no son primos.',
  },
  unoNoPrimo: {
    id: 'uno_no_es_primo',
    concepto: 'divisibilidad',
    feedback: 'El 1 no se considera primo: un primo tiene exactamente dos divisores distintos.',
  },
  noDivide: {
    id: 'no_divide',
    concepto: 'divisibilidad',
    feedback: 'Comprueba la división: un divisor tiene que dar resto 0.',
  },
  noMultiplo: {
    id: 'no_multiplo',
    concepto: 'divisibilidad',
    feedback: 'Divide entre el número: si el resto no es 0, no es múltiplo suyo.',
  },
};

const num = (v, error) => ({ tex: tex(v), clave: v, error });
const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const IMPARES_COMPUESTOS = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99];

function divisoresPropios(n) {
  const lista = [];
  for (let d = 2; d < n; d++) if (n % d === 0) lista.push(d);
  return lista;
}

function multiplo(rng) {
  const n = rng.elegir([4, 6, 6, 8, 9, 12, 15]);
  const correcta = n * rng.entero(3, 12);
  const divisores = divisoresPropios(n);
  const factor = rng.elegir(divisores);
  // Múltiplo de un factor de n pero no de n.
  let soloUnFactor = factor * rng.entero(3, 15);
  while (soloUnFactor % n === 0) soloUnFactor += factor;
  return {
    texto: `¿Cuál de estos números es múltiplo de ${n}?`,
    enunciado: '',
    correcta: num(correcta),
    distractores: [
      num(rng.elegir(divisores), E.multiploDivisor),
      num(soloUnFactor, E.unSoloFactor),
      num(correcta + rng.elegir([1, -1, 2]), E.noMultiplo),
    ],
    genericos: [num(correcta + n + 1), num(correcta - n - 1)],
  };
}

function divisor(rng) {
  const n = rng.elegir([24, 30, 36, 40, 42, 48, 54, 60, 72]);
  const divisores = divisoresPropios(n);
  const correcta = rng.elegir(divisores);
  const noDivisor = () => {
    let x = rng.entero(2, n - 1);
    while (n % x === 0) x = rng.entero(2, n - 1);
    return x;
  };
  // Vecinos de la correcta solo si de verdad no dividen a n (y nunca el 1, que divide a todo).
  const vecinos = [correcta + 1, correcta - 1].filter(v => v > 1 && n % v !== 0);
  return {
    texto: `¿Cuál de estos números es divisor de ${n}?`,
    enunciado: '',
    correcta: num(correcta),
    distractores: [
      num(n * rng.entero(2, 3), E.multiploDivisor),
      num(noDivisor(), E.noDivide),
      ...vecinos.map(v => num(v, E.noDivide)),
      num(noDivisor(), E.noDivide),
      num(noDivisor(), E.noDivide),
    ],
  };
}

function primo(rng) {
  const correcta = rng.elegir(PRIMOS.filter(p => p > 3));
  const par = 2 * rng.entero(3, 45);
  return {
    texto: '¿Cuál de estos números es primo?',
    enunciado: '',
    correcta: num(correcta),
    distractores: [
      num(rng.elegir(IMPARES_COMPUESTOS), E.imparNoPrimo),
      num(par, E.parNoPrimo),
      rng.moneda(0.3) ? num(1, E.unoNoPrimo) : num(rng.elegir(IMPARES_COMPUESTOS), E.imparNoPrimo),
      num(rng.elegir(IMPARES_COMPUESTOS), E.imparNoPrimo),
    ],
  };
}

function divisiblePorNueve(rng) {
  const correcta = 9 * rng.entero(3, 30);
  let soloTres = 3 * rng.entero(4, 60);
  while (soloTres % 9 === 0) soloTres += 3;
  let acabaEnNueve = 10 * rng.entero(1, 20) + 9;
  while (acabaEnNueve % 9 === 0) acabaEnNueve += 10;
  return {
    texto: '¿Cuál de estos números es divisible por 9?',
    enunciado: '',
    correcta: num(correcta),
    distractores: [
      num(soloTres, E.criterioTresNueve),
      num(acabaEnNueve, { ...E.noDivide, id: 'acaba_en_9', feedback: 'Acabar en 9 no tiene que ver: un número es divisible por 9 si la suma de sus cifras es múltiplo de 9.' }),
      num(correcta + 1, E.noMultiplo),
    ],
  };
}

const FORMAS = [multiplo, multiplo, divisor, divisor, primo, divisiblePorNueve];

export default {
  id: 'divisibilidad',
  nombre: 'Múltiplos, divisores y primos',
  curso: 1,
  concepto: 'divisibilidad',
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, opciones };
  }),
};
