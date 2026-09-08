// Números enteros: sumas y restas con signos y paréntesis, y productos.

import { construirOpciones, conReintentos, tex } from './index.js';

const E = {
  signoSuma: {
    id: 'sumar_ignorando_signo',
    concepto: 'enteros',
    feedback: 'Sumar un número negativo es lo mismo que restar: a + (−b) = a − b.',
  },
  menosPorMenos: {
    id: 'menos_por_menos',
    concepto: 'enteros',
    feedback: 'Restar un número negativo es sumar: a − (−b) = a + b.',
  },
  signoResultado: {
    id: 'signo_resultado',
    concepto: 'enteros',
    feedback: 'El resultado lleva el signo del número de mayor valor absoluto. Comprueba el signo.',
  },
  reglaSignos: {
    id: 'regla_signos',
    concepto: 'enteros',
    feedback: 'Regla de los signos: dos signos iguales dan +, dos signos distintos dan −.',
  },
  ambosNegativos: {
    id: 'ambos_negativos',
    concepto: 'enteros',
    feedback: 'Dos números negativos se suman y el resultado es negativo: (−a) − b = −(a + b).',
  },
};

const num = (v, error) => ({ tex: tex(v), clave: v, error });
const neg = n => `(-${n})`;

function sumaNegativo(rng) {
  // a + (−b)
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  return {
    enunciado: `${a} + ${neg(b)}`,
    correcta: num(a - b),
    distractores: [num(a + b, E.signoSuma), num(b - a, E.signoResultado), num(-(a + b), E.signoSuma)],
  };
}

function restaNegativo(rng) {
  // a − (−b)
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  return {
    enunciado: `${a} - ${neg(b)}`,
    correcta: num(a + b),
    distractores: [num(a - b, E.menosPorMenos), num(b - a, E.menosPorMenos), num(-(a + b), E.signoResultado)],
  };
}

function negativoMenosPositivo(rng) {
  // (−a) − b
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  return {
    enunciado: `${neg(a)} - ${b}`,
    correcta: num(-(a + b)),
    distractores: [num(b - a, E.ambosNegativos), num(a + b, E.signoResultado), num(a - b, E.ambosNegativos)],
  };
}

function negativoMasPositivo(rng) {
  // (−a) + b
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  return {
    enunciado: `${neg(a)} + ${b}`,
    correcta: num(b - a),
    distractores: [num(a - b, E.signoResultado), num(-(a + b), E.signoSuma), num(a + b, E.signoSuma)],
  };
}

function restaConResultadoNegativo(rng) {
  // a − b con b > a
  const a = rng.entero(1, 12), b = a + rng.entero(1, 12);
  return {
    enunciado: `${a} - ${b}`,
    correcta: num(a - b),
    distractores: [num(b - a, E.signoResultado), num(-(a + b), E.signoSuma), num(a + b, E.signoSuma)],
  };
}

function producto(rng) {
  const a = rng.entero(2, 9), b = rng.entero(2, 9);
  const signoA = rng.moneda() ? -1 : 1, signoB = rng.moneda() ? -1 : 1;
  const A = signoA * a, B = signoB * b;
  const izq = A < 0 ? neg(a) : `${a}`, der = B < 0 ? neg(b) : `${b}`;
  return {
    enunciado: `${izq} \\cdot ${der}`,
    correcta: num(A * B),
    distractores: [
      num(-A * B, E.reglaSignos),
      num(A + B, { ...E.reglaSignos, id: 'sumar_en_vez_de_multiplicar', feedback: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.' }),
      num(-(A + B), { ...E.reglaSignos, id: 'sumar_en_vez_de_multiplicar_signo', feedback: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.' }),
    ],
    genericos: [num(A * B + (A * B > 0 ? 1 : -1))],
  };
}

const FORMAS = [sumaNegativo, restaNegativo, negativoMenosPositivo, negativoMasPositivo, restaConResultadoNegativo, producto, producto];

export default {
  id: 'enteros',
  nombre: 'Números enteros',
  curso: 1,
  concepto: 'enteros',
  generar: conReintentos(rng => {
    const { enunciado, correcta, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: 'Calcula:', enunciado, opciones };
  }),
};
