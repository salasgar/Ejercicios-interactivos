// Ecuaciones de primer grado sencillas: x ± a = b, a·x = b, a·x ± b = c y
// a·(x ± b) = c. La solución es siempre el valor de x.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  no_cambia_signo_al_pasar: { concepto: 'ecuaciones_primer_grado',
    es: 'Al pasar un término al otro lado de la igualdad, cambia de signo: lo que suma pasa restando, y lo que resta pasa sumando.', en: 'When you move a term to the other side of the equals sign, it changes sign: what was added becomes subtracted, and what was subtracted becomes added.' },
  multiplica_en_vez_de_dividir: { concepto: 'ecuaciones_primer_grado',
    es: 'Para despejar la x hay que dividir entre su coeficiente, no multiplicar.', en: 'To isolate x you must divide by its coefficient, not multiply.' },
  olvida_dividir_al_final: { concepto: 'ecuaciones_primer_grado',
    es: 'Te falta el último paso: dividir entre el coeficiente de la x.', en: 'You are missing the last step: dividing by the coefficient of x.' },
  signo_de_x: { concepto: 'ecuaciones_primer_grado',
    es: 'Revisa el signo del resultado.', en: 'Check the sign of the result.' },
  no_distribuye: { concepto: 'ecuaciones_primer_grado',
    es: 'El número de fuera del paréntesis multiplica a todo lo de dentro; hay que dividir primero para deshacer esa multiplicación.', en: 'The number outside the brackets multiplies everything inside; you must divide first to undo that multiplication.' },
  olvida_restar_b: { concepto: 'ecuaciones_primer_grado',
    es: 'Después de dividir todavía queda un término independiente dentro del paréntesis por despejar.', en: 'After dividing there is still a constant term inside the brackets left to isolate.' },
};
const E = erroresDe(errores);

export const preguntas = {
  resuelve: { es: 'Resuelve la ecuación:', en: 'Solve the equation:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  pasar_restando: { es: 'Pasamos el término al otro lado cambiando su signo.', en: 'We move the term to the other side, changing its sign.' },
  pasar_sumando: { es: 'Pasamos el término al otro lado cambiando su signo.', en: 'We move the term to the other side, changing its sign.' },
  despejar_dividiendo: { es: 'Dividimos los dos lados entre el coeficiente de la x.', en: 'We divide both sides by the coefficient of x.' },
  aislar_termino_x: { es: 'Pasamos el término independiente al otro lado, cambiando su signo.', en: 'We move the constant term to the other side, changing its sign.' },
  dividir_ambos_lados: { es: 'Dividimos los dos lados entre el número que multiplica al paréntesis.', en: 'We divide both sides by the number multiplying the brackets.' },
  pasar_termino: { es: 'Pasamos el término independiente al otro lado, cambiando su signo.', en: 'We move the constant term to the other side, changing its sign.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const signo = n => (n >= 0 ? '+' : '-');
const abs = n => Math.abs(n);
const xVal = rng => (rng.moneda(0.3) ? -1 : 1) * rng.entero(1, 9);

function sumaResta(rng) {
  const a = rng.entero(2, 15);
  const x = xVal(rng);
  const suma = rng.moneda();
  const b = suma ? x + a : x - a;
  const enunciado = suma ? `x + ${a} = ${T(b)}` : `x - ${a} = ${T(b)}`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: num(x),
    solucion: [
      paso(`x = ${T(b)} ${suma ? '-' : '+'} ${a}`, suma ? 'pasar_restando' : 'pasar_sumando'),
      paso(`x = ${T(x)}`, null),
    ],
    distractores: [
      num(suma ? b + a : b - a, E('no_cambia_signo_al_pasar'), [
        mal(`x = ${T(b)} ${suma ? '+' : '-'} ${a} = ${T(suma ? b + a : b - a)}`),
      ]),
      num(-x, E('signo_de_x'), [
        mal(`x = ${T(-x)}`),
      ]),
    ],
    genericos: [num(x + 1), num(x - 1)],
  };
}

function multiplicacion(rng) {
  const a = rng.entero(2, 9);
  const x = xVal(rng);
  const b = a * x;
  const enunciado = `${a}x = ${T(b)}`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: num(x),
    solucion: [
      paso(`x = ${T(b)} \\div ${a}`, 'despejar_dividiendo'),
      paso(`x = ${T(x)}`, null),
    ],
    distractores: [
      num(b * a, E('multiplica_en_vez_de_dividir'), [
        mal(`x = ${T(b)} \\cdot ${a} = ${T(b * a)}`),
      ]),
      num(b, E('olvida_dividir_al_final'), [
        mal(`x = ${T(b)}`),
      ]),
      num(-x, E('signo_de_x'), [
        mal(`x = ${T(-x)}`),
      ]),
    ],
  };
}

function dosOperaciones(rng) {
  const a = rng.entero(2, 9);
  const x = xVal(rng);
  const bm = rng.elegir([-3, -2, -1, 1, 2, 3]);
  const b = a * bm;
  const c = a * x + b;
  const enunciado = `${a}x ${signo(b)} ${abs(b)} = ${T(c)}`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: num(x),
    solucion: [
      paso(`${a}x = ${T(c)} ${signo(-b)} ${abs(b)}`, 'aislar_termino_x'),
      paso(`${a}x = ${T(c - b)}`, null),
      paso(`x = ${T(c - b)} \\div ${a} = ${T(x)}`, 'despejar_dividiendo'),
    ],
    distractores: [
      num(c - b, E('olvida_dividir_al_final'), [
        mal(`${a}x = ${T(c)} ${signo(-b)} ${abs(b)} = ${T(c - b)}`),
        mal(`x = ${T(c - b)}`),
      ]),
      num(x + 2 * bm, E('no_cambia_signo_al_pasar'), [
        mal(`${a}x = ${T(c)} ${signo(b)} ${abs(b)} = ${T(c + b)}`),
        mal(`x = ${T(c + b)} \\div ${a} = ${T(x + 2 * bm)}`),
      ]),
      num(-x, E('signo_de_x'), [
        mal(`x = ${T(-x)}`),
      ]),
    ],
  };
}

function conParentesis(rng) {
  const a = rng.entero(2, 9);
  const x = xVal(rng);
  const bm = rng.elegir([-3, -2, -1, 1, 2, 3]);
  const b = a * bm;
  const c = a * (x + b);
  const enunciado = `${a}(x ${signo(b)} ${abs(b)}) = ${T(c)}`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: num(x),
    solucion: [
      paso(`x ${signo(b)} ${abs(b)} = ${T(c)} \\div ${a}`, 'dividir_ambos_lados'),
      paso(`x ${signo(b)} ${abs(b)} = ${T(c / a)}`, null),
      paso(`x = ${T(c / a)} ${signo(-b)} ${abs(b)} = ${T(x)}`, 'pasar_termino'),
    ],
    distractores: [
      num(x + bm * (a - 1), E('no_distribuye'), [
        mal(`${a}x ${signo(b)} ${abs(b)} = ${T(c)}`),
        mal(`${a}x = ${T(c)} ${signo(-b)} ${abs(b)} = ${T(c - b)}`),
        mal(`x = ${T(c - b)} \\div ${a} = ${T(x + bm * (a - 1))}`),
      ]),
      num(x + b, E('olvida_restar_b'), [
        mal(`x ${signo(b)} ${abs(b)} = ${T(c / a)}`),
        mal(`x = ${T(c / a)} = ${T(x + b)}`),
      ]),
      num(-x, E('signo_de_x'), [
        mal(`x = ${T(-x)}`),
      ]),
    ],
  };
}

const FORMAS = [sumaResta, sumaResta, multiplicacion, dosOperaciones, dosOperaciones, conParentesis];

export default {
  id: 'ecuaciones_primer_grado',
  nombre: { es: 'Ecuaciones de primer grado', en: 'First-degree equations' },
  curso: 1,
  concepto: 'ecuaciones_primer_grado',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
