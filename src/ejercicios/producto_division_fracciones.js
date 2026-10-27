// Multiplicación, división y potencias de fracciones (unidad 4, semanas 2 y 3).
// El resultado correcto se da irreducible y ningún distractor tiene el mismo
// valor que él.
//
// Cada forma es un subtipo con las destrezas del inventario de la unidad 4 que
// cubre (`items`, como en enteros.js). Ni decimales ni números mixtos; las
// negativas entran en U4-3C-10 (acta del 26-10) y las potencias solo de base
// positiva (U4-2C-12). La división vale por los dos métodos (por la inversa o
// en cruz): no es un error, y por eso la forma `division` no lo trata como tal.

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
  natural_denominador: { concepto: 'producto_division_fracciones',
    es: 'Un natural por una fracción solo multiplica al numerador: el denominador no cambia.', en: 'A whole number times a fraction only multiplies the numerator: the denominator does not change.' },
  elevar_solo_numerador: { concepto: 'producto_division_fracciones',
    es: 'El exponente afecta al numerador y al denominador: (2/3)² = 2²/3².', en: 'The exponent applies to the numerator and the denominator: (2/3)² = 2²/3².' },
  multiplicar_por_exponente: { concepto: 'producto_division_fracciones',
    es: 'Elevar al cuadrado no es multiplicar por 2: es multiplicar la fracción por sí misma.', en: 'Squaring is not multiplying by 2: it is multiplying the fraction by itself.' },
  perder_signo: { concepto: 'producto_division_fracciones',
    es: 'Regla de los signos: signos distintos dan −, signos iguales dan +. Comprueba el signo del resultado.', en: 'Rule of signs: different signs give −, equal signs give +. Check the sign of the result.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  multiplicar_directo: { es: 'Se multiplican los numeradores entre sí y los denominadores entre sí.', en: 'You multiply the numerators together and the denominators together.' },
  invertir_segunda: { es: 'Dividir entre una fracción es multiplicar por su inversa.', en: 'Dividing by a fraction is the same as multiplying by its reciprocal.' },
  simplificar: { es: 'Por último, simplificamos dividiendo numerador y denominador por el mismo número.', en: 'Finally, we simplify by dividing numerator and denominator by the same number.' },
  natural_como_fraccion: { es: 'Un número natural es una fracción de denominador 1.', en: 'A whole number is a fraction with denominator 1.' },
  elevar_los_dos: { es: 'Se elevan el numerador y el denominador al exponente.', en: 'Raise the numerator and the denominator to the power.' },
  signos: { es: 'Regla de los signos: signos distintos dan negativo, signos iguales dan positivo.', en: 'Rule of signs: different signs give a negative, equal signs give a positive.' },
};

const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

/** Los distractores documentados, barajados (el motor se planta en tres), y después los de relleno, también barajados. */
const pool = (rng, documentados, extras = []) => rng.barajar(documentados.filter(Boolean)).concat(rng.barajar(extras.filter(Boolean)));

/** Paso final de simplificación, solo si la fracción no está ya reducida. */
function pasoSimplificar(sinSimplificar, num, den, nR, dR) {
  const divisor = mcd(num, den);
  if (divisor <= 1) return [];
  return [paso(`${sinSimplificar} = ${texFraccion(nR, dR)}`, 'simplificar', `\\text{mcd}(${Math.abs(num)}, ${den}) = ${divisor}`)];
}

/** Una fracción propia o impropia cualquiera que no valga 1 (6/6 se deja para otras destrezas). */
function unaFraccion(rng, maxNum = 9, maxDen = 9) {
  let n, d;
  do { n = rng.entero(1, maxNum); d = rng.entero(2, maxDen); } while (mcd(n, d) !== 1); // irreducible (y, por tanto, distinta de 1)
  return [n, d];
}

const frac = (n, d) => `\\frac{${n}}{${d}}`;

/** U4-2C-08 · un natural por una fracción: 3 · 2/5. */
function naturalPorFraccion(rng) {
  const n = rng.entero(2, 9);
  const [a, b] = unaFraccion(rng, 8, 9);
  const enunciado = rng.moneda(0.5) ? `${n} \\cdot ${frac(a, b)}` : `${frac(a, b)} \\cdot ${n}`;
  const [nR, dR] = reducir(n * a, b);
  const sinSimplificar = texFraccion(n * a, b);
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = ${frac(n, 1)} \\cdot ${frac(a, b)} = \\frac{${n} \\cdot ${a}}{1 \\cdot ${b}} = ${sinSimplificar}`, 'natural_como_fraccion'),
      ...pasoSimplificar(sinSimplificar, n * a, b, nR, dR),
    ],
    distractores: pool(rng, [
      fr(n * a, n * b, E('natural_denominador'), [mal(`${enunciado} = \\frac{${n} \\cdot ${a}}{${n} \\cdot ${b}} = ${texFraccion(n * a, n * b)}`)]),
      fr(n * b + a, b, E('suma_en_vez_de_multiplicar'), [mal(`${enunciado} = \\frac{${n} \\cdot ${b} + ${a}}{${b}} = ${texFraccion(n * b + a, b)}`)]),
      fr(n * b, a, E('multiplica_cruzado'), [mal(`${enunciado} = \\frac{${n} \\cdot ${b}}{${a}} = ${texFraccion(n * b, a)}`)]),
    ]),
  };
}

/** U4-2C-09 · producto de dos fracciones; a veces con el mismo denominador (2/5 · 3/5). */
function producto(rng) {
  const [a, b] = unaFraccion(rng);
  let [c, d] = unaFraccion(rng);
  if (rng.moneda(0.25)) { // mismo denominador: 2/5 · 3/5
    d = b;
    while (mcd(c, d) !== 1) c = rng.entero(1, d - 1);
  }
  const numCorrecto = a * c, denCorrecto = b * d;
  const [nR, dR] = reducir(numCorrecto, denCorrecto);
  const enunciado = `${frac(a, b)} \\cdot ${frac(c, d)}`;
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
    distractores: pool(rng, [
      fr(a * c, b, E('denominador_de_una_sola'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b}} = ${texFraccion(a * c, b)}`),
      ]),
      fr(a * d, b * c, E('multiplica_cruzado'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${texFraccion(a * d, b * c)}`),
      ]),
      fr(A + C, m, E('suma_en_vez_de_multiplicar'), [
        mal(`${enunciado} = ${frac(A, m)} + ${frac(C, m)} = ${texFraccion(A + C, m)}`, `\\text{mcm}(${b}, ${d}) = ${m}`),
      ]),
    ], [
      fr(a * c, b + d, E('suma_en_vez_de_multiplicar'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b} + ${d}} = ${texFraccion(a * c, b + d)}`),
      ]),
    ]),
  };
}

/** U4-2C-12 · potencia de una fracción de base positiva: (2/3)², (1/2)³, (3/2)². */
function potencia(rng) {
  const [a, b] = unaFraccion(rng, 5, 6);
  const e = rng.moneda(0.7) ? 2 : 3;
  const N = a ** e, D = b ** e;
  const [nR, dR] = reducir(N, D);
  const enunciado = `\\left(${frac(a, b)}\\right)^{${e}}`;
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = \\frac{${a}^{${e}}}{${b}^{${e}}} = ${texFraccion(N, D)}`, 'elevar_los_dos'),
      ...pasoSimplificar(texFraccion(N, D), N, D, nR, dR),
    ],
    distractores: pool(rng, [
      fr(N, b, E('elevar_solo_numerador'), [mal(`${enunciado} = \\frac{${a}^{${e}}}{${b}} = ${texFraccion(N, b)}`)]),
      fr(a * e, b * e, E('multiplicar_por_exponente'), [mal(`${enunciado} = \\frac{${a} \\cdot ${e}}{${b} \\cdot ${e}} = ${texFraccion(a * e, b * e)}`)]),
      fr(a, D, E('elevar_solo_numerador'), [mal(`${enunciado} = \\frac{${a}}{${b}^{${e}}} = ${texFraccion(a, D)}`)]),
    ]),
  };
}

/** U4-3C-06 · cociente de dos fracciones (por la inversa o en cruz: los dos métodos valen). */
function division(rng) {
  const [a, b] = unaFraccion(rng);
  const [c, d] = unaFraccion(rng);
  const numCorrecto = a * d, denCorrecto = b * c;
  const [nR, dR] = reducir(numCorrecto, denCorrecto);
  const enunciado = `${frac(a, b)} \\div ${frac(c, d)}`;
  const sinSimplificar = texFraccion(numCorrecto, denCorrecto);
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = ${frac(a, b)} \\cdot ${frac(d, c)}`, 'invertir_segunda'),
      paso(`${frac(a, b)} \\cdot ${frac(d, c)} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${sinSimplificar}`, 'multiplicar_directo'),
      ...pasoSimplificar(sinSimplificar, numCorrecto, denCorrecto, nR, dR),
    ],
    distractores: pool(rng, [
      fr(a * c, b * d, E('no_invertir'), [
        mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${texFraccion(a * c, b * d)}`),
      ]),
      fr(b * c, a * d, E('invierte_la_primera'), [
        mal(`${enunciado} = ${frac(b, a)} \\cdot ${frac(c, d)} = \\frac{${b} \\cdot ${c}}{${a} \\cdot ${d}} = ${texFraccion(b * c, a * d)}`),
      ]),
      fr(b * d, a * c, E('invierte_las_dos'), [
        mal(`${enunciado} = ${frac(b, a)} \\cdot ${frac(d, c)} = \\frac{${b} \\cdot ${d}}{${a} \\cdot ${c}} = ${texFraccion(b * d, a * c)}`),
      ]),
    ]),
  };
}

/** U4-3C-07 · un natural entre una fracción, o una fracción entre un natural. */
function divisionConNatural(rng) {
  const [a, b] = unaFraccion(rng, 8, 9);
  const n = rng.entero(2, 9);
  const naturalPrimero = rng.moneda(0.5);
  if (naturalPrimero) {
    // n : a/b = n · b/a
    const [nR, dR] = reducir(n * b, a);
    const enunciado = `${n} \\div ${frac(a, b)}`;
    const sin = texFraccion(n * b, a);
    return {
      enunciado,
      correcta: fr(nR, dR),
      solucion: [
        paso(`${enunciado} = ${n} \\cdot ${frac(b, a)}`, 'invertir_segunda'),
        paso(`${n} \\cdot ${frac(b, a)} = \\frac{${n} \\cdot ${b}}{${a}} = ${sin}`, 'multiplicar_directo'),
        ...pasoSimplificar(sin, n * b, a, nR, dR),
      ],
      distractores: pool(rng, [
        fr(n * a, b, E('no_invertir'), [mal(`${enunciado} = ${n} \\cdot ${frac(a, b)} = ${texFraccion(n * a, b)}`)]),
        fr(a, n * b, E('invierte_la_primera'), [mal(`${enunciado} = ${frac(1, n)} \\cdot ${frac(a, b)} = ${texFraccion(a, n * b)}`)]),
        fr(b, n * a, E('invierte_las_dos'), [mal(`${enunciado} = ${frac(1, n)} \\cdot ${frac(b, a)} = ${texFraccion(b, n * a)}`)]),
      ]),
    };
  }
  // a/b : n = a/b · 1/n
  const [nR, dR] = reducir(a, b * n);
  const enunciado = `${frac(a, b)} \\div ${n}`;
  const sin = texFraccion(a, b * n);
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = ${frac(a, b)} \\cdot ${frac(1, n)}`, 'invertir_segunda'),
      paso(`${frac(a, b)} \\cdot ${frac(1, n)} = \\frac{${a} \\cdot 1}{${b} \\cdot ${n}} = ${sin}`, 'multiplicar_directo'),
      ...pasoSimplificar(sin, a, b * n, nR, dR),
    ],
    distractores: pool(rng, [
      fr(a * n, b, E('no_invertir'), [mal(`${enunciado} = \\frac{${a} \\cdot ${n}}{${b}} = ${texFraccion(a * n, b)}`)]),
      fr(b, a * n, E('invierte_la_primera'), [mal(`${enunciado} = ${frac(b, a)} \\cdot ${frac(1, n)} = ${texFraccion(b, a * n)}`)]),
      fr(b * n, a, E('invierte_las_dos'), [mal(`${enunciado} = ${frac(b, a)} \\cdot ${frac(n, 1)} = ${texFraccion(b * n, a)}`)]),
    ]),
  };
}

/** U4-3C-10 · producto y cociente con una fracción negativa: -2/3 · 3/4. */
function conNegativas(rng) {
  const [a, b] = unaFraccion(rng, 8, 9);
  const [c, d] = unaFraccion(rng, 8, 9);
  const division = rng.moneda(0.4);
  // El negativo es el primero (sin paréntesis) o el segundo (entre paréntesis).
  const primeroNegativo = rng.moneda(0.5);
  const sa = primeroNegativo ? -1 : 1, sc = primeroNegativo ? 1 : -1;
  const op = division ? '\\div' : '\\cdot';
  const sinDiv = (x, y) => (division ? [x * d, y * c] : [x * c, y * d]);
  const [pn, pd] = division ? [a * d, b * c] : [a * c, b * d];
  const numCorrecto = sa * sc * pn; // un solo negativo: el resultado siempre es negativo
  const [nR, dR] = reducir(numCorrecto, pd);
  const primero = `${sa < 0 ? '-' : ''}${frac(a, b)}`;
  const segundo = sc < 0 ? `\\left(-${frac(c, d)}\\right)` : frac(c, d);
  const enunciado = `${primero} ${op} ${segundo}`;
  const sin = texFraccion(numCorrecto, pd);
  const g = mcd(numCorrecto, pd);
  const inversa = `${sc < 0 ? '-' : ''}${frac(division ? d : c, division ? c : d)}`;
  return {
    texto: { clave: 'calcula' },
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      ...(division ? [paso(`${enunciado} = ${primero} \\cdot ${sc < 0 ? `\\left(${inversa}\\right)` : inversa}`, 'invertir_segunda')] : []),
      paso(`${division ? `${primero} \\cdot ${sc < 0 ? `\\left(${inversa}\\right)` : inversa}` : enunciado} = -\\frac{${a} \\cdot ${division ? d : c}}{${b} \\cdot ${division ? c : d}} = ${sin}`, 'signos'),
      ...(g > 1 ? [paso(`${sin} = ${texFraccion(nR, dR)}`, 'simplificar', `\\text{mcd}(${Math.abs(numCorrecto)}, ${pd}) = ${g}`)] : []),
    ],
    distractores: pool(rng, [
      fr(-numCorrecto, pd, E('perder_signo'), [mal(`${enunciado} = ${texFraccion(-numCorrecto, pd)}`)]),
      division
        ? fr(-a * c, b * d, E('no_invertir'), [mal(`${enunciado} = -\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${texFraccion(-a * c, b * d)}`)])
        : fr(-a * c, b, E('denominador_de_una_sola'), [mal(`${enunciado} = -\\frac{${a} \\cdot ${c}}{${b}} = ${texFraccion(-a * c, b)}`)]),
      division
        ? fr(-b * c, a * d, E('invierte_la_primera'), [mal(`${enunciado} = -\\frac{${b} \\cdot ${c}}{${a} \\cdot ${d}} = ${texFraccion(-b * c, a * d)}`)])
        : fr(-a * d, b * c, E('multiplica_cruzado'), [mal(`${enunciado} = -\\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${texFraccion(-a * d, b * c)}`)]),
    ]),
  };
}

// ---------------------------------------------------------------------------

const subtipo = (id, items, forma) => ({
  id,
  items,
  generar: conReintentos(rng => {
    const datos = forma(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: datos.texto ?? { clave: 'calcula' }, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
});

export const SUBTIPOS = [
  subtipo('natural_por_fraccion', ['U4-2C-08'], naturalPorFraccion),
  subtipo('producto', ['U4-2C-09'], producto),
  subtipo('potencia', ['U4-2C-12'], potencia),
  subtipo('division', ['U4-3C-06'], division),
  subtipo('division_con_natural', ['U4-3C-07'], divisionConNatural),
  subtipo('con_negativas', ['U4-3C-10'], conNegativas),
];

export default {
  id: 'producto_division_fracciones',
  nombre: { es: 'Multiplicación y división de fracciones', en: 'Multiplying and dividing fractions' },
  curso: 1,
  concepto: 'producto_division_fracciones',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas: {},
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
