// Polinomios de segundo grado: valor numérico, suma y resta, y producto de
// un monomio por un binomio. Los resultados se representan como
// coef2·x² + coef1·x + coef0 con el helper texExpr2/expr2.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  ignora_exponente: { concepto: 'polinomios',
    es: 'x² no es lo mismo que x: hay que elevar al cuadrado antes de multiplicar por el coeficiente.', en: 'x² is not the same as x: you must square it before multiplying by the coefficient.' },
  signo_termino: { concepto: 'polinomios',
    es: 'Cuidado con el signo de ese término.', en: 'Watch the sign of that term.' },
  olvida_termino_independiente: { concepto: 'polinomios',
    es: 'Te has dejado el término independiente sin sumar.', en: 'You left the constant term without adding it.' },
  no_cambia_signo_al_restar: { concepto: 'polinomios',
    es: 'Al restar un polinomio, el signo de todos sus términos cambia, no solo el del primero.', en: 'When subtracting a polynomial, the sign of all its terms changes, not just the first one.' },
  olvida_signo_de_un_termino: { concepto: 'polinomios',
    es: 'Revisa el signo de ese término: al restar, también cambia de signo.', en: 'Check the sign of that term: when subtracting, it changes sign too.' },
  olvida_multiplicar_segundo_termino: { concepto: 'polinomios',
    es: 'El monomio multiplica a los dos términos del paréntesis, no solo al primero.', en: 'The monomial multiplies both terms inside the brackets, not just the first one.' },
  olvida_multiplicar_x: { concepto: 'polinomios',
    es: 'Al multiplicar dos términos con x, las x también se multiplican entre sí: x · x = x².', en: 'When multiplying two terms with x, the x’s are also multiplied together: x · x = x².' },
};
const E = erroresDe(errores);

export const preguntas = {
  valor_numerico: { es: 'Calcula el valor del polinomio para x = {x}:', en: 'Work out the value of the polynomial for x = {x}:' },
  suma: { es: 'Suma estos dos polinomios:', en: 'Add these two polynomials:' },
  resta: { es: 'Resta estos dos polinomios:', en: 'Subtract these two polynomials:' },
  producto: { es: 'Multiplica y simplifica:', en: 'Multiply and simplify:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sustituir_x: { es: 'Sustituimos x por su valor.', en: 'We substitute x for its value.' },
  elevar_y_multiplicar: { es: 'Elevamos al cuadrado y multiplicamos cada término.', en: 'We square and multiply each term.' },
  sumar: { es: 'Por último, sumamos o restamos.', en: 'Finally, we add or subtract.' },
  sumar_polinomios: { es: 'Sumamos los términos del mismo grado.', en: 'We add the terms of the same degree.' },
  restar_polinomios: { es: 'Cambiamos el signo de todos los términos del segundo polinomio y sumamos los términos del mismo grado.', en: 'We change the sign of every term in the second polynomial and add the terms of the same degree.' },
  distribuir_monomio: { es: 'El monomio multiplica a los dos términos del paréntesis.', en: 'The monomial multiplies both terms inside the brackets.' },
};

const T = tex;
const signo = n => (n >= 0 ? '+' : '-');
const abs = n => Math.abs(n);

/** Polinomio «c2·x² + c1·x + c0» en TeX neutro, con los casos particulares (coeficiente 0, ±1). */
function texExpr2(c2, c1, c0) {
  const terminos = [[c2, 2], [c1, 1], [c0, 0]].filter(([c]) => c !== 0);
  if (terminos.length === 0) return '0';
  return terminos.map(([c, p], i) => {
    const s = i === 0 ? (c < 0 ? '-' : '') : (c < 0 ? '- ' : '+ ');
    const a = abs(c);
    const parteNum = p > 0 && a === 1 ? '' : T(a);
    const parteX = p === 2 ? 'x^{2}' : p === 1 ? 'x' : '';
    return `${s}${parteNum}${parteX}`;
  }).join(' ');
}

const expr2 = (c2, c1, c0, error, pasos) => ({ tex: texExpr2(c2, c1, c0), clave: `${c2}|${c1}|${c0}`, error, pasos });
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function valorNumerico(rng) {
  const c2 = rng.entero(1, 5) * (rng.moneda() ? 1 : -1);
  const c1 = rng.entero(1, 9) * (rng.moneda() ? 1 : -1);
  const c0 = rng.entero(0, 9) * (rng.moneda() ? 1 : -1);
  const x = (rng.moneda(0.3) ? -1 : 1) * rng.entero(1, 5);
  const enunciado = texExpr2(c2, c1, c0);
  const cuadrado = x * x;
  const terminoC2 = c2 * cuadrado, terminoC1 = c1 * x;
  const correcta = terminoC2 + terminoC1 + c0;
  return {
    texto: { clave: 'valor_numerico', params: { x } },
    enunciado,
    correcta: num(correcta),
    solucion: [
      paso(`${enunciado} = ${T(c2)} \\cdot (${T(x)})^{2} ${signo(c1)} ${T(abs(c1))} \\cdot (${T(x)}) ${signo(c0)} ${T(abs(c0))}`, 'sustituir_x'),
      paso(`${T(c2)} \\cdot (${T(x)})^{2} ${signo(c1)} ${T(abs(c1))} \\cdot (${T(x)}) ${signo(c0)} ${T(abs(c0))} = ${T(terminoC2)} ${signo(terminoC1)} ${T(abs(terminoC1))} ${signo(c0)} ${T(abs(c0))}`, 'elevar_y_multiplicar'),
      paso(`${T(terminoC2)} ${signo(terminoC1)} ${T(abs(terminoC1))} ${signo(c0)} ${T(abs(c0))} = ${T(correcta)}`, 'sumar'),
    ],
    distractores: [
      num(c2 * x + terminoC1 + c0, E('ignora_exponente'), [
        mal(`${enunciado} = ${T(c2)} \\cdot (${T(x)}) ${signo(c1)} ${T(abs(c1))} \\cdot (${T(x)}) ${signo(c0)} ${T(abs(c0))} = ${T(c2 * x + terminoC1 + c0)}`),
      ]),
      num(terminoC2 + terminoC1 - c0, E('signo_termino'), [
        mal(`${T(terminoC2)} ${signo(terminoC1)} ${T(abs(terminoC1))} ${signo(-c0)} ${T(abs(c0))} = ${T(terminoC2 + terminoC1 - c0)}`),
      ]),
      num(terminoC2 + terminoC1, E('olvida_termino_independiente'), [
        mal(`x = ${T(terminoC2 + terminoC1)}`),
      ]),
    ],
  };
}

function sumaResta(rng) {
  const a2 = rng.entero(1, 6) * (rng.moneda() ? 1 : -1);
  const a1 = rng.entero(1, 9) * (rng.moneda() ? 1 : -1);
  const a0 = rng.entero(0, 9) * (rng.moneda() ? 1 : -1);
  const b2 = rng.entero(1, 6) * (rng.moneda() ? 1 : -1);
  const b1 = rng.entero(1, 9) * (rng.moneda() ? 1 : -1);
  const b0 = rng.entero(0, 9) * (rng.moneda() ? 1 : -1);
  const resta = rng.moneda(0.4);
  const signoOp = resta ? -1 : 1;
  const c2 = a2 + signoOp * b2, c1 = a1 + signoOp * b1, c0 = a0 + signoOp * b0;
  if (c2 === 0) return null;
  const enunciado = `(${texExpr2(a2, a1, a0)}) ${resta ? '-' : '+'} (${texExpr2(b2, b1, b0)})`;
  const invertida = expr2(a2 - signoOp * b2, a1 - signoOp * b1, a0 - signoOp * b0,
    E('no_cambia_signo_al_restar'), [
      mal(`${enunciado} = ${texExpr2(a2 - signoOp * b2, a1 - signoOp * b1, a0 - signoOp * b0)}`),
    ]);
  const soloUnTerminoMal = expr2(c2, c1, resta ? a0 + b0 : a0 - b0,
    E('olvida_signo_de_un_termino'), [
      mal(`${enunciado} = ${texExpr2(c2, c1, resta ? a0 + b0 : a0 - b0)}`),
    ]);
  return {
    texto: { clave: resta ? 'resta' : 'suma' },
    enunciado,
    correcta: expr2(c2, c1, c0),
    solucion: [
      paso(`${enunciado} = ${texExpr2(c2, c1, c0)}`, resta ? 'restar_polinomios' : 'sumar_polinomios'),
    ],
    distractores: [invertida, soloUnTerminoMal],
    genericos: [expr2(c2 + 1, c1, c0), expr2(c2, c1 + 1, c0), expr2(c2, c1, c0 + 1)],
  };
}

function productoMonomioBinomio(rng) {
  const k = rng.entero(2, 9) * (rng.moneda() ? 1 : -1);
  const a = rng.entero(2, 9) * (rng.moneda() ? 1 : -1);
  const b = rng.entero(1, 9) * (rng.moneda() ? 1 : -1);
  const enunciado = `${T(k)}x(${a === 1 ? 'x' : a === -1 ? '-x' : `${T(a)}x`} ${signo(b)} ${T(abs(b))})`;
  const c2 = k * a, c1 = k * b;
  return {
    texto: { clave: 'producto' },
    enunciado,
    correcta: expr2(c2, c1, 0),
    solucion: [
      paso(`${enunciado} = ${texExpr2(c2, c1, 0)}`, 'distribuir_monomio'),
    ],
    distractores: [
      expr2(c2, 0, k * b, E('olvida_multiplicar_segundo_termino'), [
        mal(`${enunciado} = ${texExpr2(c2, 0, k * b)}`),
      ]),
      expr2(0, k * a, k * b, E('olvida_multiplicar_x'), [
        mal(`${enunciado} = ${texExpr2(0, k * a, k * b)}`),
      ]),
      expr2(c2, -c1, 0, E('signo_termino'), [
        mal(`${enunciado} = ${texExpr2(c2, -c1, 0)}`),
      ]),
    ],
  };
}

const FORMAS = [valorNumerico, valorNumerico, sumaResta, sumaResta, productoMonomioBinomio];

export default {
  id: 'polinomios',
  nombre: { es: 'Polinomios', en: 'Polynomials' },
  curso: 2,
  concepto: 'polinomios',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    const { texto, enunciado, correcta, solucion, distractores, genericos } = datos;
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
