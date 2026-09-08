// Números enteros: sumas y restas con signos y paréntesis, y productos.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  negar_toda_la_suma: { concepto: 'enteros',
    es: 'Has sumado los dos valores y les has puesto signo negativo a todos. Cuando los signos son distintos, los valores se restan y el resultado lleva el signo del mayor.',
    en: 'You added both values and made the whole thing negative. When the signs are different, you subtract the values and the result takes the sign of the larger one.' },
  sumar_ignorando_signo: { concepto: 'enteros',
    es: 'Sumar un número negativo es lo mismo que restar: a + (−b) = a − b.', en: 'Adding a negative number is the same as subtracting: a + (−b) = a − b.' },
  menos_por_menos: { concepto: 'enteros',
    es: 'Restar un número negativo es sumar: a − (−b) = a + b.', en: 'Subtracting a negative number is the same as adding: a − (−b) = a + b.' },
  signo_resultado: { concepto: 'enteros',
    es: 'El resultado lleva el signo del número de mayor valor absoluto. Comprueba el signo.', en: 'The result takes the sign of the number with the greater absolute value. Check the sign.' },
  regla_signos: { concepto: 'enteros',
    es: 'Regla de los signos: dos signos iguales dan +, dos signos distintos dan −.', en: 'Rule of signs: two equal signs give +, two different signs give −.' },
  ambos_negativos: { concepto: 'enteros',
    es: 'Dos números negativos se suman y el resultado es negativo: (−a) − b = −(a + b).', en: 'Two negative numbers are added and the result is negative: (−a) − b = −(a + b).' },
  ambos_negativos_signo: { concepto: 'enteros',
    es: 'Los dos números son negativos, así que el resultado también lo es: (−a) − b = −(a + b).', en: 'Both numbers are negative, so the result is negative too: (−a) − b = −(a + b).' },
  sumar_en_vez_de_multiplicar: { concepto: 'enteros',
    es: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.', en: 'It is a product, not a sum: multiply the values and apply the rule of signs.' },
  sumar_en_vez_de_multiplicar_signo: { concepto: 'enteros',
    es: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.', en: 'It is a product, not a sum: multiply the values and apply the rule of signs.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sumar_negativo: { es: 'Sumar un número negativo es restar.', en: 'Adding a negative number is subtracting.' },
  restar_negativo: { es: 'Restar un número negativo es sumar.', en: 'Subtracting a negative number is adding.' },
  ambos_negativos: { es: 'Los dos números son negativos: se suman y el resultado es negativo.', en: 'Both numbers are negative: add them and the result is negative.' },
  suma_signos_distintos: { es: 'Signos distintos: se restan los valores y el resultado lleva el signo del mayor.', en: 'Different signs: subtract the values and the result takes the sign of the larger one.' },
  resta_resultado_negativo: { es: 'Si el número que se resta es mayor, el resultado es negativo.', en: 'If the number being subtracted is bigger, the result is negative.' },
  signos_iguales: { es: 'Signos iguales: el producto es positivo.', en: 'Same signs: the product is positive.' },
  signos_distintos: { es: 'Signos distintos: el producto es negativo.', en: 'Different signs: the product is negative.' },
};

const num = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const neg = n => `(-${n})`;
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const T = tex;

function sumaNegativo(rng) {
  // a + (−b)
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${a} + ${neg(b)}`;
  return {
    enunciado,
    correcta: num(a - b),
    solucion: [
      paso(`${enunciado} = ${a} - ${b} = ${T(a - b)}`, 'sumar_negativo'),
    ],
    distractores: [
      num(a + b, E('sumar_ignorando_signo'), [
        mal(`${enunciado} = ${a} + ${b}`),
        paso(`${a} + ${b} = ${T(a + b)}`),
      ]),
      num(b - a, E('signo_resultado'), [
        paso(`${enunciado} = ${a} - ${b}`),
        mal(`${a} - ${b} = ${T(b - a)}`),
      ]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = -(${a} + ${b})`),
        paso(`-(${a} + ${b}) = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
      ]),
    ],
  };
}

function restaNegativo(rng) {
  // a − (−b)
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${a} - ${neg(b)}`;
  return {
    enunciado,
    correcta: num(a + b),
    solucion: [
      paso(`${enunciado} = ${a} + ${b} = ${T(a + b)}`, 'restar_negativo'),
    ],
    distractores: [
      num(a - b, E('menos_por_menos'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
      num(b - a, E('menos_por_menos'), [
        mal(`${enunciado} = ${b} - ${a}`),
        paso(`${b} - ${a} = ${T(b - a)}`),
      ]),
      num(-(a + b), E('signo_resultado'), [
        mal(`${enunciado} = -(${a} + ${b})`),
        paso(`-(${a} + ${b}) = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
      ]),
    ],
  };
}

function negativoMenosPositivo(rng) {
  // (−a) − b
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${neg(a)} - ${b}`;
  return {
    enunciado,
    correcta: num(-(a + b)),
    solucion: [
      paso(`${enunciado} = -(${a} + ${b})`, 'ambos_negativos'),
      paso(`-(${a} + ${b}) = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
    ],
    distractores: [
      num(b - a, E('ambos_negativos'), [
        mal(`${enunciado} = ${b} - ${a}`),
        paso(`${b} - ${a} = ${T(b - a)}`),
      ]),
      num(a + b, E('ambos_negativos_signo'), [
        paso(`${enunciado} = -(${a} + ${b})`, null, `${a} + ${b} = ${a + b}`),
        mal(`-(${a} + ${b}) = ${T(a + b)}`),
      ]),
      num(a - b, E('ambos_negativos'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
    ],
  };
}

function negativoMasPositivo(rng) {
  // (−a) + b
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${neg(a)} + ${b}`;
  return {
    enunciado,
    correcta: num(b - a),
    solucion: [
      paso(`${enunciado} = ${b} - ${a} = ${T(b - a)}`, 'suma_signos_distintos'),
    ],
    distractores: [
      num(a - b, E('signo_resultado'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = -(${a} + ${b})`),
        paso(`-(${a} + ${b}) = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
      ]),
      num(a + b, E('sumar_ignorando_signo'), [
        mal(`${enunciado} = ${a} + ${b}`),
        paso(`${a} + ${b} = ${T(a + b)}`),
      ]),
    ],
  };
}

function restaConResultadoNegativo(rng) {
  // a − b con b > a
  const a = rng.entero(1, 12), b = a + rng.entero(1, 12);
  const enunciado = `${a} - ${b}`;
  return {
    enunciado,
    correcta: num(a - b),
    solucion: [
      paso(`${enunciado} = ${T(a - b)}`, 'resta_resultado_negativo'),
    ],
    distractores: [
      num(b - a, E('signo_resultado'), [
        mal(`${enunciado} = ${T(b - a)}`),
      ]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = -(${a} + ${b})`),
        paso(`-(${a} + ${b}) = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
      ]),
      num(a + b, E('sumar_ignorando_signo'), [
        mal(`${enunciado} = ${T(a + b)}`),
      ]),
    ],
  };
}

function producto(rng) {
  const a = rng.entero(2, 9), b = rng.entero(2, 9);
  const signoA = rng.moneda() ? -1 : 1, signoB = rng.moneda() ? -1 : 1;
  const A = signoA * a, B = signoB * b;
  const izq = A < 0 ? neg(a) : `${a}`, der = B < 0 ? neg(b) : `${b}`;
  const enunciado = `${izq} \\cdot ${der}`;
  const notaSigno = signoA === signoB ? 'signos_iguales' : 'signos_distintos';
  return {
    enunciado,
    correcta: num(A * B),
    solucion: [
      paso(`${enunciado} = ${T(A * B)}`, notaSigno, `${a} \\cdot ${b} = ${a * b}`),
    ],
    distractores: [
      num(-A * B, E('regla_signos'), [
        mal(`${enunciado} = ${T(-A * B)}`, `${a} \\cdot ${b} = ${a * b}`),
      ]),
      num(A + B, E('sumar_en_vez_de_multiplicar'), [
        mal(`${enunciado} = ${izq} + ${der}`),
        paso(`${izq} + ${der} = ${T(A + B)}`),
      ]),
      num(-(A + B), E('sumar_en_vez_de_multiplicar_signo'), [
        mal(`${enunciado} = ${T(-(A + B))}`, `${izq} + ${der} = ${T(A + B)}`),
      ]),
    ],
    genericos: [num(A * B + (A * B > 0 ? 1 : -1))],
  };
}

const FORMAS = [sumaNegativo, restaNegativo, negativoMenosPositivo, negativoMasPositivo, restaConResultadoNegativo, producto, producto];

export default {
  id: 'enteros',
  nombre: { es: 'Números enteros', en: 'Integers' },
  curso: 1,
  concepto: 'enteros',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const { enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: { clave: 'calcula' }, enunciado, solucion, opciones };
  }),
};
