// Fracciones equivalentes: reconocer una equivalente y simplificar.

import { construirOpciones, conReintentos, erroresDe, tex, texFraccion, claveFraccion, mcd } from './index.js';

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
  simplificar_a_medias: { concepto: 'fracciones_equivalentes',
    es: 'Has dividido, pero todavía se puede seguir: la fracción irreducible es la que ya no se puede simplificar más (divide entre el m.c.d.).', en: 'You divided, but you can keep going: the lowest-terms fraction cannot be simplified any further (divide by the GCD).' },
  perder_signo: { concepto: 'fracciones_equivalentes',
    es: 'Al simplificar, el signo se queda: una fracción negativa sigue siendo negativa.', en: 'When you simplify, the sign stays: a negative fraction is still negative.' },
  escribir_el_factor: { concepto: 'fracciones_equivalentes',
    es: 'El número por el que se multiplica no es el término que falta: hay que multiplicar el término de arriba (o de abajo) por ese número.', en: 'The number you multiply by is not the missing term: you have to multiply the other term of the first fraction by it.' },
};
const E = erroresDe(errores);

export const preguntas = {
  equivalente_a: { es: '¿Qué fracción es equivalente a esta?', en: 'Which fraction is equivalent to this one?' },
  simplifica: { es: 'Simplifica hasta la fracción irreducible:', en: 'Simplify to lowest terms:' },
  completa_hueco: { es: 'Completa la equivalencia (□ es el término que falta):', en: 'Complete the equivalence (□ is the missing term):' },
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
    // Los tres errores del inventario (U4-1C-10), barajados; «invertir» solo de relleno.
    distractores: pool(rng, [
      fr(n + k, d + k, E('sumar_mismo_numero'), [
        mal(`${enunciado} = \\frac{${n} + ${k}}{${d} + ${k}} = ${texFraccion(n + k, d + k)}`),
      ]),
      fr(N, d, E('solo_numerador'), [
        mal(`${enunciado} = \\frac{${n} \\cdot ${k}}{${d}} = ${texFraccion(N, d)}`),
      ]),
      fr(n, D, E('solo_denominador'), [
        mal(`${enunciado} = \\frac{${n}}{${d} \\cdot ${k}} = ${texFraccion(n, D)}`),
      ]),
    ], [
      fr(D, N, E('invertir'), [
        mal(`${enunciado} = \\frac{${d}}{${n}}`),
        paso(`\\frac{${d}}{${n}} = \\frac{${d} \\cdot ${k}}{${n} \\cdot ${k}} = ${texFraccion(D, N)}`),
      ]),
    ]),
  };
}

// Desactivada: la antigua `simplificar` con el error «restar el mismo número», que no está
// entre los errores del inventario de la unidad 4. Se quitó el error de la tabla porque
// `distractores.test.js` exige que todo error declarado pueda salir.

/** Los distractores documentados, barajados, y después los de relleno, también barajados. */
const pool = (rng, documentados, extras = []) => rng.barajar(documentados).concat(rng.barajar(extras));

/** Simplificar hasta la irreducible. La «a medias» vale como distractor SOLO aquí (el enunciado pide la irreducible). */
function irreducible(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.elegir([4, 6, 8, 9, 10, 12]);
  const p = rng.elegir([2, 3, 4, 6].filter(x => k % x === 0 && x < k));
  const N = n * k, D = d * k;
  const enunciado = `\\frac{${N}}{${D}}`;
  const aMedias = { tex: texFraccion(N / p, D / p), clave: `a-medias:${N / p}/${D / p}`, error: E('simplificar_a_medias'), pasos: [
    mal(`${enunciado} = \\frac{${N} \\div ${p}}{${D} \\div ${p}} = ${texFraccion(N / p, D / p)}`),
  ] };
  return {
    texto: { clave: 'simplifica' },
    enunciado,
    correcta: fr(n, d),
    solucion: [
      paso(`${enunciado} = \\frac{${N} \\div ${k}}{${D} \\div ${k}} = ${texFraccion(n, d)}`, 'simplificar', `\\text{mcd}(${N}, ${D}) = ${k}`),
    ],
    distractores: pool(rng, [
      aMedias,
      fr(n, D, E('simplificar_uno_solo'), [
        mal(`${enunciado} = \\frac{${N} \\div ${k}}{${D}} = ${texFraccion(n, D)}`),
      ]),
      fr(N, d, E('simplificar_uno_solo'), [
        mal(`${enunciado} = \\frac{${N}}{${D} \\div ${k}} = ${texFraccion(N, d)}`),
      ]),
    ]),
  };
}

/** Simplificar una fracción negativa: el signo no se pierde. */
function irreducibleNegativa(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.entero(2, 6);
  const N = n * k, D = d * k;
  const enunciado = `-\\frac{${N}}{${D}}`;
  return {
    texto: { clave: 'simplifica' },
    enunciado,
    correcta: fr(-n, d),
    solucion: [
      paso(`${enunciado} = -\\frac{${N} \\div ${k}}{${D} \\div ${k}} = ${texFraccion(-n, d)}`, 'simplificar', `\\text{mcd}(${N}, ${D}) = ${k}`),
    ],
    distractores: pool(rng, [
      fr(n, d, E('perder_signo'), [
        mal(`${enunciado} = \\frac{${N} \\div ${k}}{${D} \\div ${k}} = ${texFraccion(n, d)}`),
      ]),
      fr(-n, D, E('simplificar_uno_solo'), [
        mal(`${enunciado} = -\\frac{${N} \\div ${k}}{${D}} = ${texFraccion(-n, D)}`),
      ]),
      fr(-N, d, E('simplificar_uno_solo'), [
        mal(`${enunciado} = -\\frac{${N}}{${D} \\div ${k}} = ${texFraccion(-N, d)}`),
      ]),
    ]),
  };
}

/** Completar la equivalencia con un hueco (□), en el numerador o en el denominador. */
function hueco(enElNumerador) {
  return rng => {
    const [n, d] = fraccionIrreducible(rng);
    const k = rng.entero(2, 6);
    const N = n * k, D = d * k;
    const huecoTex = '\\square';
    const respuesta = enElNumerador ? N : D;
    const enunciado = enElNumerador
      ? `\\frac{${n}}{${d}} = \\frac{${huecoTex}}{${D}}`
      : `\\frac{${n}}{${d}} = \\frac{${N}}{${huecoTex}}`;
    const num = (v, error, pasos) => ({ tex: tex(v), clave: String(v), error, ...(pasos ? { pasos } : {}) });
    // Sumar (el documentado): si el denominador pasa de d a D, se suma D - d al otro término.
    const sumado = enElNumerador ? n + (D - d) : d + (N - n);
    const sinCambiar = enElNumerador ? n : d;
    const mal2 = enElNumerador
      ? `\\frac{${n}}{${d}} = \\frac{${n}}{${D}}`
      : `\\frac{${n}}{${d}} = \\frac{${N}}{${d}}`;
    return {
      texto: { clave: 'completa_hueco' },
      enunciado,
      correcta: num(respuesta),
      solucion: [
        paso(`\\square = ${enElNumerador ? n : d} \\cdot ${k} = ${respuesta}`, 'multiplicar_mismo_numero', `${enElNumerador ? d : n} \\cdot ${k} = ${enElNumerador ? D : N}`),
      ],
      distractores: pool(rng, [
        num(sumado, E('sumar_mismo_numero'), [mal(`${enElNumerador ? n : d} + ${enElNumerador ? D - d : N - n} = ${sumado}`)]),
        num(sinCambiar, E(enElNumerador ? 'solo_denominador' : 'solo_numerador'), [mal(mal2), mal(`\\square = ${sinCambiar}`)]),
        num(k, E('escribir_el_factor'), [mal(`${enElNumerador ? d : n} \\cdot ${k} = ${enElNumerador ? D : N}`), mal(`\\square = ${k}`)]),
      ]),
    };
  };
}

// Cada forma declara las destrezas del inventario de la unidad 4 que cubre (`items`).
export const SUBTIPOS = [
  { id: 'equivalente', items: ['U4-1C-10'], forma: equivalente },
  { id: 'hueco_numerador', items: ['U4-1C-12'], forma: hueco(true) },
  { id: 'hueco_denominador', items: ['U4-1C-12'], forma: hueco(false) },
  { id: 'irreducible', items: ['U4-1C-13', 'U4-1C-14'], forma: irreducible },
  { id: 'irreducible_negativa', items: ['U4-1C-22'], forma: irreducibleNegativa },
].map(s => ({
  ...s,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, distractores, solucion } = s.forma(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
}));

export default {
  id: 'fracciones_equivalentes',
  nombre: { es: 'Fracciones equivalentes', en: 'Equivalent fractions' },
  curso: 1,
  concepto: 'fracciones_equivalentes',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
