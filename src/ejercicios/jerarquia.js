// Jerarquía de las operaciones: sumas, restas, productos, paréntesis y
// cuadrados combinados. Cada distractor reproduce un error concreto, y lleva
// los pasos que conducen a él; cada ejercicio lleva su solución paso a paso.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  izquierda_derecha: { concepto: 'jerarquia',
    es: 'Has hecho la suma antes que la multiplicación. La multiplicación va primero, aunque esté escrita después.',
    en: 'You did the addition before the multiplication. Multiplication comes first, even if it is written later.' },
  resta_izquierda_derecha: { concepto: 'jerarquia',
    es: 'Has hecho la resta antes que la multiplicación. La multiplicación va primero, aunque esté escrita después.',
    en: 'You did the subtraction before the multiplication. Multiplication comes first, even if it is written later.' },
  agrupar_suma: { concepto: 'jerarquia',
    es: 'Has sumado antes de multiplicar. Primero se hacen los productos, cada uno por su lado, y después se suman los resultados.',
    en: 'You added before multiplying. First do each multiplication on its own, then add the results.' },
  agrupar_resta: { concepto: 'jerarquia',
    es: 'Has restado antes de multiplicar. Primero se hace el producto y después las sumas y restas, de izquierda a derecha.',
    en: 'You subtracted before multiplying. First do the multiplication, then the additions and subtractions from left to right.' },
  potencia_como_producto: { concepto: 'potencias',
    es: 'Una potencia no es un producto: 10² significa 10·10, no 10·2.',
    en: 'A power is not a product: 10² means 10 × 10, not 10 × 2.' },
  elevar_producto: { concepto: 'jerarquia',
    es: 'Has elevado el producto entero. La potencia se calcula antes que el producto: solo se eleva el número que lleva el exponente.',
    en: 'You raised the whole product to the power. Powers come before multiplication: only the number with the exponent is raised.' },
  ignorar_exponente: { concepto: 'potencias',
    es: 'Te has olvidado del exponente: hay que calcular la potencia antes de multiplicar.',
    en: 'You forgot the exponent: you have to work out the power before multiplying.' },
  ignorar_parentesis: { concepto: 'jerarquia',
    es: 'Has ignorado el paréntesis. Lo que hay dentro se calcula primero, antes de multiplicar.',
    en: 'You ignored the brackets. What is inside must be worked out first, before multiplying.' },
  parentesis_parcial: { concepto: 'jerarquia',
    es: 'Has multiplicado solo una parte del paréntesis. Primero se calcula el paréntesis completo y ese resultado es lo que se multiplica.',
    en: 'You multiplied only part of the brackets. Work out the whole bracket first; that result is what gets multiplied.' },
  parentesis_suma: { concepto: 'jerarquia',
    es: 'Te falta multiplicar: primero se suma lo del paréntesis y después se multiplica el resultado, no se suma todo seguido.',
    en: 'You forgot to multiply: first add what is inside the brackets, then multiply the result; do not just add everything.' },
  signo_antes_de_potencia: { concepto: 'jerarquia',
    es: 'Has multiplicado los signos antes de elevar. La potencia se calcula antes que el signo de delante: primero (−3)² = 9 y después 15 − 9 = 6.',
    en: 'You multiplied the signs before raising to the power. The power comes before the sign in front: first (−3)² = 9, then 15 − 9 = 6.' },
  elevar_signo: { concepto: 'jerarquia',
    es: 'Has elevado también el signo. Sin paréntesis, el exponente solo afecta al número: −3² = −9, no +9. Solo con paréntesis, (−3)², se eleva el signo.',
    en: 'You raised the sign too. Without brackets, the exponent only applies to the number: −3² = −9, not +9. Only with brackets, (−3)², is the sign raised.' },
  elevar_signo_parentesis: { concepto: 'jerarquia',
    es: 'Dentro del paréntesis, −3² es −9: el exponente no afecta al signo. Y restar −9 es sumar 9.',
    en: 'Inside the brackets, −3² is −9: the exponent does not apply to the sign. And subtracting −9 is adding 9.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  potencia_primero: { es: 'Primero la potencia.', en: 'First the power.' },
  producto_primero: { es: 'Primero el producto: la multiplicación va antes que la suma y la resta.', en: 'First the multiplication: it comes before addition and subtraction.' },
  productos_primero: { es: 'Primero los dos productos, cada uno por su lado.', en: 'First both multiplications, each on its own.' },
  parentesis_primero: { es: 'Primero lo que hay dentro del paréntesis.', en: 'First what is inside the brackets.' },
  izq_der: { es: 'Sumas y restas, de izquierda a derecha.', en: 'Additions and subtractions, from left to right.' },
  sumar: { es: 'Por último, la suma.', en: 'Finally, the addition.' },
  restar: { es: 'Por último, la resta.', en: 'Finally, the subtraction.' },
  multiplicar: { es: 'Por último, el producto.', en: 'Finally, the multiplication.' },
  potencia_negativa_par: { es: 'Con paréntesis se eleva todo el número, signo incluido: negativo por negativo da positivo.', en: 'With brackets the whole number is raised, sign included: negative times negative is positive.' },
  potencia_solo_numero: { es: 'Sin paréntesis, el exponente solo afecta al número, no al signo.', en: 'Without brackets, the exponent only applies to the number, not to the sign.' },
  restar_negativo: { es: 'Restar un número negativo es sumar.', en: 'Subtracting a negative number is adding.' },
};

const op = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const T = tex;

function generarSuma(rng) {
  // a + b·c²
  const a = rng.entero(1, 9), b = rng.entero(2, 9), c = rng.entero(2, 10);
  const C = c * c, P = b * C, R = a + P;
  const enunciado = `${a} + ${b} \\cdot ${c}^{2}`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${a} + ${b} \\cdot ${C}`, 'potencia_primero', `${c}^{2} = ${c} \\cdot ${c} = ${C}`),
      paso(`${a} + ${b} \\cdot ${C} = ${a} + ${P}`, 'producto_primero', `${b} \\cdot ${C} = ${P}`),
      paso(`${a} + ${P} = ${R}`, 'sumar'),
    ],
    distractores: [
      op(a + b * c * 2, E('potencia_como_producto'), [
        mal(`${enunciado} = ${a} + ${b} \\cdot ${c * 2}`, `${c}^{2} = ${c} \\cdot 2 = ${c * 2}`),
        paso(`${a} + ${b} \\cdot ${c * 2} = ${a} + ${b * c * 2}`),
        paso(`${a} + ${b * c * 2} = ${a + b * c * 2}`),
      ]),
      op((a + b) * C, E('izquierda_derecha'), [
        mal(`${enunciado} = ${a + b} \\cdot ${c}^{2}`, `${a} + ${b} = ${a + b}`),
        paso(`${a + b} \\cdot ${c}^{2} = ${a + b} \\cdot ${C}`),
        paso(`${a + b} \\cdot ${C} = ${(a + b) * C}`),
      ]),
      op(a + (b * c) * (b * c), E('elevar_producto'), [
        mal(`${enunciado} = ${a} + (${b} \\cdot ${c})^{2}`),
        paso(`${a} + (${b} \\cdot ${c})^{2} = ${a} + ${b * c}^{2}`, null, `${b} \\cdot ${c} = ${b * c}`),
        paso(`${a} + ${b * c}^{2} = ${a} + ${b * c * b * c} = ${a + b * c * b * c}`),
      ]),
      op(a + b * c, E('ignorar_exponente'), [
        mal(`${enunciado} = ${a} + ${b} \\cdot ${c}`),
        paso(`${a} + ${b} \\cdot ${c} = ${a} + ${b * c} = ${a + b * c}`),
      ]),
    ],
  };
}

function generarResta(rng) {
  // a − b·c  (con a > b·c para que salga positivo en 1º ESO)
  const b = rng.entero(2, 9), c = rng.entero(2, 9);
  const a = b * c + rng.entero(1, 20);
  const P = b * c, R = a - P;
  const enunciado = `${a} - ${b} \\cdot ${c}`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${a} - ${P}`, 'producto_primero', `${b} \\cdot ${c} = ${P}`),
      paso(`${a} - ${P} = ${R}`, 'restar'),
    ],
    distractores: [
      op((a - b) * c, E('izquierda_derecha'), [
        mal(`${enunciado} = ${a - b} \\cdot ${c}`, `${a} - ${b} = ${a - b}`),
        paso(`${a - b} \\cdot ${c} = ${(a - b) * c}`),
      ]),
      op(a - b + c, E('resta_izquierda_derecha'), [
        mal(`${enunciado} = ${a - b} + ${c}`, `${a} - ${b} = ${a - b}`),
        paso(`${a - b} + ${c} = ${a - b + c}`),
      ]),
    ],
    genericos: [op(R + 1), op(R - 1), op(a + P)],
  };
}

function generarParentesis(rng) {
  // (a + b)·c
  const a = rng.entero(1, 9), b = rng.entero(1, 9), c = rng.entero(2, 9);
  const S = a + b, R = S * c;
  const enunciado = `(${a} + ${b}) \\cdot ${c}`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${S} \\cdot ${c}`, 'parentesis_primero', `${a} + ${b} = ${S}`),
      paso(`${S} \\cdot ${c} = ${R}`, 'multiplicar'),
    ],
    distractores: [
      op(a + b * c, E('ignorar_parentesis'), [
        mal(`${enunciado} = ${a} + ${b} \\cdot ${c}`),
        paso(`${a} + ${b} \\cdot ${c} = ${a} + ${b * c} = ${a + b * c}`),
      ]),
      op(a * c + b, E('parentesis_parcial'), [
        mal(`${enunciado} = ${a} \\cdot ${c} + ${b}`),
        paso(`${a} \\cdot ${c} + ${b} = ${a * c} + ${b} = ${a * c + b}`),
      ]),
      op(a + b + c, E('parentesis_suma'), [
        mal(`${enunciado} = ${a} + ${b} + ${c}`),
        paso(`${a} + ${b} + ${c} = ${a + b + c}`),
      ]),
    ],
    genericos: [op(R + c)],
  };
}

function generarDosProductos(rng) {
  // a·b + c·d
  const a = rng.entero(2, 9), b = rng.entero(2, 9), c = rng.entero(2, 9), d = rng.entero(2, 9);
  const P = a * b, Q = c * d, R = P + Q;
  const enunciado = `${a} \\cdot ${b} + ${c} \\cdot ${d}`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${P} + ${Q}`, 'productos_primero', `${a} \\cdot ${b} = ${P}, \\quad ${c} \\cdot ${d} = ${Q}`),
      paso(`${P} + ${Q} = ${R}`, 'sumar'),
    ],
    distractores: [
      op((P + c) * d, E('izquierda_derecha'), [
        paso(`${enunciado} = ${P} + ${c} \\cdot ${d}`, null, `${a} \\cdot ${b} = ${P}`),
        mal(`${P} + ${c} \\cdot ${d} = ${P + c} \\cdot ${d}`, `${P} + ${c} = ${P + c}`),
        paso(`${P + c} \\cdot ${d} = ${(P + c) * d}`),
      ]),
      op(a * (b + c) * d, E('agrupar_suma'), [
        mal(`${enunciado} = ${a} \\cdot ${b + c} \\cdot ${d}`, `${b} + ${c} = ${b + c}`),
        paso(`${a} \\cdot ${b + c} \\cdot ${d} = ${a * (b + c) * d}`),
      ]),
    ],
    genericos: [op(P + c + d), op(a + b * c + d), op(a * b * c * d)],
  };
}

function generarMixta(rng) {
  // a + b·c − d
  const b = rng.entero(2, 9), c = rng.entero(2, 9);
  // d cerca de c para que el distractor a + b·(c − d) sea verosímil y no un negativo enorme.
  const a = rng.entero(1, 15), d = rng.entero(1, c + 3);
  const P = b * c, R = a + P - d;
  const enunciado = `${a} + ${b} \\cdot ${c} - ${d}`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${a} + ${P} - ${d}`, 'producto_primero', `${b} \\cdot ${c} = ${P}`),
      paso(`${a} + ${P} - ${d} = ${a + P} - ${d}`, 'izq_der', `${a} + ${P} = ${a + P}`),
      paso(`${a + P} - ${d} = ${R}`, 'restar'),
    ],
    distractores: [
      op((a + b) * c - d, E('izquierda_derecha'), [
        mal(`${enunciado} = ${a + b} \\cdot ${c} - ${d}`, `${a} + ${b} = ${a + b}`),
        paso(`${a + b} \\cdot ${c} - ${d} = ${(a + b) * c} - ${d} = ${(a + b) * c - d}`),
      ]),
      op(a + b * (c - d), E('agrupar_resta'), [
        mal(`${enunciado} = ${a} + ${b} \\cdot ${T(c - d)}`, `${c} - ${d} = ${T(c - d)}`),
        paso(`${a} + ${b} \\cdot ${T(c - d)} = ${a} + ${T(b * (c - d))} = ${T(a + b * (c - d))}`),
      ]),
    ],
    genericos: [op(a + P + d), op(a + b + c - d)],
  };
}

function generarPotenciaConSigno(rng) {
  const b = rng.entero(2, 9);
  const B = b * b;
  const forma = rng.entero(0, 2);
  if (forma === 0) {
    // a − (−b)²  = a − b²   (error típico: 15 + 3² por multiplicar los signos antes)
    const a = B + rng.entero(1, 20), R = a - B;
    const enunciado = `${a} - (-${b})^{2}`;
    return {
      enunciado,
      correcta: { tex: T(R), clave: R },
      solucion: [
        paso(`${enunciado} = ${a} - ${B}`, 'potencia_negativa_par', `(-${b})^{2} = (-${b}) \\cdot (-${b}) = ${B}`),
        paso(`${a} - ${B} = ${R}`, 'restar'),
      ],
      distractores: [
        op(a + B, E('signo_antes_de_potencia'), [
          mal(`${enunciado} = ${a} + ${b}^{2}`),
          paso(`${a} + ${b}^{2} = ${a} + ${B} = ${a + B}`),
        ]),
        op(a + b, E('ignorar_exponente'), [
          mal(`${enunciado} = ${a} - (-${b})`),
          paso(`${a} - (-${b}) = ${a} + ${b} = ${a + b}`),
        ]),
        op(a + 2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = ${a} - (-${2 * b})`, `(-${b})^{2} = (-${b}) \\cdot 2 = -${2 * b}`),
          paso(`${a} - (-${2 * b}) = ${a} + ${2 * b} = ${a + 2 * b}`),
        ]),
      ],
      genericos: [op(a - 2 * b)],
    };
  }
  if (forma === 1) {
    // a − b²  (error típico: 15 + 9 por elevar el signo)
    const a = B + rng.entero(1, 20), R = a - B;
    const enunciado = `${a} - ${b}^{2}`;
    return {
      enunciado,
      correcta: { tex: T(R), clave: R },
      solucion: [
        paso(`${enunciado} = ${a} - ${B}`, 'potencia_primero', `${b}^{2} = ${b} \\cdot ${b} = ${B}`),
        paso(`${a} - ${B} = ${R}`, 'restar'),
      ],
      distractores: [
        op(a + B, E('elevar_signo'), [
          mal(`${enunciado} = ${a} + ${B}`, `(-${b})^{2} = ${B}`),
          paso(`${a} + ${B} = ${a + B}`),
        ]),
        op((a - b) * (a - b), E('izquierda_derecha'), [
          mal(`${enunciado} = ${a - b}^{2}`, `${a} - ${b} = ${a - b}`),
          paso(`${a - b}^{2} = ${(a - b) * (a - b)}`),
        ]),
        op(a - 2 * b, E('potencia_como_producto'), [
          mal(`${enunciado} = ${a} - ${2 * b}`, `${b}^{2} = ${b} \\cdot 2 = ${2 * b}`),
          paso(`${a} - ${2 * b} = ${a - 2 * b}`),
        ]),
      ],
      genericos: [op(a - b)],
    };
  }
  // a − (−b²) = a + b²  (error típico: 15 − 9 por elevar el signo dentro del paréntesis)
  const a = rng.entero(1, 30), R = a + B;
  const enunciado = `${a} - (-${b}^{2})`;
  return {
    enunciado,
    correcta: { tex: T(R), clave: R },
    solucion: [
      paso(`${enunciado} = ${a} - (-${B})`, 'potencia_solo_numero', `-${b}^{2} = -(${b} \\cdot ${b}) = -${B}`),
      paso(`${a} - (-${B}) = ${a} + ${B}`, 'restar_negativo'),
      paso(`${a} + ${B} = ${R}`, 'sumar'),
    ],
    distractores: [
      op(a - B, E('elevar_signo_parentesis'), [
        mal(`${enunciado} = ${a} - (+${B})`, `(-${b})^{2} = ${B}`),
        paso(`${a} - ${B} = ${T(a - B)}`),
      ]),
      op(a + 2 * b, E('potencia_como_producto'), [
        mal(`${enunciado} = ${a} - (-${2 * b})`, `-${b}^{2} = -${b} \\cdot 2 = -${2 * b}`),
        paso(`${a} - (-${2 * b}) = ${a} + ${2 * b} = ${a + 2 * b}`),
      ]),
      op(a + b, E('ignorar_exponente'), [
        mal(`${enunciado} = ${a} - (-${b})`),
        paso(`${a} - (-${b}) = ${a} + ${b} = ${a + b}`),
      ]),
    ],
    genericos: [op(a - 2 * b)],
  };
}

const FORMAS = [generarSuma, generarSuma, generarResta, generarParentesis, generarDosProductos, generarMixta, generarPotenciaConSigno, generarPotenciaConSigno];

export default {
  id: 'jerarquia',
  nombre: { es: 'Jerarquía de las operaciones', en: 'Order of operations' },
  curso: 1,
  concepto: 'jerarquia',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const forma = rng.elegir(FORMAS);
    const { enunciado, correcta, solucion, distractores, genericos } = forma(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: { clave: 'calcula' }, enunciado, solucion, opciones };
  }),
};
