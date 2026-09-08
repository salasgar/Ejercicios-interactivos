// Suma y resta de fracciones con distinto denominador. El resultado correcto
// se da simplificado, y ningún distractor tiene el mismo valor que él.

import { construirOpciones, conReintentos, erroresDe, texFraccion, claveFraccion, mcm, mcd, reducir } from './index.js';

export const errores = {
  sumar_numeradores_y_denominadores: { concepto: 'suma_fracciones',
    es: 'No se suman los denominadores: primero se reducen a común denominador y luego se suman solo los numeradores.', en: 'You do not add the denominators: first find a common denominator, then add only the numerators.' },
  no_multiplicar_numerador: { concepto: 'suma_fracciones',
    es: 'Al cambiar el denominador hay que multiplicar también el numerador por el mismo número.', en: 'When you change the denominator, you must also multiply the numerator by the same number.' },
  convertir_una_sola: { concepto: 'suma_fracciones',
    es: 'Las dos fracciones tienen que ponerse con el denominador común, no solo una de ellas.', en: 'Both fractions need to be converted to the common denominator, not just one of them.' },
  orden_resta: { concepto: 'suma_fracciones',
    es: 'Cuidado con el orden de la resta: el signo del resultado depende de cuál fracción es mayor.', en: 'Watch the order of the subtraction: the sign of the result depends on which fraction is bigger.' },
  multiplicar_numeradores: { concepto: 'suma_fracciones',
    es: 'Es una suma, no un producto: con el mismo denominador se suman los numeradores.', en: 'It is a sum, not a product: with the same denominator, you add the numerators.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  comun_denominador: { es: 'Reducimos a común denominador.', en: 'We convert to a common denominator.' },
  sumar_numeradores: { es: 'Ahora se suman los numeradores; el denominador no cambia.', en: 'Now we add the numerators; the denominator stays the same.' },
  restar_numeradores: { es: 'Ahora se restan los numeradores; el denominador no cambia.', en: 'Now we subtract the numerators; the denominator stays the same.' },
  simplificar: { es: 'Por último, simplificamos dividiendo numerador y denominador por el mismo número.', en: 'Finally, we simplify by dividing numerator and denominator by the same number.' },
};

const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function generar(rng) {
  let b = rng.entero(2, 8), d = rng.entero(2, 8);
  while (b === d) d = rng.entero(2, 8);
  const a = rng.entero(1, b - 1), c = rng.entero(1, d - 1);
  const resta = rng.moneda(0.4);
  const m = mcm(b, d);
  const A = a * (m / b), C = c * (m / d);
  const signo = resta ? -1 : 1;
  const numCorrecto = A + signo * C;
  if (numCorrecto === 0) return null;
  const operador = resta ? '-' : '+';
  const enunciado = `\\frac{${a}}{${b}} ${operador} \\frac{${c}}{${d}}`;
  const notaCombinar = resta ? 'restar_numeradores' : 'sumar_numeradores';
  const combinado = `\\frac{${A}}{${m}} ${operador} \\frac{${C}}{${m}}`;
  // La respuesta correcta se da simplificada; si hace falta, un paso más.
  const [nR, dR] = reducir(numCorrecto, m);
  const divisor = mcd(numCorrecto, m);
  const sinSimplificar = texFraccion(numCorrecto, m);
  const pasoSimplificar = divisor > 1
    ? [paso(`${sinSimplificar} = ${texFraccion(Math.sign(numCorrecto) * Math.abs(numCorrecto) / divisor, 1) === texFraccion(nR, dR) ? sinSimplificar : `\\frac{${Math.abs(numCorrecto)} \\div ${divisor}}{${m} \\div ${divisor}}`} = ${texFraccion(nR, dR)}`.replace(`${sinSimplificar} = ${sinSimplificar} = `, `${sinSimplificar} = `), 'simplificar', `\\text{mcd}(${Math.abs(numCorrecto)}, ${m}) = ${divisor}`)]
    : [];
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = ${combinado}`, 'comun_denominador', `\\text{mcm}(${b}, ${d}) = ${m}`),
      paso(`${combinado} = ${sinSimplificar}`, notaCombinar),
      ...pasoSimplificar,
    ],
    distractores: [
      fr(a + signo * c, b + d, E('sumar_numeradores_y_denominadores'), [
        mal(`${enunciado} = \\frac{${a} ${operador} ${c}}{${b} + ${d}} = ${texFraccion(a + signo * c, b + d)}`),
      ]),
      fr(a + signo * c, m, E('no_multiplicar_numerador'), [
        mal(`${enunciado} = \\frac{${a} ${operador} ${c}}{${m}} = ${texFraccion(a + signo * c, m)}`),
      ]),
      fr(A + signo * c, m, E('convertir_una_sola'), [
        mal(`${enunciado} = \\frac{${A}}{${m}} ${operador} \\frac{${c}}{${m}} = ${texFraccion(A + signo * c, m)}`),
      ]),
      fr(a + signo * C, m, E('convertir_una_sola'), [
        mal(`${enunciado} = \\frac{${a}}{${m}} ${operador} \\frac{${C}}{${m}} = ${texFraccion(a + signo * C, m)}`),
      ]),
      resta
        ? fr(-nR, dR, E('orden_resta'), [
            paso(`${enunciado} = ${combinado}`, null, `\\text{mcm}(${b}, ${d}) = ${m}`),
            mal(`${combinado} = \\frac{${C} - ${A}}{${m}} = ${texFraccion(-numCorrecto, m)}${divisor > 1 ? ` = ${texFraccion(-nR, dR)}` : ''}`),
          ])
        : fr(A * C, m, E('multiplicar_numeradores'), [
            paso(`${enunciado} = ${combinado}`, null, `\\text{mcm}(${b}, ${d}) = ${m}`),
            mal(`${combinado} = \\frac{${A} \\cdot ${C}}{${m}} = ${texFraccion(A * C, m)}`),
          ]),
    ],
  };
}

export default {
  id: 'suma_fracciones',
  nombre: { es: 'Suma y resta de fracciones', en: 'Adding and subtracting fractions' },
  curso: 1,
  concepto: 'suma_fracciones',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = generar(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: { clave: 'calcula' }, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
};
