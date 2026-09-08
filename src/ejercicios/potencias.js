// Potencias de exponente natural: cálculo directo y propiedades (producto,
// cociente y potencia de potencia con la misma base).

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  potencia_como_producto: { concepto: 'potencias',
    es: 'La potencia repite la base tantas veces como dice el exponente: 2³ = 2·2·2, no 2·3.', en: 'A power repeats the base as many times as the exponent says: 2³ = 2×2×2, not 2×3.' },
  potencia_mal_contada: { concepto: 'potencias',
    es: 'Cuenta bien las veces que se repite la base: el exponente dice cuántos factores hay.', en: 'Count carefully how many times the base repeats: the exponent tells you how many factors there are.' },
  base_exponente_intercambiados: { concepto: 'potencias',
    es: 'Has cambiado la base por el exponente: la base es el número grande y se repite; el exponente cuenta las veces.', en: 'You swapped the base and the exponent: the base is the number that gets repeated; the exponent counts how many times.' },
  multiplicar_exponentes: { concepto: 'potencias',
    es: 'Al multiplicar potencias de la misma base, los exponentes se suman, no se multiplican.', en: 'When multiplying powers with the same base, the exponents are added, not multiplied.' },
  multiplicar_bases: { concepto: 'potencias',
    es: 'Al multiplicar potencias de la misma base, la base se mantiene: solo cambian los exponentes.', en: 'When multiplying powers with the same base, the base stays the same: only the exponents change.' },
  multiplicar_todo: { concepto: 'potencias',
    es: 'Al multiplicar potencias de la misma base, la base se mantiene y los exponentes se suman.', en: 'When multiplying powers with the same base, the base stays the same and the exponents are added.' },
  sumar_exponentes_potencia: { concepto: 'potencias',
    es: 'En una potencia de potencia los exponentes se multiplican, no se suman.', en: 'In a power of a power, the exponents are multiplied, not added.' },
  exponente_de_exponente: { concepto: 'potencias',
    es: 'En una potencia de potencia los exponentes se multiplican: (2³)² = 2⁶.', en: 'In a power of a power, the exponents are multiplied: (2³)² = 2⁶.' },
  exponente_a_la_base: { concepto: 'potencias',
    es: 'El exponente de fuera afecta a toda la potencia: se multiplican los exponentes y la base no cambia.', en: 'The outer exponent affects the whole power: the exponents are multiplied and the base does not change.' },
  sumar_exponentes_cociente: { concepto: 'potencias',
    es: 'Al dividir potencias de la misma base, los exponentes se restan.', en: 'When dividing powers with the same base, the exponents are subtracted.' },
  dividir_bases: { concepto: 'potencias',
    es: 'Al dividir potencias de la misma base, la base se mantiene: solo cambian los exponentes.', en: 'When dividing powers with the same base, the base stays the same: only the exponents change.' },
  dividir_exponentes: { concepto: 'potencias',
    es: 'Al dividir potencias de la misma base, los exponentes se restan, no se dividen.', en: 'When dividing powers with the same base, the exponents are subtracted, not divided.' },
  signo_potencia_par: { concepto: 'potencias',
    es: 'Con paréntesis, la base es −3 entera: (−3)² = (−3)·(−3) = 9. Un negativo elevado a un exponente par da positivo.',
    en: 'With brackets, the whole −3 is the base: (−3)² = (−3)×(−3) = 9. A negative number raised to an even power is positive.' },
  signo_potencia_impar: { concepto: 'potencias',
    es: 'Un negativo elevado a un exponente impar da negativo: (−2)³ = (−2)·(−2)·(−2) = −8.',
    en: 'A negative number raised to an odd power is negative: (−2)³ = (−2)×(−2)×(−2) = −8.' },
  elevar_signo: { concepto: 'potencias',
    es: 'Sin paréntesis, el exponente solo afecta al número: −3² = −(3·3) = −9. Para elevar también el signo hacen falta paréntesis: (−3)².',
    en: 'Without brackets, the exponent only applies to the number: −3² = −(3×3) = −9. To raise the sign too you need brackets: (−3)².' },
  multiplicar_exponentes_cociente: { concepto: 'potencias',
    es: 'Al dividir potencias de la misma base, los exponentes se restan, no se multiplican.', en: 'When dividing powers with the same base, the exponents are subtracted, not multiplied.' },
};
const E = erroresDe(errores);

export const preguntas = {
  una_sola_potencia: { es: 'Escribe como una sola potencia:', en: 'Write as a single power:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  potencia_directa: { es: 'Multiplica la base tantas veces como indica el exponente.', en: 'Multiply the base as many times as the exponent says.' },
  producto_misma_base: { es: 'Al multiplicar potencias de la misma base, se suman los exponentes.', en: 'When multiplying powers with the same base, add the exponents.' },
  cociente_misma_base: { es: 'Al dividir potencias de la misma base, se restan los exponentes.', en: 'When dividing powers with the same base, subtract the exponents.' },
  potencia_de_potencia: { es: 'Al elevar una potencia a otra potencia, se multiplican los exponentes.', en: 'When raising a power to another power, multiply the exponents.' },
  potencia_par_negativa: { es: 'Con paréntesis se eleva también el signo: negativo elevado a exponente par da positivo.', en: 'With brackets the sign is raised too: a negative number to an even power is positive.' },
  potencia_sin_parentesis: { es: 'Sin paréntesis, el exponente solo afecta al número, no al signo.', en: 'Without brackets, the exponent only applies to the number, not the sign.' },
  potencia_impar_negativa: { es: 'Con paréntesis se eleva también el signo: negativo elevado a exponente impar da negativo.', en: 'With brackets the sign is raised too: a negative number to an odd power is negative.' },
};

const num = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const pot = (base, exp, error, pasos) => ({ tex: `${base}^{${exp}}`, clave: `${base}^${exp}`, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const T = tex;

/** Expansión de una potencia como producto de factores repetidos: 2^3 -> "2 \\cdot 2 \\cdot 2". */
const expandir = (base, exp) => Array(exp).fill(base).join(' \\cdot ');

function generarCalculo(rng) {
  const base = rng.elegir([2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10]);
  const exp = base === 10 ? rng.entero(2, 5) : base <= 3 ? rng.entero(2, 4) : base <= 5 ? rng.entero(2, 3) : 2;
  const correcta = base ** exp;
  return {
    texto: { clave: 'calcula' },
    enunciado: `${base}^{${exp}}`,
    correcta: num(correcta),
    solucion: [
      paso(`${base}^{${exp}} = ${expandir(base, exp)} = ${T(correcta)}`, 'potencia_directa'),
    ],
    distractores: [
      num(base * exp, E('potencia_como_producto'), [
        mal(`${base}^{${exp}} = ${base} \\cdot ${exp}`),
        paso(`${base} \\cdot ${exp} = ${T(base * exp)}`),
      ]),
      num(exp ** base, E('base_exponente_intercambiados'), [
        mal(`${base}^{${exp}} = ${exp}^{${base}}`),
        paso(`${exp}^{${base}} = ${T(exp ** base)}`),
      ]),
      num(base ** (exp - 1) * exp, E('potencia_mal_contada'), [
        mal(`${base}^{${exp}} = ${base}^{${exp - 1}} \\cdot ${exp}`, `${base}^{${exp - 1}} = ${base ** (exp - 1)}`),
        paso(`${T(base ** (exp - 1))} \\cdot ${exp} = ${T(base ** (exp - 1) * exp)}`),
      ]),
    ],
    genericos: [num(base + exp), num(base ** exp + base), num(base ** (exp + 1))],
  };
}

function generarProducto(rng) {
  const base = rng.entero(2, 9), m = rng.entero(2, 5), n = rng.entero(2, 5);
  const enunciado = `${base}^{${m}} \\cdot ${base}^{${n}}`;
  return {
    texto: { clave: 'una_sola_potencia' },
    enunciado,
    correcta: pot(base, m + n),
    solucion: [
      paso(`${enunciado} = ${base}^{${m}+${n}} = ${base}^{${m + n}}`, 'producto_misma_base'),
    ],
    distractores: [
      pot(base, m * n, E('multiplicar_exponentes'), [
        mal(`${enunciado} = ${base}^{${m} \\cdot ${n}} = ${base}^{${m * n}}`),
      ]),
      pot(base * base, m + n, E('multiplicar_bases'), [
        mal(`${enunciado} = ${base * base}^{${m}+${n}} = ${base * base}^{${m + n}}`),
      ]),
      pot(base * base, m * n, E('multiplicar_todo'), [
        mal(`${enunciado} = ${base * base}^{${m} \\cdot ${n}} = ${base * base}^{${m * n}}`),
      ]),
    ],
  };
}

function generarCociente(rng) {
  const base = rng.entero(2, 9), n = rng.entero(2, 4), m = n + rng.entero(1, 4);
  const enunciado = `${base}^{${m}} \\div ${base}^{${n}}`;
  const tercero = m % n === 0
    ? pot(base, m / n, E('dividir_exponentes'), [
        mal(`${enunciado} = ${base}^{${m} \\div ${n}} = ${base}^{${m / n}}`),
      ])
    : pot(base, m * n, E('multiplicar_exponentes_cociente'), [
        mal(`${enunciado} = ${base}^{${m} \\cdot ${n}} = ${base}^{${m * n}}`),
      ]);
  return {
    texto: { clave: 'una_sola_potencia' },
    enunciado,
    correcta: pot(base, m - n),
    solucion: [
      paso(`${enunciado} = ${base}^{${m}-${n}} = ${base}^{${m - n}}`, 'cociente_misma_base'),
    ],
    distractores: [
      pot(base, m + n, E('sumar_exponentes_cociente'), [
        mal(`${enunciado} = ${base}^{${m}+${n}} = ${base}^{${m + n}}`),
      ]),
      pot(1, m - n, E('dividir_bases'), [
        mal(`${enunciado} = 1^{${m}-${n}} = 1^{${m - n}}`, `${base} \\div ${base} = 1`),
      ]),
      tercero,
    ],
  };
}

function generarPotenciaDePotencia(rng) {
  const base = rng.entero(2, 9), m = rng.entero(2, 5), n = rng.entero(2, 4);
  const enunciado = `\\left(${base}^{${m}}\\right)^{${n}}`;
  return {
    texto: { clave: 'una_sola_potencia' },
    enunciado,
    correcta: pot(base, m * n),
    solucion: [
      paso(`${enunciado} = ${base}^{${m} \\cdot ${n}} = ${base}^{${m * n}}`, 'potencia_de_potencia'),
    ],
    distractores: [
      pot(base, m + n, E('sumar_exponentes_potencia'), [
        mal(`${enunciado} = ${base}^{${m}+${n}} = ${base}^{${m + n}}`),
      ]),
      pot(base * n, m, E('exponente_a_la_base'), [
        mal(`${enunciado} = ${base * n}^{${m}}`, `${base} \\cdot ${n} = ${base * n}`),
      ]),
      pot(base, m ** n, E('exponente_de_exponente'), [
        mal(`${enunciado} = ${base}^{${m ** n}}`, `${m}^{${n}} = ${m ** n}`),
      ]),
    ],
  };
}

function generarPotenciaNegativa(rng) {
  const b = rng.entero(2, 9);
  const forma = rng.entero(0, 2);
  const base = { texto: { clave: 'calcula' } };
  if (forma === 0) {
    // (−b)² = b²
    const enunciado = `(-${b})^{2}`;
    return {
      ...base,
      enunciado,
      correcta: num(b * b),
      solucion: [
        paso(`${enunciado} = (-${b}) \\cdot (-${b}) = ${T(b * b)}`, 'potencia_par_negativa'),
      ],
      distractores: [
        num(-b * b, E('signo_potencia_par'), [
          mal(`${enunciado} = -${b * b}`, `${b} \\cdot ${b} = ${b * b}`),
        ]),
        num(-2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = (-${b}) \\cdot 2 = ${T(-2 * b)}`),
        ]),
        num(2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = ${b} \\cdot 2 = ${T(2 * b)}`),
        ]),
      ],
    };
  }
  if (forma === 1) {
    // −b² = −(b²)
    const enunciado = `-${b}^{2}`;
    return {
      ...base,
      enunciado,
      correcta: num(-b * b),
      solucion: [
        paso(`${enunciado} = -(${b} \\cdot ${b}) = ${T(-b * b)}`, 'potencia_sin_parentesis'),
      ],
      distractores: [
        num(b * b, E('elevar_signo'), [
          mal(`${enunciado} = ${b * b}`, `${b} \\cdot ${b} = ${b * b}`),
        ]),
        num(-2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = -(${b} \\cdot 2) = ${T(-2 * b)}`),
        ]),
        num(2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = ${b} \\cdot 2 = ${T(2 * b)}`),
        ]),
      ],
    };
  }
  // (−b)³ = −b³
  const c = rng.entero(2, 5);
  const enunciado = `(-${c})^{3}`;
  return {
    ...base,
    enunciado,
    correcta: num(-(c ** 3)),
    solucion: [
      paso(`${enunciado} = (-${c}) \\cdot (-${c}) \\cdot (-${c}) = ${T(-(c ** 3))}`, 'potencia_impar_negativa'),
    ],
    distractores: [
      num(c ** 3, E('signo_potencia_impar'), [
        mal(`${enunciado} = ${c ** 3}`, `${c} \\cdot ${c} \\cdot ${c} = ${c ** 3}`),
      ]),
      num(-3 * c, E('potencia_como_producto'), [
        mal(`${enunciado} = (-${c}) \\cdot 3 = ${T(-3 * c)}`),
      ]),
      num(3 * c, E('potencia_como_producto'), [
        mal(`${enunciado} = ${c} \\cdot 3 = ${T(3 * c)}`),
      ]),
    ],
  };
}

const FORMAS = [generarCalculo, generarCalculo, generarProducto, generarCociente, generarPotenciaDePotencia, generarPotenciaNegativa, generarPotenciaNegativa];

export default {
  id: 'potencias',
  nombre: { es: 'Potencias', en: 'Powers' },
  curso: 1,
  concepto: 'potencias',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
