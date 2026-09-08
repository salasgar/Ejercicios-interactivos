// Fracciones equivalentes: reconocer una equivalente y simplificar.

import { construirOpciones, conReintentos, erroresDe, texFraccion, claveFraccion, mcd } from './index.js';

export const errores = {
  sumar_mismo_numero: { concepto: 'fracciones_equivalentes',
    es: 'Para obtener una fracción equivalente se multiplica (o divide) numerador y denominador por el mismo número; sumar no vale.', en: 'To get an equivalent fraction you multiply (or divide) the numerator and the denominator by the same number; adding does not work.' },
  solo_numerador: { concepto: 'fracciones_equivalentes',
    es: 'Hay que multiplicar el numerador y el denominador por el mismo número, no solo uno de los dos.', en: 'You need to multiply the numerator and the denominator by the same number, not just one of them.' },
  solo_denominador: { concepto: 'fracciones_equivalentes',
    es: 'Hay que multiplicar el numerador y el denominador por el mismo número, no solo uno de los dos.', en: 'You need to multiply the numerator and the denominator by the same number, not just one of them.' },
  invertir: { concepto: 'fracciones_equivalentes',
    es: 'Has intercambiado numerador y denominador: la fracción invertida no es equivalente.', en: 'You swapped the numerator and the denominator: the flipped fraction is not equivalent.' },
  simplificar_uno_solo: { concepto: 'fracciones_equivalentes',
    es: 'Al simplificar hay que dividir numerador y denominador por el mismo número.', en: 'To simplify, you must divide the numerator and the denominator by the same number.' },
  restar_mismo_numero: { concepto: 'fracciones_equivalentes',
    es: 'Simplificar es dividir arriba y abajo por el mismo número; restar cambia el valor de la fracción.', en: 'Simplifying means dividing the top and bottom by the same number; subtracting changes the value of the fraction.' },
};
const E = erroresDe(errores);

export const preguntas = {
  equivalente_a: { es: '¿Qué fracción es equivalente a esta?', en: 'Which fraction is equivalent to this one?' },
  simplifica: { es: 'Simplifica la fracción:', en: 'Simplify the fraction:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  multiplicar_mismo_numero: { es: 'Multiplicamos numerador y denominador por el mismo número.', en: 'We multiply the numerator and the denominator by the same number.' },
  simplificar: { es: 'Simplificamos dividiendo numerador y denominador por el mismo número.', en: 'We simplify by dividing the numerator and the denominator by the same number.' },
};

const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function fraccionIrreducible(rng) {
  let n = rng.entero(1, 9), d = rng.entero(2, 9);
  while (n === d || mcd(n, d) !== 1) { n = rng.entero(1, 9); d = rng.entero(2, 9); }
  return [n, d];
}

function equivalente(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.entero(2, 5);
  const enunciado = `\\frac{${n}}{${d}}`;
  const N = n * k, D = d * k;
  return {
    texto: { clave: 'equivalente_a' },
    enunciado,
    correcta: fr(N, D),
    solucion: [
      paso(`${enunciado} = \\frac{${n} \\cdot ${k}}{${d} \\cdot ${k}} = ${texFraccion(N, D)}`, 'multiplicar_mismo_numero'),
    ],
    distractores: [
      fr(n + k, d + k, E('sumar_mismo_numero'), [
        mal(`${enunciado} = \\frac{${n} + ${k}}{${d} + ${k}} = ${texFraccion(n + k, d + k)}`),
      ]),
      fr(N, d, E('solo_numerador'), [
        mal(`${enunciado} = \\frac{${n} \\cdot ${k}}{${d}} = ${texFraccion(N, d)}`),
      ]),
      fr(n, D, E('solo_denominador'), [
        mal(`${enunciado} = \\frac{${n}}{${d} \\cdot ${k}} = ${texFraccion(n, D)}`),
      ]),
      fr(D, N, E('invertir'), [
        mal(`${enunciado} = \\frac{${d}}{${n}}`),
        paso(`\\frac{${d}}{${n}} = \\frac{${d} \\cdot ${k}}{${n} \\cdot ${k}} = ${texFraccion(D, N)}`),
      ]),
    ],
  };
}

function simplificar(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.entero(2, 6);
  const N = n * k, D = d * k;
  const j = rng.entero(1, Math.min(N, D) - 1);
  const enunciado = `\\frac{${N}}{${D}}`;
  return {
    texto: { clave: 'simplifica' },
    enunciado,
    correcta: fr(n, d),
    solucion: [
      paso(`${enunciado} = \\frac{${N} \\div ${k}}{${D} \\div ${k}} = ${texFraccion(n, d)}`, 'simplificar', `\\text{mcd}(${N}, ${D}) = ${k}`),
    ],
    distractores: [
      fr(n, D, E('simplificar_uno_solo'), [
        mal(`${enunciado} = \\frac{${N} \\div ${k}}{${D}} = ${texFraccion(n, D)}`),
      ]),
      fr(N, d, E('simplificar_uno_solo'), [
        mal(`${enunciado} = \\frac{${N}}{${D} \\div ${k}} = ${texFraccion(N, d)}`),
      ]),
      fr(N - j, D - j, E('restar_mismo_numero'), [
        mal(`${enunciado} = \\frac{${N} - ${j}}{${D} - ${j}} = ${texFraccion(N - j, D - j)}`),
      ]),
      fr(d, n, E('invertir'), [
        paso(`${enunciado} = \\frac{${N} \\div ${k}}{${D} \\div ${k}} = ${texFraccion(n, d)}`),
        mal(`${texFraccion(n, d)} = \\frac{${d}}{${n}}`),
      ]),
    ],
  };
}

const FORMAS = [equivalente, simplificar];

export default {
  id: 'fracciones_equivalentes',
  nombre: { es: 'Fracciones equivalentes', en: 'Equivalent fractions' },
  curso: 1,
  concepto: 'fracciones_equivalentes',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, distractores, solucion } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
