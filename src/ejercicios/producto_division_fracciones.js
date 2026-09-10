// Multiplicación y división de fracciones. El resultado correcto se da
// simplificado, y ningún distractor tiene el mismo valor que él.

import { construirOpciones, conReintentos, erroresDe, texFraccion, claveFraccion, mcd, mcm, reducir } from './index.js';

export const errores = {
  denominador_de_una_sola: { concepto: 'producto_division_fracciones',
    es: 'En un producto de fracciones se multiplican los dos numeradores entre sí y los dos denominadores entre sí, no solo uno.', en: 'In a product of fractions you multiply both numerators together and both denominators together, not just one.' },
  multiplica_cruzado: { concepto: 'producto_division_fracciones',
    es: 'Has multiplicado en cruz, pero eso no es multiplicar fracciones: numerador con numerador y denominador con denominador.', en: 'You multiplied crosswise, but that is not how you multiply fractions: numerator with numerator and denominator with denominator.' },
  suma_en_vez_de_multiplicar: { concepto: 'producto_division_fracciones',
    es: 'Has sumado como si fuera una suma de fracciones. En un producto no hace falta común denominador: se multiplica directamente.', en: 'You added as if it were a sum of fractions. In a product you do not need a common denominator: you multiply directly.' },
  no_invertir: { concepto: 'producto_division_fracciones',
    es: 'Para dividir fracciones hay que multiplicar por la fracción inversa de la segunda, no multiplicar directamente.', en: 'To divide fractions you must multiply by the reciprocal of the second one, not multiply directly.' },
  invierte_la_primera: { concepto: 'producto_division_fracciones',
    es: 'Se invierte la segunda fracción, no la primera.', en: 'It is the second fraction that gets flipped, not the first.' },
  invierte_las_dos: { concepto: 'producto_division_fracciones',
    es: 'Solo se invierte la segunda fracción; la primera se queda igual.', en: 'Only the second fraction gets flipped; the first one stays the same.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  multiplicar_directo: { es: 'Se multiplican los numeradores entre sí y los denominadores entre sí.', en: 'You multiply the numerators together and the denominators together.' },
  invertir_segunda: { es: 'Dividir entre una fracción es multiplicar por su inversa.', en: 'Dividing by a fraction is the same as multiplying by its reciprocal.' },
  simplificar: { es: 'Por último, simplificamos dividiendo numerador y denominador por el mismo número.', en: 'Finally, we simplify by dividing numerator and denominator by the same number.' },
};

const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

/** Paso final de simplificación, solo si la fracción no está ya reducida. */
function pasoSimplificar(sinSimplificar, num, den, nR, dR) {
  const divisor = mcd(num, den);
  if (divisor <= 1) return [];
  return [paso(`${sinSimplificar} = ${texFraccion(nR, dR)}`, 'simplificar', `\\text{mcd}(${num}, ${den}) = ${divisor}`)];
}

function producto(rng) {
  const a = rng.entero(1, 9), b = rng.entero(2, 9);
  const c = rng.entero(1, 9), d = rng.entero(2, 9);
  const numCorrecto = a * c, denCorrecto = b * d;
  const [nR, dR] = reducir(numCorrecto, denCorrecto);
  const enunciado = `\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}}`;
  const sinSimplificar = texFraccion(numCorrecto, denCorrecto);
  const m = mcm(b, d);
  const A = a * (m / b), C = c * (m / d);
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${sinSimplificar}`, 'multiplicar_directo'),
      ...pasoSimplificar(sinSimplificar, numCorrecto, denCorrecto, nR, dR),
    ],
    distractores: [
      fr(a * c, b, E('denominador_de_una_sola'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b}} = ${texFraccion(a * c, b)}`),
      ]),
      fr(a * d, b * c, E('multiplica_cruzado'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${texFraccion(a * d, b * c)}`),
      ]),
      fr(A + C, m, E('suma_en_vez_de_multiplicar'), [
        mal(`${enunciado} = \\frac{${A}}{${m}} + \\frac{${C}}{${m}} = ${texFraccion(A + C, m)}`, `\\text{mcm}(${b}, ${d}) = ${m}`),
      ]),
    ],
  };
}

function division(rng) {
  const a = rng.entero(1, 9), b = rng.entero(2, 9);
  const c = rng.entero(1, 9), d = rng.entero(2, 9);
  const numCorrecto = a * d, denCorrecto = b * c;
  const [nR, dR] = reducir(numCorrecto, denCorrecto);
  const enunciado = `\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}}`;
  const sinSimplificar = texFraccion(numCorrecto, denCorrecto);
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = \\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}}`, 'invertir_segunda'),
      paso(`\\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${sinSimplificar}`, 'multiplicar_directo'),
      ...pasoSimplificar(sinSimplificar, numCorrecto, denCorrecto, nR, dR),
    ],
    distractores: [
      fr(a * c, b * d, E('no_invertir'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${texFraccion(a * c, b * d)}`),
      ]),
      fr(b * c, a * d, E('invierte_la_primera'), [
        mal(`${enunciado} = \\frac{${b}}{${a}} \\cdot \\frac{${c}}{${d}} = \\frac{${b} \\cdot ${c}}{${a} \\cdot ${d}} = ${texFraccion(b * c, a * d)}`),
      ]),
      fr(b * d, a * c, E('invierte_las_dos'), [
        mal(`${enunciado} = \\frac{${b}}{${a}} \\cdot \\frac{${d}}{${c}} = \\frac{${b} \\cdot ${d}}{${a} \\cdot ${c}} = ${texFraccion(b * d, a * c)}`),
      ]),
    ],
  };
}

const FORMAS = [producto, producto, division, division];

export default {
  id: 'producto_division_fracciones',
  nombre: { es: 'Multiplicación y división de fracciones', en: 'Multiplying and dividing fractions' },
  curso: 1,
  concepto: 'producto_division_fracciones',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: { clave: 'calcula' }, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
};
