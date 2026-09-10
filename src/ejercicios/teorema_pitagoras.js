// Teorema de Pitágoras: hallar la hipotenusa o un cateto de un triángulo
// rectángulo. Usa ternas pitagóricas (escaladas) para que la raíz cuadrada
// final salga siempre exacta.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  no_eleva_al_cuadrado: { concepto: 'teorema_pitagoras',
    es: 'El teorema de Pitágoras trabaja con los cuadrados de los lados, no con los lados directamente.', en: "Pythagoras' theorem works with the squares of the sides, not with the sides directly." },
  olvida_raiz_cuadrada: { concepto: 'teorema_pitagoras',
    es: 'Te falta el último paso: la raíz cuadrada.', en: 'You are missing the last step: the square root.' },
};
const E = erroresDe(errores);

export const preguntas = {
  hipotenusa: { es: 'En un triángulo rectángulo, los catetos miden {a} y {b} cm. ¿Cuánto mide la hipotenusa?', en: 'In a right triangle, the legs measure {a} and {b} cm. What is the length of the hypotenuse?' },
  cateto: { es: 'En un triángulo rectángulo, la hipotenusa mide {c} cm y un cateto mide {a} cm. ¿Cuánto mide el otro cateto?', en: 'In a right triangle, the hypotenuse measures {c} cm and one leg measures {a} cm. What is the length of the other leg?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  suma_cuadrados: { es: 'La hipotenusa al cuadrado es la suma de los cuadrados de los catetos.', en: 'The hypotenuse squared is the sum of the squares of the legs.' },
  resta_cuadrados: { es: 'Un cateto al cuadrado es la hipotenusa al cuadrado menos el otro cateto al cuadrado.', en: 'One leg squared is the hypotenuse squared minus the other leg squared.' },
  raiz_cuadrada: { es: 'Y hacemos la raíz cuadrada.', en: 'And we take the square root.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

const TERNAS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [12, 16, 20]];

function hipotenusa(rng) {
  const [a, b, c] = rng.elegir(TERNAS);
  const k = rng.entero(1, 10);
  const A = a * k, B = b * k, C = c * k;
  return {
    texto: { clave: 'hipotenusa', params: { a: A, b: B } },
    enunciado: '',
    correcta: num(C),
    solucion: [
      paso(`${A}^{2} + ${B}^{2} = ${T(A * A)} + ${T(B * B)} = ${T(A * A + B * B)}`, 'suma_cuadrados'),
      paso(`\\sqrt{${A * A + B * B}} = ${T(C)}`, 'raiz_cuadrada'),
    ],
    distractores: [
      num(A + B, E('no_eleva_al_cuadrado'), [
        mal(`${A} + ${B} = ${T(A + B)}`),
      ]),
      num(A * A + B * B, E('olvida_raiz_cuadrada'), [
        paso(`${A}^{2} + ${B}^{2} = ${T(A * A)} + ${T(B * B)} = ${T(A * A + B * B)}`),
        mal(`x = ${T(A * A + B * B)}`),
      ]),
    ],
    genericos: [num(C + 1), num(Math.max(1, C - 1))],
  };
}

function cateto(rng) {
  const [a, b, c] = rng.elegir(TERNAS);
  const k = rng.entero(1, 10);
  const A = a * k, B = b * k, C = c * k;
  return {
    texto: { clave: 'cateto', params: { a: A, c: C } },
    enunciado: '',
    correcta: num(B),
    solucion: [
      paso(`${C}^{2} - ${A}^{2} = ${T(C * C)} - ${T(A * A)} = ${T(C * C - A * A)}`, 'resta_cuadrados'),
      paso(`\\sqrt{${C * C - A * A}} = ${T(B)}`, 'raiz_cuadrada'),
    ],
    distractores: [
      num(C - A, E('no_eleva_al_cuadrado'), [
        mal(`${C} - ${A} = ${T(C - A)}`),
      ]),
      num(C * C - A * A, E('olvida_raiz_cuadrada'), [
        paso(`${C}^{2} - ${A}^{2} = ${T(C * C)} - ${T(A * A)} = ${T(C * C - A * A)}`),
        mal(`x = ${T(C * C - A * A)}`),
      ]),
    ],
    genericos: [num(B + 1), num(Math.max(1, B - 1))],
  };
}

const FORMAS = [hipotenusa, hipotenusa, cateto, cateto];

export default {
  id: 'teorema_pitagoras',
  nombre: { es: 'Teorema de Pitágoras', en: "Pythagoras' theorem" },
  curso: 1,
  concepto: 'teorema_pitagoras',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
