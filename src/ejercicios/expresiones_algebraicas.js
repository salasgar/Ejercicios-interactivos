// Álgebra inicial: valor numérico de una expresión, reducir términos
// semejantes y traducir un enunciado a una expresión algebraica.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  suma_en_vez_de_multiplicar: { concepto: 'expresiones_algebraicas',
    es: 'El coeficiente multiplica a la x, no se suma con ella.', en: 'The coefficient multiplies x, it is not added to it.' },
  ignora_coeficiente: { concepto: 'expresiones_algebraicas',
    es: 'Te has olvidado del coeficiente: hay que multiplicarlo por el valor de x.', en: 'You forgot the coefficient: you have to multiply it by the value of x.' },
  signo_termino: { concepto: 'expresiones_algebraicas',
    es: 'Cuidado con el signo de ese término.', en: 'Watch the sign of that term.' },
  no_distribuye: { concepto: 'expresiones_algebraicas',
    es: 'El número de fuera del paréntesis multiplica a todo lo de dentro, no solo a la x.', en: 'The number outside the brackets multiplies everything inside, not just x.' },
  combina_terminos_distintos: { concepto: 'expresiones_algebraicas',
    es: 'Un término con x y un término sin x no son términos semejantes: no se pueden sumar entre sí.', en: 'A term with x and a term without x are not like terms: they cannot be added together.' },
  signo_termino_semejante: { concepto: 'expresiones_algebraicas',
    es: 'Al agrupar los términos con x hay que respetar el signo que llevaba cada uno.', en: 'When grouping the x terms you must keep the sign each one had.' },
  signo_constante: { concepto: 'expresiones_algebraicas',
    es: 'Al agrupar los términos independientes hay que respetar el signo que llevaba cada uno.', en: 'When grouping the constant terms you must keep the sign each one had.' },
  mete_b_en_parentesis: { concepto: 'expresiones_algebraicas',
    es: 'Solo el número se duplica o triplica; el «más» o «menos» que sigue no entra en esa multiplicación.', en: 'Only the number gets doubled or tripled; the "plus" or "minus" that follows is not part of that multiplication.' },
  escala_al_numero_fijo: { concepto: 'expresiones_algebraicas',
    es: 'El doble o el triple es del número desconocido (la x), no del número que se suma o resta.', en: 'The double or triple applies to the unknown number (x), not to the number being added or subtracted.' },
  signo_operacion: { concepto: 'expresiones_algebraicas',
    es: 'Fíjate si el enunciado dice «más» o «menos».', en: 'Check whether the statement says "plus" or "minus".' },
};
const E = erroresDe(errores);

export const preguntas = {
  valor_numerico: { es: 'Calcula el valor de la expresión para x = {x}:', en: 'Work out the value of the expression for x = {x}:' },
  reducir: { es: 'Reduce, agrupando los términos semejantes:', en: 'Simplify by grouping the like terms:' },
  doble_mas: { es: 'El doble de un número, más {b}:', en: 'Double a number, plus {b}:' },
  doble_menos: { es: 'El doble de un número, menos {b}:', en: 'Double a number, minus {b}:' },
  triple_mas: { es: 'El triple de un número, más {b}:', en: 'Triple a number, plus {b}:' },
  triple_menos: { es: 'El triple de un número, menos {b}:', en: 'Triple a number, minus {b}:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sustituir_x: { es: 'Sustituimos x por su valor.', en: 'We substitute x for its value.' },
  multiplicar: { es: 'Multiplicamos.', en: 'We multiply.' },
  sumar: { es: 'Por último, sumamos o restamos.', en: 'Finally, we add or subtract.' },
  calcular_parentesis: { es: 'Primero calculamos lo que hay dentro del paréntesis.', en: 'First we work out what is inside the brackets.' },
  agrupar_terminos: { es: 'Reordenamos agrupando los términos con x y los términos independientes.', en: 'We reorder, grouping the x terms and the constant terms.' },
  combinar: { es: 'Sumamos los términos con x entre sí, y los independientes entre sí.', en: 'We add the x terms together, and the constant terms together.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const signo = n => (n >= 0 ? '+' : '-');
const abs = n => Math.abs(n);

/** Expresión «coef·x + const» en TeX neutro, con los casos particulares (coef 0, ±1, const 0). */
function texExpr(coef, constante) {
  const partes = [];
  if (coef !== 0) {
    if (coef === 1) partes.push('x');
    else if (coef === -1) partes.push('-x');
    else partes.push(`${T(coef)}x`);
  }
  if (constante !== 0 || partes.length === 0) {
    if (partes.length === 0) partes.push(T(constante));
    else partes.push(`${signo(constante)} ${T(abs(constante))}`);
  }
  return partes.join(' ');
}

const expr = (coef, constante, error, pasos) => ({ tex: texExpr(coef, constante), clave: `${coef}|${constante}`, error, pasos });

function valorLineal(rng) {
  const a = rng.entero(2, 9);
  const b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
  const x = (rng.moneda(0.3) ? -1 : 1) * rng.entero(1, 9);
  const enunciado = `${a}x ${signo(b)} ${abs(b)}`;
  const correcta = a * x + b;
  return {
    texto: { clave: 'valor_numerico', params: { x } },
    enunciado,
    correcta: num(correcta),
    solucion: [
      paso(`${enunciado} = ${a} \\cdot (${T(x)}) ${signo(b)} ${abs(b)}`, 'sustituir_x'),
      paso(`${a} \\cdot (${T(x)}) ${signo(b)} ${abs(b)} = ${T(a * x)} ${signo(b)} ${abs(b)}`, 'multiplicar'),
      paso(`${T(a * x)} ${signo(b)} ${abs(b)} = ${T(correcta)}`, 'sumar'),
    ],
    distractores: [
      num(a + x + b, E('suma_en_vez_de_multiplicar'), [
        mal(`${enunciado} = ${a} + (${T(x)}) ${signo(b)} ${abs(b)} = ${T(a + x + b)}`),
      ]),
      num(x + b, E('ignora_coeficiente'), [
        mal(`${enunciado} = (${T(x)}) ${signo(b)} ${abs(b)} = ${T(x + b)}`),
      ]),
      num(a * x - b, E('signo_termino'), [
        mal(`${enunciado} = ${T(a * x)} ${signo(-b)} ${abs(b)} = ${T(a * x - b)}`),
      ]),
    ],
  };
}

function valorParentesis(rng) {
  const a = rng.entero(2, 9);
  const b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
  const x = (rng.moneda(0.3) ? -1 : 1) * rng.entero(1, 9);
  const enunciado = `${a}(x ${signo(b)} ${abs(b)})`;
  const correcta = a * (x + b);
  return {
    texto: { clave: 'valor_numerico', params: { x } },
    enunciado,
    correcta: num(correcta),
    solucion: [
      paso(`${enunciado} = ${a}(${T(x)} ${signo(b)} ${abs(b)})`, 'sustituir_x'),
      paso(`${a}(${T(x)} ${signo(b)} ${abs(b)}) = ${a} \\cdot ${T(x + b)}`, 'calcular_parentesis', `${T(x)} ${signo(b)} ${abs(b)} = ${T(x + b)}`),
      paso(`${a} \\cdot ${T(x + b)} = ${T(correcta)}`, 'multiplicar'),
    ],
    distractores: [
      num(a * x + b, E('no_distribuye'), [
        mal(`${enunciado} = ${a} \\cdot ${T(x)} ${signo(b)} ${abs(b)} = ${T(a * x)} ${signo(b)} ${abs(b)} = ${T(a * x + b)}`),
      ]),
      num(a + x + b, E('suma_en_vez_de_multiplicar'), [
        mal(`${enunciado} = ${a} + (${T(x)} ${signo(b)} ${abs(b)}) = ${T(a + x + b)}`),
      ]),
      num(a * (x - b), E('signo_termino'), [
        mal(`${enunciado} = ${a}(${T(x)} ${signo(-b)} ${abs(b)}) = ${a} \\cdot ${T(x - b)} = ${T(a * (x - b))}`),
      ]),
    ],
  };
}

function reducirTerminosSemejantes(rng) {
  const a = rng.entero(2, 9), c = rng.entero(2, 9);
  const b = rng.entero(1, 9), d = rng.entero(1, 9);
  const op1 = rng.moneda() ? 1 : -1, op2 = rng.moneda() ? 1 : -1, op3 = rng.moneda() ? 1 : -1;
  const bS = op1 * b, cS = op2 * c, dS = op3 * d;
  const enunciado = `${a}x ${signo(bS)} ${abs(bS)} ${signo(cS)} ${abs(cS)}x ${signo(dS)} ${abs(dS)}`;
  const coefCorrecto = a + cS, constCorrecto = bS + dS;
  return {
    texto: { clave: 'reducir' },
    enunciado,
    correcta: expr(coefCorrecto, constCorrecto),
    solucion: [
      paso(`${enunciado} = (${T(a)}x ${signo(cS)} ${abs(cS)}x) + (${T(bS)} ${signo(dS)} ${abs(dS)})`, 'agrupar_terminos'),
      paso(`(${T(a)}x ${signo(cS)} ${abs(cS)}x) + (${T(bS)} ${signo(dS)} ${abs(dS)}) = ${texExpr(coefCorrecto, constCorrecto)}`, 'combinar'),
    ],
    distractores: [
      expr(0, a + bS + cS + dS, E('combina_terminos_distintos'), [
        mal(`${enunciado} = ${T(a + bS + cS + dS)}`),
      ]),
      expr(a - cS, constCorrecto, E('signo_termino_semejante'), [
        mal(`${enunciado} = ${texExpr(a - cS, constCorrecto)}`),
      ]),
      expr(coefCorrecto, bS - dS, E('signo_constante'), [
        mal(`${enunciado} = ${texExpr(coefCorrecto, bS - dS)}`),
      ]),
    ],
  };
}

function traducir(rng) {
  const escala = rng.elegir([2, 3]);
  const b = rng.entero(1, 9);
  const suma = rng.moneda();
  const clave = `${escala === 2 ? 'doble' : 'triple'}_${suma ? 'mas' : 'menos'}`;
  const constante = suma ? b : -b;
  return {
    texto: { clave, params: { b } },
    enunciado: '',
    correcta: expr(escala, constante),
    solucion: [
      paso(`${escala === 2 ? 'x + x' : 'x + x + x'} ${signo(constante)} ${abs(constante)} = ${texExpr(escala, constante)}`, 'agrupar_terminos'),
    ],
    distractores: [
      expr(escala, escala * constante, E('mete_b_en_parentesis'), [
        mal(`${escala}(x ${signo(constante)} ${abs(b)}) = ${texExpr(escala, escala * constante)}`),
      ]),
      expr(1, escala * constante, E('escala_al_numero_fijo'), [
        mal(`x ${signo(escala * constante)} ${abs(escala * constante)} = ${texExpr(1, escala * constante)}`),
      ]),
      expr(escala, -constante, E('signo_operacion'), [
        mal(`${escala}x ${signo(-constante)} ${abs(constante)} = ${texExpr(escala, -constante)}`),
      ]),
    ],
  };
}

const FORMAS = [valorLineal, valorLineal, valorParentesis, reducirTerminosSemejantes, reducirTerminosSemejantes, traducir, traducir];

export default {
  id: 'expresiones_algebraicas',
  nombre: { es: 'Expresiones algebraicas', en: 'Algebraic expressions' },
  curso: 1,
  concepto: 'expresiones_algebraicas',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
